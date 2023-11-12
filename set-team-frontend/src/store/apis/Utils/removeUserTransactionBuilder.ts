import { ulid } from 'ulid';
import data from '../../../../../setteam_backend/outputs.json';
import { RemoveUserFromProjectProps } from '../projectsApi';

export function buildRemoveUserTransaction({
    projId,
    projTeam,
    datesToUpdate,
}: RemoveUserFromProjectProps) {
    const newSessionId = ulid();
    const tableName =
        data.STDataStack.ExportsOutputRefSetTeamTableDDFDBCCC12092BBC;

    

    // build props for DynamoDB transaction
    const params = {
        TransactItems: [
            // update project
            {
                Update: {
                    TableName: tableName,
                    Key: {
                        PK: 'PROJ',
                        SK: projId,
                    },
                    UpdateExpression: 'SET projTeam = :projTeam',

                    ExpressionAttributeValues: {
                        ':projTeam': projTeam,
                    },
                },
            },
            // map datesToUpdate to update each date
            ...datesToUpdate.map((date) => {
                return {
                    Update: {
                        TableName: tableName,
                        Key: {
                            PK: 'DATE',
                            SK: date.SK,
                        },
                        UpdateExpression:
                            'SET teamStatus = :teamStatus, sessionId = :newSessionId',
                        ExpressionAttributeValues: {
                            ':teamStatus': date.teamStatus,
                            ':sessionId': date.sessionId,
                            ':newSessionId': newSessionId,
                        },
                        ConditionExpression: 'sessionId = :sessionId',
                    },
                };
            }),
        ],
    };
    return params;
}
