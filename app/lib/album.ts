export type UploadFile = {
  id: number;
  url: string;
  originFileName: string;
  width: number | null;
  height: number | null;
  cameraModel: string | null;
  lensModel: string | null;
  iso: number | null;
  aperture: string | null;
  shutterSpeed: string | null;
  takenAt: string | null;
};

export type AlbumListItem = {
  id: number;
  title: string;
  uploadFile: UploadFile | null;
  viewCount: number;
  status: "PUBLIC" | "PRIVATE";
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// 업로드된 파일은 백엔드의 정적 리소스 핸들러가 /resource/** 경로로
// 서빙한다 (WebConfig.addResourceHandlers).
export function buildUploadFileUrl(url: string): string {
  return `${API_URL}/resource/${url}`;
}
