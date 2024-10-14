import { useEffect,useState } from "react";
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import { Oval } from 'react-loader-spinner'
import "./index.css"


const registerViewWithFeedbackView = (rating,feedback) => {
    return <div><button className="btn register-button" disabled>Registered</button>
    <div className="feedback-container">
    <p className="details-date">Rating : {rating}</p>
    <p className="details-date">Feedback : {feedback}</p>
    </div>
    </div>
}


const nonRegisterView = (onRegister) => {
    return  <button className="btn register-button" type="button" onClick={onRegister}>Register</button>
}


const registerView = (submitFeedback,onUpadteRating,onUpadteFeedback,inputRating,inputFeedback,correctFeedback) => {
    return <div>
    <button className="btn register-button" disabled>Registered</button>
    <form onSubmit={submitFeedback}>
        <div className="feedback-container">
        <label htmlFor="rating">Rating : </label>
        <select id="rating" value={inputRating} onChange={onUpadteRating}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4} >4</option>
            <option value={5}>5</option>
        </select>
        </div>
        <div className="feedback-container">
        <label>Feedback : </label>
        <br/>
        <textarea rows="10" cols="50" id="feedback" value={inputFeedback} onChange={onUpadteFeedback}></textarea>
        </div>
        <button className="btn register-button" type="submit">submit</button>
    </form>
    {!correctFeedback && <p className="errormsg">Give rating and feedback properly</p>}
</div>
}

const StudentWorkshopDetails = (props) => {


    const {id} = useParams()
    const [isRegister,updateRegister] = useState(false)
    const [feedback,updateFeedback] = useState("")
    const [inputFeedback,updateInputFeedback] = useState("")
    const [inputRating,updateInputRating] = useState("5")
    const [name,updateName] = useState("")
    const [correctFeedback,upadteCorrectFeedback] = useState(true)
    const [date,updateDate] = useState("")
    const [rating,updateRating] = useState("")
    const [loading,updateLoading] = useState(true)


    

    const onUpadteFeedback = (event) => {
        updateInputFeedback(event.target.value)
    }

    const onUpadteRating = (event) => {
        updateInputRating(event.target.value)
    }

    const postFeedback = async () => {
        const url = "http://127.0.0.1:5000/postfeedback"
        const options = {
            method:"POST",
            headers : {
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body:JSON.stringify({
                workshopId:id,
                feedback : inputFeedback,
                rating:inputRating
            })
        }
        const response = await fetch(url,options)
        if (response.ok){
            window.location.reload();
        }
    }

    const submitFeedback = (event) => {
        event.preventDefault()
        if (inputFeedback===""){
            upadteCorrectFeedback(false)
        }
        else{
            upadteCorrectFeedback(true)
            postFeedback()
        }
    }

    const onRegister = async () => {
        const url = "http://127.0.0.1:5000/register"
        const  options = {
            method : "POST",
            headers : {
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body : JSON.stringify({
                "workshopId" :id
            }),
        }
        const response = await fetch(url,options)
        if (response.ok){
            window.location.reload();
        }
        
    }

    const makeAPiCall = async () => {
        const url = "http://127.0.0.1:5000/studentworkshopdetails"
        const  options = {
            method : "POST",
            headers : {
                "Authorization" : "Bearer "+Cookies.get("jwt_token"),
                "Content-Type" :"application/json"
            },
            body : JSON.stringify({
                "workshopId" :id
            }),
            
        }
        const response = await fetch(url,options)
        if (response.ok){
            const data = await response.json()
            const {feedback,rating,date,name} = data
            updateDate(date)
            updateName(name)
            console.log(data)
            if (data.isRegister==="yes"){
                updateRegister(true)
                if (feedback!==""){
                    updateFeedback(feedback)
                    updateRating(rating)
                }
            }
            else {
                updateRegister(false)
                updateFeedback("")
                updateRating("")
            }
            updateLoading(false)
        }
    }

    useEffect(() => {
        makeAPiCall()
    },[])

   

    if (!Cookies.get("jwt_token")){
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

    return <div>
        <div className='header'>
            <h1 className='workshop-heading'>Workshops</h1>
        </div>
        <div className="details-container">
        <h1 className="head">{name}</h1>
        <p className="details-date">starts on : {date}</p>
        {(!isRegister) ? nonRegisterView(onRegister) : (isRegister && feedback!=="")? registerViewWithFeedbackView(rating,feedback) : registerView(submitFeedback,onUpadteRating,onUpadteFeedback,inputRating,inputFeedback,correctFeedback)}
    </div>
    </div>

}

export default StudentWorkshopDetails