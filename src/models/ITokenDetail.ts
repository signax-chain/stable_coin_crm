import { ReactNode } from "react";

export interface ITokenDetails{
    token_id: number;
    token_name: string;
    token_description: string;
    token_supply: number;
}
export interface ITokenDisplay {
    title: string;
    supply: number;
    supply_sent: number;
    icon: ReactNode;
    token_details: ITokenDetails;
  }