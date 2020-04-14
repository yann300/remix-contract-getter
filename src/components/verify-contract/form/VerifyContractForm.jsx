import React, {useState} from "react";
import {VerifyContractDropdown} from "./VerifyContractDropdown";
import {VerifyContractAddressInput} from "./VerifyContractAddressInput";
import {VerifyContractFileUpload} from "./VerifyContractFileUpload";
import {useDropzone} from "react-dropzone";

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
            acceptedFiles.forEach(file => formData.append('files', file));
        }

        setLoading(true);
        try{
            fetch(`${serverUrl}`, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    setLoading(false)
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setChainValue(chain.value);
                        setResult(response.result);
                    }
                }).catch(err => {
                setLoading(false);
                setError('Something went wrong!');
            })
        }
        catch(err) {
            console.log('Error: ', err);
            setLoading(false);
            setError('Something went wrong!');
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
