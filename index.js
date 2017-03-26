const Discord = require('discord.js');
const client = new Discord.Client({
    owner: '235595819808587776',
});
const settings = require('./settings.json');

var prefix = ">";

client.on('ready', () =>{
    console.log('Admin v1.0.0 Booted Successfully');
});

client.on('channelCreate', channel => {
    channel.sendMessage('New Channel: '+ channel + ' make sure to check it out');
    console.log('['+ channel.createdAt +'] --- Created channel ' + channel.name);
});

client.on('guildMemberAdd', member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage('Welcome ' + member.user + ', You can get Started by reading #rules' );
    console.log('['+ member.joinedTimestamp +'] --- User '+ member.user + ' Joined the guild');
});

client.on('guildMemberRemove', member => {
    let guild = member.guild;
    member.user.dmChannel.sendMessage('Sorry to see you go ' + member.user + ', Hope to see you soon' );
});

client.on('message', message => {

    //check if the messages are meant for the bot and if its not the bot reacting to its own messages.
    if(!message.content.startsWith(prefix)){return;}
    if(message.author.bot){return;}

    //check the args provided
    var args = message.content.split(' ').slice(1);

    //log message recieved
    console.log('[Message Recieved]: \''+ message.author.username + '\' said: ' + message.content);

    //start registring our commands

    if(message.content.startsWith(prefix+"clean")){
        if(args.length < 1){
            message.reply('You did NOT specify enough arguments, use the command as follows: `>del [number of messages to delete]`');
        }
        else{
            args[0] = parseInt(args[0]);
            if(args[0] <= 2){
                message.channel.sendMessage('You can do that manually, Asshole');
            }else if(args[0] > 100){
                message.channel.sendMessage('Sorry, my limit is 100 messages');
            }else{
                message.channel.bulkDelete(args[0]);
                message.channel.sendMessage('Deleted '+args[0]+' messages, Ordered By: '+ message.author.username);
                console.log('Deleted '+args[0]+' messages, Ordered By: '+ message.author.username);
            }
        }
    }else
    
    if(message.content.startsWith(prefix+"ban")){
        if(message.member.hasPermission('BAN_MEMBERS')){
            if(message.mentions.users.first() == undefined){
                message.reply('You did NOT specify enough arguments, use the command as follows: `>ban [@person to be banned]`');
            }else{
                var canbebanned = message.guild.member(message.mentions.users.first()).bannable;
                console.log(canbebanned);
                if(canbebanned){
                    var banned = message.guild.member(message.mentions.users.first()).ban();
                    if(banned){
                        message.reply('User '+ message.mentions.users.first() + ' has been banned');
                    }
                    message.reply('Unable to ban User ' + message.mentions.users.first() );
                }else{
                    message.reply('I do not have the persmissions to ban ' + message.mentions.users.first() );
                }
            }
        }else{
            message.reply('You do not have Ban permissions, sorry i can\'t help you');
        }
    }

    if(message.content.startsWith(prefix+'membersL')){
        guild = message.guild;
        members = guild.members.map(m => m.displayName);
        var result = "\r\n";
        for (i=0;i<members.length;i++){
            members[i] = ' -   ' + members[i];
            result+=members[i]+"\r\n"; //depends on OS
        }
        message.channel.sendMessage('Members ('+ guild.memberCount +'): \n'+ result);
    }
});

client.login(settings.token);