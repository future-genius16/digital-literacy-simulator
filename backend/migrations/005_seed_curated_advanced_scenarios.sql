UPDATE scenarios
SET is_active = false
WHERE level > 1;

INSERT INTO scenarios (
  module,
  title,
  text,
  option_a,
  option_b,
  option_c,
  option_d,
  option_e,
  correct_option,
  correct_options,
  explanation,
  level,
  difficulty,
  task_type,
  digcomp_area,
  digcomp_competence,
  learning_outcome,
  option_feedback,
  is_active
)
VALUES

-- PHISHING LEVEL 2 — MULTI SELECT
(
  'phishing',
  'University Account Verification',
  'A student receives an email that says: “Your university mailbox will be blocked in 2 hours. Confirm your account immediately.” The sender is support@university-security-check.com. The link text says “University Portal”, but the URL points to http://uni-login-confirm.com.',
  'The message creates urgency and pressure',
  'The sender domain is not the official university domain',
  'The visible link text and actual URL may not match a trusted service',
  'The email mentions a university account',
  'The message uses formal language',
  'option_a',
  '["option_a", "option_b", "option_c"]'::jsonb,
  'The strongest phishing indicators are urgency, an unofficial sender domain, and a suspicious link destination. Formal language and mentioning a university account are not enough to prove that the message is malicious by themselves.',
  2,
  'intermediate',
  'multi_select',
  'Safety',
  'Protecting devices and personal data',
  'The learner can identify several phishing indicators in one message and separate strong evidence from weak assumptions.',
  '{
    "option_a": "Correct: urgency is often used in phishing to make users act before checking details.",
    "option_b": "Correct: the sender domain differs from the official university domain, which is a strong warning sign.",
    "option_c": "Correct: mismatched or unofficial links can lead to fake login pages.",
    "option_d": "Not enough by itself: legitimate and phishing emails can both mention a university account.",
    "option_e": "Not enough by itself: formal language can appear in both real and fake messages."
  }'::jsonb,
  true
),

-- PHISHING LEVEL 2 — RISK ANALYSIS
(
  'phishing',
  'Unexpected MFA Request',
  'You receive a push notification asking you to approve a login to your university email account. You are not trying to log in. A minute later, another approval request appears.',
  'Low risk',
  'Medium risk',
  'High risk',
  NULL,
  NULL,
  'option_c',
  '["option_c"]'::jsonb,
  'Unexpected multi-factor authentication requests may mean that someone knows the password and is trying to access the account. The safe response is to deny the request and secure the account through official settings.',
  2,
  'intermediate',
  'risk_analysis',
  'Safety',
  'Protecting devices and personal data',
  'The learner can assess account takeover risk and respond safely to unexpected authentication attempts.',
  '{
    "option_a": "Incorrect: this is not low risk because the user did not initiate the login attempt.",
    "option_b": "Not enough: repeated unexpected MFA requests suggest a serious account security risk.",
    "option_c": "Correct: this should be treated as high risk because it may indicate an attempted account takeover."
  }'::jsonb,
  true
),

-- PHISHING LEVEL 3 — MULTI SELECT
(
  'phishing',
  'Compromised Classmate Account',
  'A real classmate sends a message in a group chat: “Please review this shared document before tomorrow.” The link opens a page that looks like the university login screen, but the domain is docs-study-access.com. The classmate later says they did not send the message.',
  'A familiar sender does not guarantee that the link is safe',
  'The login page is hosted on an unofficial domain',
  'The classmate account may have been compromised',
  'The message is safe because it came from a real classmate',
  'It is safe to enter the password if the page design looks identical',
  'option_a',
  '["option_a", "option_b", "option_c"]'::jsonb,
  'A message from a familiar person can still be dangerous if their account was compromised. The unofficial domain and fake login page are strong indicators of credential phishing.',
  3,
  'advanced',
  'multi_select',
  'Safety',
  'Protecting devices and personal data',
  'The learner can recognize phishing attempts that use compromised trusted accounts and look-alike login pages.',
  '{
    "option_a": "Correct: trust in the sender is not enough if the link or login page is suspicious.",
    "option_b": "Correct: an unofficial domain for a login page is a strong phishing indicator.",
    "option_c": "Correct: the later message suggests that the classmate account may have been compromised.",
    "option_d": "Incorrect: a real sender can be compromised or impersonated.",
    "option_e": "Incorrect: visual similarity does not prove that a login page is legitimate."
  }'::jsonb,
  true
),

