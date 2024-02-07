import { firebaseAuth } from "./Config";

class AuthHelpers {
  getUserID() {
    return firebaseAuth.currentUser?.uid;
  }
}
export const authHelpers = new AuthHelpers();
