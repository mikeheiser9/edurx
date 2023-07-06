import { userDocumentModal } from "../model/userDocument.js";
import mongoose from "mongoose";

const addNewDocument = async (payload) => {
  const { _id } = payload;
  return await userDocumentModal.updateOne(
    { _id: _id ?? new mongoose.Types.ObjectId() },
    { $set: payload },
    { upsert: true }
  );
};

const updateMultipleDocs = async (userId, listOfDocuments) => {
  const updatePromises = listOfDocuments.map(async (document) => {
    return await userDocumentModal.updateOne(
      {
        userId,
        _id: document._id,
      },
      {
        $set: document,
      },
      {
        upsert: true,
      }
    );
  });

  return await Promise.all(updatePromises);
};

const getUsersDocs = async (query) => {
  return await userDocumentModal.find(query, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
};

const getDocumentById = async (id) => {
  return await userDocumentModal.findById({ _id: id });
};

export { addNewDocument, getUsersDocs, updateMultipleDocs, getDocumentById };
