const telegramBot = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const token = require('./config/token');
const bot = new telegramBot(token, {username: 'MonPoteLeBot'});
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const http = require('https');
const express = require('express');
const commandParts = require('telegraf-command-parts');

const catApi = "https://cat-fact.herokuapp.com/facts";
let catData = "";
let messageSent = "";
let CounterBirthDay = 0;

bot.use(telegramBot.log());
bot.use(commandParts());

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
});

bot.help(ctx => ctx.reply("" +
    "schedule ▶️ schedule msg 📫 [DD/MM/YY-HH:mm] [msg]\n" +
    "timekr ▶️ time in Korea 🇰🇷\n" +
    "time ▶️ local time 🇫🇷\n" +
    "cat ▶ Send a 🐱 fact\n" +
    "timear  ▶ time in Argentina 🇦🇷"));


bot.command('schedule', ctx => {
    const arg = ctx.state.command.splitArgs;
    const date = arg[0];
    let checkdate = moment(date, "DD/MM/YY-HH:mm", true);
    let argParsed = arg.splice(1, arg.length).join(' ');
    let timer = 0;

    if (ctx.state.command.splitArgs.length === 1)
        messageSent = "Veuillez indiquer un message";
    else if (moment(date, "DD/MM/YY-HH:mm") < moment())
        messageSent = "La date est déjà passé";
    else if (checkdate.isValid()) {
        messageSent = `Votre message: "${argParsed}" s'enverra le ${date}`;
        timer = (moment(date, "DD/MM/YY-HH:mm") - moment());
    } else
        messageSent = "Date invalide format DD/MM/YY-HH:mm";
    ctx.reply(messageSent);
    if (timer) {
        setTimeout(function () {
            ctx.reply(argParsed);
        }, timer);
    }
});

bot.command('timekr', (ctx => {
    messageSent = momentTimeZone().tz("Asia/Seoul").format("HH:mm:ss");
    messageSent += " 🇰🇷";
    ctx.reply(messageSent);
}));

bot.command('timear', (ctx => {
    messageSent = momentTimeZone().tz("America/Argentina/Buenos_Aires").format("HH:mm:ss");
    messageSent += " 🇦🇷";
    ctx.reply(messageSent);
}));
bot.command('time', (ctx => {
    messageSent = moment().format('HH:mm:ss');
    messageSent += " 🇫🇷";
    ctx.reply(messageSent);
}));

bot.command('cat', (ctx => {
    let idCatFact;
    http.get(catApi, function (response) {
        response.on("data", function (factResolve) {
            catData += factResolve;
        });
        response.on("end", function (err) {
            catData = JSON.parse(catData);
            idCatFact = Math.floor(Math.random() * Math.floor(catData.all.length));
            messageSent = catData.all[idCatFact].text + " 🐱";
            ctx.reply(messageSent);
            catData = "";
        })
    })
}));

bot.on('message', (ctx) => {
    if (ctx.update.message.from.id === 507276943 && moment().format("YYYY/MM/DD") === "2018/11/28") {
        switch (CounterBirthDay) {
            case 0:
                ctx.reply("JOYYYYYYYYEUX ANNNNIVERSSSAIIIIRE MON BRO THEEEEEEEO ❤️");
                break;
            case 1:
                ctx.replyWithPhoto("https://i.ytimg.com/vi/G-oXiAiz_2o/hqdefault.jpg");
                break;
            case 3:
                ctx.reply("🎂🎂🎈🎊🎉🎈🎊🎉🎈🎊🎉🎈🎊🎉🎂🎂");
                break;
            case 4:
                ctx.replyWithSticker("CAADAgADTQYAApb6EgUzSUkAATkoXTcC");
                break;
            case 6:
                ctx.replyWithPhoto("https://goo.gl/images/ztK4Mh");
                break;
            case 7:
                ctx.reply("C'était le dernier mon bro, quand tu veux pour fêter ça ❤️");
        }
        CounterBirthDay++;
    }
});


bot.startPolling();


