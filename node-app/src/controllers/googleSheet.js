import { addValuesToSpreadsheet } from "../services/googleSheets.js";
import { generalResponse } from "../util/commonFunctions.js";

const addToSheet = async (req, res) => {
  try {
    const data = Object.values(req.body);
    await addValuesToSpreadsheet(data)
      .then((values) => {
        if (!values) throw new Error("Bad request");
        generalResponse(res, 200, "OK", "success", values.data, false, false);
      })
      .catch((err) => {
        generalResponse(
          res,
          400,
          "error",
          "Bad request",
          err?.errors || err,
          true
        );
      });
  } catch (err) {
    generalResponse(res, 500, "error", "Internal server error", err, true);
  }
};

export { addToSheet };
