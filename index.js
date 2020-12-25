const { Client } = require('discord.js');
require('dotenv').config();

const client = new Client();

const triggerNames = ['santa', 'санта', 'hoho', 'хохо', 'новый год', 'new year', 'christmas', 'рождество'];
const triggerEmojis = ['🕛', '🦌', '⛄', '☃️', '❄️', '🍾', '🥂', '✨', '🎄', '🎅', '📺', '🎇', '🎆', '🧨', '🛷', '🎁', '🍊', '🎉', '🎊', '⛸', '📦', '💃', '🍽', '🍷', '🍍', '🍓', '🌰', '📅', '🥶', '❶', '❅', '❆', '👯', '★', '☆', '✪', '✫', '✯', '⚝', '⚫', '⚹', '✵', '❉', '❋', '✺', '✹', '✸', '✶', '✷', '✵', '✴', '✴', '✳', '✲', '✱', '✧', '✦', '⍟', '⊛'];

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
        name: 'Merry Christmas',
        type: 2,
      },
      status: 'dnd',
    })
    .catch(console.error);
  console.log('Santa is ready! Ho! - Ho! - Ho!');
}


async function messageEvent(message) {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    await message.reply('Ho! - Ho! - Ho!');
  }

  if (trigger(message.content)) {
    const emoji = triggerEmojis[Math.floor(Math.random() * triggerEmojis.length)];
    await message.react(emoji).catch(console.error);
  }
}

async function guildCreateEvent(guild) {
  if (guild.me.hasPermission('MANAGE_ROLES')) {
    let role;
    const foundRoles = guild.roles.cache.filter((value) => trigger(value));
    if (foundRoles.length === 0) {
      await guild.roles.create({
        data: {
          name: 'CHRISTMAS🎉',
          color: '#ff6666',
        },
        reason: 'Ho! - Ho! - Ho!',
      })
      .then((value) => role = value)
      .catch(() => role = undefined);
    } else {
      role = foundRoles[0];
    }

    if (role)
    {
      for (member of guild.members.cache) {
        if (trigger(member.nickname)) {
          await member.roles.add(role).catch(console.error);
        }
      }
    }
  }
}

async function guildEvent(member) {
  if (member.guild.me.hasPermission('MANAGE_ROLES')) {
    let role;
    const foundRoles = member.guild.roles.cache.filter((value) => trigger(value));
    if (foundRoles.length === 0) {
      await member.guild.roles.create({
        data: {
          name: 'CHRISTMAS🎉',
          color: '#ff6666',
        },
        reason: 'Ho! - Ho! - Ho!',
      })
      .then((value) => role = value)
      .catch(() => role = undefined);
    } else {
      role = foundRoles[0];
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
