require('dotenv').config();
const { verifyKey } = require('discord-interactions');

function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

const startDate = new Date('2023-08-15'); // The date when the game number was 787
const startNumber = 787; // The game number on the start date

function getWordleNumber() {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - startDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const wordleNumber = startNumber + dayDiff;
  return wordleNumber;
}

console.log(`Today's Wordle game number is ${getWordleNumber()}`);

async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);

  // Use dynamic import for node-fetch
  const fetch = (await import('node-fetch')).default;

  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });

  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }

  // return original response
  return res;
}


// Simple method that returns a random emoji from list
function getXTries() {
  const list = ["Haruko's highscore",'L','lmaoo','wordle failure','did u even try???','<:fluffer:1106973284609835119> ',"https://media.discordapp.net/attachments/260457447523745794/923106570680819722/ezgif-5-a8dc09f59a.gif",'???','dumbass','lol','<:kek:956133148318650368>','...',"stop playing this game"];
  return list[Math.floor(Math.random() * list.length)];
}
function getFirstTry() {
  const list = ['<:cerealguy2:956133149329477632> ','W','GOAT','this man cheated','no way','cheated or extremely lucky','holy shit','FIRST TRY???','The Wordle God','DAMNN',"https://tenor.com/view/franzj-sus-gif-23944159"];
  return list [Math.floor(Math.random() * list.length)];
}
function getSecondTry() {
  const list = ['W','Congrats :3','the goat','gambling or skill???','NICE','WIN','Second try!','epic win','ez win','haruko could never','hes da wodlar','sexo',"so much win"];
  return list [Math.floor(Math.random() * list.length)];
}
function getThridTry() {
  const list = ['okok','hes the captain now','win','ok hes actually trying','nice','<:notbad:956133151426629644> ',"https://tenor.com/view/nice-gif-24544674","https://tenor.com/view/reddit-reddit-gold-kind-stranger-slot-machine-gif-9286172767555917428","https://tenor.com/view/nodding-soyjak-pissluffare-soy-gif-25061889",'nice 3rd try','let this man wordle','okok hes wordling','win',"common W",];
  return list [Math.floor(Math.random() * list.length)];
}
function getForthTry() {
  const list = ["https://tenor.com/view/eggwuh-egg-roll-it-comes-with-eggroll-gif-23569160","https://tenor.com/view/mid-its-mid-ugly-nah-gif-19839131","<:sleep:1139627395356315739>","average ass score"];
  return list [Math.floor(Math.random() * list.length)];
}
function getFifthTry() {
  const list = ["https://tenor.com/view/nas-smh-nasir-jones-nope-gif-14716760",'<:facepalm:956133153356021780> ','<:comeon:1070056414082519070> ',"https://tenor.com/view/byuntear-sad-sad-cat-cat-meme-gif-25617057","https://tenor.com/view/spongebob-squarepants-laugh-knee-slapper-gif-3463839",'fail','haruko?','common L','<:ohgodwhy:956133150835245098> ','<:kill:1055230481941155930> ','L','dont let this man play again','wordle failure'];
  return list [Math.floor(Math.random() * list.length)];
}
function getSixthTry() {
  const list = ["https://tenor.com/view/drake-computer-notebook-explaning-gif-21152267",'<:scarm:1134858801120542770> ',"https://media.discordapp.net/attachments/956150012474175558/1140390046562779317/huskidork_-_1690544635641278464.gif",'L','failure','good luck tomorrow','laugh at this man','smh','???','...','idiot','this man is r','loser','no'];
  return list [Math.floor(Math.random() * list.length)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



module.exports = {
  VerifyDiscordRequest,
  DiscordRequest,
  getXTries,
  getFirstTry,
  getSecondTry,
  getThridTry,
  getForthTry,
  getFifthTry,
  getSixthTry,
  getWordleNumber,
  capitalize
};
