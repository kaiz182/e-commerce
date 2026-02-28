import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatLayout from './pages/SeatLayout';
import MyBooking from './pages/MyBooking';
import Favorite from './pages/Favorite';
import Movies from './pages/Movies';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Navbar from './components/Navbar'; // Thêm import Navbar
import Favorites from './pages/Favorite';
import Releases from './pages/Releases';
import Theaters from './pages/Theaters';

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetail />} />
        <Route path="/movies/book/:movieId/:showId" element={<SeatLayout />} />    
        <Route path='/my-booking' element={<MyBooking />} />
        <Route path='/favorites' element={<Favorites/>} />
        <Route path='/releases' element={<Releases/>} />
        <Route path='/theaters' element={<Theaters/>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
