import React, {useState} from "react";
import {BlockChainSelect} from "./BlockchainDropdown";
import {Spinner} from "./Spinner";
import {BlockchainAdressInput} from "./BlockchainAddressInput";

export const VerifyContractForm = () => {
    const chainOptions = [
        { value: 'mainnet', label: 'Ethereum Mainnet' },
        { value: 'ropsten', label: 'Ropsten' },
        { value: 'rinkeby', label: 'Rinkeby' },
        { value: 'kovan', label: 'Kovan' },
        { value: 'goerli', label: 'Görli' }
    ];

    const [chain, setChain] = useState(chainOptions[0]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const resetState = () => {
        setError(null);
        setResult(null);
    };

    const validateInput = () => {
      return !!address;
    };

    const handleSubmit = (e) => {
        resetState();
        e.preventDefault();

        if (!validateInput()) return;

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            // setError('error');
            setResult(true);
            console.log('Clicked on submit');
        }, 1000);
    };

    return(
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <BlockChainSelect chainOptions={chainOptions} chain={chain} setChain={setChain}/>
            <BlockchainAdressInput setAddress={setAddress}/>

            <div className="my-4">
                <code style={{display: 'block'}}>
                    {JSON.stringify(chain)}
                </code>
                <code style={{display: 'block'}}>
                    {JSON.stringify({address})}
                </code>
            </div>

            <button type="submit" className="btn btn-primary mb-2">Verify</button>
            {
                loading && <Spinner/>
            }
            {
                error && <div className="alert alert-danger" role="alert">{ error }</div>
            }
            {
                result && <div className="alert alert-success" role="alert">success</div>
            }
        </form>
    )
}
