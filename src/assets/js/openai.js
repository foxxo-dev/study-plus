const apiUri = 'https://study-plus-api.vercel.app/';

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

  // fetch the API with all the fields in the body
  const body = {
    documentData,
    documentType,
    topic,
    description,
    extraPrompt,
  };

  const response = await fetch(apiUri + 'flashcards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

export async function getRatingAndImproving(_doc, _rubric) {
  if (!_doc || !_rubric) {
    throw new Error('Missing required parameters');
  }

  const body = {
    _doc,
    _rubric,
  };

  const response = await fetch(apiUri + 'rating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

let questionQueue = [];

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

  if (questionQueue.length === 0) {
    const body = {
      documentData,
      documentType,
      topic,
      description,
      extraPrompt,
    };

    console.log('Fetching', apiUri, '/', 'g4aq');

    const response = await fetch(apiUri + 'g4aq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log(data);

    if (!data.questions || data.questions.length === 0) {
      throw new Error('No questions returned from API');
    }

    questionQueue = data.questions.map((item) => ({
      q: item.q,
      answers: [...item.answers].sort(() => Math.random() - 0.5),
    }));
  }

  const currentQuestion = questionQueue.shift();

  console.log('Serving from queue. Remaining:', questionQueue.length);

  return {
    question: currentQuestion,
  };
}
