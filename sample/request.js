import axios from "axios";

const BASE_URL = 'https://apis.helangyoshi.online';

export function getTgUser() {
    const res = {
        userId: '',
        username: '',
    };
    if (window.Telegram.WebApp) {
        const tgApp = window.Telegram.WebApp;
        if (tgApp.initDataUnsafe.user) {
            const userInfo = tgApp.initDataUnsafe.user;
            res.userId = userInfo.id;
            res.username = userInfo.username;
        }
    }
    return res;
}


export async function fetchPrizes() {
    const url = BASE_URL + "/api/list/prizes";
    const response = await axios.get(url);
    if (!response || !response.data) {
        return { code: 500, data: []};
    }
    return response.data;
}

export async function getPrize(userId) {
    const url = BASE_URL + "/api/getPrize?userTgId=" + userId;
    const response = await axios.get(url);
    if (!response || !response.data) {
        return { code: 500, data: {}};
    }
    return response.data;
}

export async function getPrizeRecords(userId) {
    const url = BASE_URL + "/api/prize/record?userTgId=" + userId;
    const response = await axios.get(url);
    if (!response || !response.data) {
        return { code: 500, data: {}};
    }
    return response.data;
}

export async function prizeSett(params) {
    const url = BASE_URL + "/api/prize/sett";
    const response = await axios.post(url, params, {headers: {'Content-Type': 'application/json'}});
    if (!response || !response.data) {
        return { code: 500, data: {}};
    }
    return response.data;
}


export async function getPrizeTimes(userId) {
    const url = BASE_URL + "/api/prize/times?userTgId=" + userId;
    const response = await axios.get(url);
    if (!response || !response.data) {
        return { code: 500, data: {}};
    }
    return response.data;
}


export async function getCopyLink(userId) {
    const url = BASE_URL + "/api/invite/link?userTgId=" + userId;
    const response = await axios.get(url);
    if (!response || !response.data) {
        return { code: 500, data: {}};
    }
    return response.data;
}