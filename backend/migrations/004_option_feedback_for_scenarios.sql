-- Migration: option-level feedback for training scenarios

ALTER TABLE scenarios
ADD COLUMN IF NOT EXISTS option_feedback JSONB;

UPDATE scenarios
SET option_feedback = '{
  "option_a": "Correct: the sender domain is not the official university domain, which is a strong phishing indicator.",
  "option_b": "Correct: urgency and pressure are commonly used in phishing messages to make users act without checking.",
  "option_c": "Correct: the link leads to an unofficial domain, so entering credentials there would be risky.",
  "option_d": "Not enough by itself: mentioning a university account does not prove that the message is phishing.",
  "option_e": "Not enough by itself: formal language can be used in both legitimate and phishing messages."
}'::jsonb
WHERE title = 'Identify Phishing Indicators';