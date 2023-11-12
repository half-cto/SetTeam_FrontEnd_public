import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/login/Login.tsx';
import NavBar from './components/main-app/navbar/Navbar.tsx';
import { AuthService } from './services/authService.ts';
import ConfimNewUser from './components/login/ConfirmNewUser.tsx';
import UserInfo from './components/main-app/userInfo/UserInfo.tsx';
import Dashboard from './components/main-app/calendar/Dashboard.tsx';
import Project from './components/main-app/project/Project.tsx';
import ErrorPage from './components/main-app/error-page/ErrorPage.tsx';
import ProtectedRoute from './components/main-app/protected-route/ProtectedRoute.tsx';
import SignUpNew from './components/login/SignUpNew.tsx';

import MDashboard from './components/mobile-app/MDashboard.tsx';

const authService = new AuthService();

// TODO clen up authService drilling
const router = createBrowserRouter([
    {
        path: '/',
        element: <Login authService={authService} />,
    },
    {
        path: '/signup',
        element: <SignUpNew authService={authService} />,
    },
    {
        path: '/confirmNewUser',
        element: <ConfimNewUser authService={authService} />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute authService={authService}>
                <NavBar authService={authService} />
                <Outlet />
            </ProtectedRoute>
        ),

        children: [
            {
                path: '/userinfo',
                element: <UserInfo />,
            },
            {
                path: '/calendar',
                element: <Dashboard />,
            },
            {
                path: '/project/:projId',
                element: <Project />,
            },
        ],
    },
    {
        path: '/mdashboard',
        element: (
            <ProtectedRoute authService={authService}>
                <MDashboard authService={authService}></MDashboard>
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="relative font-montserrat bg-opacity-50 h-screen">
            <div className="absolute"></div>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </div>
    </React.StrictMode>
);
