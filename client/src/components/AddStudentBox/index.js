import { Link } from 'react-router-dom'
import { IoAddCircle } from "react-icons/io5";
import './index.css'

const AddStudentBox = () => {
    return <Link to={`/addstudent`}  style={{ textDecoration: 'none' }}><div className='create-workshop'>
            
            <h3 className='create-heading'>Add Student</h3>
            <div className='icon-container'>
                <IoAddCircle className='add-icon' />
            </div>
        </div>
    </Link>
}

export default AddStudentBox