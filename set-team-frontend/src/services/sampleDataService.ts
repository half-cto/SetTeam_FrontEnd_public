// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import { AuthService } from './authService';
// import { STDataStack, STApiStack } from '../../../setteam_backend/outputs.json';

// const projectsUrl = STApiStack.SetTeamApiEndpoint565D410D + 'projects';

// export class DataService {
//     private s3Client: S3Client | undefined;
//     private awsRegion = 'eu-central-1';

//     constructor(private authService: AuthService) {}

//     //TODO rewrite this function to add current user as owner ID
//     public async createProject(
//         projectName: string,
//         startDate: string,
//         photo?: File
//     ) {
//         const project = {} as any;
//         (project.name = projectName), (project.ownerId = 'test_owner');
//         project.projDates = [startDate];
//         console.log(project);
//         if (photo) {
//             const uploadUrl = await this.uploadPublicFile(photo);
//             console.log(uploadUrl);
//         }

//         if (this.authService.jwtToken) {
//             const postResult = await fetch(projectsUrl, {
//                 method: 'POST',
//                 body: JSON.stringify(project),
//                 headers: {
//                     Authorization: this.authService.jwtToken,
//                 },
//             });
//             const postResultJSON = await postResult.json();
//             return postResultJSON;
//         }

//         return 'creating space failed';
//     }

//     private async uploadPublicFile(file: File) {
//         const credentials = await this.authService.getTemoraryCredentials();
//         if (!this.s3Client) {
//             this.s3Client = new S3Client({
//                 credentials: credentials,
//                 region: this.awsRegion,
//             });
//         }

//         const command = new PutObjectCommand({
//             Bucket: STDataStack.SetTeamPhotosBucketName,
//             Key: file.name,
//             ACL: 'public-read',
//             Body: file,
//         });

//         await this.s3Client.send(command);

//         return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
//     }

//     public isAuthorized(): boolean {
//         return true;
//     }
// }
