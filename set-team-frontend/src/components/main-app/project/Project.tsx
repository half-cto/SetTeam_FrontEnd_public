import { useParams } from 'react-router-dom';

import { useGetAllProjectsQuery } from '../../../store/store';
import ProjTable from './ProjTable';
import ProjActionBar from './ProjActionBar';
import { ConfigProvider } from 'antd';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';

// TODO  add/remove users/dates functionality

const Project = () => {
    const { projId } = useParams();

    const { userName: userId } = getCredentialsFromLocalStorage();

    const { data } = useGetAllProjectsQuery({
        userId,
    });
    let project: Project | undefined;
    if (data) {
        project = data.find((proj) => proj.SK === projId);
    }
    //  <div className="p-2 rounded-md  bg-orange-100 shadow-xl">
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <div className="max-w-screen-lg mx-auto mt-2 p-2 rounded-xl  bg-orange-100 shadow-xl">
                {projId && project && (
                    <ProjActionBar
                        projId={projId}
                        project={project}
                    />
                )}
                {project && <ProjTable project={project} />}
            </div>
        </ConfigProvider>
    );
};

export default Project;
