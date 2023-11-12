import { Empty, Typography, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;

const ErrorPage = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <Title level={2}>404 nothing to be found here...</Title>
                    <Empty />
                    <Link
                        to={'/'}
                        className="font-robotoMono font-bold text-blue-600 hover:text-blue-500"
                    >
                        go to Log In page
                    </Link>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ErrorPage;
