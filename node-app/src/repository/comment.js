import { commentModal } from "../model/post/comment.js"

export const findCommentById=(id)=>{
    return commentModal.findById(id);
}