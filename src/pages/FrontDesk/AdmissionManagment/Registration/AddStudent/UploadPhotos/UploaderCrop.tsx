import React, { useEffect, useRef, useState } from "react";
import ReactCrop, {
    Crop,
    PixelCrop,
} from 'react-image-crop';
import classnames from "classnames";
import { useModal } from "../../../../../../hooks/modalhook";
import { FormFeedback, FormText, Label } from "reactstrap";
import { ModalContainerUpdated } from "../../../../../../Components/Common";
import 'react-image-crop/dist/ReactCrop.css'
import { acceptedImageFile, uploadFileErrorHndlr, validateDimension } from "./helper";
import CropModal from "./CropModal";

export default function UploaderV2(props: any) {
    const { uploadedFileInfo, newFileUploadHandler, isLoading, isViewMode = false, isCropImg = false } = props;
    const inputFileRef = useRef<any>(null);
    const [imgUrl, setImgUrl] = useState<string>('')
    const { closeModal, modalState, openModal } = useModal()
    const [uploadFileState, setUploadFileState] = useState({
        fileName: "",
        previewUrl: "",
    });
    const uploadedFileRef = useRef<any>(null);

    useEffect(() => {
        if (uploadedFileInfo) {
            const { previewUrl } = uploadFileState;
            const { downloadUrl } = uploadedFileInfo || {}
            URL.revokeObjectURL(previewUrl);

            if (uploadedFileInfo?.isUploaded) {
                setUploadFileState({
                    fileName: uploadedFileInfo?.fileName,
                    previewUrl: uploadedFileInfo?.downloadUrl
                })
                setImgUrl(downloadUrl)
            }
        }
    }, [uploadedFileInfo]);

    function uploadHandler(event: any) {
        const uploadFileId = event.currentTarget.getAttribute("data-id");
        if (uploadFileId) {
            props.uploadFileHandler(props.uploadFileId, uploadFileState.fileName, uploadedFileRef.current);
        }
    }

    function changeFileHandler(e: any) {
        const file = e.target.files[0],
            errorMessage = uploadFileErrorHndlr(file.size, file.type);
        uploadedFileRef.current = null;
        if (errorMessage) {
            setUploadFileState({
                fileName: "",
                previewUrl: ""
            });
            setImgUrl('');
            newFileUploadHandler(props.uploadFileId, errorMessage);
        } else {
            const reader = new FileReader()

            reader.addEventListener('load', () => {
                openModal({
                    imageName: e.target.files[0].name,
                    imageType: file.type,
                    imageSrc: reader.result?.toString() || ''
                })
            })

            reader.readAsDataURL(e.target.files[0])
        }

    }

    function onClick() {
        if (inputFileRef?.current && inputFileRef?.current?.value) {
            inputFileRef.current.value = null;
        }
    }

    function uploadCroppedImgHndlr(blobFile: any) {
        const { imageName } = modalState.modalData;
        setImgUrl(URL.createObjectURL(blobFile))
        const newImage = new File([blobFile], blobFile.name, { type: blobFile.type });
        console.log('cropped', { size: newImage.size, type: newImage.type });
        setUploadFileState({
            fileName: imageName,
            previewUrl: ""
        });
        uploadedFileRef.current = newImage;
        newFileUploadHandler(props.uploadFileId, "")
        closeModal();
    }

    return (
        <>
            <div className={classnames("ngfile-uploader tw-mb-3", props.formgroupClassName)}>
                <div className="upload-max-width">
                    {props.labelText && (
                        <Label className={`${props.labelClass}`}>
                            {props.labelText}
                        </Label>
                    )}
                    <div className={classnames("upload-container tw-overflow-hidden", props.uploaderClassName)}>
                        <div className="file-info">
                            <input
                                type="file"
                                id={props.uploadFileId}
                                ref={inputFileRef}
                                onClick={onClick}
                                name={props.uploadFileId}
                                className="tw-hidden"
                                onChange={changeFileHandler}
                                accept={acceptedImageFile.join(',')}
                            />
                            <label
                                htmlFor={props.uploadFileId}
                                className={classnames("upload-btn-label", {
                                    "isDisabled": (isViewMode || uploadedFileInfo?.isDisabled || isLoading) || false
                                })}
                            >
                                <div className={classnames("upload-label-btn", props.uploadBtnClassName, { "error-upload": !!props.error })}>
                                    <div className="file-name">{uploadFileState.fileName || "No file selected."}</div>
                                    <i className="plus-icon ri-add-circle-line"></i>
                                </div>
                            </label>
                            {uploadedFileInfo?.isUploaded && (
                                <div className="uploaded-text">
                                    Uploaded.
                                </div>
                            )}
                            {props.error && (
                                <FormFeedback type="invalid" className="tw-block">{props.error}</FormFeedback>
                            )}
                        </div>
                        {!uploadedFileInfo?.isUploaded && (
                            <div className="uploadbtn-container">
                                <button
                                    data-id={props.uploadFileId}
                                    type="button"
                                    onClick={uploadHandler}
                                    disabled={(isViewMode || uploadedFileInfo?.isDisabled || isLoading) || !(uploadedFileRef.current)}
                                    className="btn btn-orange btn-dc">
                                    Upload
                                </button>
                            </div>
                        )}
                        {uploadedFileInfo?.downloadUrl && (
                            <div className="uploadbtn-container">
                                <a href={uploadedFileInfo?.downloadUrl} target="_blank">
                                    <button
                                        data-id={props.uploadFileId}
                                        type="button"
                                        className="tw-bg-gray-100 hover:tw-bg-gray-200 tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-rounded tw-flex tw-items-center">
                                        <i className="tw-text-gray-500 ri-download-2-line tw-mr-1 tw-text-base"></i> Download
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {!!imgUrl && (
                    <div className="preview-container">
                        <img
                            src={imgUrl}
                            alt="Crop Image"
                            className="preview-img"
                        />
                    </div>
                )}
            </div>
            <ModalContainerUpdated
                id="upload-new-image-modal"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={"Upload Image"}
                modalSize="md"
            >
                <CropModal
                    closeModalHndler={closeModal}
                    modalData={modalState.modalData}
                    uploadCroppedImgHndlr={uploadCroppedImgHndlr}
                />
            </ModalContainerUpdated>
        </>
    )
}