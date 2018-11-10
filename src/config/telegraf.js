/**
 * @module telegraf
 */
'use strict';

const Telegraf = require('telegraf');

const {url, token, env} = require('./vars');
const Property = require('../api/models/property.model');

const TELEGRAM_TOKEN = Property.names.TELEGRAM_TOKEN;

let options = {};

if (env === 'development') {
    const SocksProxyAgent = require('socks-proxy-agent');
    options = {
        telegram: {
            agent: new SocksProxyAgent('socks://127.0.0.1:9050', true)
        }
    };
}



// exports.getBot = async () => {
//     try {
//         const property = await Property.get(TELEGRAM_TOKEN);
//         return new Telegraf(property.value, options);
//     } catch (error) {
//         if (token) {
//             return new Telegraf(token, options);
//         }
//         error.message = "Telegram token is not provided";
//         throw error;
//     }
// };
const bot = new Telegraf(token, options);
bot.telegram.setWebhook(`${url}/v1/bot${token}`);

module.exports = bot;
