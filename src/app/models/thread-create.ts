export interface ThreadCreate {
  title: string;
  categoryId: number;
  content: string;

  isPinned: boolean;
  isLocked: boolean;
}
