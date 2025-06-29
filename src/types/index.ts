export interface Student {
  id: number;
  name: string;
  photos: string[];
  isFavorite?: boolean;
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

export interface PhotoInteraction {
  id: string;
  photoId: string;
  userId: string;
  type: 'like' | 'download';
  createdAt: Date;
}

export interface PhotoStats {
  photoId: string;
  likeCount: number;
  downloadCount: number;
  isLiked: boolean;
}