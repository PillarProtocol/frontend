import { waitForTransactionReceipt } from '../components/helpers';
import { COLLATERAL_ONCHAIN_DATA } from '../config';

const onchainTransition = async (zilPay, amount) => {
    console.log({ zilPay, amount });
    const { contracts, utils, blockchain } = window.zilPay;

    const zilAmount = utils.units.toQa(0, utils.units.Units.Li);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(COLLATERAL_ONCHAIN_DATA.WZIL.tokenAddress);

    const tx = await contract.call(
        'Burn',
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

export { onchainTransition as wzilToZilTransition };
