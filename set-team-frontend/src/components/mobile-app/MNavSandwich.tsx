import { MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { MDisplayPage } from './MDashboard';
import { useDispatch } from 'react-redux';
import { updateDisplayPage } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

interface MNavSandwichProps {
    authService: AuthService;
}

const MNavSandwich = ({ authService }: MNavSandwichProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigation = (destination: MDisplayPage) => {
        dispatch(updateDisplayPage({ displayPage: destination }));
        console.log(destination);
    };

    const handleSignOut = async () => {
        await authService.signOut();
        console.log('User signed out ...');
        window.localStorage.clear();
        navigate('/');
    };

    const items: MenuProps['items'] = [
        {
            key: 'calendar',
            label: (
                <div className="flex">
                    <Button
                        className="flex-auto"
                        onClick={() => handleNavigation('calendar')}
                    >
                        Calendar
                    </Button>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div className="flex">
                    <Button
                        className="flex-auto"
                        onClick={() => handleNavigation('userInfo')}
                    >
                        User
                    </Button>
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div className="flex">
                    <Button
                        className="flex-auto"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
        >
            <Button
                icon={<MenuOutlined />}
                className="bg-slate-200"
            />
        </Dropdown>
    );
};

export default MNavSandwich;
