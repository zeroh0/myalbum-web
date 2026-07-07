export type UploadFile = {
  id: number;
  url: string;
  originFileName: string;
  width: number | null;
  height: number | null;
};

export type AlbumListItem = {
  id: number;
  title: string;
  uploadFile: UploadFile | null;
  viewCount: number;
  status: "PUBLIC" | "PRIVATE";
  createdAt: string;
};
