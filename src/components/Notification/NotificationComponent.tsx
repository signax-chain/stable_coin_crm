import React from "react";

import styles from "../../styles/notification.module.css";
import { INotificationUserDetails } from "../../models/INotifications";
import { NotebookTabs } from "lucide-react";

export default function NotificationComponent(props: {
  notifications: INotificationUserDetails[];
}) {
  return (
    <div className={styles["notification__container"]}>
      <div className={styles["notification__container_heading"]}>
        <h1 className={styles["notification__title"]}>Notifications</h1>
      </div>
      <div className={styles["notification__body"]}>
        {props.notifications.map((notification, index) => {
          return (
            <div className={styles["notification__card_container"]} key={index}>
              <div className={styles["notification__card"]}>
                <div className={styles["notification__icon"]}>
                  <NotebookTabs color="white" />
                </div>
                <div className={styles["notification__label"]}>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                </div>
                <div className={styles["notification__read_dot"]}>
                  {!notification.is_read ? (
                    <div className={styles["not__read"]}></div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <div>
                {!notification.is_read &&
                notification.notification_type === "request_token" ? (
                  <div className={styles["notification__button_group"]}>
                    <button>Request Stable Coin</button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
