import { waitForTransactionReceipt } from '../components/helpers';
import { REWARD_CONTRACT } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, epoch) => {
    await checkConsent();
    const { contracts, utils, blockchain } = zilPay;
    console.log({ zilPay, epoch });
    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(REWARD_CONTRACT);

    //   let state = await contract.getState();
    //   console.log({ state });

    const tx = await contract.call(
        'claimReward',
        [
            {
                vname: 'epoch',
                type: 'Uint32',
                value: `${epoch}`,
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

export { onchainTransition as claimRewardTransition };
