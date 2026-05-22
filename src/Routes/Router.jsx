import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Tuitions from "../pages/Tuitions/Tuitions";
import TuitionDetails from "../pages/TuitionDetails/TuitionDetails";
import Tutors from "../pages/Tutors/Tutors";
import TutorProfile from "../pages/TutorProfile/TutorProfile";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import TutorHome from "../pages/Dashboard/Tutor/TutorHome";
import AppliedJobs from "../pages/Dashboard/Tutor/AppliedJobs";
import PostTuition from "../pages/Dashboard/Students/PostTuition";
import DashboardIndex from "../pages/Dashboard/DashboardIndex/DashboardIndex";
import MyPosts from "../pages/Dashboard/Students/MyPosts";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageTutors from "../pages/Dashboard/Admin/ManageTutors";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import PaymentHistory from "../pages/PaymentHistory/PaymentHistory";
import ProfileSettings from "../pages/ProfileSettings/ProfileSettings";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageTuitions from "../pages/Dashboard/Admin/ManageTuitions";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true, 
                Component: Home,
            },
            {
                path: '/tuitions',
                Component: Tuitions,
            },
            {
                path: `/tuitions/details/:id`,
                element: <TuitionDetails></TuitionDetails>
            },
            {
                path: '/tutors',
                element: <Tutors></Tutors>
            },
            {
                path: `/tutor/:id`,
                element: <PrivateRoute><TutorProfile></TutorProfile></PrivateRoute>
            },
            {
                path: '/about',
                Component: About,
            },
            {
                path: '/contact',
                Component: Contact,
            },
 
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                index: true,
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: Register,
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashboardIndex></DashboardIndex>
            },
            {
                path: 'profile-settings',
                element: <ProfileSettings></ProfileSettings>
            },

            // Tutors Dashboard 
            {
                path: 'tutor',
                element: <TutorHome></TutorHome>
            },
            {
                path: 'tutor/applied-jobs',
                element: <AppliedJobs></AppliedJobs>
            },
            {
                path: 'tutor/payment-history',
                element: <PaymentHistory></PaymentHistory>
            },

            // Students Dashboard 
            {
                path: 'student/post-tuition',
                element: <PostTuition></PostTuition>
            },
            {
                path: 'student/my-posts',
                element: <MyPosts></MyPosts>
            },
            {
                path: 'student/payment-history',
                element: <PaymentHistory></PaymentHistory>
            },

            // Admin Dashboard 
            {
                path: 'admin',
                element: <AdminHome></AdminHome>
            },
            {
                path: 'admin/manage-tutors',
                element: <ManageTutors></ManageTutors>
            },
            {
                path: 'admin/manage-users',
                element: <ManageUsers></ManageUsers>
            },
            {
                path: 'admin/manage-tuitions',
                element: <ManageTuitions></ManageTuitions>
            }
        ]
    },
    {
        path: '*',
        element: <ErrorPage></ErrorPage>
    }

])