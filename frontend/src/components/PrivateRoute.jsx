import { Navigate,Outlet } from "react-router-dom";

export default function(){
    const token = localStorage.getItem('access_token')
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}