-- PHISHING LEVEL 3 — SINGLE CHOICE
(
  'phishing',
  'Security Alert With Partial Legitimacy',
  'You receive a security email from a service you use. It contains your name, does not ask for your password, and says there was a login attempt from another country. However, the button leads through a shortened URL.',
  'Click the button because the email contains personal details and does not ask for a password',
  'Open the service manually through the official app or website and review security activity there',
  'Ignore the message completely because all security emails are suspicious',
  NULL,
  NULL,
  'option_b',
  '["option_b"]'::jsonb,
  'Some elements may look legitimate, but shortened links reduce transparency. For account security events, it is safer to open the official service manually.',
  3,
  'advanced',
  'single_choice',
  'Safety',
  'Protecting devices and personal data',
  'The learner can evaluate mixed signals in security messages and choose an independent verification path.',
  '{
    "option_a": "Incorrect: personal details can appear in phishing emails, and shortened links make verification harder.",
    "option_b": "Correct: opening the official service manually avoids relying on a potentially unsafe link.",
    "option_c": "Too extreme: the message may be real, so the event should be checked through official channels."
  }'::jsonb,
  true
),

-- INFO LEVEL 2 — MULTI SELECT
(
  'info',
  'Suspicious Statistic in a Student Chat',
  'A student chat shares a post claiming: “80% of students fail online exams because of digital platforms.” The post includes a chart, but no source, sample size, date, or research method.',
  'The chart makes the claim automatically reliable',
  'The source of the data should be checked',
  'The sample size and research method matter',
  'The publication date may affect relevance',
  'The claim should be shared quickly because it concerns students',
  'option_b',
  '["option_b", "option_c", "option_d"]'::jsonb,
  'Charts can make weak claims look credible. Statistical information should be checked by looking at the source, methodology, context, and date.',
  2,
  'intermediate',
  'multi_select',
  'Information and data literacy',
  'Evaluating data, information and digital content',
  'The learner can evaluate statistical digital claims using source, methodology, date, and context.',
  '{
    "option_a": "Incorrect: a chart is a presentation format, not proof of reliability.",
    "option_b": "Correct: the origin of the data is essential for evaluating credibility.",
    "option_c": "Correct: sample size and method affect whether the statistic can be trusted.",
    "option_d": "Correct: older or undated information may be outdated or misleading.",
    "option_e": "Incorrect: importance does not remove the need for verification."
  }'::jsonb,
  true
),

-- INFO LEVEL 2 — RISK ANALYSIS
(
  'info',
  'AI Summary of a University Policy',
  'A student uses an AI tool to summarize a university data processing policy. The summary sounds clear and confident, but no one has compared it with the original policy document.',
  'Low risk',
  'Medium risk',
  'High risk',
  NULL,
  NULL,
  'option_b',
  '["option_b"]'::jsonb,
  'AI-generated summaries can be useful, but they may omit details or introduce errors. The risk is medium unless the summary is used for an important decision without checking the original.',
  2,
  'intermediate',
  'risk_analysis',
  'Information and data literacy',
  'Evaluating data, information and digital content',
  'The learner can assess reliability risks of AI-generated information and verify it against primary sources.',
  '{
    "option_a": "Too low: AI-generated text can sound confident while still being incomplete or wrong.",
    "option_b": "Correct: the summary can be useful, but it should be checked against the original document.",
    "option_c": "Too high in this context: the summary is not necessarily harmful, but it should not be trusted blindly."
  }'::jsonb,
  true
),

-- INFO LEVEL 3 — MULTI SELECT
(
  'info',
  'Manipulative Article About Student Monitoring',
  'An article claims that educational platforms secretly monitor students. It uses emotional language, anonymous quotes, screenshots without context, and links only to opinion posts. There are no official documents or research references.',
  'Emotional language may indicate an attempt to influence the reader',
  'Anonymous quotes should be treated as sufficient proof',
  'Screenshots without context may be misleading',
  'The claim should be checked against official documents or reliable research',
  'Opinion posts are always as reliable as primary sources',
  'option_a',
  '["option_a", "option_c", "option_d"]'::jsonb,
  'The article may raise an important issue, but weak evidence and manipulative language require careful verification through stronger sources.',
  3,
  'advanced',
  'multi_select',
  'Information and data literacy',
  'Evaluating data, information and digital content',
  'The learner can recognize manipulative framing and verify complex claims using stronger evidence.',
  '{
    "option_a": "Correct: emotional wording can be used to push a conclusion before evidence is evaluated.",
    "option_b": "Incorrect: anonymous quotes may be useful context, but they are not sufficient proof.",
    "option_c": "Correct: screenshots can be edited, selective, or taken out of context.",
    "option_d": "Correct: serious claims should be checked against stronger sources.",
    "option_e": "Incorrect: opinion posts are usually weaker evidence than primary documents or research."
  }'::jsonb,
  true
),

-- INFO LEVEL 3 — SINGLE CHOICE
(
  'info',
  'Conflicting Sources',
  'Two sources give different explanations of a new university rule. One is an official university page updated yesterday. The other is a popular student blog post with no links to documents.',
  'Trust the student blog because it is written in simpler language',
  'Use the official updated university page as the primary source and treat the blog as secondary commentary',
  'Assume both sources are equally reliable because both discuss the same rule',
  NULL,
  NULL,
  'option_b',
  '["option_b"]'::jsonb,
  'When sources conflict, authority, date, evidence, and purpose matter. An official updated source should be treated as primary for institutional rules.',
  3,
  'advanced',
  'single_choice',
  'Information and data literacy',
  'Evaluating data, information and digital content',
  'The learner can prioritize sources by authority, relevance, date, and evidence when information conflicts.',
  '{
    "option_a": "Incorrect: simple language does not make a source more authoritative.",
    "option_b": "Correct: official updated information is the best primary source for university rules.",
    "option_c": "Incorrect: sources are not equally reliable just because they discuss the same topic."
  }'::jsonb,
  true
),

