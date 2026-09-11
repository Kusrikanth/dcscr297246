import React, { useEffect, useRef, useState } from "react";
import {
    NgFileUploader
} from "../../../../../../Components/Common";
import { uploadFileErrorHndlr, validateDimension } from "./helper";

export default function Uploader(props: any) {
    const { uploadedFileInfo, newFileUploadHandler, isLoading, isViewMode = false } = props;
    const [uploadFileState, setUploadFileState] = useState({
        fileName: "",
        previewUrl: "",
    });
    const uploadedFileRef = useRef<null>(null);

    useEffect(() => {
        if (uploadedFileInfo) {
            const { previewUrl } = uploadFileState;
            URL.revokeObjectURL(previewUrl);
            if (uploadedFileInfo?.isUploaded) {
                setUploadFileState({
                    fileName: uploadedFileInfo?.fileName,
                    previewUrl: uploadedFileInfo?.downloadUrl
                })
            }
        }
    }, [uploadedFileInfo]);

    function uploadHandler(event: any) {
        const dataId = event.currentTarget.getAttribute("data-id");
        if (dataId) {
            props.uploadFileHandler(props.uploadFileId, uploadFileState.fileName, uploadedFileRef.current);
        }
    }

    function changeFileHandler(event: any) {
        const file = event.target.files[0],
            errorMessage = uploadFileErrorHndlr(file.size, file.type);
        uploadedFileRef.current = null;
        if (errorMessage) {
            setUploadFileState({
                fileName: "",
                previewUrl: ""
            });
            newFileUploadHandler(props.uploadFileId, errorMessage);
        } else {
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                const width = image.width;
                const height = image.height;
                const dimensionError = validateDimension(height, width);
                if (dimensionError) {
                    URL.revokeObjectURL(previewUrl);
                    setUploadFileState({
                        fileName: "",
                        previewUrl: ""
                    });
                    newFileUploadHandler(props.uploadFileId, dimensionError);
                } else {
                    uploadedFileRef.current = file;
                    setUploadFileState({
                        fileName: file.name,
                        previewUrl: previewUrl
                    });
                    newFileUploadHandler(props.uploadFileId, "");
                }
            };
        }
    }

    return (
        <NgFileUploader
            formgroupClassName="tw-mb-3"
            labelText={props.labelText}
            labelClass={props.labelClass}
            uploadBtnClassName="upload-label-btn-sm"
            name={props.uploadFileId}
            fileName={uploadFileState.fileName}
            uploadedFile={uploadedFileRef.current}
            previewUrl={uploadFileState.previewUrl}
            downloadLink={uploadedFileInfo?.downloadUrl}
            isUploaded={uploadedFileInfo?.isUploaded || false}
            onChangeFileHndlr={changeFileHandler}
            uploadHndlr={uploadHandler}
            dataId={props.uploadFileId}
            isDisabled={isViewMode || uploadedFileInfo?.isDisabled || isLoading}
            invalid={props.invalid}
            error={props.error}
        />
    )
}