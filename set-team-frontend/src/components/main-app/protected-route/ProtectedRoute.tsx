import { Navigate } from 'react-router-dom';
import { AuthService } from '../../../services/authService';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';

interface ProtectedRouteProps {
    children: JSX.Element | JSX.Element[];
    authService: AuthService;
}

const ProtectedRoute = ({ children, authService }: ProtectedRouteProps) => {
    const { userName, jwtToken } = getCredentialsFromLocalStorage();
    const userIsAuthorised =
        (!!authService.getTokenAndUsername().jwtToken &&
            !!authService.getTokenAndUsername().userName) ||
        (userName && jwtToken);

    return userIsAuthorised ? children : <Navigate to={'/Login'} />;
};

export default ProtectedRoute;
