import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './apis/usersApi';
import { projectsApi } from './apis/projectsApi';
import { authReducer } from './slices/authSlice';
import { datesApi } from './apis/datesApi';
import { activeData } from './slices/activeDataSlice.ts';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
        [datesApi.reducerPath]: datesApi.reducer,
        authReducer,
        activeData,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(projectsApi.middleware)
            .concat(datesApi.middleware);
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
    useFetchUserQuery,
    useCreateUserMutation,
    useFetchTeamMembersQuery,
} from './apis/usersApi';

export {
    useCreateProjectMutation,
    useGetAllProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useFetchCalProjectsQuery,
    useRemoveDatesFromProjectMutation,
    useRemoveUserFromProjectMutation,
    useFetchProjByIdQuery,
} from './apis/projectsApi';

export { useFetchDatesQuery, useUpdatedDateMutation } from './apis/datesApi';

// TODO check if auhtSlice and userSlice are being used at all

export { setCredentials } from './slices/authSlice';

export {
    setActiveData,
    updateCalMonth,
    updateActiveDate,
    updateDisplayPage,
    updateActiveDateAndPage,
} from './slices/activeDataSlice.ts';
