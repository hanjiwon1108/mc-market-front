export type Comment = {
  id: string;
  article_id: string;
  user: {
    id: string;
    nickname?: string;
  };
  replies?: Comment[];
  content: string;
  created_at: string;
  updated_at: string;
};

export type ResponseCommentType = {
  comments: Comment[];
  count: number;
};
