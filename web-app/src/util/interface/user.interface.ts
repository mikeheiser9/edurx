type USER_ROLES = "super_admin" | "moderator" | "professional" | "student";
interface userLoginField {
  email: string;
  password: string;
}

interface commonRegistrationField extends userLoginField {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
}

interface professionalUserRegistrationField extends commonRegistrationField {
  addresses: string[];
  city: string;
  state: string;
  zip_code: string;
  npi_number: string;
  npi_designation: string[];
  npiReturnFullName: string;
  taxonomy: string;
  organization: string;
}

interface googleSheetPayload {
  email: string;
  first_name: string;
  last_name: string;
  taxonomies: string;
  addresses: string;
}
