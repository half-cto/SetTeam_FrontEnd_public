import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { STApiStack } from '../../../../setteam_backend/outputs.json';
import { RootState } from '../store';
import { getCredentialsFromLocalStorage } from '../../utils/functions';

const baseUrl = STApiStack.SetTeamApiEndpoint565D410D;

export interface SparkStatus {
    userId: string;
    status: string | undefined;
}

export interface DateCore {
    SK: string;
    teamStatus: SparkStatus[];
    sessionId: string;
}

export interface ProjDate extends DateCore {
    PK: 'DATE';
    date: number;
    dateProjs: string[];
}

const datesApi = createApi({
    reducerPath: 'dates',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders(headers, { getState }) {
            const token = (getState() as RootState).authReducer.jwtToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                const { jwtToken } = getCredentialsFromLocalStorage();
                headers.set('Authorization', `Bearer ${jwtToken}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Date'],
    endpoints(build) {
        return {
            fetchDates: build.query<ProjDate[], string[]>({
                providesTags: (result) => {
                    if (result) {
                        const tags = [
                            ...result.map((date) => ({
                                type: 'Date' as const,
                                id: date.SK,
                            })),
                            {
                                type: 'Date' as const,
                                id: 'LIST',
                            },
                        ];
                        return tags;
                    } else {
                        return [
                            {
                                type: 'Date' as const,
                                id: 'LIST',
                            },
                        ];
                    }
                },
                query: (dates) => {
                    return {
                        url: `dates?dates=${dates.join(',')}`,
                    };
                },
            }),
            updatedDate: build.mutation<void, DateCore>({
                invalidatesTags: () => {
                    // TODO check if possible to return updated dates
                    return [{ type: 'Date' as const, id: 'LIST' }];
                },
                query: ({ SK: date, teamStatus, sessionId }) => {
                    return {
                        method: 'PATCH',
                        url: `dates?date=${date}`,
                        body: { teamStatus, sessionId },
                    };
                },
            }),
        };
    },
});

export { datesApi };
export const { useFetchDatesQuery, useUpdatedDateMutation } = datesApi;
