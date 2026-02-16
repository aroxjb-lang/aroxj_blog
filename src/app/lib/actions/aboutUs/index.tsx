'use server'

import AboutUs from "../../models/aboutUsModel";
import dbConnect from "../../mongoose";

export async function updateAboutUs(id:string,data:string) {
    await dbConnect()
    const content= await AboutUs.findOneAndUpdate({_id:id},{text:data})
      return JSON.parse(JSON.stringify(content));

}

export async function creatAboutUs(data: { text: string; }) {
  await dbConnect();
  const content = await AboutUs.create(data);
  return JSON.parse(JSON.stringify(content));
}

export async function getAboutUs() {
  await dbConnect();
  const content = await AboutUs.find();
  return JSON.parse(JSON.stringify(content));
}
