interface baseNotificationType {
  _id: string;
  createdBy?: string;
  receiver: string;
  notificationType: string;
  notificationTypeId: string;
  isRead: boolean;
  eventTime?: string;
}

interface notificationFrom {
  email: string;
  _id: string;
  username: string;
  profile_img: string;
}

interface postInfo {
  _id: string;
  title: string;
}

interface commentsInfo {
  content: string;
  postId: string;
  postInfo: postInfo[];
}

interface newAndOldNotificationType extends baseNotificationType {
  notificationFrom: notificationFrom[];
  commentsInfo: commentsInfo[];
  postInfo: postInfo[];
}

interface documentInfo{
    _id:string,
    doc_name:string,
    doc_type:"certificate"|"license",
    doc_url:string,
    expiration_date:string,
}

interface timeSensitiveNotificationType extends baseNotificationType {
  remindMeTomorrow: string;
  dismiss: boolean;
  documentInfo:documentInfo
}
