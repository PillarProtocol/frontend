const style = {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
    borderRadius: '6px',
    paddingBottom: '16px',
    height: 'auto',
    outline: 'none',
    margin: '16px',
    maxHeight: '90vh',
    overflow: 'auto',
};
const vaultFactoryCardStyle = {
    ...style,
    maxWidth: '600px',
};
const addCollateralCardStyle = {
    ...style,
    maxWidth: '600px',
};

const borrowCardStyle = {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
    borderRadius: '6px',
    height: 'auto',
    outline: 'none',
    margin: '16px',
    maxHeight: '90vh',
    overflow: 'auto',
};

const releaseCollateralCardStyle = {
    ...borrowCardStyle,
};

const repayCollateralCardStyle = {
    ...style,
    maxWidth: '600px',
};
const errorStyle = {
    fontFamily: 'Karla',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '17px',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#DA1818',
};

const modalLinkStyle = {
    fontFamily: 'Karla',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
    color: '#359595',
    marginRight: '0px',
    marginLeft: '0px',
};

const backLinkStyle = {
    ...modalLinkStyle,
    cursor: 'pointer',
};
const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        height: '100%',
        width: '100%',
        transform: `translate(-${top}%, -${left}%)`,
    };
};

const modal = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...getModalStyle(),
};
export {
    style,
    errorStyle,
    modalLinkStyle,
    backLinkStyle,
    modal,
    addCollateralCardStyle,
    borrowCardStyle,
    repayCollateralCardStyle,
    vaultFactoryCardStyle,
    releaseCollateralCardStyle,
};
