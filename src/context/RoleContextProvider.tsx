import axios from "axios";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUserDetails } from "../models/IUserDetails";
import { firebaseAuth, onAuthStateChanged } from "../helpers/Config";
import { authController } from "../controllers/auth.controller";

interface RoleEnum {
  role: "user" | "central_bank" | "bank" | "team" | undefined;
}

interface RoleContextProps {
  children: ReactNode;
}

interface RoleContextValue {
  role: RoleEnum;
  setRole: React.Dispatch<React.SetStateAction<RoleEnum>>;
  userInformation: IUserDetails | undefined;
  setUserInformation: React.Dispatch<
    React.SetStateAction<IUserDetails | undefined>
  >;
  getRole: (user_id: string) => Promise<string>;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<RoleContextProps> = ({ children }) => {
  const [role, setUserRole] = useState<RoleEnum>({ role: "user" });
  const [userInformation, setUserInformation] = useState<
    IUserDetails | undefined
  >(undefined);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (state) => {
      if (state) {
        const user_id = state.uid;
        const response = await authController.getUserDetails(user_id);
        if (response.is_success) {
          if ("role" in response.data!) {
            let role = response.data?.role;
            setUserRole({ role: role });
            setUserInformation(response.data!);
          }
        }
      }
    });
  }, []);

  const getRole = async (user_id: string): Promise<string> => {
    return "";
  };

  const contextValue: RoleContextValue = {
    role,
    setRole: setUserRole,
    getRole,
    userInformation,
    setUserInformation,
  };

  return (
    <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
  );
};

export const useRoleFinder = (): RoleContextValue => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleFinder must be used within a RoleContext");
  }
  return context;
};