-- DATA LEVEL 2 — PERMISSION CHECK
(
  'data',
  'Study Planner Permissions',
  'A study planner app helps students manage deadlines and sends reminders. During setup it asks for access to notifications, contacts, camera, microphone, and location.',
  'Notifications',
  'Contacts',
  'Camera',
  'Microphone',
  'Location',
  'option_a',
  '["option_a"]'::jsonb,
  'Application permissions should match the app’s actual purpose. A study planner may need notifications for reminders, but access to contacts, camera, microphone, or location is excessive.',
  2,
  'intermediate',
  'permission_check',
  'Safety',
  'Protecting personal data and privacy',
  'The learner can evaluate app permissions and allow only access that is necessary for the app’s main function.',
  '{
    "option_a": "Correct: notifications are directly related to reminders and can be necessary.",
    "option_b": "Incorrect: contacts are not necessary for a basic planner and may expose other people’s data.",
    "option_c": "Incorrect: camera access is not necessary for managing deadlines.",
    "option_d": "Incorrect: microphone access is not needed for a simple planner.",
    "option_e": "Incorrect: location access is not necessary for deadline reminders."
  }'::jsonb,
  true
),

-- DATA LEVEL 2 — MULTI SELECT
(
  'data',
  'Cloud File Sharing',
  'You upload a group project file to cloud storage. It contains names, emails, and project notes. The default setting is “Anyone with the link can edit”.',
  'Limit access to specific group members',
  'Give edit rights only to people who need them',
  'Keep “anyone with the link can edit” because it is convenient',
  'Review sharing settings before sending the link',
  'Post the link in a public student chat',
  'option_a',
  '["option_a", "option_b", "option_d"]'::jsonb,
  'Sharing settings should protect personal and project data. Convenience should not override access control.',
  2,
  'intermediate',
  'multi_select',
  'Safety',
  'Protecting personal data and privacy',
  'The learner can choose safer access settings when sharing files containing personal or group data.',
  '{
    "option_a": "Correct: access should be limited to people involved in the project.",
    "option_b": "Correct: edit rights should be granted only when necessary.",
    "option_c": "Incorrect: public edit access can expose data and allow unwanted changes.",
    "option_d": "Correct: checking settings before sharing reduces accidental exposure.",
    "option_e": "Incorrect: posting the link publicly increases privacy and integrity risks."
  }'::jsonb,
  true
),

-- DATA LEVEL 3 — PERMISSION CHECK
(
  'data',
  'AI Study Assistant Data Access',
  'An AI study assistant offers personalized recommendations. It asks to access your calendar, email metadata, files, location history, and notification permission.',
  'Calendar events related to study deadlines',
  'All email metadata',
  'All files in cloud storage',
  'Location history',
  'Notifications for study reminders',
  'option_a',
  '["option_a", "option_e"]'::jsonb,
  'Personalization does not justify unlimited access. Only data directly needed for the stated function should be allowed.',
  3,
  'advanced',
  'permission_check',
  'Safety',
  'Protecting personal data and privacy',
  'The learner can evaluate complex data access requests and apply data minimization.',
  '{
    "option_a": "Correct: calendar deadlines may be directly relevant to study recommendations.",
    "option_b": "Incorrect: all email metadata is excessive and can reveal sensitive patterns.",
    "option_c": "Incorrect: access to all files is too broad for a study assistant.",
    "option_d": "Incorrect: location history is not necessary for study reminders.",
    "option_e": "Correct: notifications can be appropriate for reminders if the user wants them."
  }'::jsonb,
  true
),

-- DATA LEVEL 3 — RISK ANALYSIS
(
  'data',
  'Public Computer Session',
  'You use a public computer in a university library to access the student portal. The browser asks to save your password, and you notice another account is still logged into a different service.',
  'Low risk',
  'Medium risk',
  'High risk',
  NULL,
  NULL,
  'option_c',
  '["option_c"]'::jsonb,
  'Shared devices create account exposure risks. Password saving, active sessions, and cached data can compromise accounts even when websites use HTTPS.',
  3,
  'advanced',
  'risk_analysis',
  'Safety',
  'Protecting personal data and privacy',
  'The learner can assess privacy and account risks when using shared or public devices.',
  '{
    "option_a": "Incorrect: public or shared computers are not low risk for account access.",
    "option_b": "Too low: saved passwords and existing sessions create serious exposure risks.",
    "option_c": "Correct: this is high risk and requires logging out, avoiding password saving, and clearing session data if possible."
  }'::jsonb,
  true
);