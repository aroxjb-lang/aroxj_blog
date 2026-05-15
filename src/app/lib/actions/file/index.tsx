"use server";

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR =
    process.env.NODE_ENV === "production"
        ? "/var/www/wp-content/uploads"
        : path.join(process.cwd(), "uploads");

export async function uploadToVps(file: File) {
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (file.size === 0) {
    throw new Error("Empty file");
  }

  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");

  const fileName = `${randomUUID()}-${safeName}`;

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.writeFile(filePath, buffer);

  return {
    pathname: `uploads/${fileName}`,
    fileName,
  };
}

export async function deleteFromVps(fileName: string) {
  if (!fileName) {
    throw new Error("Missing file name");
  }

  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.unlink(filePath);

  return {
    success: true,
  };
}