import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HostelSelection from './pages/HostelSelection';
import ItemListings from './pages/ItemListings';
import AdminLogin from './pages/AdminLogin';
import Welcome from './Components/Welcome';
import Chat from './pages/Chat';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/hostel-selection' element={<HostelSelection />} />
        <Route path='/item-listings' element={<ItemListings />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/favorites' element={<Favorites />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
