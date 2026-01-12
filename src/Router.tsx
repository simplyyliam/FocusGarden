import { createBrowserRouter } from "react-router-dom";
import { Authentication, HomePage, Layout, Sessio } from "./pages";
import { ProtectedRoute, PublicRoute } from "./routes";

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
        element: (
          <PublicRoute>
            <Authentication />
          </PublicRoute>
        ),
      },
      {
        path: "sessio",
        element: (
          <ProtectedRoute>
            <Sessio />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
