export interface userLoginField{
    email:string,
    password:string
}

export interface commonRegistrationField extends userLoginField{
    first_name:string,
    last_name:string,
    email:string,
    password:string,
    confirm_password:string,
    role:string,
}

export interface professionalUserRegistrationField extends commonRegistrationField
{
    addresses:string[],
    city:string,
    state:string,
    zip_code:string,
    npi_number:string
    npi_designation:string[],
    npiReturnFullName:string,
    taxonomy:string,
    organization:string
}
