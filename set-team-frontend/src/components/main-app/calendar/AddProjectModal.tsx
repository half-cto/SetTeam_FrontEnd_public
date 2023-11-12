import { Modal, Input, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useCreateProjectMutation } from '../../../store/store';
import { CreateProjectProps } from '../../../store/apis/projectsApi';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';

interface AddProjectModalProps {
    isOpen: boolean;
    setIsOpen: (modalOpen: boolean) => void;
    selectedDate: Dayjs;
}

const AddProjectModal = ({
    isOpen,
    setIsOpen,
    selectedDate,
}: AddProjectModalProps) => {
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState(
        selectedDate.format('YYYY-MM-DD')
    );

    const [addProject, { isLoading }] = useCreateProjectMutation();
    const [dateStatus, setDateStatus] = useState<'error' | ''>('');
    const [nameStatus, setNameStatus] = useState<'error' | ''>('');
    const [errorMsg, setErrorMsg] = useState<string | undefined>();

    const handleOk = async () => {
        const { userName } = getCredentialsFromLocalStorage();
        if (!startDate) {
            setDateStatus('error');
            setErrorMsg('Select project start date!');
            return;
        }

        if (projectName === '') {
            setNameStatus('error');
            setErrorMsg('Enter project name!');
            return;
        }

        setNameStatus('');
        setDateStatus('');
        setErrorMsg(undefined);

        if (!projectName) return;

        if (userName && startDate) {
            const newProjectProps: CreateProjectProps = {
                name: projectName,
                ownerId: userName,
                projDates: [startDate],
            };

            await addProject(newProjectProps);
        }
        if (!isLoading) {
            setIsOpen(false);
            setProjectName('');
            setStartDate(dayjs().format('YYYY-MM-DD'));
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };
    const handleDateChange = (value: dayjs.Dayjs | null) => {
        if (dateStatus === 'error') setDateStatus('');
        if (value) {
            const tempDate = value.format('YYYY-MM-DD');
            setStartDate(tempDate);
        }
    };

    return (
        <Modal
            title="Create New Project"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={isLoading}
            okButtonProps={{ className: 'bg-blue-600' }}
            className="max-w-xs"
        >
            <div className="flex flex-col gap-2">
                <div>
                    <p className="mb-2">Project name</p>
                    <Input
                        placeholder="Project name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        maxLength={18}
                        className="max-w-3/4"
                        status={nameStatus}
                    />
                </div>
                <div>
                    <p className="mb-2">Start date</p>
                    <DatePicker
                        onChange={handleDateChange}
                        status={dateStatus}
                        value={dayjs(startDate, 'YYYY-MM-DD')}
                    />
                </div>
                <div className="h-2 mb-2">
                    <p className="text-red-500">{errorMsg}</p>
                </div>
            </div>
        </Modal>
    );
};
export default AddProjectModal;
