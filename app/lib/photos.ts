export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

// Placeholder feed until the real album API (NEXT_PUBLIC_API_URL) is wired in.
// Mixes portrait, landscape, square and panorama aspect ratios on purpose so
// the masonry layout can be validated against real-world variance.
const dimensions: [number, number][] = [
  [800, 1200], // portrait
  [1200, 800], // landscape
  [900, 900], // square
  [1000, 1400], // tall portrait
  [1400, 900], // wide landscape
  [800, 1000],
  [1200, 700],
  [900, 1300],
  [1300, 1300],
  [1500, 800],
  [700, 1100],
  [1100, 750],
];

export const photos: Photo[] = Array.from({ length: 30 }, (_, i) => {
  const [width, height] = dimensions[i % dimensions.length];
  const seed = `myalbum-${i + 1}`;
  return {
    id: seed,
    src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    width,
    height,
    alt: `Album photo ${i + 1}`,
  };
});
