import React from "react";
import Select from "react-select";

export const BlockChainSelect = ({chainOptions, chain, setChain}) => {

    return (
        <>
            <Select
                options={chainOptions}
                className="dropdown"
                value={chain}
                onChange={option => setChain(option)}
            />
        </>
    )
};
