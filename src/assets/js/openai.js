const apiUri = 'https://study-plus-api-foxxos-projects-70ddd111.vercel.app/';

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

  // fetch the API with all the fields in the body
  const body = {
    documentData,
    documentType,
    topic,
    description,
    extraPrompt,
  };

  const response = await fetch(apiUri + 'g4aq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // shuffle the items in the array
  const data = await response.json();

  const array = data.question.answers;
  console.log(array);
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  console.log(shuffledArray);

  return {
    question: data.question.question,
    answers: shuffledArray,
  };
}
