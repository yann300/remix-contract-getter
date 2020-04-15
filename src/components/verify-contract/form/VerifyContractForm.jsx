import React, {useState} from "react";
import {VerifyContractDropdown} from "./VerifyContractDropdown";
import {VerifyContractAddressInput} from "./VerifyContractAddressInput";
import {VerifyContractFileUpload} from "./VerifyContractFileUpload";
import {useDropzone} from "react-dropzone";
import { remixClient } from "../../../remix/RemixClient"

export const VerifyContractForm = ({setLoading, setError, setResult, setChainValue, serverUrl}) => {
    const chainOptions = [
        {value: 'mainnet', label: 'Ethereum Mainnet'},
        {value: 'ropsten', label: 'Ropsten'},
        {value: 'rinkeby', label: 'Rinkeby'},
        {value: 'kovan', label: 'Kovan'},
        {value: 'goerli', label: 'Görli'}
    ];

    const [chain, setChain] = useState(chainOptions[0]);
    const [address, setAddress] = useState('');
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    const resetState = () => {
        setError(null);
        setResult([]);
        setChainValue(null);
    };

    const handleSubmit = async (e) => {
        resetState();
        e.preventDefault();

        const formData = new FormData();

        console.log(address);
        // add address
        formData.append('address', address);

        // add selected blockchain
        formData.append('chain', chain.value);

        // add selected files to the form data object
        if (acceptedFiles.length > 0) {
            acceptedFiles.forEach(file => formData.append('files', file));
        }

        setLoading(true);

        try {
            const response = await remixClient.verify(formData);
            // console.log('test')
            console.log(response.result)

            if (!!response.result) {
                setLoading(false);
            }
            // console.log(response);
        } catch (e) {
            console.log(e);
            console.log('error')
        }
    };

    return (
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <VerifyContractDropdown chainOptions={chainOptions} chain={chain} setChain={setChain}/>
                <VerifyContractAddressInput setAddress={setAddress}/>
                <VerifyContractFileUpload acceptedFiles={acceptedFiles} getInputProps={getInputProps} getRootProps={getRootProps} />
                <button type="submit" className="btn btn-primary my-2" disabled={!address}>Verify</button>
            </form>
    )
};
