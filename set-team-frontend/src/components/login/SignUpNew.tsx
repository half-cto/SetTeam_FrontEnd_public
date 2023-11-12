import { useState } from 'react';
import { type AuthService } from '../../services/authService';
import ContainerDiv from '../utility-components/ContainerDiv';
import { handleLoginError } from '../../utils/functions';
import { Button, ConfigProvider, Form, Input } from 'antd';
import Background from './Background';
import { Link, Navigate } from 'react-router-dom';

interface SubmitSignupProps {
    userName: string;
    password: string;
    password2: string;
    email: string;
}

interface SignUpProps {
    authService: AuthService;
}

const SignUpNew = ({ authService }: SignUpProps) => {
    const [errorMsg, setErrorMsg] = useState<string | undefined>();
    const [signUpSuccsess, setSignUpSuccess] = useState(false);

    const handleSubmit = async ({
        email,
        password,
        password2,
        userName,
    }: SubmitSignupProps) => {
        if (password !== password2) {
            setErrorMsg('Passwords have to match!');
            return;
        }
        try {
            await authService.signUp(userName, password, email);
            setSignUpSuccess(true);
            setErrorMsg(undefined);
        } catch (error) {
            handleLoginError(error, setErrorMsg);
        }
    };

    return (
        <>
            {signUpSuccsess && <Navigate to={'/confirmNewUser'} />}
            <Background />
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: 'Roboto Mono',
                    },
                }}
            >
                <ContainerDiv divType="landing-container">
                    <ContainerDiv divType="form-conainer">
                        <div className="flex justify-center">
                            <h1 className="mb-4 text-xl">Get on Board</h1>
                        </div>
                        <Form
                            name="signup"
                            labelCol={{ span: 10 }}
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
                                        required: true,
                                        message: 'Please enter username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Confirm password"
                                name="password2"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        required: true,
                                        message: 'Enter valid email address',
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
                                    Sign Up
                                </Button>
                            </Form.Item>
                            {errorMsg && (
                                <div className="flex justify-center text-red-500">
                                    <h2>{errorMsg}</h2>
                                </div>
                            )}
                        </Form>
                        <div className="flex justify-center text-xs mt-4">
                            <p>
                                Already have account?{' '}
                                <Link
                                    className="text-blue-600 hover:text-blue-400"
                                    to={'/'}
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </ContainerDiv>
                </ContainerDiv>
            </ConfigProvider>
        </>
    );
};

export default SignUpNew;
