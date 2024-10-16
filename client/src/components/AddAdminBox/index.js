import { Link } from 'react-router-dom'
import { IoAddCircle } from "react-icons/io5";
import './index.css'

const AddAdminBox = () => {
    return <Link to={`/addadmin`}  style={{ textDecoration: 'none' }}><div className='create-workshop'>
            
            <h3 className='create-heading'>Add Admin</h3>
            <div className='icon-container'>
                <IoAddCircle className='add-icon' />
            </div>
        </div>
    </Link>
}

export default AddAdminBox