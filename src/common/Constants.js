export const REPOSITORY_URL = process.env.NODE_ENV === 'development' ? 
    process.env.REPOSITORY_URL: "https://contractrepostaging.komputing.org/";

export const SERVER_URL = process.env.NODE_ENV === 'development' ? 
    process.env.SERVER_URL : "https://verificationstaging.komputing.org/server";
    
export const chainOptions = [
        { value: 'mainnet', label: 'Ethereum Mainnet' },
        { value: 'ropsten', label: 'Ropsten' },
        { value: 'rinkeby', label: 'Rinkeby' },
        { value: 'kovan', label: 'Kovan' },
        { value: 'goerli', label: 'Görli' }
    ];
