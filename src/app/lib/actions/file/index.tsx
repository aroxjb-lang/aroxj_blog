"use server";

import { del, put } from "@vercel/blob";

export async function uploadToBlob(file: File) {

  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  // optional: validate
  if (file.size === 0) throw new Error("Empty file");
  // Server uploads recommended for small files on Vercel (≈4.5MB)
  // If you need bigger => use client upload flow.

  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
  const path = `uploads/${Date.now()}-${safeName}`;

  const blob = await put(path, file, {
    access: "public",
    // contentType: file.type, // optional
    addRandomSuffix: false, // optional (keeps it unique)
  });

  // blob.url / blob.downloadUrl are available
  return { url: blob.url, downloadUrl: blob.downloadUrl, pathname: blob.pathname };
}






export async function deleteFromBlob(url: string) {
  if (!url) {
    throw new Error("Missing blob url");
  }

  await del(url);

  return { success: true };
}
