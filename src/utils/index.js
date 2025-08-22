import standsData from '../data/stands.json';

export const utils = {
    getStand,
    getStands,
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