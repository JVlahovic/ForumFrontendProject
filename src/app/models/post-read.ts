export interface PostRead {
  id: number;
  content: string;
  createdAt: string;
  modifiedAt: string;
  isEdited: boolean;

  authorId: number;
  threadId: number;

  authorUsername: string;
}
