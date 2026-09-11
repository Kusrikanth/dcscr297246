import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { CropModal, ModalContainerUpdated, MultipleFileUpload, SelectInput, UploadFileInput, UploadImageUpdated } from "../../../Components/Common";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { typeMenu } from "./helper";
import { useModal } from "../../../hooks/modalhook";
import ImgPreview from "../../../assets/imagesdps/directory/image_preview.png";
import classNames from "classnames";
import { addBrchLogoAct } from "../../../store/branchsettings/branchinfo/branchinfoactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import Button from "../../../Components/Common/Button";

const initialValues = {
    type: "",
    file: null,
    fileName: "",
    studentPhotoPreviewUrl: "",
};

const validationSchema = Yup.object().shape({
    areas: Yup.array().of(
        Yup.object().shape({
            areaName: Yup.string().required("Name is required."),
            pinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
        })
    ),
});

const AddBranchModal: React.FC<any> = (props) => {

    const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
    const [isFileTooLarge, setIsFileTooLarge] = useState(false);

    const dispatch = useAppDispatch();
    const { currentBranchIdResp: branchId, showApiLoader } = useAppSelector(({ appData, globalData }) => ({

        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

    useEffect(() => {
        if (!props.isOpen) {
            addBranchAreaForm.resetForm();
        }
    }, [props.isOpen]);

    const addBranchAreaForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (!values.file) {
                toast.error("Please upload a photo.");
                return;
            }
            const formData = new FormData();
            formData.append("file", values.file);
            const params = {
                branchId, isTemporary: 0,
                type: values.type,
            };

            dispatch(
                addBrchLogoAct(
                    generateActionPayload("add_brch_logo", params, formData)
                )
            );
        },
    });

    const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

    function uploadFileErrorHndlr(fileSize, fileType) {
        if (!acceptedImageFile.includes(fileType)) {
            return `Upload file should be of format ${acceptedImageFile.join(', ')}`;
        }
        if (!isNaN(fileSize) && fileSize > 2 * 1024 * 1024) {
            return "Upload file should be less than 2MB.";
        }
        return "";
    }

    function handleFileUploadHnlr(event) {
        const { name } = event.target;
        const file = event.target.files[0];
        event.currentTarget.value = null;

        if (!file) return;
        setIsFileTooLarge(false);
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);

        if (errorMessage) {
            if (file.size > 2 * 1024 * 1024) {
                setIsFileTooLarge(true);
            }
            addBranchAreaForm.setFieldTouched(name, true, false);
            addBranchAreaForm.setFieldValue(name, null, false);
            addBranchAreaForm.setFieldValue("fileName", "", false);
            addBranchAreaForm.setFieldValue("studentPhotoPreviewUrl", "", false);
            addBranchAreaForm.setFieldError(name, errorMessage);
            toast.error(errorMessage);
        } else {
            addBranchAreaForm.setFieldError(name, "");
            addBranchAreaForm.setFieldTouched(name, false, false);
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                openCropModalState({
                    imageName: file?.name,
                    imageType: file.type,
                    imageSrc: previewUrl || "",
                });
            };
        }
    }

    function uploadCroppedImgHndlr(blobFile: Blob) {
        const { imageName, imageType } = cropModalState.modalData;
        const newImage = new File([blobFile], imageName, { type: imageType });
        const imgUrl = URL.createObjectURL(newImage);
        addBranchAreaForm.setFieldValue("file", newImage, false);
        addBranchAreaForm.setFieldValue("fileName", imageName, false);
        addBranchAreaForm.setFieldValue("studentPhotoPreviewUrl", imgUrl, false);

        closeCropModalState();
    }

    return (
        <>
            <div className="tw-p-5">
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <SelectInput
                            name="type"
                            labelText="Type"
                            value={addBranchAreaForm.values.type}
                            onChange={addBranchAreaForm.handleChange}
                            menuItems={typeMenu}
                            valueKey="key"
                            textKey="label"
                            formgroupClassName="tw-mb-3"
                            isDisabled={props?.id ? true : false}
                            invalid={addBranchAreaForm.touched.type && addBranchAreaForm.errors.type ? true : false}
                            error={addBranchAreaForm.touched.type && addBranchAreaForm.errors.type ? addBranchAreaForm.errors.type : ""}
                        />
                    </div>

                    <div className="tw-col-span-1">
                        <div className="tw-flex tw-gap-2">
                            <div className="tw-flex-grow">
                                <UploadFileInput
                                    name="file"
                                    labelText="Student Photo"
                                    formgroupClassName="tw-mb-0"
                                    value={addBranchAreaForm.values.fileName || ""}
                                    onChange={handleFileUploadHnlr}
                                    hideUploadBtn={true}
                                    canRemove={false}
                                    invalid={addBranchAreaForm.touched.file && addBranchAreaForm.errors.file ? true : false}
                                    error={addBranchAreaForm.touched.file && addBranchAreaForm.errors.file ? addBranchAreaForm.errors.file : ""}
                                />
                            </div>

                            <div className="tw-flex-shrink-0">
                                <div
                                    className={classNames(
                                        "tw-flex-shrink-0 tw-ml-2 tw-relative tw-overflow-hidden tw-rounded",
                                        {
                                            "tw-border tw-rounded": !!addBranchAreaForm.values.studentPhotoPreviewUrl
                                        }
                                    )}
                                >
                                    <img
                                        src={addBranchAreaForm.values.studentPhotoPreviewUrl || ImgPreview}
                                        style={{ height: "100px", width: "100px" }}
                                        className="tw-object-cover tw-w-full tw-h-full"
                                        alt="Preview"
                                    />
                                </div>
                            </div>
                        </div>

                        {isFileTooLarge && (
                            <span className="tw-text-red-600 tw-font-bold">
                                *File size should not exceed 2 MB
                            </span>
                        )}
                    </div>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={(event: any) => addBranchAreaForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.branchAreaId ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
            <ModalContainerUpdated
                id="upload-new-image-modal"
                isOpen={cropModalState.showModal}
                toggle={closeCropModalState}
                modalTitle={"Upload Image"}
                modalSize="md"
            >
                <CropModal
                    closeModalHndler={closeCropModalState}
                    modalData={cropModalState.modalData}
                    uploadCroppedImgHndlr={uploadCroppedImgHndlr}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default AddBranchModal;