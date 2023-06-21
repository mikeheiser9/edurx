import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import authJson from "../metadata/googleSheets/keys.js";
import { spreadsheetHeaders } from "../util/constant.js";

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/spreadsheets",
  credentials: {
    client_email: authJson.client_email,
    private_key: authJson.private_key,
  },
});
const spreadsheetId = "1gzoYustOkqXct1ZgJ2XhV3zL0-yoyzfQuHBgWmVedHE";
const sheetName = "Sheet1";
const service = google.sheets({ version: "v4", auth });

const getAuthToken = async () => {
  const res = await auth.getClient();
  return res;
};

const createSpreadsheet = async (title) => {
  const res = await service.spreadsheets.create({
    auth,
    resource: {
      properties: {
        title,
      },
    },
  });
  return res;
};

const getSpreadSheet = async () => {
  const res = await service.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
};

const getSpreadSheetValues = async (sheetName) => {
  const res = await service.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });
  return res;
};

const appendHeaders = async () => {
  const resource = {
    values: [spreadsheetHeaders],
  };
  await service.spreadsheets.values.update({
    spreadsheetId,
    resource,
    auth,
    range: "Sheet1!1:1",
    valueInputOption: "USER_ENTERED",
  });
};

const getEmailAlreadyExists = async (email) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const range = `${sheetName}!A:A`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows?.length) {
      const emails = rows.flat();
      return emails.includes(email);
    } else {
      return false;
    }
  } catch (error) {
    console.error("The API returned an error:", error);
    throw error;
  }
};

const addValuesToSpreadsheet = async (data) => {
  const isEmailAlreadyExists = await getEmailAlreadyExists(data[0]);
  if (isEmailAlreadyExists) {
    throw new Error("Email already exists");
  }
  const resource = {
    values: [data],
  };
  const headersCells = await service.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: "Sheet1!1:1",
  });
  if (
    !headersCells.data.values ||
    headersCells.data.values.length === 0 ||
    JSON.stringify(headersCells.data.values[0]) !==
      JSON.stringify(spreadsheetHeaders)
  ) {
    await appendHeaders();
  }
  const responce = await service.spreadsheets.values.append({
    spreadsheetId,
    resource,
    auth,
    range: "Sheet1!1:1",
    valueInputOption: "USER_ENTERED",
  });

  return responce;
};

export {
  getAuthToken,
  createSpreadsheet,
  getSpreadSheet,
  getSpreadSheetValues,
  addValuesToSpreadsheet,
};
