// Load required modules
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const discord = require('discord.js');
const express = require('express');
const { Client, GatewayIntentBits, Routes, REST, Events, Partials } = require('discord.js');
const {
  InteractionType,
  InteractionResponseType,
} = require('discord-interactions');
const {
  VerifyDiscordRequest,
  getXTries,
  getFirstTry,
  getSecondTry,
  getThridTry,
  getForthTry,
  getFifthTry,
  getSixthTry,
  getWordleNumber,
} = require('./utils.cjs');
const { insertScore, getLeaderboard, db} = require('./db.cjs');

// Define the minimal intents required for your use case
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;
const rest = new REST().setToken(process.env.DISCORD_TOKEN);


// Configure middleware
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Start the Express app
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

// Log in to Discord when the client is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: 'Wordle' }], status: 'online' });
});

// Get today's Wordle number
const todayWordle = getWordleNumber(); // Replace this with the actual value of todayWordle

// Listen for new messages
client.on('messageCreate', (message) => {
  // Check if the message content includes the specific pattern
  const regex = /\bWordle\s+(\d{3})\s+([X123456])\/6\b/;
  const match = message.content.match(regex);
  
  if (match) {
    // The message contains the specific pattern
    const number = parseInt(match[1]);
    const triesOrX = match[2];
    
    if (number >= todayWordle - 1 && number <= todayWordle + 1) {
      // The user sent the correct 3-digit number
      
      // Check if the user has already posted a result for this number
      db.get(`SELECT * FROM leaderboard WHERE user = ? AND number = ?`, [message.author.username, number], (err, row) => {
        if (err) {
          return console.log(err.message);
        }
        
        if (!row) {
          // The user has not posted a result for this number yet
          
          // Save the data to the database
          insertScore(message.author.username, number, triesOrX);
          
          // Send a response
          if (triesOrX === 'X') {
            // The user sent 'X/6', which means they lost
            message.channel.send(getXTries());
          } else if (triesOrX === '1') {
            // Send a message for the first try
            message.channel.send(getFirstTry());
          } else if (triesOrX === '2') {
            // Send a message for the second try
            message.channel.send(getSecondTry());
          } else if (triesOrX === '3') {
            // Send a message for the third try
            message.channel.send(getThridTry());
          } else if (triesOrX === '4') {
            // Send a message for the fourth try
            message.channel.send(getForthTry());
          } else if (triesOrX === '5') {
            // Send a message for the fifth try
            message.channel.send(getFifthTry());
          } else if (triesOrX === '6') {
            // Send a message for the sixth and final try
            message.channel.send(getSixthTry());
          }
        }
      });
    } else {
      // The user sent an incorrect 3-digit number
      message.channel.send(`Sorry, ${number} is not today's wordle.`);
    }
  }
});


client.on('messageCreate', (message) => {
  // Check if the message content is "Wordle rank"
  const content = message.content.toLowerCase();
  if (content === 'wordle rank') {
    // Retrieve the leaderboard data from the database
    getLeaderboard((rows) => {
      // Find the row for the current user
      const row = rows.find((row) => row.user === message.author.username);
      
      if (row) {
        // The user has posted at least one score
        
        // Calculate the total number of tries
        const totalTries = row.x + row.six + row.five + row.four + row.three + row.two + row.one;
        
        // Format the user's personal table as a string
        let personalTable = 'Your Wordle Stats:\n\n';
        personalTable += `Score: ${row.score}\n`;
        personalTable += `1: ${row.one} (${row.onePercent.toFixed(2)}%)\n`;
        personalTable += `2: ${row.two} (${row.twoPercent.toFixed(2)}%)\n`;
        personalTable += `3: ${row.three} (${row.threePercent.toFixed(2)}%)\n`;
        personalTable += `4: ${row.four} (${row.fourPercent.toFixed(2)}%)\n`;
        personalTable += `5: ${row.five} (${row.fivePercent.toFixed(2)}%)\n`;
        personalTable += `6: ${row.six} (${row.sixPercent.toFixed(2)}%)\n`;
        personalTable += `X: ${row.x} (${row.xPercent.toFixed(2)}%)\n`;
        personalTable += `\nTotal tries: ${totalTries}`;
        
        // Send the personal table to the channel
        message.channel.send(personalTable);
      } else {
        // The user has not posted any scores yet
        message.channel.send(`You have not posted any Wordle scores yet.`);
      }
    });
  }



  // Check if the message content is "Wordle ranking"
  if (content === 'wordle ranking') {
    // Retrieve the leaderboard data from the database
   getLeaderboard((rows) => {
      // Format the global ranking as a string
      let globalRanking = 'Wordle Global Ranking:\n\n';
      rows.forEach((row, index) => {
        if (index === 0) {
          globalRanking += `🥇: ${row.user} - Score: ${row.score}\n`;
        } else if (index === 1) {
          globalRanking += `🥈: ${row.user} - Score: ${row.score}\n`;
        } else if (index === 2) {
          globalRanking += `🥉: ${row.user} - Score: ${row.score}\n`;
        } else {
          globalRanking += `${index + 1}.   ${row.user} - Score: ${row.score}\n`;
        }
      });
      
      // Send the global ranking to the channel
      message.channel.send(globalRanking);
    });
  }
});




// Log in to Discord using the bot token
client.login(process.env.DISCORD_TOKEN);
