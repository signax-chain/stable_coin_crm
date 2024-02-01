import React, { useEffect }  from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { authController } from "../controllers/auth.controller";

import styles from "../styles/logout.module.css";

export default function LogoutComponent(){
    const navigate = useNavigate();

    useEffect(()=>{
        authController.logout().then((res) => {
            localStorage.clear();
            navigate("/");
        })
    }, []);

    return(
        <div className={styles["logout__component"]}>
            <h2>Logging out from the platform ....</h2>
            <CircularProgress color="success" />
            <p>Clearing all the session informations ....</p>
            <span>This process might take sometime. Please wait ....</span>
        </div>
    );
}