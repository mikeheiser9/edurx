import Joi from "joi";
import { returnAppropriateError } from "../../util/commonFunctions.js";
import { validateField } from "../../util/constant.js";

export const dismissAndRemindMeTomorrowNotificationValidator = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    await Joi.object({
      notificationId: objectId.required(),
    }).validateAsync(req.params);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};
