import {Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Compiler from './Components/Compiler';
import ContactUs from './pages/Feedback';
import AdminApproval from './pages/AdminApproval';
import ListItem from './pages/ListItem';
import Sell from './pages/Sell';
import ServiceMarketplace from './pages/ServiceMarketplace';
import CreateService from './pages/CreateService';
import ServiceRequest from './pages/ServiceRequest';
import ServiceRequests from './pages/ServiceRequests';
import MyServices from './pages/MyServices';
import MyServiceRequests from './pages/MyServiceRequests';
import AdminServiceApproval from './pages/AdminServiceApproval';
import About_Us from './pages/About_Us'
import Community_Guidelines from './pages/Community_Guidelines'
import Contact_Support from './pages/Contact_Support'
import OurPrivaces from './pages/OurPrivacies'
import { Contact } from 'lucide-react';
import Feedback from './pages/Feedback'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderHistory from './pages/OrderHistory';
import UserDetails from './Components/UserDetails';
import BuyRequests from './pages/BuyRequests';
import { ContactProvider } from './contexts/ContactContext';
import CreateHostels from './pages/CreateHostels'

// Use the actual Google Client ID from your credentials
const GOOGLE_CLIENT_ID = "93651837969-9gkvrarqjqv6eqkd5477mppsqjs1865o.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ContactProvider>
          <Routes>
            <Route path='*' element={<Navigate to="/app/home" replace />} />
            <Route path='/App' element={<Compiler />}>
              <Route path='feedback' element={<Feedback/>}></Route>
              <Route path='home' element={<Home/>}/>
              <Route path='Sell' element={<Sell/>}></Route>
              <Route path='listItem' element={<ListItem/>}></Route>
              <Route path='admin' element={<AdminApproval/>}></Route>
              <Route path='admin/hostels' element={<CreateHostels/>}></Route>
              <Route path='admin/services' element={<AdminServiceApproval/>}></Route>
              <Route path='services' element={<ServiceMarketplace/>}></Route>
              <Route path='service/create' element={<CreateService/>}></Route>
              <Route path='service/request' element={<ServiceRequest/>}></Route>
              <Route path='service-requests' element={<ServiceRequests/>}></Route>
              <Route path='my-services' element={<MyServices/>}></Route>
              <Route path='my-service-requests' element={<MyServiceRequests/>}></Route>
              <Route path="about" element={<About_Us />} />
              <Route path="Guidelines" element={<Community_Guidelines />} />
              <Route path="Connect" element={<Contact_Support/>} />
              <Route path="ourPrivacy" element={<OurPrivaces />} />
              <Route path='buyRequests' element={<BuyRequests/>}></Route>
              <Route path='forgotPassword' element={<ForgotPassword/>}></Route>
              <Route path='userdetails' element={<UserDetails/>}></Route>
              <Route path="orders/history" element={<OrderHistory />}></Route>
            </Route>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </ContactProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
