import { addValuesToSpreadsheet } from "../services/googleSheets.js";
import { generalResponse } from "../util/commonFunctions.js";

const addToSheet = async (req, res) => {
  try {
    const data = Object.values(req.body);
    const error="error while saving data to google sheet"
    await addValuesToSpreadsheet(data)
      .then((values) => {
        if (!values) throw new Error(error);
        generalResponse(res, 200, "OK", "success", values.data, false, false);
      })
      .catch((err) => {
        generalResponse(
          res,
          400,
          "error",
          error,
          err?.errors || err,
          true
        );
      });
  } catch (err) {
    generalResponse(res, 500, "error", "Internal server error", err, true);
  }
};

export { addToSheet };
