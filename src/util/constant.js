import joi from "joi";

export const validateField={
    email :joi.string().trim().required().email(),
    password:joi.string().required(),
    stringPrefixJoiValidation:joi.string().trim()
}

