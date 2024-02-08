import { Timestamp } from "firebase/firestore";
import { IStableCoins } from "./IStableCoins";
import { IBankDetails } from "./IBankDetails";
import { IUserDetails } from "./IUserDetails";

export interface INotificationDetails {
  creator_id: string;
  notification_type:
    | "request_token"
    | "response_request_token"
    | "general"
    | undefined;
  is_resolved: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface INotificationUserDetails {
  creator_id: string;
  receiver_id: string;
  notification_doc_id: string;
  title: string;
  message: string;
  is_read: boolean;
  notification_type:
    | "request_token"
    | "response_request_token"
    | "general"
    | undefined;
  created_at: Timestamp;
  updated_at: Timestamp;
  data: IStableCoins | IBankDetails | IUserDetails | undefined;
  doc_id: string | undefined;
}

export interface INotificationData {
  data: IStableCoins | IBankDetails | IUserDetails;
}
