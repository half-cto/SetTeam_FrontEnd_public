import { ConfigProvider, Table } from 'antd';
import { prepDataToRemoveUser, renderManageTeamColumns } from './manageTeamUtils';
import {
    useFetchDatesQuery,
    useFetchTeamMembersQuery,
    useRemoveUserFromProjectMutation,
    useUpdateProjectMutation,
} from '../../../store/store';

interface ManageUsersTableData {
    key: string;
    nameSurname: string;
    tags: string[];
    action: string;
}

interface ManageUsersTableProps {
    project: Project;
}

const ManageTeamTable = ({ project }: ManageUsersTableProps) => {
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const [updateProject] = useUpdateProjectMutation();
    const { data: projDates, refetch: refetchProjDates } = useFetchDatesQuery(
        project.projDates
    );
    const [removeUserFromProject] = useRemoveUserFromProjectMutation();

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
            <Table
                bordered={true}
                dataSource={dataSource}
                columns={columns}
                rowClassName={rowClassNameRender}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
            />
        </ConfigProvider>
    );
};

export default ManageTeamTable;
