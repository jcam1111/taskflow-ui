export interface CreateTaskDto {
  title: string;
  userId: number;
  additionalInfo?: string;
}