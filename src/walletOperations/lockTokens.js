import { waitForTransactionReceipt } from '../components/helpers';
import { GZIL_STAKING } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, amount) => {
    await checkConsent();
    const { contracts, utils, blockchain } = zilPay;
    console.log({ zilPay, amount });
    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(GZIL_STAKING);

    //   let state = await contract.getState();
    //   console.log({ state });

    const tx = await contract.call(
        'lockTokens',
        [
            {
                vname: 'amount',
                type: 'Uint128',
                value: `${amount}`,
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

export { onchainTransition as lockTokenTransition };
