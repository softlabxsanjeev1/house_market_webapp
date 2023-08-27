import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './components/layout/Profile';
// import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './components/EditListing';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/category/:categoryName' element={<Category />} />
        <Route path='/editlisting/:listingId' element={<EditListing />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/contact/:landlordId' element={<Contact />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/category/:categoryName/:listingId' element={<Listing />} />
        <Route path='/profile' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
