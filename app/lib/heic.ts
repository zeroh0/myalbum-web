const HEIC_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

// 브라우저(사파리 제외)가 <img>에서 HEIC/HEIF를 직접 디코딩하지 못하므로
// 별도 판별이 필요하다. OS/브라우저에 따라 MIME 타입이 비어 있는 경우가
// 많아 확장자도 함께 확인한다.
export function isHeicFile(file: File): boolean {
  return HEIC_MIME_TYPES.has(file.type) || /\.hei[cf]$/i.test(file.name);
}

export async function createImagePreviewUrl(file: File): Promise<string> {
  if (!isHeicFile(file)) {
    return URL.createObjectURL(file);
  }

  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8,
    });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return URL.createObjectURL(blob);
  } catch {
    // 변환 실패 시에도 업로드 자체는 막지 않도록 원본으로 폴백한다
    // (미리보기만 깨질 뿐, 서버 업로드에는 영향 없음).
    return URL.createObjectURL(file);
  }
}
