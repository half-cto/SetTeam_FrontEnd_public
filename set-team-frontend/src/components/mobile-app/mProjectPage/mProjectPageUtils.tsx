import classNames from 'classnames';
import { ProjDate } from '../../../store/apis/datesApi';

import { MUpdateUserStatusProps } from './MProjectDate';

interface UserStatus {
    status: string | undefined;
    callback?: () => Promise<void>;
}

export interface MCellRecord {
    key: string;
    name: string;
    status: UserStatus;
}

export interface MTableColumnProps {
    title: string;
    dataIndex: string;
    key: string;
    render?: (
        value: UserStatus,
        record: MCellRecord,
        index: number
    ) => JSX.Element;
    className?: string;
    align?: 'left' | 'right' | 'center';
    fixed?: 'left' | 'right';
    // sortDirections?: SortOrder[];
    // sorter?: (a: RowData, b: RowData) => number;
}

export interface RenderMColumnsProps {
    projId: string;
    activeDate: string;
    callback: (props: MUpdateUserStatusProps) => Promise<void>;
}

//  * renders user availability for date

export const renderMColumns = ({
    projId,
    activeDate,
    callback,
}: RenderMColumnsProps): MTableColumnProps[] => {
    const renderedColumns: MTableColumnProps[] = [
        {
            title: 'Name Surname',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render(value, record) {
                const cellClasses = createCellClass(value.status, projId);
                // console.log('value : ', value, ' record : ', record);
                return (
                    <div
                        className={cellClasses}
                        onClick={() =>
                            callback({
                                date: activeDate,
                                status: value.status,
                                userId: record.key,
                            })
                        }
                    ></div>
                );
            },
        },
    ];
    return renderedColumns;
};

// * create cell classes for user status display
const createCellClass = (userStatus: string | undefined, projId: string) => {
    const cellType =
        userStatus === projId
            ? 'onTeam'
            : userStatus === 'available' || userStatus === undefined
            ? 'available'
            : 'busy';
    const cellClasses = classNames(
        `rounded h-6 w-20 mx-auto drop-shadow-lg active:drop-shadow-none border-4`,
        {
            'border-green-600 cursor-pointer': cellType === 'available',
            'border-green-600 bg-green-600 cursor-pointer':
                cellType === 'onTeam',
            'border-gray-400 bg-gray-400': cellType === 'busy',
        }
    );
    return cellClasses;
};

// * creates data for ProjectDate table

export interface MTableDataSource {
    key: string;
    name: string;
    status: UserStatus;
}

export function createTeamStatusTableData(
    project: Project,
    projDates: ProjDate[],
    activeDate: string,
    allSparks: User[]
) {
    const dateInfo = projDates.find((date) => date.SK === activeDate);

    const teamStatusTableData: MTableDataSource[] = project.projTeam.map(
        (teamMemberId) => {
            const memberStatus = dateInfo?.teamStatus.find(
                (entry) => entry.userId === teamMemberId
            );

            const memberData = allSparks.find(
                (spark) => spark.SK === teamMemberId
            ) as User;

            return {
                key: teamMemberId,
                name: memberData.name + ' ' + memberData.surname,
                status: { status: memberStatus?.status },
            };
        }
    );
    return teamStatusTableData;
}
