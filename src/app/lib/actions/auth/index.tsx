"use server";

import bcrypt from "bcrypt";
import dbConnect from "../../mongoose";
import User from "../../models/userModel";
import { createSession, deleteSession } from "../../session";
import { redirect } from "next/navigation";
export interface AuthLoginInput {
  email: string;
  password: string;
}
export async function signup() {
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash("12345678", 10);

  // 3. Insert the user into the database or call an Auth Library's API
  await dbConnect();
  const data = await User.create({
    name: "Aroxj Blog",
    email: "aroxjb@gmail.com",
    password: hashedPassword,
  });

  const user = data;

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function login(data: AuthLoginInput) {
  try {
    const user = await User.findOne({ email: data.email });
    const isValidPass = await bcrypt.compare(data.password, user._doc.password);
    if (isValidPass) {
      await createSession(user._doc._id);
    }
  } catch (err) {
    console.log(err);
  }
}
