import { FloatButton } from 'antd';
import { updateDisplayPage, useFetchProjByIdQuery } from '../../../store/store';
import ManageTeamTable from '../../main-app/manage-team-modal/ManageTeamTable';
import { LeftOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

interface MManageTeamViewProps {
    projectId: string;
}

const MManageTeamView = ({ projectId }: MManageTeamViewProps) => {
    const { data: project } = useFetchProjByIdQuery({
        projId: projectId,
    });

    const dispatch = useDispatch();

    // TODO add spinner while data is loading
    const handleReturn = () => {
        dispatch(updateDisplayPage({ displayPage: 'project' }));
    };

    return (
        <div className="mt-14">
            {project && <ManageTeamTable project={project} />}
            <FloatButton
                icon={<LeftOutlined />}
                type="default"
                onClick={handleReturn}
                style={{ left: 24 }}
                className="bg-blue-200"
            />
        </div>
    );
};

export default MManageTeamView;
