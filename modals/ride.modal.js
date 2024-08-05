import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Adjust this to your actual patient model if different
    required: true,
  },
  patient_name: {
    type: String,
  },
  patient_ph: {
    type: String,
  },
  driver_name: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
  },
  type_ambu: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  source: {
    type: {
      lat: Number,
      lng: Number,
      name: String,
      label: String,
    },
  },
  dest: {
    type: {
      lat: Number,
      lng: Number,
      name: String,
      label: String,
    },
  },
  ambu_initial_loc: {
    type: {
      lat: Number,
      lng: Number,
    },
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

export default mongoose.models.Ride || mongoose.model("Ride", rideSchema);
