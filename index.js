const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});
app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

// Array with different activities
const statusMessages = [
  { name: "AthlixGG", type: ActivityType.Playing }
];

let currentIndex = 0;
const channelId = ''; // Set your channel ID here

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatusAndSendMessages() {
  const currentStatus = statusMessages[currentIndex];

  // Update presence with the current status
  client.user.setPresence({
    activities: [{ name: currentStatus.name, type: currentStatus.type, url: currentStatus.url || null }],
    status: 'dnd',
  });

  // Send message to the specified channel (if channelId is valid)
  const textChannel = client.channels.cache.get(channelId);
  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is now: ${currentStatus.name}`);
  }

  // Update the index for the next cycle
  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    Bot is ready as ${client.user.tag}`);
  updateStatusAndSendMessages();

  // Set interval to update status every 10 seconds
  setInterval(() => {
    updateStatusAndSendMessages();
  }, 600000);
});

login();


