import { BigNumber as BN } from 'bignumber.js';
import { normaliseAddress, toBech32Address, toChecksumAddress } from '@zilliqa-js/crypto';

function timeDifference(previous, current = new Date().valueOf()) {
    previous = parseInt(previous / 1000);
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return 'approx ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return 'approx ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return 'approx ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function transformTransactionHash(text) {
    return `${text.substring(0, 13)}...`;
}

function transformAddress(text) {
    return `${text.substring(0, 6)}...${text.substring(text.length - 4, text.length)}`;
}

function numberWithCommas(x, decimal = 0) {
    let toDivideBy = new BN(10).exponentiatedBy(decimal);
    let number = new BN(x).div(toDivideBy).toFixed(3);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function numberWithoutCommas(x, decimal = 0) {
    let toDivideBy = new BN(10).exponentiatedBy(decimal);
    return new BN(x).div(toDivideBy).toFixed(3);
}

function getHexAddress(address) {
    return normaliseAddress(address);
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function toBech32(address) {
    return toBech32Address(normaliseAddress(address));
}

function isValidAddress(address) {
    try {
        normaliseAddress(address);
        return true;
    } catch (ex) {
        return false;
    }
}

const induceDelay = (ts, msg = 'Waiting') => {
    let delay = ts || 3000;
    console.log(msg);
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, delay);
    });
};

const waitForTransactionReceipt = async (blockchain, hash) => {
    while (true) {
        try {
            const result = await blockchain.getTransaction(hash);
            return result;
        } catch (ex) {
            console.log(ex);
            await induceDelay(15000, `Waiting for receipt of transaction: ${hash}`);
        }
    }
};
export {
    timeDifference,
    transformAddress,
    transformTransactionHash,
    numberWithCommas,
    numberWithoutCommas,
    waitForTransactionReceipt,
    getHexAddress,
    isFloat,
    toBech32,
    isValidAddress,
    toChecksumAddress,
};
