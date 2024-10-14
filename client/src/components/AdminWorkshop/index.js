import { Link } from 'react-router-dom'
import './index.css'

const AdminWorkshop = (props) => {
    const {name,date,workshopId} = props
    return <Link to={`/adminworkshops/${workshopId}`} style={{ textDecoration: 'none' }}><li><div className='workshop-container'>
        <h3 >{name}</h3>
        <p className='date'>{date}</p>
    </div> 
    </li>
    </Link>
}

export default AdminWorkshop