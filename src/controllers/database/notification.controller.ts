import {
  getDoc,
  doc,
  setDoc,
  getDocs,
  notificationRef,
  addDoc,
  notificationUserRef,
  query,
  where,
} from "../../helpers/Config";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import {
  INotificationDetails,
  INotificationUserDetails,
} from "../../models/INotifications";
import { userController } from "./user.controller";
class NotificationController {
  async getAllNotifications(uid: string): Promise<INotificationUserDetails[]> {
    try {
      let data: INotificationUserDetails[] = [];
      const documentRequest = query(
        notificationUserRef,
        where("receiver_id", "==", uid),
        where("is_read", "==", false)
      );
      const documentResponse = await getDocs(documentRequest);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        const elementContent: INotificationUserDetails = {
          creator_id: elementData.creator_id,
          receiver_id: elementData.receiver_id,
          notification_doc_id: elementData.notification_doc_id,
          title: elementData.title,
          message: elementData.message,
          is_read: elementData.is_read,
          created_at: elementData.created_at,
          updated_at: elementData.updated_at,
          notification_type: elementData.notification_type,
        };
        data.push(elementContent);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createNotification(
    notification: INotificationDetails,
    uid: string,
    contractData: IContractDatabaseDetails
  ): Promise<boolean> {
    try {
      const documentResponse = await addDoc(notificationRef, notification);
      if (documentResponse) {
        let doc_id = documentResponse.id;
        if (notification.notification_type === "general") {
          let allUsers = await userController.getAllUsers(uid);
          for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
            const element = allUsers[userIndex];
            const notificationData: INotificationUserDetails = {
              creator_id: notification.creator_id,
              receiver_id: element.user_id,
              notification_doc_id: doc_id,
              title: "You have a unread notification",
              message: "",
              is_read: false,
              created_at: new Date(),
              updated_at: new Date(),
              notification_type: notification.notification_type,
            };
            await addDoc(notificationRef, notificationData);
          }
          return true;
        } else if (notification.notification_type === "request_token") {
          const notificationData: INotificationUserDetails = {
            creator_id: notification.creator_id,
            receiver_id: contractData.user_id,
            notification_doc_id: doc_id,
            title: `We have a new Mint of Coins`,
            message: `We have minted ${contractData.token_details.token_supply} tokens. Send the request to CCX team to request for Stable Coins`,
            is_read: false,
            created_at: new Date(),
            updated_at: new Date(),
            notification_type: notification.notification_type
          };
          await addDoc(notificationUserRef, notificationData);
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
export const notificationController = new NotificationController();
