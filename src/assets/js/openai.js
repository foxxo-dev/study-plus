import OpenAI from 'openai';


const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openaiOrg = import.meta.env.VITE_OPENAI_ORGANIZATION;

if (!openaiKey) {
  throw new Error(
    'Missing OpenAI API Key. Set OPENAI_API_KEY in your environment variables.',
  );
}

const openai = new OpenAI({
  apiKey: openaiKey,
  organization: openaiOrg,
  dangerouslyAllowBrowser: true,
});

export { openai };

export async function getChatGPTFlashcards(
  documentType,
  topic,
  description,
  extraPrompt,
) {
  if (!documentType || !topic || !description || !extraPrompt) {
    throw new Error('Missing required parameters');
  }
  // using the two attached resources which are <insert document type>,
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a AI model which generates RAW JSON CONTENT. You do not need any aditional styling such as backticks in order to make it look beter. The only need is the RAW DATA. ONLY TEXT NO STYLING. THIS IS PURE JSON NO MARKDOWN OR HTML. These are flashcards, so try to keep them without any funny examples or too funny. Make them purley factual and easy to learn. ',
      },
      {
        role: 'user',
        content: `generate me exactly 10 flash cards make it in this format, using a JSON fomrat. The topic of this is: ${topic}. Here is some additional info i included: ${description} Do not include any additional text other than the json, as it will make bad things happen, and break the database. ONLY JSON TEXT NO EXTRA. ONLY USE INFORMATION FROM THESE DOCUMENTS Use this format: [{q: "<text-of-card-question>", a: "<text-of-card-answer>"}, {q: "<text-of-card-question>", a: "<text-of-card-answer>"}, ...] make these falsh cards fun to learn, and not too boring. You can try to follow the following information, but if it seems too hard or something that dosent make sence, delete it and forget about it. here is the information: "${extraPrompt}"`,
      },
    ],
    store: true,
  });

  console.log(completion, completion.choices[0].message.content);

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return { rawResponse: completion, flashcards };
}
