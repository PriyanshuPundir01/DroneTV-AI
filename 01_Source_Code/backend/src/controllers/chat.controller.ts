import { Request, Response } from 'express';
import { processChatQuery, PREDEFINED_RULES } from '../services/ruleBasedChatbot';

export function getQuickQuestions(req: Request, res: Response): void {
  const questions = PREDEFINED_RULES.map((rule) => ({
    id: rule.id,
    question: rule.canonicalQuestion
  }));

  res.status(200).json({
    success: true,
    data: questions
  });
}

export function handleChatMessage(req: Request, res: Response): void {
  const { message } = req.body;

  if (message !== undefined && typeof message !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Query message must be a valid string.'
    });
    return;
  }

  const botResult = processChatQuery(message || '');

  res.status(200).json({
    success: true,
    data: {
      userMessage: message || '',
      reply: botResult.answer,
      matchedRule: botResult.matchedRule,
      suggestions: botResult.suggestions,
      actions: botResult.actions,
      timestamp: new Date().toISOString()
    }
  });
}
