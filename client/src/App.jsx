import {Navigate,  BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HostelSelection from './pages/HostelSelection';
import ItemListings from './pages/ItemListings';
import AdminLogin from './pages/AdminLogin';
import Welcome from './Components/Welcome';
import Chat from './pages/Chat';
import Favorites from './pages/Favorites';
import Compiler from './Components/Compiler'
import Seller from './pages/seller';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Navigate to="/home" replace />} />
        <Route path='/home' element={<Welcome/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/se/admin' element={<AdminLogin/>}></Route>
        <Route path='/App' element={<Compiler />}>
        <Route path='*' element={<Navigate to="/Login" replace />} />
         <Route path='hostels' element={<HostelSelection/>}></Route>
         <Route path='item-listings' element={<ItemListings/>}></Route>
         <Route path='chat' element={<Chat/>}></Route>
         <Route path='favorites' element={<Favorites/>}></Route>
         <Route path='sell' element={<Seller/>}></Route>
          {/* <Route path='Contact' element={<Contact />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
