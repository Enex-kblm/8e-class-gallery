
export interface Student {
  id: number;
  name: string;
  photos: string[];
  isFavorite?: boolean; // Tambah properti baru
}

export interface Hori {
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

export interface HorizontalScrollItem {
  id: string;
  image: string;
}
