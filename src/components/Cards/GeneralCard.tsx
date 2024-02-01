import React, { ReactNode } from "react";

import styles from "../../styles/card.module.css";

export default function GeneralCard(props: {
  title: string;
  subtitle: string | undefined;
  icon: ReactNode;
  children: ReactNode;
  needAlignment: boolean;
}) {
  return (
    <div className={styles["card__container"]}>
      <div className={styles["card__icon"]}>{props.icon}</div>
      <div className={styles["card__data"]}>
        <h3>{props.title}</h3>
        {props.subtitle && props.needAlignment ? (
          <p className={styles["card__sub_title"]}>
            {props.subtitle.length > 30
              ? `${props.subtitle.substring(
                  0,
                  props.subtitle.length - 10
                )} ....`
              : props.subtitle}
          </p>
        ) : (
          <p className={styles["card__sub_title"]}>{props.subtitle}</p>
        )}
        {props.children}
      </div>
    </div>
  );
}
