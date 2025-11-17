import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const scanAndDeduct = asyncHandler(async (req, res) => {
  const { qrData, amount = 1, mealType } = req.body;

  if (!qrData) {
    return res.status(400).json({ message: 'QR data is required' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero' });
  }

  const user = await User.findOne({ qrCodeData: qrData });
  if (!user) {
    return res.status(404).json({ message: 'User not found for supplied QR code' });
  }

  if (user.credits < amount) {
    return res.status(400).json({ message: 'Insufficient credits' });
  }

  user.credits -= amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    amount: -Math.abs(amount),
    actionType: 'deduct',
    mealType,
    balanceAfter: user.credits
  });

  return res.json({
    message: 'Credit deducted successfully',
    newBalance: user.credits,
    userName: user.name
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ name: 1 });
  return res.json({ users });
});

export const adjustCredits = asyncHandler(async (req, res) => {
  const { userId, amount, notes } = req.body;

  if (!userId || typeof amount !== 'number') {
    return res.status(400).json({ message: 'userId and numeric amount are required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedCredits = user.credits + amount;
  if (updatedCredits < 0) {
    return res.status(400).json({ message: 'Credits cannot be negative' });
  }
  user.credits = updatedCredits;
  await user.save();

  await Transaction.create({
    user: user._id,
    amount,
    actionType: amount >= 0 ? 'refill' : 'deduct',
  balanceAfter: updatedCredits,
    notes
  });

  return res.json({
    message: 'Credits updated successfully',
    newBalance: user.credits
  });
});

export const getUserTransactionsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const transactions = await Transaction.find({ user: userId })
    .sort({ createdAt: -1 });
  return res.json({ transactions });
});
