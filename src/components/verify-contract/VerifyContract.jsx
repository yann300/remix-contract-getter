import React, { useState } from "react";
import { ContractForm } from "../common/form/ContractForm";
import { Alert, Spinner } from "../common";
import { REPOSITORY_URL } from '../../common/Constants';

export const VerifyContract = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [chainValue, setChainValue] = useState(null);

    return (
        <div className="card m-2">
            <div className="card-body text-center p-3">
                <div className="card-header">
                    <h6 className="card-title m-0">Decentralized Metadata and Source Code Repository</h6>
                </div>
                <p className="card-text my-2">
                    Upload metadata and source files of your contract to make it available.
                    Note that the metadata file has to be exactly the same as at deploy time. Browse repository <a href={`${REPOSITORY_URL}`}>here</a> or via <a href="https://gateway.ipfs.io/ipns/QmNmBr4tiXtwTrHKjyppUyAhW1FQZMJTdnUrksA9hapS4u">ipfs/ipns gateway.</a>
                </p>
                <p className="mb-3">Also if you have any question join us on <a
                    href='https://gitter.im/ethereum/source-verify'>Gitter.</a></p>
                <ContractForm 
                    setError={setError} 
                    setLoading={setLoading} 
                    setResult={setResult}
                    setChainValue={setChainValue} />
                {
                    loading && <Spinner />
                }
                {
                    error && <Alert type={'danger'} heading={error} />
                }
                {
                    !!result.length && (
                        <Alert type={'success'} heading='Contract successfully verified!'>
                            <p className="m-0 mt-2">
                                View the assets in the <a href={`${REPOSITORY_URL}contract/${chainValue}/${result[0].address}`}> file explorer.
                            </a>
                            </p>
                            {
                                result.length > 1 &&
                                <p>Found {result.length} addresses of this contract: {result.join(', ')}</p>
                            }
                        </Alert>
                    )}
                <p className="my-1">Source code: <a
                    href="https://github.com/ethereum/source-verify/">GitHub</a>
                </p>
                <p className="m-0">Feel free to open issues or contribute.</p>
            </div>
        </div>
    )
};
