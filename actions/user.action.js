"use server";

import User from "@/modals/user.modal";
import { connect } from "@/db";

export async function createUser(user) {
  try {
    await connect();
    console.log("Database connected")
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}