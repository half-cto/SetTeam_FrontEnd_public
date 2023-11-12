import { ConfigProvider, Modal, Table } from 'antd';
import {
    useFetchTeamMembersQuery,
    useUpdateProjectMutation,
    useFetchDatesQuery,
    useRemoveUserFromProjectMutation,
} from '../../../store/store';

import {
    prepDataToRemoveUser,
    renderManageTeamColumns,
} from './manageTeamUtils';

interface ManageTeamModalProps {
    isOpen: boolean;
    setIsOpen: (isModalOpen: boolean) => void;
    project: Project;
}

export interface ManageUsersTableData {
    key: string;
    nameSurname: string;
    tags: string[];
    action: string;
}

const ManageTeamModal = ({
    isOpen,
    setIsOpen,
    project,
}: ManageTeamModalProps) => {
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const [updateProject] = useUpdateProjectMutation();
    const { data: projDates, refetch: refetchProjDates } = useFetchDatesQuery(
        project.projDates
    );
    const [removeUserFromProject] = useRemoveUserFromProjectMutation();

    // TODO clean up this component - bring logic out to separate file

    let dataSource: ManageUsersTableData[] = [];

    const sortedSparks: User[] = [];

    if (allSparks) {
        allSparks.forEach((spark) =>
            project.projTeam.find((projSpark) => projSpark === spark.SK)
                ? sortedSparks.unshift(spark)
                : sortedSparks.push(spark)
        );

        dataSource = sortedSparks.map(({ SK, name, surname, tags }) => {
            return {
                key: SK,
                nameSurname: name + ' ' + surname,
                tags: tags,
                action: SK,
            };
        });
    }

    const handleRemoveUser = async (userToRemove: string) => {
        if (!projDates) {
            console.error('projDates undefined');
            return;
        }

        // get updated data for request
        const { updatedProjectTeam, datesToUpdate } = prepDataToRemoveUser({
            project,
            projDates,
            userToRemove,
        });

        // feed data to RTK Query

        await removeUserFromProject({
            projId: project.SK,
            projTeam: updatedProjectTeam,
            datesToUpdate,
        });
        await refetchProjDates();
    };

    const handleAddUser = async (userToAdd: string) => {
        const newProjectTeam = [...project.projTeam, userToAdd];
        await updateProject({ projId: project.SK, projTeam: newProjectTeam });
    };

    const columns = renderManageTeamColumns({
        project,
        handleRemoveUser,
        handleAddUser,
    });

    const rowClassNameRender = (record: { key: string }) => {
        if (project.projTeam.find((spark) => spark === record.key))
            return 'bg-yellow-50';
        return '';
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <Modal
                className="p-2 rounded-xl bg-orange-200"
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                onOk={() => setIsOpen(false)}
                okButtonProps={{ className: 'bg-blue-600' }}
                width={650}
            >
                <div>
                    <Table
                        bordered={true}
                        dataSource={dataSource}
                        columns={columns}
                        rowClassName={rowClassNameRender}
                        pagination={{ pageSize: 10, hideOnSinglePage: true }}
                    />
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default ManageTeamModal;
