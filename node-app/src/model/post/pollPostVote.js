import { Schema, model } from "mongoose";

const voteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  choosenOption: {
    type: Schema.Types.String,
    required: true,
  },
});

export const pollPostVoteModal = model("pollPostVote", voteSchema);
