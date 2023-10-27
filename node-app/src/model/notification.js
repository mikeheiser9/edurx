import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  // createdFor: {
  //   type: Schema.Types.ObjectId,
  //   ref: "users",
  //   required: true,
  // } // consider new collection ,
  // ,
  sendNotificationTo: {
    type: Schema.Types.ObjectId,
    ref: "listOfUsersToSendNotificationTo",
    required: true,
  },
  notificationType: {
    type: Schema.Types.String,
    enum: [
      "someone_you_follow_published_a_new_post",
      "someone_who_you_follow_commented_on_a_post",
      "someone_commented_on_a_post_you_follow",
      "someone_approved_your_reuqest_to_follow_a_private_post",
      "comments_on_your_post",
      "someone_replied_to_your_comment",
      "someone_requested_to_follow_your_private_post",
      "someone_followed_your_post",
      "someone_followed_you",
    ],
  },
  notificationTypeId: Schema.Types.ObjectId,
  // relatedLinks: {
  //   userLink: Schema.Types.String,
  //   postLink: Schema.Types.String,
  // },
  isRead: Schema.Types.Boolean,
  settings: {
    post: {
      comments: Schema.Types.Boolean, //Comments on you posts
      follows: Schema.Types.Boolean, //Follows on your posts
      postRequests: Schema.Types.Boolean, //Requests to follow your post
      commentReplies: Schema.Types.Boolean, // Replies to comments / mentions
      postRequestApprovals: Schema.Types.Boolean, //Approvals to follow a post
    },
    following: {
      newPost: Schema.Types.Boolean, //Someone you follow made a new post
      newComment: Schema.Types.Boolean, //Someone you follow commented on a post
    },
  }, // user account settings new collection ref by user doc
});

export const notifications = model("notifications", notificationSchema);
