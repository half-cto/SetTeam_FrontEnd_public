import { getCredentialsFromLocalStorage } from '../../utils/functions';
import MCalendar from './MCalendar';
import MNavbar from './MNavbar';

import MProjectPage from './m-project-page/MProjectPage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import MCreateProject from './create-project-page/MCreateProject';
import ManageDatesView from './dates-view/ManageDatesView';
import MManageTeamView from './manage-team-page/MManageTeamView';
import { AuthService } from '../../services/authService';
import MUserInfo from './m-user-info-view/MUserInfo';

export type MDisplayPage =
    | 'calendar'
    | 'project'
    | 'createProject'
    | 'manageProjDates'
    | 'manageTeam'
    | 'userInfo';

interface MDashboardProps {
    authService: AuthService;
}

const MDashboard = ({ authService }: MDashboardProps) => {
    const { userName: userId } = getCredentialsFromLocalStorage();

    const { activeProjectId, displayPage } = useSelector(
        (state: RootState) => state.activeData
    );

    let renderedBody: JSX.Element;

    // TODO bring this out to utilities
    switch (displayPage) {
        case 'calendar':
            renderedBody = <MCalendar userId={userId} />;
            break;
        case 'project':
            if (typeof activeProjectId !== 'string') return;
            renderedBody = <MProjectPage activeProjectId={activeProjectId} />;
            break;
        case 'createProject':
            renderedBody = <MCreateProject />;
            break;
        case 'manageProjDates':
            if (typeof activeProjectId !== 'string') return;
            renderedBody = <ManageDatesView projectId={activeProjectId} />;
            break;
        case 'manageTeam':
            if (typeof activeProjectId !== 'string') return;
            renderedBody = <MManageTeamView projectId={activeProjectId} />;
            break;
        case 'userInfo':
            renderedBody = <MUserInfo />;
            break;
        default:
            renderedBody = <MCalendar userId={userId} />;
            break;
    }

    return (
        <>
            <MNavbar
                displayPage={displayPage}
                authService={authService}
                userId={userId}
            />
            {renderedBody}
        </>
    );
};

export default MDashboard;
