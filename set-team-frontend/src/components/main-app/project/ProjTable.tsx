import { Button, message, Table, Modal } from 'antd';
import {
    TableColumn,
    getUpdatedDate,
    removeProjectFromDate,
    renderColumns,
    renderRows,
} from './projUtils';
import {
    useDeleteProjectMutation,
    useFetchDatesQuery,
    useFetchTeamMembersQuery,
    useRemoveDatesFromProjectMutation,
} from '../../../store/store';
import { ProjDate, useUpdatedDateMutation } from '../../../store/apis/datesApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjTableProps {
    project: Project;
}


export interface RowData extends Record<string, any> {
    key: string;
    date: string;
}

export interface CellChangeProps {
    project: Project;
    projDates: ProjDate[];
    date: string;
    userId: string;
    status: string | undefined;
}

// TODO refactor this component

const ProjTable = ({ project }: ProjTableProps) => {
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const { data: projDates, refetch: refetchDates } = useFetchDatesQuery(
        project.projDates
    );
    const [removeDatesFromProject] = useRemoveDatesFromProjectMutation();
    const [updateDate] = useUpdatedDateMutation();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [deleteProject] = useDeleteProjectMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [modal, modalContextHolder] = Modal.useModal();

    const handleCellChange = async ({
        date,
        userId,
        status,
    }: CellChangeProps): Promise<void> => {
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

    let columns: TableColumn[] | undefined = [];
    if (allSparks)
        columns = renderColumns(project.projTeam, allSparks, project.SK);

    let rowData: RowData[] = [];

    if (projDates) {
        rowData = renderRows(projDates, columns, handleCellChange);
    }

    const onRowSelectionChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleRemoveDates = async () => {
        if (projDates?.length === selectedRowKeys.length) {
            await messageApi.open({
                type: 'error',
                content: 'Project has to have at least one date!',
            });
            return;
        }
        if (projDates && selectedRowKeys.length > 0) {
            let updatedDates: ProjDate[] = projDates.filter((date) =>
                selectedRowKeys.includes(date.SK)
            );

            updatedDates = updatedDates.map((date) => {
                return removeProjectFromDate(project.SK, date);
            });

            // console.log('dates to remove from project : ', updatedDates);

            const newProjDates = project.projDates.filter(
                (date) => !selectedRowKeys.includes(date)
            );

            // console.log('updated projDates : ', newProjDates);
            let refetchFlag = false;
            await removeDatesFromProject({
                projId: project.SK,
                projDates: newProjDates,
                datesToUpdate: updatedDates,
            })
                .unwrap()
                .catch(() => (refetchFlag = true));

            if (refetchFlag) await refetchDates();
            if (!refetchFlag) setSelectedRowKeys([]);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onRowSelectionChange,
    };

    const handleDeleteProject = async () => {
        if (projDates) {
            const updatedDates = projDates.map((date) =>
                removeProjectFromDate(project.SK, date)
            );

            try {
                await deleteProject({
                    projId: project.SK,
                    datesToUpdate: updatedDates,
                });
            } catch (error) {
                console.error(error);
            }
            navigate('/calendar');
        }
    };

    // TODO refactor table footer

    return (
        <div>
            {contextHolder}
            {modalContextHolder}
            <Table
                bordered={true}
                columns={columns}
                dataSource={rowData}
                loading={!allSparks || !projDates}
                rowSelection={rowSelection}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                scroll={{ scrollToFirstRowOnChange: true, y: 500, x: 800 }}
                footer={() => {
                    return (
                        <div className="flex justify-between">
                            <div>
                                <Button onClick={handleRemoveDates}>
                                    Remove Selected Dates
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        modal.confirm({
                                            title: 'Confirm',
                                            content:
                                                'Do You want to delete current project?',
                                            onOk: handleDeleteProject,
                                            okButtonProps: {
                                                className: 'bg-blue-600',
                                            },
                                        });
                                    }}
                                    danger
                                >
                                    Delete Project
                                </Button>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default ProjTable;
