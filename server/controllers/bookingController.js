import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import mongoose from 'mongoose'
import crypto from "crypto"; // 1. Import the crypto module

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });
    return bookings.length === 0;
};

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // fetch all available cars for the given location
        const cars = await Car.find({ location, isAvaliable: true });

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable: isAvailable };
        });

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);

        res.json({ success: true, availableCars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Create Booking
// API to Create Booking (no username stored, only refs)
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate, passengerName, passengerLicenseNumber, paymentMethod = 'offline', paymentType = null, paymentUpiApp = null } = req.body;

        if(!passengerName || typeof passengerName !== 'string' || passengerName.trim().length < 2){
            return res.json({ success: false, message: 'Please enter a valid passenger name' })
        }
        if(!passengerLicenseNumber || typeof passengerLicenseNumber !== 'string' || passengerLicenseNumber.trim().length < 4){
            return res.json({ success: false, message: 'Please enter a valid license number' })
        }

        const session = await mongoose.startSession();
        let created;
        await session.withTransaction(async () => {
            const isAvailable = await checkAvailability(car, pickupDate, returnDate);
            if (!isAvailable) {
                throw new Error('Car is not available');
            }

            const carData = await Car.findById(car).session(session);

            const picked = new Date(pickupDate);
            const returned = new Date(returnDate);
            const noOfDays = Math.max(1, Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)));
            const price = carData.pricePerDay * noOfDays;

            const prefix = 'CAR';
            const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const randomString = crypto.randomBytes(2).toString('hex').toUpperCase();
            const uniqueBookingId = `${prefix}-${dateString}-${randomString}`;

            created = await Booking.create([{
                car,
                owner: carData.owner,
                user: _id,
                passengerName: passengerName.trim(),
                passengerLicenseNumber: passengerLicenseNumber.trim(),
                paymentMethod,
                paymentType,
                paymentUpiApp,
                pickupDate,
                returnDate,
                price,
                bookingid: uniqueBookingId,
            }], { session });
        });
        session.endSession();
        if(!created){
            return res.json({ success: false, message: "Car is not available" });
        }
        res.json({ success: true, message: "Booking Created", booking: created[0] });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;

        const bookings = await Booking.find({ user: _id })
            .populate("car")
            .populate("user", "name email phone licenseNumber aadhaarNumber")   // include IDs for display
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const bookings = await Booking.find({ owner: req.user._id })
            .populate("car")
            .populate("user", "name email phone licenseNumber aadhaarNumber")   // include IDs for display
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};