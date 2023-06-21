import { Router } from "express";
import { addToSheet } from "../controllers/googleSheet.js";
import { addSheetDataValidator } from "../middleware/validator/googleSheet.js";

const sheetRoute = Router();

sheetRoute.post("/add-values", addSheetDataValidator, addToSheet);

export default sheetRoute;
