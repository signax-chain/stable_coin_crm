import { ITokenDetails } from "./ITokenDetail";

export interface IContractDatabaseDetails{
    contract_address: string;
    user_id: string;
    token_details: ITokenDetails,
    created_at: Date,
    updated_at: Date,
}