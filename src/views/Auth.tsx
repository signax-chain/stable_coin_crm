import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleLogo from "../assets/logo/google.png";
import Logo from "../assets/logo/logo.png";
import { countryData } from "../helpers/Constants";
import { sortArrayAscending } from "../helpers/Country";

import styles from "../styles/auth.module.css";
import { toast } from "react-toastify";

export default function AuthLayout() {
  const [contentStatus, setContentStatus] = useState("login");
  const [contentTitle, setContentTitle] = useState("Login to the platform");
  const navigate = useNavigate();

  const handleLogin = () => {
    // toast("🦄 Wow so easy!", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });
    navigate("/home");
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
                />
              </div>
              <div className={styles["form-group"]}>
                <p>Enter Password</p>
                <input
                  type="password"
                  className="form-control"
                  placeholder=""
                  name="password"
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
                  />
                </div>
                <div className={styles["form-group"]}>
                  <p>Enter Email Address</p>
                  <input
                    type="email"
                    className="form-control"
                    placeholder=""
                    name="email"
                  />
                </div>
              </div>
              <div className={styles["signup-section-one"]}>
                <div className={styles["form-group"]}>
                  <p>Enter Your Country</p>
                  <select className="form-control">
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
                  />
                </div>
              </div>
              <div className={styles["signup-section-one"]}>
                <button
                  className={styles["login-button"]}
                  onClick={() => handleLogin()}
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
      {/* <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            limit={1}
          /> */}
    </div>
  );
}
