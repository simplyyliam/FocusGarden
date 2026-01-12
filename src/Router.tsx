import { createBrowserRouter } from "react-router-dom"
import { Authentication, HomePage, Layout, Sessio } from "./pages"


export const Router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "signin",
        element: <Authentication />,
      },
    ],
  },

  {
    path: "sessio",
    element: <Sessio/>
  }
]);