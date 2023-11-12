import { PlusOutlined } from '@ant-design/icons';
import { Form, DatePicker, Button, Drawer, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { sortDates } from '../../../utils/functions';
import { useUpdateProjectMutation } from '../../../store/store';
import { RangePickerProps } from 'antd/es/date-picker';
import { UpdateProjectProps } from '../../../store/apis/projectsApi';

interface AddDateDrawerProps {
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projDates: string[];
    projectId: string;
}

const AddDateDrawer = ({
    isDrawerOpen,
    setIsDrawerOpen,
    projDates,
    projectId,
}: AddDateDrawerProps) => {
    const [updateProject] = useUpdateProjectMutation();

    const handleAddDate = async ({ startDate }: { startDate: Dayjs }) => {
        const selectedDate = startDate.format('YYYY-MM-DD');
        const sortedDates = [
            ...new Set(sortDates([selectedDate, ...projDates])),
        ];

        const updateProjectProps: UpdateProjectProps = {
            projId: projectId,
            projDates: sortedDates,
        };

        try {
            await updateProject(updateProjectProps);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('rejected', error);
        }
    };

    // disable dates before today and existing project dates
    const disableDate: RangePickerProps['disabledDate'] = (current) => {
        return (
            projDates.includes(current.format('YYYY-MM-DD')) ||
            current < dayjs().endOf('day')
        );
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <Drawer
                title="Add Date"
                placement="bottom"
                closable={false}
                // onClose={onClose}
                open={isDrawerOpen}
                key="addDateDrawer"
                height={200}
                extra={
                    <Button onClick={() => setIsDrawerOpen(false)}>
                        Cancel
                    </Button>
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="vertical"
                    onFinish={handleAddDate}
                    requiredMark={false}
                    className="w-full flex justify-between items-center"
                >
                    <Form.Item
                        label="Select Date"
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please select date!',
                            },
                        ]}
                    >
                        <DatePicker disabledDate={disableDate} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 mt-6"
                            icon={<PlusOutlined />}
                        >
                            Add Date
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </ConfigProvider>
    );
};

export default AddDateDrawer;
