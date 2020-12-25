const { Client } = require('discord.js');
const moment = require('moment');
const express = require('express');
require('dotenv').config();

const getTimeToNewYear = () => moment([(new Date().getFullYear() + 1)]).locale('ru').fromNow(true);

// -== Web server ==-
const app = express();
const keepalive = require('express-glitch-keepalive');

app.use(keepalive);

app.get("/", (_request, response) => {
  response.status(200).send(`Хо! - Хо! - Хо! До Нового Года осталось ${getTimeToNewYear()}!`);
});

app.listen(process.env.PORT);
// -== Web server ==-

// -== Bot client ==-
const client = new Client();

// -== Config ==-
const triggerNames = ['santa', 'санта', 'hoho', 'хохо', 'новый год', 'new year', 'christmas', 'рождество'];
const triggerEmojis = ['🕛', '🦌', '⛄', '☃️', '❄️', '🍾', '🥂', '✨', '🎄', '🎅', '📺', '🎇', '🎆', '🧨', '🛷', '🎁', '🍊', '🎉', '🎊', '⛸', '📦', '💃', '🍽', '🍷', '🍍', '🍓', '🌰', '📅', '🥶', '❶', '❅', '❆', '👯', '★', '☆', '✪', '✫', '✯', '⚝', '⚫', '⚹', '✵', '❉', '❋', '✺', '✹', '✸', '✶', '✷', '✵', '✴', '✴', '✳', '✲', '✱', '✧', '✦', '⍟', '⊛'];
const roleName = 'CHRISTMAS🎉';
// -== Config ==-

const triggerNamesRegex = new RegExp(triggerNames.map((value, index, array) => {
  return (index !== (array.length - 1)) ? `${value}|` : `${value}`;
}).join(''), 'gmi');

const triggerEmojisRegex = new RegExp(triggerEmojis.map((value, index, array) => {
  return (index !== (array.length - 1)) ? `${value}|` : `${value}`;
}).join(''), 'gmi');

const trigger = (content) => (triggerNamesRegex.test(content) || triggerEmojisRegex.test(content));

async function readyEvent() {
  await client.user
    .setPresence({
      activity: {
        name: 'Рождественские песни',
        type: 2,
      },
      status: 'dnd',
    })
    .catch(console.error);
  console.log('Santa is ready! Ho! - Ho! - Ho!');
  await client.generateInvite({
    permissions: ['ADMINISTRATOR', 'MANAGE_ROLES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'CONNECT'],
  })
  .then(link => console.log(`Generated Santa's invite link: ${link}`))
  .catch(console.error);
}


async function messageEvent(message) {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    await message.reply(`Хо! - Хо! - Хо! До Нового Года осталось \`${getTimeToNewYear()}\`!`);
  }

  if (trigger(message.content)) {
    await message.react('🎅').catch(console.error);
  }
}

async function guildCreateEvent(guild) {
  if (guild.me.hasPermission('MANAGE_ROLES')) {
    let role = member.guild.roles.cache.find((value) => value.name === roleName);
    if (!role) {
      await member.guild.roles.create({
        data: {
          name: roleName,
          color: '#ff6666',
        },
        reason: 'Ho! - Ho! - Ho!',
      })
      .then((value) => role = value)
      .catch(console.error);
    }

    if (role)
    {
      if (trigger(member.nickname)) {
        await member.roles.add(role).catch(console.error);
      }
    }
  }
}

async function guildEvent(member) {
  if (member.guild.me.hasPermission('MANAGE_ROLES')) {
    let role = member.guild.roles.cache.find((value) => value.name === roleName);
    if (!role) {
      await member.guild.roles.create({
        data: {
          name: roleName,
          color: '#ff6666',
        },
        reason: 'Ho! - Ho! - Ho!',
      })
      .then((value) => role = value)
      .catch(console.error);
    }

    if (role)
    {
      if (trigger(member.nickname)) {
        await member.roles.add(role).catch(console.error);
      }
    }
  }
}

async function channelEvent(channel) {
  if (channel.type === 'voice') {
    if (trigger(channel.name.toLowerCase())) {
      if (channel.joinable) {
        await channel.join().catch(console.error);
      }
    }
  }
}

client.on('ready', readyEvent);
client.on('message', messageEvent);
client.on('messageUpdate', async (_oldMessage, newMessage) => await messageEvent(newMessage));
client.on('guildCreate', guildCreateEvent);
client.on('guildMemberAdd', guildEvent);
client.on('guildMemberUpdate', async (_oldMember, newMember) => guildEvent(newMember));
client.on('channelCreate', channelEvent);
client.on('channelUpdate', channelEvent);

client.login(process.env.TOKEN);
// -== Bot client ==-
