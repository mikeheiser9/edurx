export interface TypeUserData {
    first_name:string;
    last_name:string;
    username:string;
    email:string;
    password: string;
    role: "super_admin" | "moderator" | "professional" | "student";
    npi_number: string;
    taxonomy: string;
    joined:string;
    verified_account:boolean;
    id:string;
    npi_designation:string[]
}
