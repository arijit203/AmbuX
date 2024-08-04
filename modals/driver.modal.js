import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  curr_location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
      updated_at: { type: Date, default: Date.now },
    },
  },
  isOffline: { type: Boolean, default: false },
  password: { type: String, required: true },
  license_plate: { type: String, required: true },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // Reference to User model
});

const Driver = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
export default Driver;
