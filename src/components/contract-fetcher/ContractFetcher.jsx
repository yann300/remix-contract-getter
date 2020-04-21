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
            const response = await remixClient.fetch(address, chain)
            await remixClient.saveFetchedToRemix(response.metadata, response.contract, address)

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
            setError(e || `Something went wrong!`);
        }
    };
    
    return (
        <div className="card m-2">
            <div className="card-body text-center p-3">
                <div className="card-header">
                    <h6 className="card-title m-0">Contract Fetcher</h6>
                </div>
                <p className="card-text my-2 mb-3">Input a valid contract address and load the source code in
                    Remix (Please make sure the correct network is selected)).</p>    
                    <form className="d-flex flex-column" onSubmit={handleSubmit}>
                    <Dropdown chainOptions={chainOptions} chain={chain} setChain={setChain} />
                    <AddressInput setAddress={setAddress} />
                    <button type="submit" className="btn btn-primary my-2 mb-0" disabled={!address}>Fetch</button>
                </form>
            </div>
        </div>
    )
}
