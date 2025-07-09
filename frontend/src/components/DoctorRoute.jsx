import { useEffect, useState } from "react"
import { Outlet , Navigate } from "react-router-dom"
import { fetchDoctorProfile } from "../services/api"

export default function(){
    const token= localStorage.getItem('access_toke')
    const [isDoctor,setIsDoctor] = useState(null)

    useEffect(()=>{
        const checkDoctor = async () =>{
            try{
                await fetchDoctorProfile()
                setIsDoctor(true)
            }catch(err){
                setIsDoctor(false)
            }
        }
        if(token) checkDoctor();
        else setIsDoctor(false)
    },[]);
    if(isDoctor==null) return null;
    return isDoctor ? <Outlet/> : <Navigate to="/" replace />;
}