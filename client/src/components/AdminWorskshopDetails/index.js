import { useEffect,useState } from "react";
import Cookies from 'js-cookie'
import { Oval } from 'react-loader-spinner'
import { v4 as uuidv4 } from 'uuid';
import { useParams ,Navigate} from "react-router-dom";
import "./index.css"


const AdminWorkShopDetails = () => {
    const {id} = useParams()
    const [date,updateDate] = useState("")
    const [name,updateName] = useState("")
    const [students,updateStudents] = useState([])
    const [loading,updateLoading] = useState(true)
    const [feedbacks,updateFeedbacks] = useState([])


   const makeapicall = async () => {
        const url = "http://127.0.0.1:5000/getadminworkshopdetails"
        const options = {
            method:"POST",
            headers : {
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body:JSON.stringify({
                role:Cookies.get("role"),
                workshopId:id,
            })
        }
        const response = await fetch(url,options)
        if (response.ok){
            const data = await response.json()
            console.log(data)
            updateDate(data.date)
            updateFeedbacks(data.feedbacks)
            updateName(data.name)
            updateStudents(data.students)
            updateLoading(false)
        }
    } 


    useEffect(() => {
        makeapicall()
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


    return <div className="admin-workshop-details">
        <div className='header'>
            <h1 className='workshop-heading'>Workshops</h1>
        </div>
        <div className="details-container">
        <h1 className="head">{name}</h1>
        <p className="details-date">starts on : {date}</p>
        <div className="sub-container">
            <div className="students">
                <h2 className="details-head">STUDENTS</h2>
                <ul className="list">
                    {
                       (students.length===0) ? <h3>No one Registered yet.</h3> :  students.map((i) => {
                        return <li key={uuidv4()}><h5>{i}</h5></li>})
                    
                    }
                </ul>
            </div>
            <div className="feedbacks">
                <h2 className="details-head">FEEDBACKS</h2>
                <ul className="list">
                   {
                   (feedbacks.length===0) ? <h3>No Feedbacks yet.</h3> :  feedbacks.map(i => <li key={uuidv4()}>
                   <div className="fed">
                       <h5>Rating : {i.rating}</h5>
                       <br/>
                       <h5>feedback :</h5><p className="feedback-description">{i.feedback}</p>
                   </div>
           </li>)
                   } 
                </ul>
            </div>
        </div>
    </div>
    </div>
}

export default AdminWorkShopDetails