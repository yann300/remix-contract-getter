import React from "react";

export const BlockchainAdressInput = ({setAddress}) => {

    return (
        <>
            <input className="form-control my-2" type="text" placeholder="Contract Address (required)"
                   onChange={e => setAddress(e.target.value)}/>
        </>
    )
};
