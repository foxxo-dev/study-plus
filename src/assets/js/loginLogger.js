async function sendDiscordWebhook(content) {
  const webhookUrl =
    'https://discord.com/api/webhooks/1344416645590024264/X7gZrmHnPMeG71Wn9w6J9xk56VuFICdbCaYH5M8lvinqqS8q6qoLLKdHiW4o-HwdzHJm';

  const body = JSON.stringify({
    content: content, // The message content to send
  });

  console.log('Sending webhook with body:', body); // Debug log

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Webhook send failed with status ${response.status}`);
    }

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

async function signUpNewUser(time, method) {
  const discordTimestamp = `<t:${Math.floor(time / 1000)}:F>`;

  const message = `# Yayy we have a new user who signed up at ${discordTimestamp} using ${method} method`;

  await sendDiscordWebhook(message);
}

async function loggedInNewUser(time, method) {
  const discordTimestamp = `<t:${Math.floor(time / 1000)}:F>`;

  const ipAddress = await fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch((error) => {
      console.error('Error fetching IP address:', error);
      return 'unknown';
    });

  const loginMessage = `User signed in at ${discordTimestamp} using ${method} method from IP address ${ipAddress}`;

  await sendDiscordWebhook(loginMessage);

  const statsMessage =
    '-# To be replaced with Google Statistics - Location of user is: ' +
    ipAddress;

  await sendDiscordWebhook(statsMessage);
}

export { signUpNewUser, loggedInNewUser };
