import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DateCore, ProjDate } from '../../../store/apis/datesApi';
import { ManageUsersTableData } from './ManageTeamModal';
import FilterDropDown from './FilterDropDown';
import {
    MinusSquareTwoTone,
    PlusSquareTwoTone,
    SearchOutlined,
} from '@ant-design/icons';

type SparkTag = 'B cat' | 'C cat' | 'Spark' | 'Gaffer' | 'BB';

const tagColorMap = {
    'B cat': 'green',
    'C cat': 'blue',
    BB: 'magenta',
    Spark: 'red',
    Gaffer: 'orange',
};

interface RenderManageTeamColumnsProps {
    project: Project;
    handleRemoveUser: (data: string) => Promise<void>;
    handleAddUser: (userToAdd: string) => Promise<void>;
}

export function renderManageTeamColumns({
    project,
    handleRemoveUser,
    handleAddUser,
}: RenderManageTeamColumnsProps) {
    const columns: ColumnsType<ManageUsersTableData> = [
        {
            title: 'Name Surname',
            dataIndex: 'nameSurname',
            key: 'nameSurname',
            align: 'center',
            filterSearch: true,
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                close,
            }) => (
                <FilterDropDown
                    setSelectedKeys={setSelectedKeys}
                    selectedKeys={selectedKeys}
                    confirm={confirm}
                    clearFilters={clearFilters}
                    close={close}
                ></FilterDropDown>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined
                    style={{ color: filtered ? '#1677ff' : undefined }}
                />
            ),
            onFilter: (value, record) => {
                if (typeof value === 'string') {
                    return !!record.nameSurname
                        .split(' ')
                        .find((el) =>
                            el.toLowerCase().startsWith(value.toLowerCase())
                        );
                }

                return false;
            },
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: 300,
            filters: [
                { text: 'B cat', value: 'B cat' },
                { text: 'C cat', value: 'C cat' },
                { text: 'Spark', value: 'Spark' },
                { text: 'Gaffer', value: 'Gaffer' },
            ],
            filterSearch: true,

            onFilter: (value, record) =>
                !!record.tags.find((tag) => tag === value),
            render: (tags: SparkTag[], record: { key: string }) => {
                // console.log(record);

                const renderedTags = tags.map((tag) => (
                    <Tag
                        color={tagColorMap[tag]}
                        key={tag + record.key}
                    >
                        {tag}
                    </Tag>
                ));
                return <>{renderedTags}</>;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 50,
            render: (data: string) => {
                if (project.projTeam.find((spark) => spark === data)) {
                    return (
                        <Button
                            onClick={() => handleRemoveUser(data)}
                            icon={<MinusSquareTwoTone twoToneColor="#eb2f96" />}
                            size="middle"
                        />
                    );
                } else {
                    return (
                        <Button
                            onClick={() => handleAddUser(data)}
                            icon={<PlusSquareTwoTone twoToneColor="#52c41a" />}
                            size="middle"
                        />
                    );
                }
            },
        },
    ];
    return columns;
}

interface PrepDataToRemoveUserArgs {
    userToRemove: string;
    project: Project;
    projDates: ProjDate[];
}

export function prepDataToRemoveUser({
    project,
    userToRemove,
    projDates,
}: PrepDataToRemoveUserArgs) {
    // provide follwing data
    // updated projectTeam
    const updatedProjectTeam = project.projTeam.filter(
        (sparkName) => sparkName !== userToRemove
    );
    // array of objects containign date and updatedTeamStatus
    const datesToUpdate: DateCore[] = [];
    projDates?.forEach((date) => {
        if (
            date.teamStatus.find(
                (statusEntry) =>
                    statusEntry.userId === userToRemove &&
                    statusEntry.status === project.SK
            )
        ) {
            const updatedTeamStatus = date.teamStatus.map((statusEntry) => {
                if (statusEntry.userId === userToRemove)
                    return {
                        userId: statusEntry.userId,
                        status: 'available',
                    };
                return statusEntry;
            });
            datesToUpdate.push({
                SK: date.SK,
                teamStatus: updatedTeamStatus,
                sessionId: date.sessionId,
            });
        }
    });

    return { updatedProjectTeam, datesToUpdate };
}
