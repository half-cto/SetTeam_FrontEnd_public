import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Form, Button, Input, ConfigProvider } from 'antd';
import { type AuthService } from '../../services/authService';
import ContainerDiv from '../utility-components/ContainerDiv';
import { handleLoginError } from '../../utils/functions';
import { setCredentials } from '../../store/store';
import { useDispatch } from 'react-redux';
import Background from './Background';
import { useMediaQuery } from 'react-responsive';

interface SubmitProps {
    username: string;
    password: string;
}

interface LoginProps {
    authService: AuthService;
}

function Login({ authService }: LoginProps): JSX.Element {
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | undefined>();

    const dispatch = useDispatch();

    const handleSubmit = async (values: SubmitProps) => {
        try {
            setErrorMsg(undefined);
            const loginResponse = await authService.login(
                values.username,
                values.password
            );

            if (loginResponse) {
                const credentials = {
                    userName: loginResponse.getUsername(),
                    jwtToken: loginResponse
                        .getSignInUserSession()
                        ?.getIdToken()
                        .getJwtToken(),
                };
                if (credentials.userName && credentials.jwtToken) {
                    dispatch(
                        setCredentials({
                            userName: credentials.userName,
                            jwtToken: credentials.jwtToken,
                        })
                    );
                    window.localStorage.setItem(
                        'SET_TEAM_CREDENTIALS',
                        JSON.stringify(credentials)
                    );
                }

                setLoginSuccess(true);
            }

            return;
        } catch (error) {
            handleLoginError(error, setErrorMsg);
        }
    };

    const isTablet = useMediaQuery({ minWidth: 768 });
    const isLaptop = useMediaQuery({ minWidth: 1024 });

    const siteToDisplay = isTablet
        ? '/calendar'
        : isLaptop
        ? '/calendar'
        : '/mdashboard';

    return (
        <>
            <Background />
            <ContainerDiv divType="landing-container">
                {loginSuccess && (
                    <Navigate
                        to={siteToDisplay}
                        replace={true}
                    />
                )}
                <div className="felx justify-center">
                    <h1 className="text-6xl z-20 text-center">SetTeam</h1>
                </div>
                <ContainerDiv divType="form-conainer">
                    <ConfigProvider
                        theme={{
                            token: {
                                fontFamily: 'Roboto Mono',
                            },
                        }}
                    >
                        <Form
                            name="login"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{}}
                            initialValues={{ remember: true }}
                            onFinish={handleSubmit}
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
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
                            {errorMsg && (
                                <div className="flex justify-center mb-3">
                                    <h2>{errorMsg}</h2>
                                </div>
                            )}
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-600"
                                >
                                    Log In
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="flex justify-center text-xs">
                            <p>
                                Don't have an account?{' '}
                                <Link
                                    className="text-blue-600 hover:text-blue-400"
                                    to={'/signup'}
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </ConfigProvider>
                </ContainerDiv>
            </ContainerDiv>
        </>
    );
}

export default Login;
