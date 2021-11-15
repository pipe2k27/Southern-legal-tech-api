import mongoose from 'mongoose';

const { Schema } = mongoose;

const documentSchema = new Schema({
  sub: {
    type: String,
    required: true,
  },
  id: {
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
  document: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Document = mongoose.model('document', documentSchema);

export default Document;
