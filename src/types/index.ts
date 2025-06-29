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

export interface PhotoStats {
  photoId: string;
  likeCount: number;
  downloadCount: number;
  isLiked: boolean;
}

export interface LocalPhotoData {
  [photoId: string]: {
    likes: number;
    downloads: number;
    likedBy: string[];
  };
}