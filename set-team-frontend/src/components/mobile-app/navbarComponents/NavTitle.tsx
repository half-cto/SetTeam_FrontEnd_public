import { Typography } from 'antd';

const { Title } = Typography;

interface NavTitleProps {
    type: 'createProject' | 'userInfo';
}

const NavTitleProps = ({ type }: NavTitleProps) => {
    const title =
        type === 'createProject'
            ? 'Create New Project'
            : type === 'userInfo'
            ? 'User'
            : undefined;
    return (
        <div>
            <Title level={3}>{title}</Title>
        </div>
    );
};

export default NavTitleProps;
