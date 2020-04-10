import React, {useState} from "react";
import {VerifyContractDropdown} from "./VerifyContractDropdown";
import {VerifyContractAddressInput} from "./VerifyContractAddressInput";
import {VerifyContractFileUpload} from "./VerifyContractFileUpload";
import {useDropzone} from "react-dropzone";

export const VerifyContractForm = ({setLoading, setError, setResult}) => {
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
        setResult(null);
    };

    const handleSubmit = (e) => {
        resetState();
        e.preventDefault();

        const formData = new FormData();

        // add address
        formData.append('address', address);

        // add selected blockchain
        formData.append('chain', chain.value);

        // add selected files to the form data object
        if (acceptedFiles.length > 0) {
            console.log(acceptedFiles);
            acceptedFiles.forEach(file => formData.append('files', file));
        }
        console.log(formData.get('files'));
    };

    return (
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <VerifyContractDropdown chainOptions={chainOptions} chain={chain} setChain={setChain}/>
                <VerifyContractAddressInput setAddress={setAddress}/>
                <VerifyContractFileUpload acceptedFiles={acceptedFiles} getInputProps={getInputProps} getRootProps={getRootProps} />
                <button type="submit" className="btn btn-primary my-2">Verify</button>
            </form>
    )
};
