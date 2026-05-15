import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Tuitions from "../pages/Tuitions/Tuitions";
import TuitionDetails from "../pages/TuitionDetails/TuitionDetails";

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
            }
        ]
    }

])