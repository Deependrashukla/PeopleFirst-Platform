// src/App.js
import './App.css';
import Navbar from './Components/Navbar';
import FirstPage from './Components/FirstPage';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import routing components
import RoleSelectionPage from './Components/RoleSelectionPage';
import About from './Components/Pages/About';
import Contact from './Components/Pages/Contact';
import Services from './Components/Pages/Services';
import Worker from './Components/RoleSelection/Worker';
import Customer from './Components/RoleSelection/Customer';
import Register from './Components/RoleSelection/Register';
// import GetWorker from './Components/GetWorker';
import RegisterWorker from './Components/RoleSelection/WorkerRegister'
import EventList from './Components/work/EventList';
import EventForm from './Components/work/EventForm';
import EventDetails from './Components/work/EventDetails';

function App() {
  const location = useLocation(); // Get the current route

  return (
    <div className="App">
      <Navbar /> 
      <Routes>
        <Route path="" element={<FirstPage />} /> 
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/select-role/worker" element={<Worker />} />
        <Route path="/select-role/customer" element={<Customer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-role/worker/register" element={<RegisterWorker />} />
        <Route path="/cart" element={<EventList />} />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/event-details" element={<EventDetails />} />
        {/* <Route path="/getworker" element={<GetWorker />} /> */}
      </Routes>
      {location.pathname === '/' && <Footer />}
    </div>
  );
}

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
