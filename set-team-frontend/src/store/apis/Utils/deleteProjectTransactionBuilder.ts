import { DeleteProjectProps } from '../projectsApi';
import data from '../../../../../setteam_backend/outputs.json';
import { ulid } from 'ulid';

export function buildDeleteProjectTransactionParams({
    projId,
    datesToUpdate,
}: DeleteProjectProps) {
    const newSessionId = ulid();
    const tableName =
        data.STDataStack.ExportsOutputRefSetTeamTableDDFDBCCC12092BBC;
    const params = {
        TransactItems: [
            {
                Delete: {
                    TableName: tableName,
                    Key: {
                        PK: 'PROJ',
                        SK: projId,
                    },
                },
            },
            ...datesToUpdate.map((date) => {
                return {
                    Update: {
                        TableName: tableName,
                        Key: {
                            PK: 'DATE',
                            SK: date.SK,
                        },
                        UpdateExpression:
                            'SET dateProjs = :dateProjs, teamStatus = :teamStatus, sessionId = :newSessionId',
                        ExpressionAttributeValues: {
                            ':dateProjs': date.dateProjs,
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
