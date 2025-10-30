import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    actionType: {
      type: String,
      enum: ['deduct', 'refill'],
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      lowercase: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
