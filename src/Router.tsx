import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "./pages"


export const Router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
 }
])