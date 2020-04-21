import React, { useState } from "react";
import { Dropdown } from "./Dropdown";
import { AddressInput } from "./AddressInput";
import { remixClient } from "../../../remix/RemixClient";
import { chainOptions } from "../../../common/Constants"

export const ContractForm = ({ setLoading, setError, setResult, setChainValue }) => {

    const [chain, setChain] = useState(chainOptions[0]);
    const [address, setAddress] = useState('');
    const [files, setFiles] = useState([]);
    const [isListening, setListening] = useState(false);

    if (!isListening) {
        remixClient.listenOnCompilationFinishedEvent((data) => {
            const contract = data.contract[Object.keys(data.contract)[0]];
    
            const sol = new File([data.source], data.target.replace("browser/", ""), { type: "text/plain" });
            const metadata = new File([contract.metadata], "metadata.json", { type: "text/plain" });
    
            setFiles([sol, metadata]);
        });
        setListening(true);
    }

    const resetState = () => {
        setError(null);
        setResult([]);
        setChainValue(null);
    };

    const handleSubmit = async (e) => {
        resetState();
        e.preventDefault();

        const formData = new FormData();

        formData.append('address', address);
        formData.append('chain', chain.value);

        if (files.length > 0) {
            files.forEach(file => formData.append('files', file));
        }

        setLoading(true);

        try {
            const response = await remixClient.verify(formData);

            if (!!response.data.result.length) {
                setLoading(false);
                setChainValue(chain.value);
                setResult(response.data.result);
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
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <Dropdown chainOptions={chainOptions} chain={chain} setChain={setChain} />
            <AddressInput setAddress={setAddress} />
            {files.length > 0 &&
            <>
            <h6>Files</h6>
            <ul className="text-center list-unstyled border my-2 p-1">
                {files.map(file => <li key={file.name}>{file.name}</li>)}
            </ul>
            </>
            }
            <button type="submit" className="btn btn-primary my-2" disabled={!address}>Verify</button>
        </form>
    )
};
