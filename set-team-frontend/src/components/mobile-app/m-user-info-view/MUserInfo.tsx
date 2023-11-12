import { getCredentialsFromLocalStorage } from '../../../utils/functions';
import UserDetailsForm from '../../main-app/userInfo/UserDetailsForm';

const MUserInfo = () => {
    const { userName } = getCredentialsFromLocalStorage();

    return (
        <div className="pt-20 px-4">
            <UserDetailsForm
                userName={userName}
                width={400}
            />
        </div>
    );
};

export default MUserInfo;
