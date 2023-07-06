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
}

interface about {
  socials?: socials;
  personal_bio: string;
  contact_email: string;
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
}

interface userProfileInterface {
  about: about;
  education: education;
  certifications: userDocs;
  licenses: userDocs;
  profileImages: profileImages;
}

type certifications = userDocs;
type licenses = userDocs;
