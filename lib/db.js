import mongoose,{Mongoose} from "mongoose"

const MONGODB_URL=process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);

