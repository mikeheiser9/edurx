import { Schema, Types ,model } from "mongoose";
const resourceSchema = new Schema (
    {
        title: { type: String, required: true },
        link: { type: String, required: true },
        publisher: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'postCategoryFilters' }]

    });

export const resourceModel = model('resource', resourceSchema); 