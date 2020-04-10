import React from "react";
import { useDropzone } from "react-dropzone";

const BlockChainUploadItem = ({acceptedFiles}) => {
    return acceptedFiles.map(file => <li key={file.name}>{file.name} - {file.size} bytes</li>);
};

export const BlockchainUpload = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    console.log(acceptedFiles);

    return (
        <>
            <div {...getRootProps({ className: 'form-control d-flex h-100 text-center justify-content-center align-items-center' })}>
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
                            <BlockChainUploadItem acceptedFiles={acceptedFiles}/>
                        </ul>
                    )
                }
            </div>
        </>
    )
};
