
"use server";

import { writeFile, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "/var/www/uploads";

export async function uploadToVps(file: File) {
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (file.size === 0) throw new Error("Empty file");

  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
  const fileName = `${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(UPLOAD_DIR, fileName);

  await writeFile(filePath, buffer);

  return {
    pathname: `/uploads/${fileName}`,
    fileName
  };
}




export async function deleteFromVps(fileName: string) {
  const filePath = `/var/www/uploads/${fileName}`;
  await unlink(filePath);
  return { success: true };
}