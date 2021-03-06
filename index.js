require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', msg => {
  if (!msg.member.user.bot) {
    const args = msg.content.slice(prefix.length).split(/ +/)
    let command = args.shift().toLowerCase()
    if (
      client.user.id === '708400631441784843' &&
      !client.commands.has(command)
    ) {
      command = 'camel'
      try {
        client.commands.get(command).execute(msg, args)
        return
      } catch (err) {
        console.log(err)
      }
    }

    if (!client.commands.has(command)) return

    try {
      client.commands.get(command).execute(msg, args)
    } catch (err) {
      console.error(err)
      msg.reply('Error with command')
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
