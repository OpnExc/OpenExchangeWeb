import {Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ItemListings from './pages/ItemListings';
import AdminLogin from './pages/AdminLogin';
import Welcome from './Components/Welcome';
import Chat from './pages/Chat';
import Favorites from './pages/Favorites';
import Compiler from './Components/Compiler';
import Seller from './pages/seller';
import About from './Components/about';

// Use the actual Google Client ID from your credentials
const GOOGLE_CLIENT_ID = "93651837969-9gkvrarqjqv6eqkd5477mppsqjs1865o.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/home" replace />} />
          <Route path='/home' element={<Welcome/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/se/admin' element={<AdminLogin/>}></Route>
          <Route path='/App' element={<Compiler />}>
            <Route path='*' element={<Navigate to="/Login" replace />} />
            <Route path='item-listings' element={<ItemListings/>}></Route>
            <Route path='chat' element={<Chat/>}></Route>
            <Route path='favorites' element={<Favorites/>}></Route>
            <Route path='sell' element={<Seller/>}></Route>
            {/* <Route path='Contact' element={<Contact />} /> */}
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;