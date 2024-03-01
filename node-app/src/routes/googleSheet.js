import { Router } from "express";
import { addToSheet } from "../controllers/googleSheet.js";
import { addSheetDataValidator } from "../middleware/validator/googleSheet.js";

const sheetRoute = Router();

sheetRoute.post("/add-to-sheet", addSheetDataValidator, addToSheet);

export default sheetRoute;
 