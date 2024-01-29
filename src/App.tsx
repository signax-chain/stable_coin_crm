import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./views/Auth";
import HomeLayout from "./views/Home";
import Explorer from "./Explorer/Explorer";
import { TranslationProvider } from "./context/TranslatorContextProvider";

function App() {
  return (
    <TranslationProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />} />
            <Route path="/home/*" element={<HomeLayout />} />
            <Route path="/explorer/*" element={<Explorer />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
    </TranslationProvider>
  );
}

export default App;
