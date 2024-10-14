import { Link } from 'react-router-dom'
import './index.css'

const Workshop = (props) => {
    const {name,date,workshopId} = props
    return <Link to={`/workshops/${workshopId}`}  style={{ textDecoration: 'none' }}><li><div className='workshop-container'>
        <h3 >{name}</h3>
        <p className='date'>{date}</p>
    </div> 
    </li>
    </Link>
}

export default Workshop