import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { STApiStack } from '../../../../setteam_backend/outputs.json';
import { RootState } from '../store';
import { getCredentialsFromLocalStorage } from '../../utils/functions';

const baseUrl = STApiStack.SetTeamApiEndpoint565D410D;

export interface UserQueryProps {
    userName: string;
}

export interface CreateUserProps {
    userName: string;
    name: string;
    surname: string;
    tags: string[];
}

const userApi = createApi({
    reducerPath: 'userApi',
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

    tagTypes: ['User', 'Team'],
    endpoints(build) {
        return {
            fetchUser: build.query<User, UserQueryProps>({
                providesTags: ['User'],
                query: (user) => {
                    return {
                        url: `users?id=${user.userName}`,
                        method: 'GET',
                    };
                },
            }),
            fetchTeamMembers: build.query<User[], undefined>({
                providesTags: ['Team'],
                query: () => {
                    return {
                        url: `users`,
                        method: 'GET',
                    };
                },
            }),
            createUser: build.mutation<User, CreateUserProps>({
                invalidatesTags: ['User'],
                query: (user) => {
                    const { userName, name, surname, tags } = user;
                    return {
                        url: 'users',
                        body: { userName, name, surname, tags },
                        method: 'POST',
                    };
                },
            }),
        };
    },
});

export const {
    useFetchUserQuery,
    useCreateUserMutation,
    useFetchTeamMembersQuery,
} = userApi;
export { userApi };
