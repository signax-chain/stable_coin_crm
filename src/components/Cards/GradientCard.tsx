import React from "react";

import styles from "../../styles/information-card.module.css";
import { IInformationStats } from "../../models/IGeneralFormData";

export default function GradientInformationCard(props: {data: IInformationStats}){
    return(
        <div className={styles["card"]}>
        <div>
          <div className={styles["card-header"]}>{props.data.title}</div>
          <div className={styles["card-body"]}>{props.data.content}</div>
        </div>
        <div className={styles["card-footer"]}>
          {props.data.footer.map((footer, index) => {
            return (
              <div className={styles["footer__content_one"]} key={index}>
                <h3>{footer.title}</h3>
                <p>{footer.content}</p>
              </div>
            );
          })}
          <div className={styles["footer__content_two"]}></div>
        </div>
      </div>
    );
}