import { FloatButton } from 'antd';
import { useFetchProjByIdQuery, updateDisplayPage } from '../../../store/store';
import ManageDatesTable from './ManageDatesTable';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import { useState } from 'react';
import AddDateDrawer from './AddDateDrawer';
import DeleteProjectBtn from './DeleteProjectBtn';

interface ManageDatesViewProps {
    projectId: string;
}

const ManageDatesView = ({ projectId }: ManageDatesViewProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: project } = useFetchProjByIdQuery({
        projId: projectId,
    });

    const dispatch = useDispatch();

    const handleReturn = () => {
        dispatch(updateDisplayPage({ displayPage: 'project' }));
    };

    return (
        <div className="mt-16">
            {project && <ManageDatesTable project={project} />}
            {project && <DeleteProjectBtn project={project} />}
            <FloatButton
                icon={<LeftOutlined />}
                type="default"
                onClick={handleReturn}
                style={{ left: 24 }}
                className="bg-blue-200"
            />
            <FloatButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setIsDrawerOpen(true)}
                style={{ right: 24 }}
                className="bg-blue-200"
            />
            {project && (
                <AddDateDrawer
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    projDates={project?.projDates}
                    projectId={projectId}
                />
            )}
        </div>
    );
};

export default ManageDatesView;
