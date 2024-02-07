import {
  userRef,
  doc,
  setDoc,
  getDocs,
  where,
  query,
  getDoc,
} from "../../helpers/Config";
import { IUserDetails } from "../../models/IUserDetails";

class UserController {
  async getAllUsers(uid: string): Promise<IUserDetails[]> {
    try {
      let users: IUserDetails[] = [];
      let documentWhereClause = where("user_id", "!=", uid);
      let documentQuery = query(userRef, documentWhereClause);
      const documentResponse = await getDocs(documentQuery);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        let data: IUserDetails = {
          name: elementData.name,
          email: elementData.email,
          password: elementData.password,
          country: elementData.country,
          role: elementData.role,
          user_id: elementData.user_id,
          created_at: elementData.created_at,
          updated_at: elementData.updated_at,
          address: elementData.address,
        };
        users.push(data);
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(uid: string): Promise<IUserDetails[]> {
    try {
      let users: IUserDetails[] = [];
      let documentWhereClause = doc(userRef, uid);
      const documentResponse = await getDoc(documentWhereClause);
      if (documentResponse.exists()) {
        let elementData = documentResponse.data();
        let data: IUserDetails = {
          name: elementData.name,
          email: elementData.email,
          password: elementData.password,
          country: elementData.country,
          role: elementData.role,
          user_id: elementData.user_id,
          created_at: elementData.created_at,
          updated_at: elementData.updated_at,
          address: elementData.address,
        };
        users.push(data);
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUserDetails(uid: string, data: any): Promise<boolean> {
    try {
      const documentRequest = doc(userRef, uid);
      await setDoc(documentRequest, data, { merge: true });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserDetailsByAddress(address: string): Promise<string> {
    try {
      let documentWhereClause = where("address", "==", address);
      let documentQuery = query(userRef, documentWhereClause);
      const documentResponse = await getDocs(documentQuery);
      if (documentResponse.docs.length > 0) {
        let data = documentResponse.docs[0].data();
        let uid = data.user_id;
        return uid;
      }
      return "";
    } catch (error) {
      throw error;
    }
  }
}

export const userController = new UserController();
