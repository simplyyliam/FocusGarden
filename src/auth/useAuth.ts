
import { useContext } from "react";
import { AuthContext } from "./AuthContex";



export const useAuth = () => {
    return useContext(AuthContext)
}