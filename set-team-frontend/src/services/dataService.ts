import { STApiStack } from '../../../setteam_backend/outputs.json';
import { AuthService } from './authService';

const usersUrl = STApiStack.SetTeamApiEndpoint565D410D + 'users';

export class DataService {
    constructor(private authService: AuthService) {}

    // check if user exists in dynamoDB
    public async userExists(userName: string) {
        const userToCheck = {
            PK: '#PROJ',
            SK: userName,
        };

        if (this.authService.jwtToken) {
            const checkResult = await fetch(usersUrl, {
                method: 'GET',
                body: JSON.stringify(userToCheck),
                headers: {
                    Authorization: this.authService.jwtToken,
                },
            });
            console.log(checkResult);
            return true;
        }
        console.log('---- Check failed');
        return false;
    }
}
