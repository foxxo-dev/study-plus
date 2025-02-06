import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_KEY;
const organization = process.env.OPENAI_ORGANIZATION;

const openai = new OpenAI({
  organization: organization,
  apiKey: OPENAI_API_KEY,
});

export async function getChatGPTFlashcards(
  documentType,
  topic,
  description,
  extraPrompt,
) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'using the two attached resources which are <insert document type>, generate me exactly 20 flash cards make it in this format, using a JSON fomrat. The topic of this is: <insert topic>. Here is some additional info i included: <insert description> Do not include any additional text other than the json, as it will make bad things happen, and break the database. ONLY JSON TEXT NO EXTRA. ONLY USE INFORMATION FROM THESE DOCUMENTS Use this format: [{q: "<text-of-card-question>", a: "<text-of-card-answer>"}, {q: "<text-of-card-question>", a: "<text-of-card-answer>"}, ...] make these falsh cards fun to learn, and not too boring. You can try to follow the following information, but if it seems too hard or something that dosent make sence, delete it and forget about it. here is the information: "<insert extra prompt>"',
      },
      {
        role: 'user',
        content: `Here is the following data: document-type: ${documentType}, topic: ${topic}, description: ${description} ${
          extraPrompt ? `, extra prompt: ${extraPrompt}` : ''
        }.`,
      },
    ],
    store: true,
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return { rawResponse: completion, flashcards };
}
