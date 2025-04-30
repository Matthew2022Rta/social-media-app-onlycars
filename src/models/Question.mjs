// src/models/Question.mjs
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  username: { type: String, default: 'Anonymous' },
  answers: { type: [String], default: [] }
});

const Question = mongoose.model('question', QuestionSchema);
export default Question;