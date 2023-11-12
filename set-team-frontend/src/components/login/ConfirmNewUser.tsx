import { useState } from 'react';
import { AuthService } from '../../services/authService';
import { Link, Navigate } from 'react-router-dom';
import ContainerDiv from '../utility-components/ContainerDiv';
import { handleLoginError } from '../../utils/functions';
import { Button, ConfigProvider, Form, Input } from 'antd';
import Background from './Background';

interface SubmitProps {
    userName: string;
    code: string;
}

interface ConfirmUserProps {
    authService: AuthService;
}

const ConfimNewUser: React.FC<ConfirmUserProps> = ({ authService }) => {
    const [confirmSuccess, setConfirmSuccess] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | undefined>();

    const handleSubmit = async ({
        userName,
        code,
    }: SubmitProps): Promise<void> => {
        if (userName && code) {
            try {
                const result = await authService.confirmNewUser(userName, code);
                setConfirmSuccess(result);
                setErrorMsg(undefined);
            } catch (error) {
                handleLoginError(error, setErrorMsg);
            }
        }
    };

    return (
        <>
            <Background />
            <ContainerDiv divType="landing-container">
                {confirmSuccess && <Navigate to={'/'} />}
                <ContainerDiv divType="form-conainer">
                    <div className="flex flex-col justify-center mb-4">
                        <h1 className="mb-4 text-xl">Confirm new user</h1>
                        <p className="text-center text-sm">
                            Check Your e-mail for confirmation code!
                        </p>
                    </div>
                    <ConfigProvider
                        theme={{
                            token: {
                                fontFamily: 'Roboto Mono',
                            },
                        }}
                    >
                        <Form
                            name="confirmNewUser"
                            labelCol={{ span: 12 }}
                            wrapperCol={{ span: 30 }}
                            style={{}}
                            initialValues={{ remember: true }}
                            onFinish={handleSubmit}
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Username"
                                name="userName"
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        message: 'Please enter username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 12 }}
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter verification code!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-600"
                                >
                                    Confirm
                                </Button>
                            </Form.Item>
                            {errorMsg && (
                                <div className="flex justify-center mb-3  text-red-500">
                                    <h2>{errorMsg}</h2>
                                </div>
                            )}
                            <div className="flex justify-center mt-4 flex-col">
                                <p className="text-center">
                                    Already have account?{' '}
                                </p>
                                <Link
                                    className="text-blue-600 hover:text-blue-400 text-center"
                                    to={'/'}
                                >
                                    Sign In
                                </Link>
                            </div>
                        </Form>
                    </ConfigProvider>
                </ContainerDiv>
            </ContainerDiv>
        </>
    );
};

export default ConfimNewUser;
