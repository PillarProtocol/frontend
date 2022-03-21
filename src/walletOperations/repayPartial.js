import { waitForTransactionReceipt } from '../components/helpers';

import { COLLATERAL_ONCHAIN_DATA, BACKEND_STAT_SERVICE } from '../config';
import axios from 'axios';

import { priceMsg } from '../components/routes';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, collateral, vaultId, amount) => {
    await checkConsent();
    const { contracts, utils, blockchain } = window.zilPay;
    const { proxy, factory } = COLLATERAL_ONCHAIN_DATA[collateral];

    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(proxy);
    let { data } = await axios.get(`${BACKEND_STAT_SERVICE}${priceMsg}/${collateral}`);
    let { msg, signature } = data;
    console.log({
        zilPay,
        collateral,
        vaultId,
        amount,
        msg,
        signature,
    });

    const tx = await contract.call(
        'RepayFromOracle',
        [
            {
                vname: 'msg',
                type: 'String',
                value: msg,
            },
            {
                vname: 'sign',
                type: 'ByStr64',
                value: signature,
            },
            {
                vname: 'col',
                type: 'String',
                value: collateral,
            },
            {
                vname: 'vaultFactory',
                type: 'ByStr20',
                value: factory,
            },
            {
                vname: 'vaultId',
                type: 'Uint32',
                value: vaultId,
            },
            {
                vname: 'amount',
                type: 'Uint128',
                value: amount,
            },
        ],
        {
            amount: zilAmount,
            gasPrice,
            gasLimit,
        },
        true
    );
    let transactionID = tx.ID;
    const result = await waitForTransactionReceipt(blockchain, transactionID);
    return result;
};

export { onchainTransition as repayPartialTransition };
