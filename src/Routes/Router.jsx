import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Tuitions from "../pages/Tuitions/Tuitions";
import TuitionDetails from "../pages/TuitionDetails/TuitionDetails";
import Tutors from "../pages/Tutors/Tutors";
import TutorProfile from "../pages/TutorProfile/TutorProfile";

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
                element: <TutorProfile></TutorProfile>
            }
        ]
    }

])