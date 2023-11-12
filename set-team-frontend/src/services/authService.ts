import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
// import authStack configuration from backend
import { STAuthStack } from '../../../setteam_backend/outputs.json';


const awsRegion = 'eu-central-1';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: awsRegion,
        userPoolId: STAuthStack.SetTeamUserPoolId,
        userPoolWebClientId: STAuthStack.SetTeamUserPoolClientId,
        identityPoolId: STAuthStack.SetTeamIdentityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
});

export class AuthService {
    private user: CognitoUser | undefined;
    public jwtToken: string | undefined;
    // private tempCredentials: AwsCredentialIdentity | undefined;

    public async login(
        username: string,
        password: string
    ): Promise<CognitoUser | undefined> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.user = await Auth.signIn(username, password);
            this.jwtToken = this.user
                ?.getSignInUserSession()
                ?.getIdToken()
                .getJwtToken();

            return this.user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected Error');
            }
        }
    }

    public async signUp(
        username: string,
        password: string,
        email: string
    ): Promise<void> {
        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected Error');
            }
        }
    }

    // fn confirms new user sign up returns - true if success / false if fail
    public async confirmNewUser(
        username: string,
        code: string
    ): Promise<boolean> {
        try {
            await Auth.confirmSignUp(username, code);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected Error');
            }
            return false;
        }
    }

    public async signOut() {
        try {
            await Auth.signOut();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('Unexpected Error');
            }
        }
    }

    public getUserName(): string | undefined {
        return this.user?.getUsername();
    }

    public getTokenAndUsername() {
        return { userName: this.getUserName(), jwtToken: this.jwtToken };
    }
}
