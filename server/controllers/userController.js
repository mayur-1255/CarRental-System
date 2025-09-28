import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Helpers
const maskValue = (value = '', visibleDigits = 4) =>{
    if(!value || typeof value !== 'string') return '';
    const trimmed = value.replace(/\s+/g, '');
    if(trimmed.length <= visibleDigits) return trimmed;
    const maskedLength = Math.max(0, trimmed.length - visibleDigits);
    return `${'*'.repeat(maskedLength)}${trimmed.slice(-visibleDigits)}`
}

// Get Profile details (masked by default)
export const getUserProfile = async (req, res)=>{
    try {
        const { user } = req;
        const mask = (req.query.mask ?? 'true') !== 'false';

        const profile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            phone: user.phone || '',
            address: user.address || '',
            licenseNumber: mask ? maskValue(user.licenseNumber) : (user.licenseNumber || ''),
            aadhaarNumber: mask ? maskValue(user.aadhaarNumber) : (user.aadhaarNumber || ''),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        res.json({ success: true, profile })
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Update Profile details
export const updateUserProfile = async (req, res)=>{
    try {
        const { _id } = req.user;
        const { name, phone, address, licenseNumber, aadhaarNumber } = req.body || {};

        const update = {};
        if(typeof name === 'string') update.name = name;
        if(typeof phone === 'string') update.phone = phone;
        if(typeof address === 'string') update.address = address;
        if(typeof licenseNumber === 'string') update.licenseNumber = licenseNumber;
        if(typeof aadhaarNumber === 'string'){
            const digits = aadhaarNumber.replace(/\D/g, '')
            if(digits && digits.length !== 12){
                return res.json({ success: false, message: 'Aadhaar must be exactly 12 digits' })
            }
            update.aadhaarNumber = digits
        }

        await User.findByIdAndUpdate(_id, update, { new: false });

        const updatedUser = await User.findById(_id).select('-password');
        res.json({ success: true, message: 'Profile updated', user: updatedUser })
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}