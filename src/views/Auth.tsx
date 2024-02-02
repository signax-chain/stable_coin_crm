import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoogleLogo from "../assets/logo/google.png";
import Logo from "../assets/logo/logo.png";
import { countryData } from "../helpers/Constants";
import { sortArrayAscending } from "../helpers/Country";

import LoaderContextProvider from "../context/LoaderContextProvider";
import { IUserDetails } from "../models/IUserDetails";
import { firebaseAuth, onAuthStateChanged } from "../helpers/Config";
import { authController } from "../controllers/database/auth.controller";
import { useRoleFinder } from "../context/RoleContextProvider";

import styles from "../styles/auth.module.css";

export default function AuthLayout() {
  const [contentStatus, setContentStatus] = useState("login");
  const [contentTitle, setContentTitle] = useState("Login to the platform");
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [formController, setFormController] = useState<IUserDetails>({
    name: "",
    email: "",
    country: "India",
    password: "",
    role: "user",
    created_at: new Date(),
    updated_at: new Date(),
    user_id: "",
    address: "",
  });
  const navigate = useNavigate();
  const {setRole, setUserInformation} = useRoleFinder();

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (state) => {
      if (state) {
        const user_id = state.uid;
        const response = await authController.getUserDetails(user_id);
        if (response.is_success) {
          if ("role" in response.data!) {
            let role = response.data?.role;
            setRole({ role: role });
            setUserInformation(response.data!);
            navigate("/home");
          }
        }
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      changeLoaderText("Logging User...");
      changeLoadingStatus(true);
      const res = await authController.login(
        formController.email,
        formController.password
      );
      if (res.is_success) {
        toast(`Login Successful ....`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/home");
          changeLoadingStatus(false);
        }, 5000);
      } else {
        toast(`${res.data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 5000);
      }
    } catch (error) {
      toast(`Error Logging In ${error} ....`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 5000);
    }
  };

  const handleRegistration = async () => {
    try {
      changeLoaderText("Registering User...");
      changeLoadingStatus(true);
      const response = await authController.registerUser(formController);
      if (response) {
        toast(`Registration Successful ....`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      toast(`Error Registering ${error} ....`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  const changeAuthStatus = () => {
    if (contentStatus === "login") {
      setContentStatus("signup");
      setContentTitle("Create a new account");
    } else {
      setContentStatus("login");
      setContentTitle("Login to the platform");
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormController({ ...formController, [name]: value });
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormController({ ...formController, [name]: value });
  };

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-navbar"]}>
        <img src={Logo} alt="platform-logo" />
        <div className={styles["divider"]}></div>
      </div>
      <div className={styles["auth-content"]}>
        <div className={styles["auth-inner-content"]}>
          <h1>{contentTitle}</h1>
          <div className={styles["google-sign-in"]}>
            <img src={GoogleLogo} width={25} alt="google-logo" />
            <p>Continue with Google</p>
          </div>
          <div className={styles["or-sec"]}>
            <div className={styles["div"]}></div>
            <p>OR</p>
            <div className={styles["div"]}></div>
          </div>
          {contentStatus === "login" ? (
            <div className={styles["section"]}>
              <div className={styles["form-group"]}>
                <p>Enter Email Address</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="email"
                  value={formController.email}
                  onChange={onInputChange}
                />
              </div>
              <div className={styles["form-group"]}>
                <p>Enter Password</p>
                <input
                  type="password"
                  className="form-control"
                  placeholder=""
                  name="password"
                  value={formController.password}
                  onChange={onInputChange}
                />
              </div>
              <button
                className={styles["login-button"]}
                onClick={() => handleLogin()}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className={styles["signup-section"]}>
              <div className={styles["signup-section-one"]}>
                <div className={styles["form-group"]}>
                  <p>Enter Your Name</p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    name="name"
                    value={formController.name}
                    onChange={onInputChange}
                  />
                </div>
                <div className={styles["form-group"]}>
                  <p>Enter Email Address</p>
                  <input
                    type="email"
                    className="form-control"
                    placeholder=""
                    name="email"
                    value={formController.email}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className={styles["signup-section-one"]}>
                <div className={styles["form-group"]}>
                  <p>Enter Your Country</p>
                  <select
                    className="form-control"
                    name="country"
                    value={formController.country}
                    onChange={onSelectChange}
                  >
                    {sortArrayAscending(countryData).map(
                      (country: any, index: number) => {
                        return (
                          <option key={index} value={country.name.common}>
                            {country.name.common}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
                <div className={styles["form-group"]}>
                  <p>Enter Password</p>
                  <input
                    type="password"
                    className="form-control"
                    placeholder=""
                    name="password"
                    value={formController.password}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className={styles["signup-section-one"]}>
                <button
                  className={styles["login-button"]}
                  onClick={() => handleRegistration()}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          <div className={styles["footer-content"]}>
            {contentStatus === "login" ? (
              <p className={styles["auth"]}>
                Don't have an account?{" "}
                <span onClick={() => changeAuthStatus()}>Sign up now</span>
              </p>
            ) : (
              <p className={styles["auth"]}>
                Already have an account?{" "}
                <span onClick={() => changeAuthStatus()}>Login now</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
