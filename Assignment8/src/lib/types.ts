export type Category = {
  id: string;
  name: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  color?: string;
  deletedAt?: string | null;
};
