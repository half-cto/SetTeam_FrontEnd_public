import { Button, ConfigProvider, DatePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
import { useState } from 'react';
import { getDatesFromRange, sortDates } from '../../../utils/functions';
import { useUpdateProjectMutation } from '../../../store/store';
import type { UpdateProjectProps } from '../../../store/apis/projectsApi';

import ManageTeamModal from '../manage-team-modal/ManageTeamModal';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface ProjActionBarProps {
    projId: string;
    project: Project;
}

const ProjActionBar = ({ projId, project }: ProjActionBarProps) => {
    const [dates, setDates] = useState<string[]>([]);
    const [updateProject] = useUpdateProjectMutation();
    const [isTeamMoalOpen, setIsTeamModalOpen] = useState(false);

    const handleDateChange = (range: RangeValue<Dayjs>) => {
        const selectedDates = getDatesFromRange(range);
        console.log(selectedDates);
        const sortedDates = [
            ...new Set(sortDates([...selectedDates, ...project.projDates])),
        ];
        setDates(sortedDates);
    };

    // TODO remove code relevant to delete Project

    const handleAddDate = async () => {
        if (dates.length === 0) {
            return;
        }

        const updateProjectProps: UpdateProjectProps = {
            projId,
            projDates: dates,
        };

        try {
            await updateProject(updateProjectProps);
        } catch (error) {
            console.error('rejected', error);
        }
    };

    // disable dates before today and existing project dates
    const disableDate: RangePickerProps['disabledDate'] = (current) => {
        return (
            project.projDates.includes(current.format('YYYY-MM-DD')) ||
            current < dayjs().endOf('day')
        );
    };

    return (
        <div>
            <div className="p-2 px-6 bg-white rounded-s mb-2 flex justify-between rounded content-center">
                <div>
                    <ConfigProvider
                        theme={{
                            components: {
                                Typography: {
                                    titleMarginBottom: 0,
                                },
                            },
                        }}
                    >
                        <Title
                            level={3}
                            underline
                        >
                            {project && project.name}
                        </Title>
                    </ConfigProvider>
                </div>

                <div className="flex gap-2">
                    <RangePicker
                        disabledDate={disableDate}
                        inputReadOnly={true}
                        onChange={(range) => handleDateChange(range)}
                    />
                    <Button
                        onClick={handleAddDate}
                        disabled={dates.length === 0}
                    >
                        Add date
                    </Button>
                </div>

                <div>
                    <Button
                        onClick={() => setIsTeamModalOpen(true)}
                        type="primary"
                        className="bg-blue-600"
                    >
                        Manage Team
                    </Button>
                    <ManageTeamModal
                        isOpen={isTeamMoalOpen}
                        setIsOpen={setIsTeamModalOpen}
                        project={project}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjActionBar;
