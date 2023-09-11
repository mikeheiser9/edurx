type PostTypes = "post" | "poll";
type PostStatusTypes = "draft" | "published";
type TargetTypes = "comment" | "post";
type ReactionTypes = "like" | "dislike";
type RolesTypes = "super_admin" | "moderator" | "professional" | "student";
type ForumTypes =
  | "Dietetics & Nutrition"
  | "Medical professionals"
  | "RDN"
  | "NDTR"
  | "Student";
interface PageDataState {
  page: number;
  totalRecords: number;
}

interface FilterOptionsState {
  sortBy?: string;
  forumType?: string;
  categories?: any[];
}

interface TagCategoryType {
  _id: string;
  name: string;
  type: "category" | "tag";
  createdAt?: string;
  updatedAt?: string;
}

interface UserId {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: RolesTypes;
  profile_img?: string;
  username?: string;
  id?: string;
}

interface UserReaction {
  _id: string;
  commentId: string;
  targetType: TargetTypes;
  userId: string & UserId;
  reactionType: ReactionTypes;
}
interface Comment {
  _id: string;
  content?: string;
  userId?: UserId & string;
  postId?: string;
  taggedUsers?: string[] & UserId[];
  isDeleted?: boolean;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  reactions?: UserReaction[];
  likeCount?: number;
  dislikeCount?: number;
  replies?: Comment[];
  id?: string;
}

interface PostInterface {
  _id: string;
  userId?: string & UserId;
  postStatus?: PostStatusTypes;
  forumType?: ForumTypes;
  postType?: PostTypes;
  title?: string;
  categories?: TagCategoryType[];
  tags?: TagCategoryType[];
  votingLength?: number;
  isPrivate?: boolean;
  isDeleted?: boolean;
  publishedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  comments?: Comment[];
  commentCount?: number;
  reactions?: UserReaction[];
  likeCount?: number;
  dislikeCount?: number;
  views?: number;
  id?: string;
}

interface CreatePostFormikInterface {
  forumType: ForumTypes;
  postType: PostTypes;
  title: string;
  categories: string[];
  tags: string[];
  isPrivate?: boolean;
  content: string;
  options: string[];
  votingLength: number; //days
}
