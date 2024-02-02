import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./views/Auth";
import HomeLayout from "./views/Home";
import Explorer from "./Explorer/Explorer";
import { TranslationProvider } from "./context/TranslatorContextProvider";
import LoaderContextProvider from "./context/LoaderContextProvider";
import Loader from "./components/Modals/Loader";
import { RoleProvider } from "./context/RoleContextProvider";
import { localStorageController } from "./controllers/storage.controller";
import { CONTRACT_ADDRESS } from "./helpers/Constants";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");

  return (
    <LoaderContextProvider.Provider
      value={{
        isLoading: isLoading,
        loaderText: loaderText,
        changeLoaderText: setLoaderText,
        changeLoadingStatus: setIsLoading,
      }}
    >
      <TranslationProvider>
        <RoleProvider>
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
        </RoleProvider>
      </TranslationProvider>
      <Loader isOpen={isLoading} loaderText={loaderText} />
    </LoaderContextProvider.Provider>
  );
}

export default App;
