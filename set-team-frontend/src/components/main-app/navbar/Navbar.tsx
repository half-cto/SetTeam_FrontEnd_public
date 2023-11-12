import { Button, ConfigProvider, Layout, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';
import { AuthService } from '../../../services/authService';
const { Header } = Layout;
import { useNavigate } from 'react-router-dom';
import { useFetchUserQuery } from '../../../store/store';
import { useEffect } from 'react';

interface NavBarProps {
    authService: AuthService;
}

function NavBar({ authService }: NavBarProps) {
    const { userName } = getCredentialsFromLocalStorage();
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();

    const { data: userInfo, isFetching: isFetchingUserInfo } =
        useFetchUserQuery({
            userName,
        });

    // redirect if first sign in
    useEffect(() => {
        if (!isFetchingUserInfo && userInfo === undefined)
            navigate('/userInfo');
    }, [isFetchingUserInfo, userInfo]);

    const handleSignOut = async () => {
        await authService.signOut();
        console.log('User signed out ...');
        window.localStorage.clear();
        navigate('/');
    };

    const confirmSignOut = () => {
        modal.confirm({
            title: 'Confirm',
            content: 'Do You want to end current session?',
            onOk: handleSignOut,
            okButtonProps: {
                className: 'bg-blue-600',
            },
        });
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            {contextHolder}

            <Layout>
                <Header className="sticky top-0 z-10 w-full flex items-center justify-between bg-orange-400 gap-4 drop-shadow-xl">
                    <div className="flex gap-4">
                        <div className="logo" />
                        <div className="flex gap-2 items-center text-lg">
                            <p className="flex ">Wellcome</p>
                            <h2 className="font-bold ">
                                {userName && userName}
                            </h2>
                        </div>

                        <div className="mr-8 flex gap-2 items-center ">
                            <Button
                                className="bg-amber-400 hover:text-red-400"
                                onClick={() => navigate('/calendar')}
                            >
                                Calendar
                            </Button>
                            <Button
                                className="bg-amber-400"
                                onClick={() => navigate('/userinfo')}
                            >
                                User
                            </Button>
                        </div>
                    </div>
                    {!isFetchingUserInfo && !userInfo && (
                        <div>
                            <p className="animate-textColorChange font-bold">
                                <Link to={'/userInfo'}>
                                    {' '}
                                    Update user details to proceed!
                                </Link>
                            </p>
                        </div>
                    )}
                    <div>
                        <Button
                            onClick={confirmSignOut}
                            type="primary"
                            className="bg-blue-600 shadow-md"
                        >
                            Sign Out
                        </Button>
                    </div>
                </Header>
            </Layout>
        </ConfigProvider>
    );
}

export default NavBar;
