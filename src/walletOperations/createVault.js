import { waitForTransactionReceipt } from '../components/helpers';
import { COLLATERAL_ONCHAIN_DATA } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, token) => {
    await checkConsent();
    const { contracts, utils, blockchain } = window.zilPay;
    const { tokenAddress, factory } = COLLATERAL_ONCHAIN_DATA[token];
    console.log({ zilPay, token, tokenAddress, factory });

    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(factory);

    let state = await contract.getState();
    console.log({ state });

    const tx = await contract.call(
        'GetNewVault',
        [],
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
    // return {receipt:{success: false}}
};

export { onchainTransition as createVaultOperation };
