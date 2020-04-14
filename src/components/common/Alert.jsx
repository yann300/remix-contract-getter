import React from "react";

export const Alert = ({type, msg, children}) => {
    return (
        <div className={`alert alert-${type}`} role="alert">
            { msg }
            { children }
        </div>
    )
};
