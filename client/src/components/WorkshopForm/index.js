import { useState } from 'react'
import { Navigate,useNavigate } from 'react-router-dom'
import moment from 'moment';
import Cookies from 'js-cookie'

import './index.css'
const WorkshopForm = () => {

    const navigate = useNavigate()
    const [workshopName,updateWorkshopName] = useState("")
    const [date,updateDate] = useState(moment().format('YYYY-MM-DD'))

    const onupdateWorkshopName=(event) =>{
            updateWorkshopName(event.target.value)
    }

    const onChangeDate = (event) => {
        const newDate = moment(event.target.value).format('YYYY-MM-DD');
        updateDate(newDate);
        console.log(newDate); 
      };

      const makeapicall = async () => {
        const url="http://127.0.0.1:5000/create/workshops"
        const options = {
            method:"POST",
            headers :{
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body : JSON.stringify({
                "name" :workshopName,
                "date":date,
                role : Cookies.get("role")
            })
        }

        const response = await fetch(url,options)
        if (response.ok){
                navigate("/Admin/workshops",{replace:true})
        }
      }

      const onSubmitForm = (event) => {
        event.preventDefault()
        makeapicall()
      }


      if (!Cookies.get("jwt_token") || Cookies.get("role")==="student"){
        return <Navigate to="/" />
    }


    return  <div>
        <div className='header'>
            <h1 className='workshop-heading'>Workshops</h1>
        </div>
        <div className='create-sub-container'>
            <div className="form-container">
                <h3 className='form-heading'>WORKSHOP FORM</h3>
                <div>
                <form onSubmit={onSubmitForm}>
                                <label htmlFor='workshopname' className='workshop-label'>Workshop Name :</label>
                                <input id="workshopname" type="text" value={workshopName} placeholder='Enter Workshop Name' onChange={onupdateWorkshopName} />
                                <label htmlFor='date'>Date :</label>
                                <input id="date" type="date" onChange={onChangeDate} /> 
                                <div className="login-button-container"><button type="submit" className="btn btn-primary select-button">submit</button></div>
                            </form>
                </div>
            </div>
            </div>
</div>
}

export default WorkshopForm