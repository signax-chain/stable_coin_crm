import { UserCredential } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseAuth,
  getDoc,
  userRef,
  doc,
  addDoc,
  setDoc,
  signOut,
} from "../../helpers/Config";
import { IAuthResponse } from "../../models/IGeneralResponse";
import { IUserDetails } from "../../models/IUserDetails";

class AuthController {
  async login(email: string, password: string): Promise<IAuthResponse> {
    var authResponse: IAuthResponse = {
      data: undefined,
      status: 0,
      is_success: false,
    };
    try {
      const response = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (response) {
        const user_id = response.user.uid;
        const documentReference = doc(userRef, user_id);
        const documentResponse = await getDoc(documentReference);
        if (documentResponse.exists()) {
          let data = documentResponse.data();
          authResponse = {
            data: {
              name: data.name,
              email: data.email,
              password: data.password,
              country: data.country,
              role: data.role,
              user_id: user_id,
              created_at: data.created_at,
              updated_at: data.updated_at,
              address: data.address,
            },
            status: 200,
            is_success: true,
          };
          return authResponse;
        } else {
          authResponse = {
            data: {
              title: "No User Found",
              message: "Following User Record Does not exists in our Record.",
            },
            status: 404,
            is_success: false,
          };
          return authResponse;
        }
      }
      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  async registerUser(data: IUserDetails): Promise<UserCredential | undefined> {
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );
      if (response) {
        let user_id = response.user.uid;
        data.user_id = user_id;
        const documentReference = doc(userRef, user_id);
        await setDoc(documentReference, data, { merge: true });
        return response;
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  }

  async getUserDetails(uid: string): Promise<IAuthResponse> {
    try {
      const documentReference = doc(userRef, uid);
      const documentResponse = await getDoc(documentReference);
      if (documentResponse.exists()) {
        let data = documentResponse.data();
        let authResponse = {
          data: {
            name: data.name,
            email: data.email,
            password: data.password,
            country: data.country,
            role: data.role,
            user_id: uid,
            created_at: data.created_at,
            updated_at: data.updated_at,
            address: data.address,
          },
          status: 200,
          is_success: true,
        };
        return authResponse;
      }
      let authResponse = {
        data: {
            title: "No User Data Found....",
            message: "No User Details Found for the given ID"
        },
        status: 404,
        is_success: false,
      };
      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  async logout():Promise<boolean>{
    try {
      await signOut(firebaseAuth);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const authController = new AuthController();
