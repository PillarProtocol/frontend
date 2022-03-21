import { waitForTransactionReceipt } from '../components/helpers';
import { GZIL_STAKING } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, request) => {
    await checkConsent();
    const { contracts, utils, blockchain } = zilPay;
    console.log({ zilPay, request });
    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(GZIL_STAKING);

    //   let state = await contract.getState();
    //   console.log({ state });

    const tx = await contract.call(
        'withdraw',
        [
            {
                vname: 'requestId',
                type: 'Uint128',
                value: `${request}`,
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

export { onchainTransition as withdrawTokensTransition };
