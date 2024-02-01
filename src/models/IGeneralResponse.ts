import { IUserDetails } from "./IUserDetails";

export interface IErrorResponse {
    title: string;
    message: string;
}

export interface IAuthResponse {
    data: IUserDetails | IErrorResponse | undefined,
    status: number;
    is_success: boolean;
}