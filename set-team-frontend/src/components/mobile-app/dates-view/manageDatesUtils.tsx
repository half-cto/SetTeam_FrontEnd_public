import dayjs from 'dayjs';
import { ProjDate } from '../../../store/apis/datesApi';
import { sortPojDates } from '../../../utils/functions';
import ViewEditActionBtns from './ViewEditActionBtns';
import { Typography } from 'antd';

const { Title } = Typography;

interface GetManageDatesTableDataProps {
    projDates: ProjDate[];
}

export interface ManageDatesTableRowProps {
    key: string;
    date: string;
    action: string;
}

export function getManageDatesTableData({
    projDates,
}: GetManageDatesTableDataProps): ManageDatesTableRowProps[] {
    const sortedProjDates = sortPojDates(projDates);
    return sortedProjDates.map((date) => {
        return {
            key: date.SK,
            date: dayjs(date.SK, 'YYYY-MM-DD').format('DD MMM'),
            action: 'edit / remove',
        };
    });
}

export interface ManageDatesTableColumnProps {
    title: string;
    dataIndex: string;
    key: string;
    render?: (
        value: string,
        record: ManageDatesTableRowProps,
        index: number
    ) => JSX.Element;
    className?: string;
    align?: 'left' | 'right' | 'center';
    fixed?: 'left' | 'right';
}

interface GetManageDatesTableColumnsProps {
    projDates: ProjDate[];
    project: Project;
}

export function getManageDatesTableColumns({
    projDates,
    project,
}: GetManageDatesTableColumnsProps): ManageDatesTableColumnProps[] {
    return [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render(value) {
                return <Title level={4}>{value}</Title>;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_value, record) => {
                return (
                    <ViewEditActionBtns
                        date={record.key}
                        projDates={projDates}
                        project={project}
                    />
                );
            },
        },
    ];
}
