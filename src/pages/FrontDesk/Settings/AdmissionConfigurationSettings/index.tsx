import { useFormik } from "formik";
import { CropModal, ModalContainerUpdated, UploadFileInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import classNames from "classnames";
import ImgPreview from "../../../../assets/imagesdps/directory/image_preview.png";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getApplicationBannerAct, resetApplicationBannerAct, saveApplicationBannerAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import Button from "../../../../Components/Common/Button";

interface FormValues {
    file: File | null;
    filePreviewUrl: string | null;
}

const initialValues: FormValues = {
    file: null,
    filePreviewUrl: null,
};

const AdmissionConfigurationSettings = () => {
    const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
    const dispatch = useAppDispatch()
    const ATTRIBUTE_KEYS = {
        APPLICATION_BANNER: "APPLICATION_BANNER",
    };

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getApplicationBannerResp,
        saveApplicationBannerResp,
        academicAvailabilityErrorResp,
    } = useAppSelector(
        ({ appData, admissionAvailabilityRequest }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getApplicationBannerResp: admissionAvailabilityRequest.getApplicationBannerResp,
            saveApplicationBannerResp: admissionAvailabilityRequest.saveApplicationBannerResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const applicationBannerRef = useRef({
        prevAcademicAvailabilityErrorResp: academicAvailabilityErrorResp,
        prevSaveApplicationBannerResp: saveApplicationBannerResp,
    });

    const applicationBannerGetApi = () => {
        const params = {
            branchId: branchId,
            attributeKey: ATTRIBUTE_KEYS.APPLICATION_BANNER,
        };
        dispatch(getApplicationBannerAct(generateActionPayload("get_banner_img", params)));
    };

    useEffect(() => {
        const { prevAcademicAvailabilityErrorResp, prevSaveApplicationBannerResp } = applicationBannerRef.current || {};

        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorResp !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp || {};
            toast.error(details || "Something went wrong. Please try again later.");
        } else if (saveApplicationBannerResp && prevSaveApplicationBannerResp !== saveApplicationBannerResp) {
            toast.success("Banner Image successfully uploaded");
            dispatch(resetApplicationBannerAct(undefined));
            applicationBannerGetApi();
        }

        applicationBannerRef.current.prevAcademicAvailabilityErrorResp = academicAvailabilityErrorResp;
        applicationBannerRef.current.prevSaveApplicationBannerResp = saveApplicationBannerResp;
    }, [academicAvailabilityErrorResp, saveApplicationBannerResp]);

    const admissionConfigurationForm = useFormik<FormValues>({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!branchId || !instituteId) {
                toast.warning("Branch or Institute ID missing!");
                return;
            }
            if (!values.file) {
                toast.warning("Please select a file before submitting.");
                return;
            }

            const formData = new FormData();
            formData.append("branchId", branchId);
            formData.append("instituteId", instituteId);
            formData.append("attributeKey", ATTRIBUTE_KEYS.APPLICATION_BANNER);
            formData.append("file", values.file);

            if (getApplicationBannerResp) {
                const { temporary, active } = getApplicationBannerResp;
                formData.append("isTemporary", temporary ? "1" : "0");
                formData.append("isActive", active ? "1" : "0");
            }

            dispatch(saveApplicationBannerAct(generateActionPayload("upload_banner_img", undefined, formData)));
        },
    });

    useEffect(() => {
        if (branchId) {
            dispatch(resetApplicationBannerAct(undefined));
            applicationBannerGetApi();
        }
    }, [branchId]);

    useEffect(() => {
        const { prevAcademicAvailabilityErrorResp, prevSaveApplicationBannerResp } = applicationBannerRef.current || {};

        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorResp !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp || {};
            toast.error(details || "Something went wrong. Please try again later.");
        }
        else if (saveApplicationBannerResp && prevSaveApplicationBannerResp !== saveApplicationBannerResp) {
            toast.success("Banner Image successfully uploaded");
            dispatch(resetApplicationBannerAct(undefined));
            applicationBannerGetApi();
        }

        applicationBannerRef.current.prevAcademicAvailabilityErrorResp = academicAvailabilityErrorResp;
        applicationBannerRef.current.prevSaveApplicationBannerResp = saveApplicationBannerResp;
    }, [academicAvailabilityErrorResp, saveApplicationBannerResp]);

    useEffect(() => {
        if (
            getApplicationBannerResp &&
            getApplicationBannerResp.attributeKey === ATTRIBUTE_KEYS.APPLICATION_BANNER
        ) {
            const { s3URL } = getApplicationBannerResp;
            admissionConfigurationForm.setValues({
                file: null,
                filePreviewUrl: s3URL || ImgPreview,
            }, false);
        }
    }, [getApplicationBannerResp]);

    const isSubmitDisabled = () => {
        const { file } = admissionConfigurationForm.values;
        const existingFileName = getApplicationBannerResp?.originalFileName || "";
        if (!file || file.name === existingFileName) {
            return true;
        }

        return false;
    };

    function handleFileUploadHnlr(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        const maxSizeMB = 5;
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file format. Please upload JPG, PNG, WEBP, or SVG only.");
            event.target.value = "";
            return;
        }
        if (file.type !== "image/svg+xml" && file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File size exceeds ${maxSizeMB} MB limit.`);
            event.target.value = "";
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        admissionConfigurationForm.setFieldValue("file", file);
        admissionConfigurationForm.setFieldValue("filePreviewUrl", previewUrl);
        openCropModalState({
            imageSrc: previewUrl,
            imageName: file.name,
            imageType: file.type,
            fieldName: "file",
        });
    }

    function uploadCroppedImgHndlr(blobFile: Blob) {
        const { imageName, imageType } = cropModalState.modalData;
        const newImage = new File([blobFile], imageName, { type: imageType });
        const imgUrl = URL.createObjectURL(newImage);
        admissionConfigurationForm.setFieldValue("file", newImage, false);
        admissionConfigurationForm.setFieldValue("filePreviewUrl", imgUrl, false);
        closeCropModalState();
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Configuration" pageTitle="Admissions" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                            <div className="tw-grid tw-grid-cols-12 tw-items-center">
                                <div className="tw-col-span-6">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Admission Configuration</h4>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-5">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
                                <div className="xl:tw-col-span-4 2xl:tw-col-span-5 tw-col-span-10 tw-mb-1">
                                    <UploadFileInput
                                        name="file"
                                        labelText="Application Sale Banner"
                                        formgroupClassName="tw-mb-0"
                                        labelClass="required"
                                        value={
                                            admissionConfigurationForm.values.file
                                                ? admissionConfigurationForm.values.file.name
                                                : getApplicationBannerResp?.originalFileName || ""
                                        }
                                        onChange={handleFileUploadHnlr}
                                        hideUploadBtn={true}
                                        canRemove={false}
                                        invalid={
                                            admissionConfigurationForm.touched.file &&
                                            !!admissionConfigurationForm.errors.file
                                        }
                                        error={
                                            admissionConfigurationForm.touched.file &&
                                                admissionConfigurationForm.errors.file
                                                ? admissionConfigurationForm.errors.file
                                                : ""
                                        }
                                    />
                                </div>
                                <div className="tw-flex-shrink-0" style={{ display: "contents" }}>
                                    <div
                                        className={classNames(
                                            "tw-flex-shrink-0 tw-ml-2 tw-mt-2 tw-flex tw-items-center",
                                            {
                                                "tw-border-2 tw-border-gray-300 tw-rounded tw-mb-1":
                                                    !!admissionConfigurationForm.values.filePreviewUrl,
                                            }
                                        )}
                                    >
                                        <img
                                            src={
                                                admissionConfigurationForm.values.filePreviewUrl ||
                                                getApplicationBannerResp?.s3URL ||
                                                ImgPreview
                                            }
                                            alt="Preview"
                                            style={{ height: "100px", width: "100px" }}
                                            className="tw-max-w-full tw-h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="tw-grid tw-grid-cols-12 tw-border-t tw-border-gray-200">
                                <div className="tw-col-span-12 tw-flex tw-gap-2 tw-w-auto tw-ml-auto tw-mx-4 tw-mt-3">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => admissionConfigurationForm.handleSubmit()}
                                        disabled={isSubmitDisabled()}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
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
    );
};

export default AdmissionConfigurationSettings;