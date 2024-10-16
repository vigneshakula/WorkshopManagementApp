import { useState } from 'react'
import { Navigate,useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'
const StudentForm = () => {

    const navigate = useNavigate()
    const [username,updateUsername] = useState("")
    const [password,updatePassword] = useState("")
    const [errormsg,updateErrormsg] = useState("")

    const onUpdateUsername = (event) => {
        updateUsername(event.target.value)
    }


    const onUpdatePassword = (event) => {
        updatePassword(event.target.value)
    }

      const makeapicall = async () => {
        const url="http://127.0.0.1:5000/addnewstudent"
        const options = {
            method:"POST",
            headers :{
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body : JSON.stringify({
                "username": username,
                "password":password,
                role : Cookies.get("role")
            })
        }

        const response = await fetch(url,options)
        if (response.ok){
                navigate("/Admin/workshops",{replace:true})
        }
        else{
            const data = await response.json()
            updateErrormsg(data.msg)
        }
      }

      const onSubmitForm = (event) => {
        event.preventDefault()
        if (username==="" || password===""){
            updateErrormsg("Enter Details correctly!")
        }
        else if(password.length<6){
                updateErrormsg(`password is only ${password.length} characters`)
        }
        else{
            updateErrormsg("")
            makeapicall()
        }
      }


      if (!Cookies.get("jwt_token") || Cookies.get("role")==="student"){
        return <Navigate to="/" />
    }


    return  <div>
        <div className='header'>
            <h1 className='workshop-heading'>Workshops App</h1>
        </div>
        <div className='create-sub-container'>
            <div className="form-container">
                <h3 className='form-heading'>Add Student</h3>
                <div>
                <form onSubmit={onSubmitForm}>
                                <label htmlFor='username' className='workshop-label'>Username :</label>
                                <input id="username" type="text" value={username} placeholder='Enter username' onChange={onUpdateUsername} />
                                <label htmlFor='password'>Password :</label>
                                <input id="password" value={password} type="text" onChange={onUpdatePassword} placeholder='Enter Password' /> 
                                <div className="login-button-container"><button type="submit" className="btn btn-primary select-button">Add</button></div>
                            </form>
                            <p className='errormsg'>{errormsg}</p>  
                </div>
            </div>
            </div>
</div>
}

export default StudentForm