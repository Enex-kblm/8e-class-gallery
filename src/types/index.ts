export interface Student {
  id: number;
  name: string;
  photos: string[];
}

export interface StudentsData {
  students: Student[];
}