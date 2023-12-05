import { isValidObjectId } from "mongoose";

export const extractError = (errors) => {
  if (errors.details) {
    return errors.details.map((error) => error.message).join(", ");
  }
  return false;
};

export const generalResponse = (
  res,
  statusCode,
  response_type,
  message,
  data,
  toast
) => {
  res.status(statusCode).send({
    data,
    message,
    response_type,
    toast,
  });
};

export const generateRandomAlphanumericCharacterOfLengthTillTenDigit = (
  length
) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
    .toLocaleUpperCase();
};

export const prepareMail = (to, subject, text, html) => {
  return {
    to,
    from: process.env.MAIL_FROM_ADDRESS,
    subject,
    text,
    html,
  };
};

export const prepareVerificationCodeForEmailConfirmation = (
  fullName,
  email
) => {
  const currentTime = new Date().getTime();
  const codeExpireTime = currentTime + 1000 * 60 * 5;
  const randomCode = generateRandomAlphanumericCharacterOfLengthTillTenDigit(6);
  const html = `<label>Hii ${fullName}</label><br><br>Here is Your EduRx email confirmation code&nbsp;<b>${randomCode}<br><br>EduRx Team</b>`;
  const mail = prepareMail(
    email,
    "code for confirmation of your email for registration",
    "email confirmation code",
    html
  );
  return { mail, codeExpireTime, randomCode };
};

export const trimFields = (fields) => {
  for (let key in fields) {
    if (key != "password" && typeof fields[key] == "string") {
      fields[key] = fields[key].trim();
    }
  }
  return fields;
};

export const returnAppropriateError = (res, error) => {
  const isError = extractError(error);
  if (isError == "false") {
    return generalResponse(res, 400, "error", null, null, true);
  }
  return generalResponse(res, 400, "error", isError, null, true);
};

export const joiObjectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.error("any.invalid") : value;
};

export const getSkippedAttributes = (excludeAttributeList) => {
  if (!excludeAttributeList || !excludeAttributeList.atrributes.length)
    return null;
  return excludeAttributeList.atrributes.reduce((acc, attribute) => {
    acc[attribute] = excludeAttributeList?.type === "include" ? 1 : 0;
    return acc;
  }, {});
};

export const getKeyValueFromFiles = (files) => {
  let result = {};
  files?.map((file) => {
    Object.assign(result, { [file.fieldname]: file.filename });
  });
  return result;
};

export const findAndPaginate = async (
  modal,
  query,
  page = 1,
  limit = 10,
  options
) => {
  if (!modal || typeof modal !== "function") {
    throw new Error("Invalid mongoose modal provided.");
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer value");
  }
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit must be a positive integer value");
  }

  try {
    const count = await modal.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const skippedPages = (page - 1) * limit;

    let findQuery = modal.find(query);
    if (options) {
      Object.keys(options).forEach((key) => {
        if (typeof findQuery[key] === "function") {
          findQuery = findQuery[key](options[key]);
        }
      });
    }

    const records = await findQuery.skip(skippedPages).limit(limit);

    return {
      totalPages,
      currentPage: page,
      totalRecords: count,
      records,
    };
  } catch (error) {
    console.error("Error occurred during pagination:", error);
    return error;
  }
};

export const getAllowedForumAccessBasedOnRoleAndNpiDesignation = (
  role,
  npiDesignation
) => {
  if (role == "student") {
    return ["Student"];
  } else if (role == "moderator" || role == "super_admin") {
    return [
      "Dietetics & Nutrition",
      "Medical professionals",
      "RDN",
      "NDTR",
      "Student",
    ];
  } else {
    let forumAccess = npiDesignation.map((designation) => {
      if (designation == "RDN") {
        return designation;
      }
      return designation;
    });
    forumAccess = [
      ...forumAccess,
      "Dietetics & Nutrition",
      "Medical professionals",
    ];
    return forumAccess;
  }
};