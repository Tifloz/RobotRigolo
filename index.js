const telegramBot = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const token = require('./config/token');
const bot = new telegramBot(token);
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const http = require('https');
const express = require('express');
const catApi = "https://cat-fact.herokuapp.com/facts";
let catData = "";
let messageSent = "";
let CounterBirthDay = 0;

bot.use(telegramBot.log());

bot.help(ctx => ctx.reply("timeKr ▶️ time in Korea 🇰🇷\ntime ▶️ local time 🇫🇷\ncat ▶ Send a 🐱 fact"));


bot.command('timeKr', (ctx => {
    messageSent = momentTimeZone().tz("Asia/Seoul").format("HH:mm:ss");
    messageSent += " 🇰🇷";
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
        }
        CounterBirthDay++;
    }
});



bot.startPolling();


