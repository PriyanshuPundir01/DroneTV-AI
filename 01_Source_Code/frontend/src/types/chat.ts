export interface ChatAction {
  label: string;
  actionType: 'navigate' | 'ask_question' | 'open_enquiry' | 'contact_direct';
  payload?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actions?: ChatAction[];
  isError?: boolean;
}

export interface QuickQuestionItem {
  id: string;
  question: string;
}
