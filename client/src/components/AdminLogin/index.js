import {useState} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {  useNavigate ,Navigate} from 'react-router-dom';


const AdminLogin = () => {

   

        const [username,updateUsername] = useState(""); 
        const [password,updatePassword] = useState(""); 
     
        const [errormsg,updateErrormsg] = useState("");
        const navigate = useNavigate()

        const OnupdateUsername = (event) => {
            updateUsername(event.target.value);
        }
        const OnupdatePassword = (event) => {
            updatePassword(event.target.value);
        }

        

        if (Cookies.get("jwt_token")){
            if (Cookies.get("role")==="student"){
                return <Navigate to="/student/workshops" />
            }
            return <Navigate to="/admin/workshops" />
        }

        const makeApiCall = async () => {
            const url = "http://127.0.0.1:5000/login/admin";
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  // Add the Content-Type header
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                
            };
            console.log(options)
            const response = await fetch(url, options);
            console.log(response);
        
            if (response.ok) { 
                const data = await response.json();
                if (data.jwt_token) {
                    Cookies.set("jwt_token", data.jwt_token, { expires: 7 });
                    Cookies.set("role","admin",{ expires: 7 })
                    navigate("/Admin/workshops", { replace: true });
                } else {
                    updateErrormsg(data.errormsg);
                }
            } else {
                const data = await response.json();
                updateErrormsg(data.errormsg);
            }
        }
        
        
        const onSubmitForm =(event) => {
            event.preventDefault();
            if (username==="" || password===""){
                updateErrormsg("enter details correctly")
            }
            else{
            makeApiCall();
            }
        }

        


        return <div className='login-main-conatiner'>
                <div className='login-container'>
                    <h3 className='select-heading'>Admin Login</h3>
                        <form onSubmit={onSubmitForm}>
                            <label htmlFor='username'>Username :</label>
                            <input type="text" value={username} placeholder='Enter Username' onChange={OnupdateUsername} />
                            <label htmlFor='password'>Password :</label>
                            <input type="password" value={password} placeholder='Enter Password' onChange={OnupdatePassword} />
                            <div className="login-button-container"><button type="submit" className="btn btn-primary select-button">Login</button></div>
                            </form>
                            <p className='errormsg'>{errormsg}</p>  
                </div>
        </div>
}

export default AdminLogin