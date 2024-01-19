import React, { ReactNode } from "react";

import styles from "../../styles/card.module.css";

export default function GeneralCard(props: {
  title: string;
  subtitle: string | undefined;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles["card__container"]}>
      <div className={styles["card__icon"]}>{props.icon}</div>
      <div className={styles["card__data"]}>
        <h3>{props.title}</h3>
        {props.subtitle && (
          <p className={styles["card__sub_title"]}>{props.subtitle}</p>
        )}
        {props.children}
      </div>
    </div>
  );
}
