import { ConfigProvider } from 'antd';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';
import UserDetailsForm from './UserDetailsForm';

// TODO if user exists populate fields and perform update if user submits

const UserInfo = () => {
    const { userName } = getCredentialsFromLocalStorage();
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Roboto Mono',
                },
            }}
        >
            <div className=" mt-8 flex flex-col justify-center items-center max-w-full">
                <div className="flex justify-center">
                    <h1 className="mb-4 text-xl font-robotoMono z-20">
                        Update user details
                    </h1>
                </div>
                <div className="flex justify-center">
                    <UserDetailsForm
                        userName={userName}
                        width={600}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default UserInfo;
