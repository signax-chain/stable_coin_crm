import { Timestamp } from "firebase/firestore";
import { IBankDetails } from "./IBankDetails";

export interface IStableCoins{
    creator_id: string;
    creator_wallet_address: string;
    creator_smart_contract_address: string;
    receiver_smart_contract_address: string;
    country: string;
    bank_id: string;
    supply_minted: number;
    created_at: Timestamp;
    updated_at: Timestamp;
    bank_details: IBankDetails;
}