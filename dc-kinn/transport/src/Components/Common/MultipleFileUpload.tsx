import React, { useEffect, useState } from 'react'
import { Label, FormFeedback, FormText } from "reactstrap";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';

interface IFileUpload {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    containerClassName?: string,
    labelText?: string,
    onChange?: any,
    containerClass ?: string,
    bodyClass ?: string,
    invalid?: boolean;
    prevFiles?:any;
    maxSizeInMb?:number | undefined;
    helperText?:string;
    error?: string | any;
}   

export const MultipleFileUpload: React.FC<IFileUpload> = (props) => {
    const [files, setFiles] = useState<any>(props.prevFiles || []);

    const handleDeleteFile = (index: any) => {
        const updatedFiles = files.filter((file: any, i: number) => i !== index);
        setFiles(updatedFiles);
        props.onChange(updatedFiles);
    };

    useEffect(() => {
      if(Array.isArray(props.prevFiles) && props.prevFiles?.length > 0){
        setFiles(props.prevFiles)
      }
    }, [props.prevFiles])
    
    function handleAcceptedFiles(newFiles: any) {

        const filteredFiles = newFiles.filter((file: any) => file.size <= (props.maxSizeInMb || 2) * 1024 * 1024); // 2MB in bytes

        if (filteredFiles.length < newFiles.length) {
            const oversizedFiles = newFiles.filter((file: any) => file.size > (props.maxSizeInMb || 2) * 1024 * 1024);
            const oversizedFileNames = oversizedFiles.map((file: any) => file.name).join(', ');
            toast.warning(`Exceed The Document Size , Maximum size is ${props.maxSizeInMb || 2} MB. `);
        }

        setFiles((prev:any)=>([...prev, ...filteredFiles]));
        props.onChange([...files, ...filteredFiles]);
      }

    return (
        <>
           
            <React.Fragment>
                <div className={props.containerClass}>
                    <div className={props.bodyClass || classnames(`tw-border tw-rounded tw-p-2 ${props.error && "tw-border-danger"}`)}>
                        <Dropzone
                            onDrop={(acceptedFiles) => {
                                handleAcceptedFiles(acceptedFiles);
                            }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div className="dropzone dz-clickable tw-m-3">
                                    <div className="dz-message needsclick tw-mb-0 tw-mt-2" {...getRootProps()}>
                                        <div className="tw-mb-1">
                                            <i className="display-8 tw-text-gray-500 ri-upload-cloud-2-fill" />
                                        </div>
                                        <input {...getInputProps()} />
                                        <h6 className="tw-text-gray-500 tw-font-normal">
                                            Drag & Drop Or Select File..
                                        </h6>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                        <div className='tw-px-3'>

                            {files.map((file: any, index: any) => (
                                <div key={index} className='tw-flex tw-justify-between tw-items-center tw-my-2 '>
                                    <div className='tw-overflow-hidden tw-text-nowrap tw-truncate' title={file.name}> {file.name}{' '} </div>
                                    <i className=" tw-text-[#f06548] tw-cursor-pointer ri-delete-bin-5-fill tw-text-sm" onClick={() => handleDeleteFile(index)}></i>
                                </div>
                            ))}
                            </div>
                    </div>
                    {props.helperText && <FormText>{props.helperText}</FormText>}
                    {props.error && <FormFeedback className="tw-block" type="invalid">{props.error}</FormFeedback>}
                </div>
            </React.Fragment>
        </>
    )
}
