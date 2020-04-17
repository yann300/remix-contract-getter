import React, {useState} from "react";
import { Dropdown } from "../common/form/Dropdown"
import { AddressInput } from "../common/form/AddressInput"
import { chainOptions } from "../../common/Constants"
import { remixClient } from "../../remix/RemixClient"
 
export const ContractFetcher = () => {
    const [chain, setChain] = useState(chainOptions[0]);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chainValue, setChainValue] = useState(null);
    const [result, setResult] = useState([]);
    const [contractAddress, setContractAddress] = useState('');
    const [metadata, setMetadata] = useState({});
    const [compilerVersion, setCompilerVersion] = useState('');
    const [abi, setAbi] = useState('');
    const [info, setInfo] = useState('');

    const resetState = () => {
        setError(null);
        setResult([]);
        setChainValue(null);
    };

    const handleSubmit = async (e) => {
        resetState();
        e.preventDefault();

        setLoading(true);

        try {
            const response = await remixClient.fetch(address, chain.value)

            if (!!response.metadata) {
                setLoading(false);
                setChainValue(chain.value);
                setResult(response);
            } else {
                setLoading(false);
                setError(`Something went wrong!`);
            }

        } catch (e) {
            setLoading(false);
            setError(e.response.data.error || `Something went wrong!`);
        }
    };
    
    return (
        <div className="container">
            <div className="card m-4">
                <div className="card-body">
                    <div className="card-header">
                        <h5 className="card-title my-2 text-center">Contract Fetcher</h5>
                    </div>
                    <p className="card-text mt-4 text-center">Input a valid contract address and load the source code in
                        Remix (Please make sure the right network is selected).</p>
                    
                        <form className="d-flex flex-column" onSubmit={handleSubmit}>
                        <Dropdown chainOptions={chainOptions} chain={chain} setChain={setChain} />
                        <AddressInput setAddress={setAddress} />
                        <button type="submit" className="btn btn-primary my-2" disabled={!address}>Fetch</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
