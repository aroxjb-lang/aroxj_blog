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
  }else{
    console.log('created');
    
  }
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function login(data: AuthLoginInput) {
  try {
    await dbConnect();
    const user = await User.findOne({ email: data.email });
     if (!user) {
      throw new Error("User not found");
    }

    const isValidPass = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isValidPass) {
      throw new Error("Invalid password");
    }
console.log("PASSWORD OK:", isValidPass);
    await createSession(user._id);
console.log("SESSION START");

    return { success: true };
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return { success: false };
  }
}
