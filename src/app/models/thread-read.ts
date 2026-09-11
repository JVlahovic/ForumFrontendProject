export interface ThreadRead {
  id: number;
  title: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;

  authorId: number;
  authorUsername: string;
  threadCategoryId: number;
}
