interface profileSections {
  about: string | React.JSX.Element;
  education: string | React.JSX.Element;
  certifications: string | React.JSX.Element;
  licenses: string | React.JSX.Element;
  profileImages: string | React.JSX.Element;
}

interface socials {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  email?: string;
}

interface about {
  socials?: socials;
  personal_bio: string;
  contact_email: string;
  username: string;
}

interface education {
  school_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_in_progress: boolean;
  activities: string;
  _id?: string;
  id?: string; // due to some mongoose issues, we need to remove this
}

interface userDocs {
  _id?: string;
  doc_type: string;
  doc_name: string;
  issuer_organization: string;
  issue_date?: string;
  expiration_date: string;
  has_no_expiry?: boolean;
  doc_id?: string;
  doc_url?: string;
  doc_image?: string;
}

interface profileImages {
  banner_img: string | File;
  profile_img: string | File;
  availableFor?: {
    Mentorship: boolean;
    Research: boolean;
    Collaboration: boolean;
  };
  setAvailableFor?:React.Dispatch<React.SetStateAction<{
    Mentorship: boolean;
    Research: boolean;
    Collaboration: boolean;
}>>
}

interface userProfileInterface {
  about: about;
  education: education;
  certifications: userDocs;
  licenses: userDocs;
  profileImages: profileImages;
}

interface UserData {
  socials?: socials;
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: "super_admin" | "moderator" | "professional" | "student";
  npi_number?: string;
  npi_designation?: string[];
  followers?: any[];
  following?: any[];
  addresses?: string[];
  city?: string;
  state?: string;
  zip_code?: string;
  joined?: string;
  updatedAt?: string;
  educations?: education[];
  contact_email?: string;
  personal_bio?: string;
  username: string;;
  profile_img?: string;
  banner_img?: string;
  followersCount?: number;
  followingCount?: number;
  licensesCount: number;
  certificatesCount: number;
  licenses: licenses[];
  certificates: certifications[];
  userPosts?: [];
  recentComments?: [];
  Collaboration?:boolean,
  Mentorship?:boolean,
  Research?:boolean
}

type certifications = userDocs;
type licenses = userDocs;
