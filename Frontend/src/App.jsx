// src/App.js
import './App.css';
import Navbar from './Components/Navbar';
import FirstPage from './Components/FirstPage';
import ImageUpload from './Components/ImageUpload';
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
import WorkerDashboard from './Components/worker_dashboard';
import UserDashboard from './Components/user_dashboard';
import RazorpayPayment from './Components/razor';
import DummyPaymentPage from './Components/DummyPaymentPage';


function App() {
  const location = useLocation(); // Get the current route
  const u = {name:'Deependra', job:'Study'}
  return (
    <div className="App">
      <Navbar/> 
      <Routes>
        <Route path="" element={<FirstPage />} /> 
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/imageupload" element={<ImageUpload />} />
        <Route path="/services" element={<Services />} />
        <Route path="/select-role/worker" element={<Worker />} />
        <Route path="/select-role/customer" element={<Customer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-role/worker/register" element={<RegisterWorker />} />
        <Route path="/cart" element={<EventList />} />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/worker_dashboard" element={<WorkerDashboard />} />
        <Route path="/user_dashboard" element={<UserDashboard></UserDashboard>} />
        <Route path="/payment" element={<RazorpayPayment />} />

      </Routes>
      {location.pathname === '/' && <Footer />}
      {location.pathname === '/payment' && <DummyPaymentPage />}

    </div>
  );
}

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
