import OpenAI from 'openai';

// const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
// const openaiOrg = import.meta.env.VITE_OPENAI_ORGANIZATION;

const openaiKey =
  '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';
const openaiOrg = 'org-ogtaCMZuh6Yw90m6eRNmFTR1';

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

function checkIfImg(data) {
  // check if it starts with : "__base_64_img__/"
  return data.startsWith('__base_64_img__/');
}

export async function getChatGPTFlashcards(
  documentData,
  documentType,
  topic,
  description,
  extraPrompt,
) {
  if (!documentType || !topic || !description || !extraPrompt) {
    throw new Error('Missing required parameters');
  }

  const isImg = checkIfImg(documentData);
  console.log('isImg', isImg);

  const imgContent = {
    type: 'image_url',
    image_url: { url: documentData.replace('__base_64_img__/', '') }, // Ensure image_url is an object
  };

  const userMessageContent = `Here is a ${documentType} document: "${
    !isImg && documentData
  }". Generate exactly 10 flashcards based on this document. Topic: ${topic}. Additional info: ${description}. Use only JSON, and no extra text. ONLY JSON. Format: [{"q": "<question>", "a": "<answer>"}, ...]. Make the flashcards easy to learn and engaging. If something is too difficult or doesn't make sense, omit it. Additional instructions: "${extraPrompt}".`;

  const messages = [
    {
      role: 'system',
      content:
        'You generate raw JSON flashcards. No markdown, no styling. Just JSON. Use only the provided document to create the flashcards.',
    },
    {
      role: 'user',
      content: [{ type: 'text', text: userMessageContent }],
    },
  ];

  // Append image content if the document is an image
  let model = 'gpt-4o-mini';
  if (isImg) {
    // model = 'gpt-4o';
    messages[1].content.push(imgContent);
    console.log('message pushed:', messages[1].content);
  }

  const _completion = {
    model,
    messages,
    store: false,
  };

  console.log('completion:', _completion);

  try {
    const completion = await openai.chat.completions.create(_completion);
    console.log(completion, completion.choices[0].message.content);

    const flashcards = JSON.parse(completion.choices[0].message.content);
    return { rawResponse: completion, flashcards };
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
}

async function gettext(doc) {
  if (!doc) {
    return '';
  }
  const reader = new FileReader();
  reader.readAsArrayBuffer(doc);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const typedarray = new Uint8Array(reader.result);
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          window.location.origin + '/pdf.worker.min.mjs';
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let text = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          text += textContent.items.map((i) => i.str).join(' ') + '-----';
        }
        resolve(text.trim());
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file'));
  });
}

export async function getRatingAndImproving(_doc, _rubric) {
  const doc = await gettext(_doc);
  const rubric = await gettext(_rubric);

  if (!doc || !rubric) {
    console.error('Missing required parameters');
    return 'params';
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI that evaluates a document based on a rubric. Return a rating and list of improvements in JSON format.',
      },
      {
        role: 'user',
        content: `The rubric is: "${rubric}"\nThe working document is: "${doc}".\n\nGenerate the response in strict JSON format:\n\n\`\`\`json\n{"rating": <number>, "improvements": ["<improvement>", "<improvement>"]}\n\`\`\``,
      },
    ],
  });

  if (!completion.choices || completion.choices.length === 0) {
    throw new Error('No valid response from OpenAI API');
  }

  const rawResponse = completion.choices[0].message.content;
  console.log('API Response:', rawResponse);

  try {
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;
    const result = JSON.parse(jsonString);

    if (
      !result ||
      typeof result.rating !== 'number' ||
      !Array.isArray(result.improvements)
    ) {
      throw new Error('Invalid response format');
    }

    console.log('Parsed JSON:', result);

    return {
      rating: result.rating,
      improvements: result.improvements || [],
    };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse JSON from OpenAI response');
  }
}

const seenQuestions = new Set();

export async function generate4AnswerQuestion(
  documentData,
  documentType,
  topic,
  description,
  extraPrompt,
) {
  if (!documentType || !topic || !description || !extraPrompt) {
    throw new Error('Missing required parameters');
  }

  const isImg = checkIfImg(documentData);
  console.log('isImg', isImg);

  const imgContent = {
    type: 'image_url',
    image_url: { url: documentData.replace('__base_64_img__/', '') },
  };

  const userMessageContent = `Here is a ${documentType} document: "${
    !isImg && documentData
  }". Generate a 4-answer question based on this document. Topic: ${topic}. Additional info: ${description}. Use only JSON, and no extra text. ONLY JSON. Format: {"q": "<question>", "answers": [{"a": "<answer>", "correct": true}, {"a": "<answer>", "correct": false}, {"a": "<answer>", "correct": false}, {"a": "<answer>", "correct": false}]}. Make the question easy to learn and engaging. If something is too difficult or doesn't make sense, omit it. Additional instructions: "${extraPrompt}". Each answer should only be 1-2 words, and the questions should also not be too long.`;

  const messages = [
    {
      role: 'system',
      content:
        'You generate raw JSON questions. DO NOT REPEAT QUESTIONS THAT HAVE ALREADY BEEN GENERATED. Use diverse wording and variations. DO NOT ALWAYS MAKE THE SAME ID QUESTION CORRECT. MAKE IT RANDOM (0, 1, 2, or 3 can be correct). ONLY ONE CORRECT ANSWER. ASK QUESTIONS WHICH CAN BE ANSWERED WITHOUT HAVING THE DOCUMENT OPEN. No markdown, no styling. Just JSON. Use only the provided document to create the questions.',
    },
    {
      role: 'user',
      content: [{ type: 'text', text: userMessageContent }],
    },
  ];

  if (isImg) {
    messages[1].content.push(imgContent);
    console.log('message pushed:', messages[1].content);
  }

  const _completion = {
    model: 'gpt-4o-mini',
    messages,
    store: true,
  };

  console.log('completion:', _completion);

  try {
    let uniqueQuestion = null;
    let maxAttempts = 5;

    while (maxAttempts > 0) {
      const completion = await openai.chat.completions.create(_completion);
      console.log(completion, completion.choices[0].message.content);

      const question = JSON.parse(completion.choices[0].message.content);

      if (!seenQuestions.has(question.q)) {
        seenQuestions.add(question.q);
        uniqueQuestion = question;
        break;
      }

      maxAttempts--;
    }

    if (!uniqueQuestion) {
      throw new Error(
        'Failed to generate a unique question after multiple attempts.',
      );
    }

    return { question: uniqueQuestion };
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
}
