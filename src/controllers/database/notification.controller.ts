import { Timestamp, setDoc } from "firebase/firestore";
import {
  getDocs,
  notificationRef,
  addDoc,
  notificationUserRef,
  query,
  where,
  doc,
} from "../../helpers/Config";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import {
  INotificationDetails,
  INotificationUserDetails,
} from "../../models/INotifications";
import { userController } from "./user.controller";
import { IStableCoins } from "../../models/IStableCoins";
import { IBankDetails } from "../../models/IBankDetails";
import { IUserDetails } from "../../models/IUserDetails";
class NotificationController {
  async getAllNotifications(
    uid: string,
    role: string
  ): Promise<INotificationUserDetails[]> {
    try {
      let data: INotificationUserDetails[] = [];
      const documentRequest = query(
        notificationUserRef,
        where("receiver_id", "==", role === "team" ? "team" : uid)
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
          data: elementData.data,
          doc_id: element.id,
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
    contractData: IContractDatabaseDetails,
    data: IStableCoins | IBankDetails | IUserDetails
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
              created_at: Timestamp.now(),
              updated_at: Timestamp.now(),
              notification_type: notification.notification_type,
              data: data,
              doc_id: undefined,
            };
            await addDoc(notificationRef, notificationData);
          }
          return true;
        } else if (notification.notification_type === "request_token") {
          const notificationData: INotificationUserDetails = {
            creator_id: notification.creator_id,
            receiver_id: contractData.user_id,
            notification_doc_id: doc_id,
            title: `We have a new Mint of Stable Coins`,
            message: `We have minted ${contractData.token_details.token_supply} stable coins. Click on send button to send ${contractData.token_details.token_supply} CBDC's to CCX Team`,
            is_read: false,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            notification_type: notification.notification_type,
            data: data,
            doc_id: undefined,
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

  async createNotificationWithUserData(
    notificationData: INotificationUserDetails
  ) {
    try {
      const res = await addDoc(notificationUserRef, notificationData);
      if (res) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async updateNotification(data: INotificationUserDetails): Promise<boolean> {
    try {
      let documentRequest = doc(notificationUserRef, data.doc_id);
      await setDoc(documentRequest, data, { merge: true });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
export const notificationController = new NotificationController();
