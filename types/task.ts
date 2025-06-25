
export interface ITasks {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  research: {
    title: string;
    fileUrl: string;
    ownerId: string;
    researchId: string;
  };
}