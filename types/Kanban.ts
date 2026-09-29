export type KanbanColumnTitle = 'To Do' | 'In Progress' | 'Done';

export type KanbanColumn = {
  boardColumnId: string;
  boardId: string;
  columnTitle: string;
  position: number;
};

export type KanbanTask = {
  taskId: string;
  researchId: string;
  boardId: string;
  boardColumnId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  assignedToProfileImagePurpose?: string | null;
  assignedToProfileImageUrl?: string | null;
  dueDate: string;
  createdBy: string;
  archivedAt?: string | null;
  archivedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResearchBoard = {
  researchTitle: string;
  researchDescription: string;
  researchImageId: string | null;
  researchOwnerId: string;
  researchCreatedAt: string;
  researchUpdatedAt: string;
  boardId: string;
  boardTitle: string;
  boardCreatedBy: string;
  boardCreatedAt: string;
};

export type KanbanBoardResponse = {
  researchBoard: ResearchBoard;
  boardColumns: KanbanColumn[];
  tasks: KanbanTask[];
};

export type KanbanBoard = {
  boardId: string;
  researchId: string;
  title: string;
  columns: KanbanColumn[];
};
