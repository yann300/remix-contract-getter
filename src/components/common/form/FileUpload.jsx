import React from "react";

const BlockChainUploadItem = ({ acceptedFiles }) => {
    return acceptedFiles.map(file => <li key={file.name}>{file.name} - {file.size} bytes</li>);
};

export const FileUpload = ({ acceptedFiles, getRootProps, getInputProps }) => {
    return (
        <div {...getRootProps({ className: 'file-upload form-control d-flex h-100 text-center justify-content-center align-items-center p-5' })}>
            <input {...getInputProps()} />
            {
                acceptedFiles.length < 1 ? (
                    <span>
                        Drag and drop files
                        <br />- or -<br />
                        Click to select files
                    </span>
                ) : (
                        <ul className="list-unstyled m-0">
                            <BlockChainUploadItem acceptedFiles={acceptedFiles} />
                        </ul>
                    )
            }
        </div>
    )
};
