import { SortOrder } from 'antd/es/table/interface';
import { DateCore, ProjDate, SparkStatus } from '../../../store/apis/datesApi';
import { parseDateToInteger, sortPojDates } from '../../../utils/functions';
import { CellChangeProps, RowData } from './ProjTable';
import TCell, { CallbackProps } from './TCell';
import dayjs from 'dayjs';

interface CellRecord {
    [key: string]: string;
}

interface ValueProps {
    cellId: string;
    callback: ({ date, userId, status }: CallbackProps) => Promise<void>;
    status: string | undefined;
}

export interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    render?: (
        value: ValueProps,
        record: CellRecord,
        index: number
    ) => JSX.Element;
    className?: string;
    align?: 'left' | 'right' | 'center';
    fixed?: 'left' | 'right';
    sortDirections?: SortOrder[];
    sorter?: (a: RowData, b: RowData) => number;
}

//  * render table columns form projTeam[]

export const renderColumns = (
    projTeam: string[],
    allSparks: User[],
    projectId: string
): TableColumn[] => {
    const renderedColumns: TableColumn[] = [
        // add Date column
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            fixed: 'left',
            className: 'mx-auto',
            align: 'center',
            sortDirections: ['descend'],
            render(_value, record) {
                return (
                    <div className="text-lg">
                        {dayjs(record.date).format('DD. MMM')}
                    </div>
                );
            },
            sorter: (a, b) => {
                return parseDateToInteger(a.key) - parseDateToInteger(b.key);
            },
        },
    ];
    // find spark in Users[] and fill column data
    projTeam.forEach((sparkId) => {
        const spark = allSparks.find((sp) => sp.SK === sparkId);
        if (spark)
            renderedColumns.push({
                title: spark?.name + ' ' + spark?.surname,
                dataIndex: spark?.SK,
                key: spark?.SK,
                align: 'center',

                render: (value, record, index) => (
                    <TCell
                        projectId={projectId}
                        userId={spark.SK}
                        rowDate={record?.date}
                        value={value || 'no text'}
                        index={index || 0}
                    />
                ),
            });
    });
    return renderedColumns;
};

// * render table rows

export function renderRows(
    projDates: ProjDate[],
    columns: TableColumn[],
    callback: (props: CellChangeProps) => Promise<void>
): RowData[] {
    // sort dates in ascending order
    const sortedProjDates = sortPojDates(projDates);

    const rowData = sortedProjDates.map(({ SK: date, teamStatus }) => {
        // add row date
        const rowToAdd: RowData = {
            key: date,
            date: date,
        };

        // add team member status to row
        if (columns) {
            columns.forEach((column) => {
                if (column.dataIndex === 'date') return;

                const sparkStatus = teamStatus.find(
                    (memberStatus) => memberStatus.userId === column.key
                );
                // add data passed to each cell
                rowToAdd[column.dataIndex] = {
                    cellId: column.dataIndex,
                    callback: callback,
                    status: sparkStatus?.status || 'available',
                };
            });
        }
        return rowToAdd;
    });
    return rowData;
}

// getUpdatedDate - return data for cell update based on current cell state

export const getUpdatedDate = ({
    project,
    projDates,
    date,
    userId,
    status,
}: CellChangeProps): DateCore | undefined => {
    if (status && status !== project.SK && status !== 'available') return;

    // switch user status to opposite : ('available' || undefined) <==> project.SK
    const newStatus =
        status === 'available' || status === undefined
            ? project.SK
            : 'available';

    const dateToUpdate = projDates.find((projDate) => projDate.SK === date);

    let newTeamStatus: SparkStatus[] = [];

    // find user in date.teamStatus and update status OR add new entry to date.teamStatus
    if (dateToUpdate?.teamStatus.find((el) => el.userId === userId)) {
        newTeamStatus = dateToUpdate.teamStatus.map((sparkStatus) => {
            if (sparkStatus.userId === userId)
                return {
                    userId,
                    status: newStatus,
                };
            return sparkStatus;
        });
    } else {
        if (dateToUpdate?.teamStatus) {
            newTeamStatus = [
                ...dateToUpdate.teamStatus,
                { userId, status: newStatus },
            ];
        } else {
            newTeamStatus.push({ userId, status: newStatus });
        }
    }

    // return updated date entry
    if (dateToUpdate?.sessionId) {
        return {
            SK: date,
            teamStatus: newTeamStatus,
            sessionId: dateToUpdate?.sessionId,
        };
    }
};

// prepare date for deleting in DB

export const removeProjectFromDate = (projId: string, date: ProjDate) => {
    // release team members from project
    const newTeamStatus = date.teamStatus.map((teamStatus) => {
        if (teamStatus.status === projId) {
            return { ...teamStatus, status: 'available' };
        }
        return teamStatus;
    });

    // remove project from date
    const newDateProjs = date.dateProjs.filter((proj) => proj !== projId);

    return {
        ...date,
        dateProjs: newDateProjs,
        teamStatus: newTeamStatus,
    };
};
