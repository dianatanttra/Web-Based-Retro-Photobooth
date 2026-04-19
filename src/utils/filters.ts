export const applyBlackAndWhiteFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Grayscale using luminosity method
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Slight contrast boost for photobooth feel
    const contrasted = ((gray - 128) * 1.15) + 128;
    
    data[i] = contrasted;       // R
    data[i + 1] = contrasted;   // G
    data[i + 2] = contrasted;   // B
    // Alpha unchanged
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applyColorFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Photobooth color characteristics:
  // 1. Slight grain (subtle noise)
  // 2. Soft contrast (crush blacks slightly, lift shadows)
  // 3. Mild vignette (darken corners)

  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);

    // Soft contrast adjustment
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Lift shadows, crush blacks slightly
    r = adjustTone(r);
    g = adjustTone(g);
    b = adjustTone(b);

    // Grain (subtle random noise)
    const grain = (Math.random() - 0.5) * 8;
    r = clamp(r + grain, 0, 255);
    g = clamp(g + grain, 0, 255);
    b = clamp(b + grain, 0, 255);

    // Vignette
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const vignette = 1 - (distanceFromCenter / maxDistance) * 0.3;
    
    r *= vignette;
    g *= vignette;
    b *= vignette;

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imageData, 0, 0);
};

const adjustTone = (value: number): number => {
  // S-curve for soft contrast
  const normalized = value / 255;
  const adjusted = normalized < 0.5
    ? 2 * normalized * normalized
    : 1 - 2 * (1 - normalized) * (1 - normalized);
  return adjusted * 255;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};