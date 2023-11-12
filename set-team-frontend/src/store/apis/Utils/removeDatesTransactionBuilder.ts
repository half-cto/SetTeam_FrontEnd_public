import { RemoveDatesFromProjectProps } from '../projectsApi';
import data from '../../../../../setteam_backend/outputs.json';
import { ulid } from 'ulid';

export function buildRemoveDatesTransactionParams({
    projId,
    projDates,
    datesToUpdate,
}: RemoveDatesFromProjectProps) {
    const newSessionId = ulid();
    const tableName =
        data.STDataStack.ExportsOutputRefSetTeamTableDDFDBCCC12092BBC;
    const params = {
        TransactItems: [
            {
                Update: {
                    TableName: tableName,
                    Key: {
                        PK: 'PROJ',
                        SK: projId,
                    },
                    UpdateExpression: 'SET projDates = :projDates',
                    ExpressionAttributeValues: {
                        ':projDates': projDates,
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
