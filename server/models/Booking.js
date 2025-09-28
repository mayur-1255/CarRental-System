import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    bookingid: { type: String, required: true, unique: true },             // Added field
    car: { type: ObjectId, ref: "Car", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },
    passengerName: { type: String, required: true },
    passengerLicenseNumber: { type: String, required: true },
    paymentMethod: { type: String, enum: ['online','offline'], default: 'offline' },
    paymentType: { type: String, enum: ['card','upi', null], default: null },
    paymentUpiApp: { type: String, enum: ['gpay','phonepe','paytm', null], default: null },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    price: { type: Number, required: true }
},{timestamps: true});

// Index to speed up overlap checks for a given car
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 })

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
