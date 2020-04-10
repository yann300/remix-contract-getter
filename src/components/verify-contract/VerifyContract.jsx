import React, {useState} from "react";
import {VerifyContractForm} from "./form/VerifyContractForm";
import {Alert, Spinner} from "../common";

export const VerifyContract = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    return (
        <div className="container">
            <div className="card m-4">
                <div className="card-body">
                    <div className="card-header">
                        <h5 className="card-title my-2 text-center">Decentralized Metadata and Source Code
                            Repository</h5>
                    </div>
                    <p className="card-text mt-4 text-center">Upload metadata and source files of your contract to make
                        it available.
                        Note that the metadata file has to be exactly the same as at deploy time. Browse repository <a
                            href="#">here</a> or via <a
                            href="https://gateway.ipfs.io/ipns/QmNmBr4tiXtwTrHKjyppUyAhW1FQZMJTdnUrksA9hapS4u">
                            ipfs/ipns gateway.
                        </a>
                    </p>
                    <p className="text-center mb-4">Also if you have any question join us on <a
                        href='https://gitter.im/ethereum/source-verify'>Gitter</a></p>
                    <VerifyContractForm setError={setError}/>
                    {
                        loading && <Spinner/>
                    }
                    {
                        error && <Alert type={'danger'} msg={error}/>
                    }
                    {
                        result && <Alert type={'success'} msg='Success msg'/>
                    }
                    <p className="text-center mt-4">Source code: <a
                        href="https://github.com/ethereum/source-verify/">https://github.com/ethereum/source-verify/</a>
                    </p>
                    <p className="text-center">Feel free to open issues or contribute.</p>
                </div>
            </div>
        </div>
    )
};
