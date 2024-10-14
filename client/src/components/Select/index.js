import { useNavigate,Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Select = () => {

    const navigate = useNavigate();


    if (Cookies.get("jwt_token")){
      if (Cookies.get("role")==="student"){
          return <Navigate to="/student/workshops" />
      }
      return <Navigate to="/admin/workshops" />
  }

    const renderAdminLogin = () => {
      navigate("/adminlogin");
    }

    const renderStudentLogin = () => {
      navigate("/studentlogin");
    }

    

    return <div className="select-main-container">
            <div className="select-container">
                <h1 className="select-heading">Login As</h1>
                <div className="select-buttons-container">
                <div><button type="button" className="btn btn-primary btn-lg select-button" onClick={renderStudentLogin}>Student</button></div>
                <div><button type="button" className="btn btn-primary btn-lg select-button" onClick={renderAdminLogin}>Admin</button></div>
                </div>
            </div>
    </div>
}

export default Select;