const telegramBot = require('node-telegram-bot-api');
const token = require('./config/token');
const bot = new telegramBot(token, {polling: true});
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const http = require('https');
const catApi = "https://cat-fact.herokuapp.com/facts";
let catData = "";


bot.on('message', (msg) => {
    let messageSent = "";
    console.log(msg);
    if (msg.text === "timeKr()") {
        messageSent = momentTimeZone().tz("Asia/Seoul").format("HH:mm:ss");
        messageSent += " 🇰🇷";
        bot.sendMessage(msg.chat.id, messageSent);
    } else if (msg.text === "time()") {
        messageSent = moment().format('HH:mm:ss');
        messageSent += " 🇫🇷";
        bot.sendMessage(msg.chat.id, messageSent);
    } else if (msg.text === "command()") {
        messageSent = "timeKr() ▶️ time in Korea 🇰🇷\ntime() ▶️ local time 🇫🇷\ncat() ▶ Send a 🐱 fact";
        bot.sendMessage(msg.chat.id, messageSent);
    } else if (msg.text === "cat()") {
        let idCatFact;
            http.get(catApi, function (response) {
            response.on("data", function (factResolve) {
                catData += factResolve;
            });
            response.on("end", function (err) {
                catData = JSON.parse(catData);
                idCatFact = Math.floor(Math.random() * Math.floor(catData.all.length));
                bot.sendMessage(msg.chat.id, catData.all[idCatFact].text + " 🐱");
                catData = "";
            })
        })
    } else if (msg.text === "nextUpdate()") {
        bot.sendMessage(msg.chat.id, "Generic code, global array of function and description for messages");
    }
});


