import {Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/LoginPopup';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Chat from './pages/Chat';
import Favorites from './pages/Favorites';
import Compiler from './Components/Compiler';
import About from './Components/about';
import AdminApproval from './pages/AdminApproval';
import ListItem from './pages/ListItem';
import Sell from './pages/Sell';

// Use the actual Google Client ID from your credentials
const GOOGLE_CLIENT_ID = "93651837969-9gkvrarqjqv6eqkd5477mppsqjs1865o.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path='*' element={<Navigate to="/app/home" replace />} />
          <Route path='/about' element={<About/>}></Route>
          <Route path='/se/admin' element={<AdminLogin/>}></Route>
          <Route path='/App' element={<Compiler />}>
          <Route path='home' element={<Home/>}/>
            <Route path='Sell' element={<Sell/>}></Route>
            <Route path='favorites' element={<Favorites/>}></Route>
            <Route path='listItem' element={<ListItem/>}></Route>
            <Route path='admin' element={<AdminApproval/>}></Route>
            {/* <Route path='Contact' element={<Contact />} /> */}
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
