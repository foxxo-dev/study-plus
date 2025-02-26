import { WebhookClient } from 'discord.js';

export async function signUpNewUser(time, method) {
  const webhookClient = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1344416645590024264/X7gZrmHnPMeG71Wn9w6J9xk56VuFICdbCaYH5M8lvinqqS8q6qoLLKdHiW4o-HwdzHJm',
  });
  const discordTimestamp = `<t:${Math.floor(time / 1000)}:F>`;
  time = discordTimestamp;

  await webhookClient.send({
    content: `# Yayy we have a new user which signed up at ${discordTimestamp} using ${method} method`,
  });
}

export async function loggedInNewUser(time, method) {
  const webhookClient = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1344416645590024264/X7gZrmHnPMeG71Wn9w6J9xk56VuFICdbCaYH5M8lvinqqS8q6qoLLKdHiW4o-HwdzHJm',
  });

  // convert date.now to a discord timestamp

  const discordTimestamp = `<t:${Math.floor(time / 1000)}:F>`;
  time = discordTimestamp;

  await webhookClient.send({
    content: `User signed in at ${discordTimestamp} using ${method} method \n`,
  });

  await webhookClient.send({
    content: '-# To be replaced with Google Statistics',
  });
}
