import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    credits: {
      type: Number,
      default: 10,
      min: 0
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    qrCodeData: {
      type: String,
      required: true,
      unique: true
    },
    avatarUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
