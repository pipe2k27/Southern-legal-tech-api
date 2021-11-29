import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  sub: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  plan: {
    type: String,
    required: false,
    default: null,
  },
  company: {
    type: String,
    required: false,
  },
  availableContracts: {
    type: [{
      title: String,
      startAmount: Number,
      currentAmount: Number,
    }],
    required: false,
  },
  anyContracts: {
    type: {
      startAmount: Number,
      currentAmount: Number,
    },
    required: false,
    default: {
      startAmount: 0,
      currentAmount: 0,
    },
  },
  documents: {
    type: [{
      name: String,
      date: String,
      id: Number,
      month: String,
    }],
    required: false,
    default: [],
  },
  saved: {
    type: [{
      sessionUrl: String,
      currentSection: String,
      answers: Object,
      date: String,
    }],
    required: false,
    default: [],
  },

}, { timestamps: true });

export const User = mongoose.model('andesUser', userSchema);
