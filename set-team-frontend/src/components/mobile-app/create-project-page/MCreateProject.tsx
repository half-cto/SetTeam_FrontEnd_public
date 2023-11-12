import { Button, ConfigProvider, DatePicker, Form, Input } from 'antd';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';
import { Dayjs } from 'dayjs';
import { useDispatch } from 'react-redux';
import {
    CreateProjectProps,
    useCreateProjectMutation,
} from '../../../store/apis/projectsApi';
import { updateDisplayPage } from '../../../store/store';

interface HandleCreateProjectProps {
    projName: string;
    startDate: Dayjs;
}

const MCreateProject = () => {
    const [addProject] = useCreateProjectMutation();
    const dispatch = useDispatch();

    const handleCreateProject = async ({
        projName,
        startDate,
    }: HandleCreateProjectProps) => {
        const { userName } = getCredentialsFromLocalStorage();
        // console.log('<-- create proj props', data.projName, data.startDate);
        const newProject: CreateProjectProps = {
            name: projName,
            ownerId: userName,
            projDates: [startDate.format('YYYY-MM-DD')],
        };

        await addProject(newProject);
        dispatch(updateDisplayPage({ displayPage: 'calendar' }));
    };

    const handleCancel = () => {
        dispatch(updateDisplayPage({ displayPage: 'calendar' }));
    };
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <div className="px-4">
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={handleCreateProject}
                    className="pt-16"
                    requiredMark={false}
                >
                    <Form.Item
                        label="Project Name"
                        name="projName"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter name of project!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please select start date!',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-between w-full ">
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-blue-600"
                            >
                                Create Project
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </ConfigProvider>
    );
};

export default MCreateProject;
