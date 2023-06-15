
import * as Yup from "yup"
export const validateField={
    email :Yup.string().trim().required().email().max(150),
    password:Yup.string().required(),
    stringPrefixJoiValidation:Yup.string().trim()
}
export const taxonomyCodeToProfessionalMapping={
    "133V00000X":"RDN",
    "136A00000X":"NDTR"
}