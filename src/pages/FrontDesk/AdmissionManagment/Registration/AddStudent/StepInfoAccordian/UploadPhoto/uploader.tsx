import React, { useRef, useState } from "react";
import { NgFileUploader } from "../../../../../../../Components/Common";

export default function Uploader(props: any) {
    const [uploadFileState, setUploadFileState] = useState({
        fileName: "",
        previewUrl: "",
    });
    const uploadedFileRef = useRef<null>(null);

    function uploadHandler(event: any) {
        const dataId = event.currentTarget.getAttribute("data-id");
        if (dataId) {
            props.uploadFileHandler(props.uploadFileId, uploadedFileRef.current);
        }
    }

    function changeFileHandler(event: any) {
        const file = event.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        uploadedFileRef.current = file;
        setUploadFileState({
            fileName: file.name,
            previewUrl: previewUrl
        });
    }

    return (
        <NgFileUploader
            formgroupClassName="mb-3"
            uploadBtnClassName="upload-label-btn-sm"
            labelText={props.labelText}
            name={props.uploadFileId}
            fileName={uploadFileState.fileName}
            previewUrl={uploadFileState.previewUrl}
            onChangeFileHndlr={changeFileHandler}
            uploadHndlr={uploadHandler}
            dataId={props.uploadFileId}
        />
    )
}