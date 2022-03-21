import { CONNECT_WALLET, CHANGE_DASHBOARD_SELECTOR } from './actionTypes';

export const connectWallet = (content) => ({
    type: CONNECT_WALLET,
    content,
});

export const changeDashboardSelector = (content) => ({
    type: CHANGE_DASHBOARD_SELECTOR,
    content,
});
