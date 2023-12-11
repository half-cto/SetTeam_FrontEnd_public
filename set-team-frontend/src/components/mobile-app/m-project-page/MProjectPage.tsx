import {
    CalendarOutlined,
    LeftOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { updateDisplayPage, useFetchProjByIdQuery } from '../../../store/store';
import MProjectDate from './MProjectDate';
import { FloatButton, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import ProjDateSwitcher from '../navbar-components/ProjDateSwitcher';

interface MProjectPageProps {
    activeProjectId: string;
}

const MProjectPage = ({ activeProjectId }: MProjectPageProps) => {
    const { data: project } = useFetchProjByIdQuery({
        projId: activeProjectId,
    });
    const dispatch = useDispatch();

    const handleManageDates = () => {
        dispatch(updateDisplayPage({ displayPage: 'manageProjDates' }));
    };

    const handleManageTeam = () => {
        dispatch(updateDisplayPage({ displayPage: 'manageTeam' }));
    };

    const handleReturn = () => {
        dispatch(updateDisplayPage({ displayPage: 'calendar' }));
    };

    const renderedProjectPage = project ? (
        <div>
            <div className="pt-16">
                <ProjDateSwitcher />
            </div>
            <div>
                <MProjectDate project={project} />
            </div>
            <FloatButton
                icon={<CalendarOutlined />}
                type="primary"
                onClick={handleManageDates}
                style={{ right: 74 }}
            />
            <FloatButton
                icon={<TeamOutlined />}
                type="primary"
                onClick={handleManageTeam}
                style={{ right: 24 }}
            />
            <FloatButton
                icon={<LeftOutlined />}
                type="default"
                onClick={handleReturn}
                style={{ left: 24 }}
                className="bg-blue-200"
            />
        </div>
    ) : (
        <div className="pt-32 flex justify-center">
            <Spin size="large" />
        </div>
    );

    return <>{renderedProjectPage}</>;
};

export default MProjectPage;
