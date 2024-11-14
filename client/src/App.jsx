
import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/AccountPage';
import PlacePage from './pages/PlacesPage';
import PlacesForm from './pages/Placeform';
import PlacesinPage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPages';
import SearchPage from './pages/SearchPage';
import FilterbyMoney from './pages/FilterMoney';
import FilterbyGuest from './pages/FilterGuest';
import FilteredPlaces from './pages/FilteredPlaces';
import FilteredGuest from './pages/FilterGuest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyCart from './MyCart';
import CartPlace from './CartPlace';
axios.defaults.baseURL='http://localhost:4000';
axios.defaults.withCredentials=true;
function App() {

  return (
    <UserContextProvider>
    <div>
      <ToastContainer/>
<Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<IndexPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
       <Route path="/account" element={<ProfilePage/>} />     
       <Route path="/account/places" element={<PlacePage/>} />
       <Route path="/account/places/new" element={<PlacesForm/>} />
       <Route path="/account/places/:id" element={<PlacesForm/>} />
      <Route path="/places/:id" element={<PlacesinPage />} />
      <Route path="/account/bookings" element={<BookingsPage/>}/>
      <Route path="/account/bookings/:id" element={<BookingPage/>}/>
      <Route path="/account/my-cart" element={<MyCart/>}/>
      <Route path="/account/my-cart/:id" element={<CartPlace/>}/>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/filterbyMoney" element={<FilteredPlaces />} />
      <Route path="/filterbyGuest" element={<FilteredGuest />} />
      </Route>
    </Routes>
    </div>
  //  </UserContextProvider>

    
  )
}

export default App
