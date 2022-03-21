import { BACKEND_SERVICE, WARNINGCONSENT } from '../config';
import { checkUserConsent, postUserConsent } from '../components/routes';

import axios from 'axios';

const checkConsent = async () => {
    const address = window.zilPay.wallet.defaultAccount.bech32;
    let { data, status } = await axios.get(`${BACKEND_SERVICE}${checkUserConsent}/${address}`);

    if (!data.status) {
        let confirmation = window.confirm(WARNINGCONSENT);
        if (!confirmation) {
            window.location.reload();
        }
        const { signature, message, publicKey } = await window.zilPay.wallet.sign(WARNINGCONSENT);
        const { status, data } = await axios.post(`${BACKEND_SERVICE}${postUserConsent}`, {
            signature,
            message,
            publicKey,
        });
        console.log({ status, data });
        if (!data.status) {
            alert('Invalid Signature');
        }
    }

    return { data, status };
};

export { checkConsent };
