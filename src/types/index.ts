export interface Student {
  id: number;
  name: string;
  photos: string[];
}

export interface GroupPhoto {
  id: number;
  title: string;
  photos: string[];
}

export interface StudentsData {
  students: Student[];
  groupPhotos?: GroupPhoto[];
}