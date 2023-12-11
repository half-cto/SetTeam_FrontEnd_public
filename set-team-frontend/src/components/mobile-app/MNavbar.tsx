import { ConfigProvider } from 'antd';
import { MDisplayPage } from './MDashboard';
import MNavSandwich from './MNavSandwich';
import MonthSwitcher from './navbar-components/MonthSwithcer';

import NavTitle from './navbar-components/NavTitle';

import { AuthService } from '../../services/authService';
import NavProjName from './navbar-components/NavProjName';
import { updateDisplayPage, useFetchUserQuery } from '../../store/store';
import { useDispatch } from 'react-redux';

interface MNavbarProps {
    displayPage: MDisplayPage;
    authService: AuthService;
    userId: string;
}

const navBarView = {
    calendar: <MonthSwitcher />,
    project: <NavProjName />,
    createProject: <NavTitle type={'createProject'} />,
    manageProjDates: <NavProjName />,
    manageTeam: <NavProjName />,
    userInfo: <NavTitle type="userInfo" />,
};

const MNavbar = ({ displayPage, authService, userId }: MNavbarProps) => {
    const currentView = navBarView[displayPage] ?? navBarView['calendar'];

    const dispatch = useDispatch();
    const { data: user, isFetching } = useFetchUserQuery({ userName: userId });
    if (!isFetching && !user)
        dispatch(updateDisplayPage({ displayPage: 'userInfo' }));

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <header className="shadow-md fixed top-0 w-full bg-white z-20">
                <div className="p-2 px-4 pt-4 flex justify-between">
                    {currentView}
                    <MNavSandwich authService={authService} />
                </div>
            </header>
        </ConfigProvider>
    );
};

export default MNavbar;
