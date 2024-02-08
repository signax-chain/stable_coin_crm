import { Timestamp } from "firebase/firestore";

export interface iTransaction{
    transaction_hash: string;
    from_address: string;
    to_address: string;
    created_at: Timestamp;
}

export interface iTransactionDetails {
    doc_id: string;
    transaction_hash: string;
    from_address: string;
    to_address:string;
    transaction_tokens: string[];
    transaction_action: string;
    transaction_block: number;
    transaction_value: number;
    transaction_fee: number;
    transaction_status: "success" | "error" | undefined;
    created_at: Timestamp;
}