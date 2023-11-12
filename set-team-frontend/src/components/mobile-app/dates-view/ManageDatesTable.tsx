import { ConfigProvider, Table } from 'antd';
import { useFetchDatesQuery } from '../../../store/store';
import {
    ManageDatesTableColumnProps,
    ManageDatesTableRowProps,
    getManageDatesTableColumns,
    getManageDatesTableData,
} from './manageDatesUtils';

interface ManageDatesTableProps {
    project: Project;
}

const ManageDatesTable = ({ project }: ManageDatesTableProps) => {
    const { data: projDates } = useFetchDatesQuery(project.projDates);

    let manageDatesTableData: ManageDatesTableRowProps[] = [];
    if (projDates)
        manageDatesTableData = getManageDatesTableData({ projDates });

    let manageDatesColumns: ManageDatesTableColumnProps[] = [];
    if (projDates)
        manageDatesColumns = getManageDatesTableColumns({
            projDates: projDates,
            project,
        });

    // TODO show spinner if projDates are Loading!!!

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <Table
                columns={manageDatesColumns}
                dataSource={manageDatesTableData}
                pagination={false}
            />
        </ConfigProvider>
    );
};

export default ManageDatesTable;
