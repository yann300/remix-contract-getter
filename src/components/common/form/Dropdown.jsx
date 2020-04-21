import React from "react";
import Select from "react-select";

export const Dropdown = ({chainOptions, chain, setChain}) => {
    return (
        <Select
            options={chainOptions}
            classNamePrefix="dropdown"
            value={chain}
            onChange={option => setChain(option)}
        />
    )
};
