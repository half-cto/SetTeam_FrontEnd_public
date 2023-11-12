import { useSelector } from 'react-redux';
import { RootState, useFetchProjByIdQuery } from '../../../store/store';
import { Typography } from 'antd';
const { Title } = Typography;

const NavProjName = () => {
    const projectId = useSelector(
        (state: RootState) => state.activeData.activeProjectId
    );

    const { data: project } = useFetchProjByIdQuery({
        projId: projectId as string,
    });
    return (
        <div>
            <Title
                level={3}
                className="text-center"
            >
                {project && project.name}
            </Title>
        </div>
    );
};

export default NavProjName;
