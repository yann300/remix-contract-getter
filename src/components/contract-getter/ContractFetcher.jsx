import React, {useState} from "react";

export const ContractFetcher = ({client}) => {
    const [contractAddress, setContractAddress] = useState('');
    const [metadata, setMetadata] = useState({});
    const [compilerVersion, setCompilerVersion] = useState('');
    const [abi, setAbi] = useState('');
    const [info, setInfo] = useState('');

    const fetchContract = async () => {
        try {
            const network = await client.call('network', 'detectNetwork');
            let contract = await fetch(`https://contractrepo.komputing.org//repository/contract/byChainId/${network.id}/${contractAddress}/metadata.json`);
            console.log(contract);
            if (!contract) return setInfo(`ŝource of ${contractAddress} not found on network ${network.id}`);
            if (!contract.ok) return setInfo(`${contract.statusText}. Network: ${network.name}`);

        } catch (e) {
            console.log(e);
            setInfo(e.message);
        }
    }

    return (
        <div className="container">
            <div className="card m-4">
                <div className="card-body">
                    <div className="card-header">
                        <h5 className="card-title my-2 text-center">Contract Fetcher</h5>
                    </div>
                    <p className="card-text mt-4 text-center">Input a valid contract address and load the source code in
                        Remix (Please make sure the right network is selected).</p>
                    <form className="d-flex flex-column" onSubmit={fetchContract}>
                        <button type="submit" className="btn btn-primary my-2">Fetch</button>
                    </form>
                    <button className="btn btn-primary my-2" onClick={fetchContract}>Fetch</button>

                </div>
            </div>
        </div>
    )
}
