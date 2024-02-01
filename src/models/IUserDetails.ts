export interface IUserDetails {
    name: string;
    email: string;
    password: string;
    country: string;
    role: "user" | "central_bank" | "bank" | "team" | undefined;
    user_id: string;
    address: string | undefined;
    created_at: Date;
    updated_at: Date;
}