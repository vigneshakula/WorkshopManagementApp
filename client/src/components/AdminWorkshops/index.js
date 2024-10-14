import Cookies from 'js-cookie'
import { useNavigate,Navigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import AdminWorkshop from '../AdminWorkshop'
import CreateWorkshop from '../CreateWorkshopBox'
import './index.css'

const AdminWorkshops = () => {

    const navigate = useNavigate()
    const [workshops,updateWorkshops] = useState([])
    const [loading,updateLoading] = useState(true)
    const onLogout = () => {
        Cookies.remove("jwt_token")
        Cookies.remove("role")
        navigate("/",{replace:true})
    }
    
    const makeApiCall = async () => {
        const url ="http://127.0.0.1:5000/getworkshops"
        const options = {
            method:"GET",
            headers :{
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
        }
        const response = await fetch(url,options)
        if (response.ok){
            const data = await response.json();
            let workshops = data["workshops"]
             workshops = JSON.parse(workshops)
            updateWorkshops(workshops)
            updateLoading(false)
        } 
    }

    useEffect(() => {
        makeApiCall()
    },[])

    if (!Cookies.get("jwt_token") || Cookies.get("role")==="student"){
        return <Navigate to="/" />
    }


    if (loading) {
        return <div className='loading-container'><Oval
        secondaryColor
        visible={true}
        height="80"
        width="80"
        color="#007bff"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
    }

    return <div className='admin-main-container'>
        <div className='header'>
            <h1 className='workshop-heading'>Workshops</h1>
            <div>
                <button type="button" className='btn logout-button' onClick={onLogout}>Logout</button>
            </div>
        </div>
        <div className='cons'> 
            <CreateWorkshop />
        </div>
        <ul className='worshops-container cons'>
                {workshops.map(i=> <AdminWorkshop name={i.name} date={i.date} workshopId={i.workshop_id} key={i.workshopId} />)}
        </ul>
    </div>
}

export default AdminWorkshops