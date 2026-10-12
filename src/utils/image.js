const MAX_SIDE = 1600;
const QUALITY = 0.82;

async function loadBitmap(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return await createImageBitmap(file);
  }
}

// Resizes a photo and re-saves it as a JPEG.
// Re-saving also removes hidden data such as GPS location from the original file.
export async function compressImage(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  let bitmap;
  try {
    bitmap = await loadBitmap(file);
  } catch {
    throw new Error('That image could not be read. Try a JPEG or PNG photo.');
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  if (bitmap.close) bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
  if (!blob) throw new Error('That image could not be processed.');
  return blob;
}