import { pollPostVoteModal } from "../model/post/pollPostVote.js";

export const insertPollVote = (data) => {
  return pollPostVoteModal.create(data);
};

export const deleteVoteById = (id) => {
  return pollPostVoteModal.findByIdAndDelete(id);
};

export const updateVoteById = (id, setData) => {
  return pollPostVoteModal.findByIdAndUpdate(id, setData);
};
