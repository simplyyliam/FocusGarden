import { RouterProvider } from "react-router-dom";
import { Router } from "./Router";
import { AuthProvider } from "./auth";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  );
}

export default App;
