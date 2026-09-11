export interface ThreadRead {
  id: number;
  title: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;

  authorId: number;
  threadCategoryId: number;
}
