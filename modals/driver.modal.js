import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  curr_location: { type: String }, // Current location field added
  isOffline: { type: Boolean, default: false },
  password: { type: String, required: true },
  license_plate: { type: String, required: true },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
});

const Driver = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
export default Driver;
