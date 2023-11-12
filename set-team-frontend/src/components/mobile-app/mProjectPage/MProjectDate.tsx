import {
    RootState,
    useFetchDatesQuery,
    useFetchTeamMembersQuery,
    useUpdatedDateMutation,
} from '../../../store/store';

import { useSelector } from 'react-redux';
import {
    MTableColumnProps,
    MTableDataSource,
    createTeamStatusTableData,
    renderMColumns,
} from './mProjectPageUtils';
import { ConfigProvider, Table } from 'antd';
import { getUpdatedDate } from '../../main-app/project/projUtils';

interface MProjectDateArgs {
    project: Project;
}

export interface MUpdateUserStatusProps {
    date: string;
    userId: string;
    status: string | undefined;
}

const MProjectDate = ({ project }: MProjectDateArgs) => {
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const [updateDate] = useUpdatedDateMutation();

    const activeDate = useSelector(
        (state: RootState) => state.activeData.activeDate
    );

    const { data: projDates } = useFetchDatesQuery(project.projDates);

    const handleUpdateUserStatusMobile = async ({
        date,
        userId,
        status,
    }: MUpdateUserStatusProps): Promise<void> => {
        if (projDates) {
            const updatedDate = getUpdatedDate({
                project,
                projDates,
                date,
                userId,
                status,
            });

            if (updatedDate) {
                await updateDate(updatedDate);
                return;
            }
            console.error('Cell update failed!');
        }
    };

    let tableDataSource: MTableDataSource[] = [];
    if (projDates && activeDate && allSparks)
        tableDataSource = createTeamStatusTableData(
            project,
            projDates,
            activeDate,
            allSparks
        );

    let dateTableColums: MTableColumnProps[] = [];
    if (activeDate)
        dateTableColums = renderMColumns({
            projId: project.SK,
            activeDate,
            callback: handleUpdateUserStatusMobile,
        });
    const isLoading = allSparks && projDates;

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: 'Roboto Mono',
                    },
                }}
            >
                <Table
                    columns={dateTableColums}
                    dataSource={tableDataSource}
                    pagination={false}
                    loading={!isLoading}
                />
            </ConfigProvider>
        </div>
    );
};

export default MProjectDate;
