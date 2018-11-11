/* eslint-disable camelcase */
const axios = require('axios');

exports.vk = async (access_token, user_id) => {
    const url = 'https://api.vk.com/method/getProfileInfo';
    const params = {access_token};
    const response = await axios.get(url, {params});
    const {
        first_name, last_name,
    } = response.data;
    return {
        service: 'vk',
        user_id,
        first_name,
        last_name,
    };
};
