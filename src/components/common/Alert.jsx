import React from "react";

export const Alert = ({type, msg}) => {
    return (
        <div className={`alert alert-${type}`} role="alert">{ msg }</div>
    )
};
