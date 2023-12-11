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

const ProjTable = ({ project }: ProjTableProps) => {
    //  RTK data fetching
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const { data: projDates, refetch: refetchDates } = useFetchDatesQuery(
        project.projDates
    );
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    //  RTK hooks
    const [removeDatesFromProject] = useRemoveDatesFromProjectMutation();
    const [updateDate] = useUpdatedDateMutation();
    const [deleteProject] = useDeleteProjectMutation();

    //  imported components/hooks
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [modal, modalContextHolder] = Modal.useModal();

    // preare meta data and data for table render
    let columns: TableColumn[] = [];

    if (allSparks) {
        columns = renderColumns(project.projTeam, allSparks, project.SK);
    }

    let rowData: RowData[] = [];

    if (projDates) {
        rowData = renderRows(projDates, columns, handleCellChange);
    }

    // eventHandlers
    async function handleRemoveDates() {
        // prevent deleting all projDates
        if (projDates?.length === selectedRowKeys.length) {
            await messageApi.open({
                type: 'error',
                content: 'Project has to have at least one date!',
            });
            return;
        }

        if (projDates && selectedRowKeys.length > 0) {
            let datesToUpdate: ProjDate[] = projDates.filter((date) =>
                selectedRowKeys.includes(date.SK)
            );

            // prepare DATES for update
            datesToUpdate = datesToUpdate.map((date) =>
                removeProjectFromDate(project.SK, date)
            );

            //prepare project.projDates for update
            const newProjDates = project.projDates.filter(
                (date) => !selectedRowKeys.includes(date)
            );

            let refetchFlag = false;
            await removeDatesFromProject({
                projId: project.SK,
                projDates: newProjDates,
                datesToUpdate: datesToUpdate,
            })
                .unwrap()
                .catch(() => (refetchFlag = true));

            // if transaction fails refetch dates to get new sessionId for next attempt
            if (refetchFlag) {
                await refetchDates();
            } else {
                setSelectedRowKeys([]);
            }
        }
    }

    async function handleCellChange({
        date,
        userId,
        status,
    }: CellChangeProps): Promise<void> {
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
    }

    function onRowSelectionChange(newSelectedRowKeys: React.Key[]) {
        setSelectedRowKeys(newSelectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onRowSelectionChange,
    };

    async function handleDeleteProject() {
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
    }

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
