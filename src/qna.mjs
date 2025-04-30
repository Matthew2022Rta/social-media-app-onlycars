import express from 'express';
import QuestionModel from './models/Question.mjs';

const router = express.Router();

// GET all questions
router.get('/questions', async (req, res) => {
    try {
      const questions = await QuestionModel.find();
      res.json(questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });
  router.post('/questions', async (req, res) => {
    const { question } = req.body;
    const username = req.session?.username || 'Anonymous';
    if (!question) return res.status(400).json({ error: 'Missing question' });
  
    try {
      const newQuestion = await QuestionModel.create({ question, username, answers: [] });
      res.status(201).json(newQuestion);
    } catch (err) {
      console.error('Error saving question:', err);
      res.status(500).json({ error: 'Failed to save question' });
    }
  });


  router.post('/answers', async (req, res) => {
    const { questionId, answer } = req.body;
    if (!questionId || !answer) return res.status(400).json({ error: 'Missing questionId or answer' });
  
    try {
      const updated = await QuestionModel.findByIdAndUpdate(
        questionId,
        { $push: { answers: answer } },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      console.error('Error saving answer:', err);
      res.status(500).json({ error: 'Failed to save answer' });
    }
  });
  router.get('/questions', async (req, res) => {
    try {
      const questions = await QuestionModel.find();
      res.json(questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });
export default router;
