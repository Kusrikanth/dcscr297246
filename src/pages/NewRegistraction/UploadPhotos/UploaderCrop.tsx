import React, { useEffect, useRef, useState } from "react";
import ReactCrop, {
    Crop,
    PixelCrop,
} from 'react-image-crop';
import classnames from "classnames";
import { FormFeedback, FormText, Label } from "reactstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { acceptedImageFile, uploadFileErrorHndlr, validateDimension } from "./helper";
import { useModal } from "../../../hooks/modalhook";
import { Button, ModalContainerUpdated } from "../../../Components/Common";

const TO_RADIANS = Math.PI / 180

export async function canvasToBlob(
    fileName: string,
    image: HTMLImageElement,
    crop: Crop,
    scale = 1,
    rotate = 0,
    fileType: string,
) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2
    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.rotate(rotateRads)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )
    // ctx.restore();
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob: any) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            blob.name = fileName;
            resolve(blob);
        }, fileType);
    });
}

export default function UploaderV2(props: any) {
    const { uploadedFileInfo, newFileUploadHandler, isLoading, isViewMode = false, isCropImg = false } = props;
    const inputFileRef = useRef<any>(null);
    const [imgSrc, setImgSrc] = useState('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [imgUrl, setImgUrl] = useState<string>('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(true)
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
        setImgUrl('')
        setScale(1)
        if (errorMessage) {
            setUploadFileState({
                fileName: "",
                previewUrl: ""
            });
            newFileUploadHandler(props.uploadFileId, errorMessage);
        } else {
            if (isCropImg) {
                if (e.target.files && e.target.files.length > 0) {
                    setCrop(undefined)
                    const reader = new FileReader()
                    reader.addEventListener('load', () =>
                        setImgSrc(reader.result?.toString() || ''),
                    )
                    setUploadFileState({
                        fileName: e.target.files[0].name,
                        previewUrl: ""
                    });
                    reader.readAsDataURL(e.target.files[0])
                    uploadedFileRef.current = file;
                    newFileUploadHandler(props.uploadFileId, "")
                    setBtnDisabled(true)
                    openModal(file.type)
                }
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
                        setImgUrl(previewUrl)
                        newFileUploadHandler(props.uploadFileId, "");
                    }
                };
            }
        }

    }

    function onClick() {
        if (inputFileRef?.current && inputFileRef?.current?.value) {
            inputFileRef.current.value = null;
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;

        // Calculate the default crop size
        const maxCropWidth = 200; // Fixed maximum width
        const maxCropHeight = 230; // Fixed maximum height

        // Ensure crop doesn't exceed image dimensions
        const cropWidth = Math.min(width, maxCropWidth);
        const cropHeight = Math.min(height, maxCropHeight);

        // Center the crop
        const x = (width - cropWidth) / 2;
        const y = (height - cropHeight) / 2;

        setCrop({
            unit: 'px', // Use pixel units
            width: cropWidth,
            height: cropHeight,
            x,
            y,
        });
    }

    async function onDownloadCropClick() {
        const image = imgRef.current
        if (!image || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }
        const blobFile: any = await canvasToBlob(uploadFileState.fileName, imgRef.current, completedCrop, scale, 0, modalState.modalData);
        setImgUrl(URL.createObjectURL(blobFile))
        const newImage = new File([blobFile], blobFile.name, { type: blobFile.type });
        uploadedFileRef.current = newImage;
        setScale(1)
        setBtnDisabled(true)
        closeModal()
    }

    const closeModalHndler = () => {
        setUploadFileState({
            fileName: "",
            previewUrl: ""
        });
        setImgUrl('')
        setScale(1)
        setBtnDisabled(true)
        uploadedFileRef.current = null;
        closeModal()
    }

    const onDargEndHndler = (e: PointerEvent) => {
        setBtnDisabled(false)
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
                    <div className={classnames("upload-container overflow-hidden", props.uploaderClassName)}>
                        <div className="file-info">
                            <input type="file"
                                id={props.uploadFileId}
                                ref={inputFileRef}
                                onClick={onClick}
                                name={props.uploadFileId}
                                className="d-none"
                                onChange={changeFileHandler}
                                accept={acceptedImageFile.join(',')}
                            />
                            <label htmlFor={props.uploadFileId} className={classnames("upload-btn-label", {
                                "isDisabled": (isViewMode || uploadedFileInfo?.isDisabled || isLoading) || false
                            })}>
                                <div className={classnames("upload-label-btn", props.uploadBtnClassName, { "error-upload": !!props.error })}>
                                    <div className="file-name">{uploadFileState.fileName || "No file selected."}</div>
                                    <i className="plus-icon ri-add-circle-line"></i>
                                </div>
                            </label>
                            {uploadedFileInfo?.isUploaded && <div className="uploaded-text">
                                Uploaded.
                            </div>}
                            {props.error && (
                                <FormFeedback type="invalid" className="d-block">{props.error}</FormFeedback>
                            )}
                        </div>
                        {!uploadedFileInfo?.isUploaded && <div className="uploadbtn-container">
                            <button
                                data-id={props.uploadFileId}
                                type="button" onClick={uploadHandler}
                                disabled={(isViewMode || uploadedFileInfo?.isDisabled || isLoading) || !(uploadedFileRef.current)}
                                className="btn btn-orange btn-dc">
                                Upload
                            </button>
                        </div>}
                        {uploadedFileInfo?.downloadUrl && <div className="uploadbtn-container">
                            <a href={uploadedFileInfo?.downloadUrl} target="_blank">
                                <button
                                    data-id={props.uploadFileId}
                                    type="button"
                                    className="btn btn-light d-flex align-items-center">
                                    <i className="text-muted ri-download-2-line me-1 fs-16"></i> Download
                                </button>
                            </a>
                        </div>}
                    </div>
                </div>

                {!!imgUrl && (
                    <>
                        <div className='preview-container'>
                            <img
                                src={imgUrl}
                                alt="Crop Image"
                                className="preview-img"
                            />
                        </div>

                    </>
                )}
            </div>
            <ModalContainerUpdated
                id="upload-new-image-modal"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={"Upload Image"}
                modalSize="md"
            >
                <div className='p-3'>
                    <div style={{ height: "350px" }} className='tw-w-full tw-flex tw-justify-center tw-items-center'>
                        {!!imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                // maxWidth={200}
                                // maxHeight={230}
                                // minHeight={230}
                                // minWidth={200}
                                locked
                                onDragEnd={onDargEndHndler}
                                aspect={undefined} // Disable aspect ratio locking
                                style={{ maxHeight: 350 }}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    style={{
                                        transform: `scale(${scale})`,
                                        // maxHeight: "230px",
                                        //  maxWidth: "100%"
                                        // maxHeight: '400px'
                                    }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                    </div>

                    <div className="Crop-Controls tw-mt-2 tw-flex tw-items-center">
                        <label htmlFor="scale-input tw-mt-1">Scale: </label>
                        <input
                            id="scale-input"
                            type="range"
                            step="0.1"
                            className='tw-ms-2 tw-mb-1'
                            min={1}
                            max={5}
                            value={scale}
                            disabled={!imgSrc}
                            onChange={(e) => setScale(Number(e.target.value))}
                        />
                    </div>
                    <div className="form-text text-muted">
                        Note : Please drag the image to crop it.
                    </div>
                    <div className='row'>
                        <div className='tw-flex tw-w-auto tw-ms-auto '>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={closeModalHndler}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={onDownloadCropClick}
                                disabled={btnDisabled}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
            </ModalContainerUpdated>
        </>
    )
}