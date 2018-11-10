/**
 * @module index
 */
'use strict';
const Markup = require('telegraf/markup')

const bot = require('../../../config/telegraf');

const User = require('../../models/user.model');

const Property = require('../../models/property.model');

exports.handle = (req, res) => {
    bot.handleUpdate(req.body);
    res.status(200);
    res.end();
};


bot.start(async (ctx) => {
    try {
        const telegramId = ctx.from.id;
        const user = await User.findByTelegramId(telegramId);
        ctx.reply(`Привет, ${user.name}`,Markup
            .keyboard(['/on','/off'])
            .oneTime()
            .resize()
            .extra());
    } catch (error) {
        ctx.reply("Sorry, you are not authorized");
    }
});

// bot.hears('Оповещения', ctx => {
//     ctx.reply(Markup
//         .keyboard(['Включить', 'Выключить'])
//         .oneTime()
//         .resize()
//         .extra());
// });

bot.command('/on', async ctx => {
    try {
        let alarmEnabled = await Property.get('ALARM_ENABLED');

        if (!alarmEnabled)
        {
            alarmEnabled = new Property({name:'ALARM_ENABLED'});
        }

        alarmEnabled.value = 'true';
        await alarmEnabled.save();

        await ctx.reply("Alarm has been enabled");
    } catch (e) {
    }
});

bot.command('/off', async ctx => {
    try {
        let alarmEnabled = await Property.get('ALARM_ENABLED');

        if (!alarmEnabled)
        {
            alarmEnabled = new Property({name:'ALARM_ENABLED'});
        }

        alarmEnabled.value = 'false';
        await alarmEnabled.save();

        await ctx.reply("Alarm has been disabled");
    } catch (e) {
    }
});