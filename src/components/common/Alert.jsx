import React from "react";

export const Alert = ({type, heading, children}) => {
    return (
        <div className={`alert alert-${type}`} role="alert">
            <p className={`alert-heading`.concat(children ? "": " mb-0")}>{ heading }</p>
            { children }
        </div>
    )
};
