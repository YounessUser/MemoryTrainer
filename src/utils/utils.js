const formatNumber = (number) => {
    return Math.round(number*100)/100;
}

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
};

const getTimeNow = () => {
    return +new Date()
}

export {
    formatNumber,
    getRndInteger,
    getTimeNow
}