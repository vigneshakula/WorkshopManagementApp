import { Link } from 'react-router-dom'
import { IoAddCircle } from "react-icons/io5";
import './index.css'

const CreateWorkshop = () => {
    return <Link to={`/createworkshop`}  style={{ textDecoration: 'none' }}><div className='create-workshop'>
            
            <h3 className='create-heading'>Create Workshop</h3>
            <div className='icon-container'>
                <IoAddCircle className='add-icon' />
            </div>
        </div>
    </Link>
}

export default CreateWorkshop