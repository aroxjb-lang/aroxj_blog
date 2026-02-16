"use server";

import dbConnect from "../../mongoose";
import SocilaMedia from "../../models/socialMediasModel";

export async function getSocials() {
  await dbConnect();
  const socials = await SocilaMedia.find();
  return JSON.parse(JSON.stringify(socials));
}

export async function creatSocial(data: { icon: string; url: string }) {
  await dbConnect();
  const social = await SocilaMedia.create(data);
  return JSON.parse(JSON.stringify(social));
}

export async function updateSocial(
  id: string,
  data: { url: string; icon: string },
) {
  await dbConnect();
  const social = await SocilaMedia.findOneAndUpdate({ _id: id }, data);
  return JSON.parse(JSON.stringify(social));
}

export async function deleteSocial(id: string) {
  await dbConnect();
  const social = await SocilaMedia.findOneAndDelete({ _id: id });
  return JSON.parse(JSON.stringify(social));
}
