import {Route,Routes} from 'react-router-dom'
import Select from './components/Select'
import StudentWorkshops from './components/StudentWorkshops'
import AdminWorkshops from './components/AdminWorkshops'
import StudentLogin from './components/StudentLogin'
import AdminLogin from './components/AdminLogin'
import StudentWorkshopDetails from './components/StudentWorkshopDetails'
import AdminWorkShopDetails from './components/AdminWorskshopDetails'
import WorkshopForm from './components/WorkshopForm'
import NotFound from './components/NotFound'

import './App.css';

const App= () => {
  return <Routes>
    <Route exact path="/" Component={Select} />
    <Route exact path="/Studentlogin" Component={StudentLogin} />
    <Route exact path="/AdminLogin" Component={AdminLogin} />
    <Route exact path="/student/workshops" Component={StudentWorkshops} />
    <Route exact path="/Admin/workshops" Component={AdminWorkshops} />
    <Route exact path="/workshops/:id" Component={StudentWorkshopDetails} />
    <Route exact path="/adminworkshops/:id" Component={AdminWorkShopDetails} />
    <Route exact path='/createworkshop' Component={WorkshopForm} />
    <Route path="*" Component={NotFound} />
  </Routes>
}

export default App;
