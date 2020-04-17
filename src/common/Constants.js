export const REPOSITORY_URL = process.env.NODE_ENV === 'development' ? 
    process.env.REACT_APP_REPOSITORY_URL : process.env.REPOSITORY_URL;

export const SERVER_URL = process.env.NODE_ENV === 'development' ? 
    process.env.REACT_APP_SERVER_URL : process.env.SERVER_URL;
    
export const chainOptions = [
        { value: 'mainnet', label: 'Ethereum Mainnet' },
        { value: 'ropsten', label: 'Ropsten' },
        { value: 'rinkeby', label: 'Rinkeby' },
        { value: 'kovan', label: 'Kovan' },
        { value: 'goerli', label: 'Görli' }
    ];
