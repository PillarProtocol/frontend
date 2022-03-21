import { waitForTransactionReceipt } from '../components/helpers';
import { GZIL_DELEGATION } from '../config';
import { checkConsent } from './checkUserConsent';

const onchainTransition = async (zilPay, newDg) => {
    await checkConsent();
    const { contracts, utils, blockchain } = window.zilPay;
    console.log({ zilPay, newDg });
    const zilAmount = utils.units.toQa(0, utils.units.Units.Zil);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(GZIL_DELEGATION);

    //   let state = await contract.getState();
    //   console.log({ state });

    const tx = await contract.call(
        'UpdateDelegatee',
        [
            {
                vname: 'newDelegatee',
                type: 'ByStr20',
                value: `${newDg}`,
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

export { onchainTransition as changeDelegationTransition };
