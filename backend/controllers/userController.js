import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import generateToken from '../utils/generateToken.js';

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  rollNumber: user.rollNumber,
  credits: user.credits,
  role: user.role,
  qrCodeData: user.qrCodeData,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, rollNumber, password } = req.body;

  if (!name || !email || !phone || !rollNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
  if (existingUser) {
    return res.status(409).json({ message: 'User with provided email or roll number already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const qrCodeData = crypto.randomUUID();

  const user = await User.create({
    name,
    email,
    phone,
    rollNumber,
    passwordHash,
    qrCodeData
  });

  const token = generateToken({ id: user._id, role: user.role });

  return res.status(201).json({
    token,
    user: buildUserResponse(user)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken({ id: user._id, role: user.role });

  return res.json({
    token,
    user: buildUserResponse(user)
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  return res.json({ user: buildUserResponse(req.user) });
});

export const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  return res.json({ transactions });
});
