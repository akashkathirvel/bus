import standsData from '../data/stands.json';
import i18n from '../data/language.json';

export const utils = {
    geti18n,
    getStand,
    getStands,
    getCookie,
    setCookie,
    getLanguage,
    setLanguage,
    checkIfStandDataExist
};

function getStands() {
    return standsData;
}

function checkIfStandDataExist(stand = ''){
    return !!(standsData.find(s => s.value?.toLowerCase() === stand?.toLowerCase()));
}

function getStand(stand = ''){
    return standsData.find(s => s.value?.toLowerCase() === stand?.toLowerCase());
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

function getLanguage() {
    return getCookie('lang') || 'ta';
}

function setLanguage(language = 'ta') {
    setCookie('lang', language);
}

function geti18n() {
    return i18n[getLanguage()];
}