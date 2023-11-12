import { Button, Modal } from 'antd';
import { removeProjectFromDate } from '../../main-app/project/projUtils';
import {
    updateDisplayPage,
    useDeleteProjectMutation,
    useFetchDatesQuery,
} from '../../../store/store';
import { useDispatch } from 'react-redux';

interface DeleteProjBtnProps {
    project: Project;
}

const DeleteProjectBtn = ({ project }: DeleteProjBtnProps) => {
    const [modal, modalContextHolder] = Modal.useModal();
    const [deleteProject] = useDeleteProjectMutation();
    const { data: projDates } = useFetchDatesQuery(project.projDates);
    const dispatch = useDispatch();

    const handleDeleteProject = async () => {
        console.log('deleting project');
        if (projDates) {
            const updatedDates = projDates.map((date) =>
                removeProjectFromDate(project.SK, date)
            );

            try {
                await deleteProject({
                    projId: project.SK,
                    datesToUpdate: updatedDates,
                });
                dispatch(updateDisplayPage({ displayPage: 'calendar' }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="mt-2 flex justify-end mr-4">
            {modalContextHolder}
            <Button
                type="primary"
                danger
                onClick={() => {
                    modal.confirm({
                        title: 'Confirm',
                        content: 'Do You want to delete current project?',
                        onOk: handleDeleteProject,
                        okButtonProps: {
                            className: 'bg-blue-600',
                        },
                    });
                }}
            >
                Delete Project
            </Button>
        </div>
    );
};

export default DeleteProjectBtn;
