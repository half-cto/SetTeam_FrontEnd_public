import {
    Button,
    ConfigProvider,
    Form,
    Input,
    Select,
    SelectProps,
    Spin,
} from 'antd';
import {
    CreateUserProps,
    useCreateUserMutation,
    useFetchUserQuery,
} from '../../../store/apis/usersApi';

import { useState } from 'react';

const selectTags: SelectProps[] = [
    { value: 'Spark' },
    { value: 'Gaffer' },
    { value: 'BB' },
    { value: 'B cat' },
    { value: 'C cat' },
];

interface UserDetailsFormProps {
    userName: string;
    width: number;
}

const UserDetailsForm = ({ userName, width }: UserDetailsFormProps) => {
    const { data: user, isFetching } = useFetchUserQuery({ userName });
    const [createUser] = useCreateUserMutation();
    const [userIsUpdated, setUserIsUpdated] = useState<undefined | string>(
        undefined
    );

    const onFinish = async (args: User) => {
        if (userName) {
            const userToCreate: CreateUserProps = {
                ...args,
                userName,
            };
            try {
                const payload = await createUser(userToCreate).unwrap();
                if (payload) setUserIsUpdated('User updated successfuly!');
            } catch (error) {
                setUserIsUpdated('User data update failed!');
            }
        }
    };

    const componentContent = !isFetching ? (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: width }}
                initialValues={{
                    name: user?.name,
                    surname: user?.surname,
                    tags: user?.tags,
                }}
                onFinish={onFinish}
                requiredMark={false}
                className="p-4 border rounded-md bg-sky-200 z-20"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Name.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Surname"
                    name="surname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Surname.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[
                        {
                            required: true,
                            message: 'Please select at least one tag.',
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={selectTags}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-600"
                    >
                        Submit
                    </Button>
                </Form.Item>
                <div className="text-center">
                    {userIsUpdated && userIsUpdated}
                </div>
            </Form>
        </ConfigProvider>
    ) : (
        <div className="flex flex-col w-full justify-center pt-32">
            <Spin size="large" />
        </div>
    );
    return componentContent;
};

export default UserDetailsForm;
