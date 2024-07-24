"use server";

import User from "../modals/user.modal"
import {connect} from "../db"

export async function createUser(user){
    try{

        await connect().then(console.log("Connected to Database"));
        const newUser=await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }catch(error){
        console.log(error);

    }
}