import { waitForTransactionReceipt } from '../components/helpers';
import { PILLAR_TOKEN_ADDRESS, COLLATERAL_ONCHAIN_DATA } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, collateral, amount) => {
    await checkConsent();
    const { contracts, utils, blockchain } = window.zilPay;
    const { factory } = COLLATERAL_ONCHAIN_DATA[collateral];

    const tokenAddress = PILLAR_TOKEN_ADDRESS;
    console.log({ zilPay, collateral, factory, tokenAddress, amount });

    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(tokenAddress);

    //   let state = await contract.getState();
    //   console.log({ state });

    const tx = await contract.call(
        'IncreaseAllowance',
        [
            { vname: 'spender', type: 'ByStr20', value: factory },
            { vname: 'amount', type: 'Uint128', value: `${amount}` },
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

export { onchainTransition as approvePillarOperation };
