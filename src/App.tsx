import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './views/Auth';
import HomeLayout from './views/Home';

function App() {
  return (
    <div>
     <BrowserRouter>
        <Routes>
          <Route path='/login' element={<AuthLayout />} />
          <Route path='/*' element={<HomeLayout />} />
        </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
