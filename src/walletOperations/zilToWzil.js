import { waitForTransactionReceipt } from '../components/helpers';
import { COLLATERAL_ONCHAIN_DATA } from '../config';

const onchainTransition = async (zilPay, amount) => {
    console.log({ zilPay, amount });
    const { contracts, utils, blockchain } = window.zilPay;

    //   const zilAmount = utils.units.toQa(parseInt(amount), utils.units.Units.Li);
    const gasPrice = utils.units.toQa('2000', utils.units.Units.Li);
    const gasLimit = utils.Long.fromNumber(9000);

    const contract = contracts.at(COLLATERAL_ONCHAIN_DATA.WZIL.tokenAddress);
    const tx = await contract.call(
        'Mint',
        [],
        {
            amount: `${parseInt(amount)}`,
            gasPrice,
            gasLimit,
        },
        true
    );
    let transactionID = tx.ID;
    const result = await waitForTransactionReceipt(blockchain, transactionID);
    return result;
};

export { onchainTransition as zilToWzilTransition };
