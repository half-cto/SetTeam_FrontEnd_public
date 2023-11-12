import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { STApiStack } from '../../../../setteam_backend/outputs.json';
import { RootState } from '../store';
import { DateCore, ProjDate } from './datesApi';
import { buildRemoveDatesTransactionParams } from './Utils/removeDatesTransactionBuilder';
import { buildRemoveUserTransaction } from './Utils/removeUserTransactionBuilder';
import { buildDeleteProjectTransactionParams } from './Utils/deleteProjectTransactionBuilder';
import { getCredentialsFromLocalStorage } from '../../utils/functions';
// ---

const baseUrl = STApiStack.SetTeamApiEndpoint565D410D;

export interface CreateProjectProps {
    name: string;
    ownerId: string;
    projDates: string[];
    projTeam?: string[];
}

export interface UpdateProjectProps {
    projDates?: string[];
    projTeam?: string[];
    name?: string;
    projId: string;
}

export interface RemoveDatesFromProjectProps {
    projId: string;
    projDates: string[];
    datesToUpdate: ProjDate[];
}

export interface RemoveUserFromProjectProps {
    projId: string;
    projTeam: string[];
    datesToUpdate: DateCore[];
}

export interface DeleteProjectProps {
    projId: string;
    datesToUpdate: ProjDate[];
}

export interface GetProjectsProps {
    userId: string;
}

export interface FetchCalProjectsProps {
    userId: string;
    date: string;
}

export interface ProjectsOnDate {
    [date: string]: Project[];
}

export interface GetProjectsByIdProps {
    projId: string;
}

const projectsApi = createApi({
    reducerPath: 'projectsApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
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
    tagTypes: ['Project', 'CalProjects'],
    endpoints(build) {
        return {
            getAllProjects: build.query<Project[], GetProjectsProps>({
                providesTags: ['Project'],
                query: ({ userId }) => {
                    return {
                        url: `projects?id=${userId}`,
                        method: 'GET',
                    };
                },
            }),
            fetchProjById: build.query<Project, GetProjectsByIdProps>({
                providesTags: ['Project'],
                query: ({ projId }) => {
                    return {
                        url: `projects?projId=${projId}`,
                        method: 'GET',
                    };
                },
            }),
            fetchCalProjects: build.query<
                ProjectsOnDate[],
                FetchCalProjectsProps
            >({
                providesTags: ['CalProjects'],
                query: ({ userId, date }) => {
                    return {
                        url: `projects?id=${userId}&date=${date}`,
                        method: 'GET',
                    };
                },
            }),
            createProject: build.mutation<Project, CreateProjectProps>({
                invalidatesTags: ['Project', 'CalProjects'],
                query: (project) => {
                    const { projDates, name, ownerId, projTeam } = project;
                    let teamToPost: string[] = [];
                    if (projTeam) teamToPost = projTeam;
                    return {
                        url: 'projects',
                        body: {
                            name,
                            ownerId,
                            projDates,
                            projTeam: teamToPost,
                        },
                        method: 'POST',
                    };
                },
            }),
            updateProject: build.mutation<Project, UpdateProjectProps>({
                invalidatesTags: ['Project', 'CalProjects'],
                query: ({ name, projDates, projTeam, projId }) => {
                    const body = { name, projDates, projTeam };
                    return {
                        url: `projects?id=${projId}`,
                        method: 'PATCH',
                        body: { ...body },
                    };
                },
            }),
            removeDatesFromProject: build.mutation<
                Project,
                RemoveDatesFromProjectProps
            >({
                invalidatesTags: ['Project', 'CalProjects'],
                query: ({ projId, projDates, datesToUpdate }) => {
                    const transactionParams = buildRemoveDatesTransactionParams(
                        { projId, projDates, datesToUpdate }
                    );

                    return {
                        url: `projects?id=${projId}`,
                        method: 'PATCH',
                        body: transactionParams,
                    };
                },
            }),
            removeUserFromProject: build.mutation<
                Project,
                RemoveUserFromProjectProps
            >({
                invalidatesTags: ['Project'],
                query: ({ projId, projTeam, datesToUpdate }) => {
                    const transactionParams = buildRemoveUserTransaction({
                        projId,
                        projTeam,
                        datesToUpdate,
                    });

                    return {
                        url: `projects?id=${projId}`,
                        method: 'PATCH',
                        body: transactionParams,
                    };
                },
            }),
            deleteProject: build.mutation<Project, DeleteProjectProps>({
                invalidatesTags: ['Project', 'CalProjects'],
                query: ({ projId, datesToUpdate }) => {
                    const transactionParams =
                        buildDeleteProjectTransactionParams({
                            projId,
                            datesToUpdate,
                        });

                    return {
                        url: `projects?id=${projId}`,
                        method: 'PATCH',
                        body: transactionParams,
                    };
                },
            }),
        };
    },
});

export const {
    useCreateProjectMutation,
    useGetAllProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useFetchCalProjectsQuery,
    useRemoveDatesFromProjectMutation,
    useRemoveUserFromProjectMutation,
    useFetchProjByIdQuery,
} = projectsApi;
export { projectsApi };
