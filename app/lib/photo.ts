import type { UploadFile } from "@/app/lib/album";

export type AlbumOwner = {
  username: string;
  albumId: string;
  albumName: string;
};

export type Photo = {
  id: number;
  title: string | null;
  description: string | null;
  displayOrder: number;
  thumbnailUploadFile: UploadFile;
  originUploadFile: UploadFile;
  createdAt: string;
  albumOwner: AlbumOwner;
};

export type AlbumPhotoList = {
  albumId: number;
  title: string;
  description: string | null;
  status: "PUBLIC" | "PRIVATE";
  owner: boolean;
  photos: Photo[];
};
