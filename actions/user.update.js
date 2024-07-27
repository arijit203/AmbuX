// actions/user.action.ts
"use server";

import User from "../modals/user.modal";
import { connect } from "../db";

export async function updateUser(id, updatedUser){
    // Implement the logic to update the user in your database
    // This will depend on your database schema and setup
    // For example:

    try {
        await connect();
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        { $set: updatedUser },
        { returnOriginal: false }
      );
      return user.value;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
  