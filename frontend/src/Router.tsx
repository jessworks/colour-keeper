import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { UserCredentials } from "./pages/Login";
import { Colors } from "./pages/Colors";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <UserCredentials />,
            },
            {
                path: "/colors",
                element: <Colors />,
            },
        ]
    }
]);