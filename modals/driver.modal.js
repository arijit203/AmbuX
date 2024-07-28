import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String},
  location: { type: String },
  isOffline: { type: Boolean, default: true },
  password: { type: String, required: true },
  license_plate: { type: String, required: true },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

const Driver = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
export default Driver;
