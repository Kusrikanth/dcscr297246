import { useFormik } from "formik";
import { CropModal, ModalContainerUpdated, UploadFileInput } from "../../../Components/Common";
import * as Yup from 'yup';
import { useAppDispatch } from "../../../hooks/storehook";
import { uploadFileErrorHndlr, validateDimension } from "./helper";
import classNames from "classnames";
import ImgPreview from "../../../assets/imagesdps/directory/image_preview.png";
import { useModal } from "../../../hooks/modalhook";
import { requestReuploadIdCardAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import Button from "../../../Components/Common/Button";

const initialValues = {
    studentPhoto: "",
    studentPhotoFile: "",
    studentPhotoPreviewUrl: "",
}
const validationSchema = Yup.object().shape({
    studentPhoto: Yup.string().required('Student photo is required.')
})

const ReuploadStudentImage = (props: any) => {
    const dispatch = useAppDispatch();
    const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
    const studentIdCardForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const idCardId = props?.idCardNo?.idCadrNo;
            formData.append("idCardId", idCardId);
            if (values.studentPhotoFile) {
                formData.append("studentPhoto", values.studentPhotoFile);
            }
            dispatch(requestReuploadIdCardAct(generateActionPayload('request_reupload_id_card', undefined, formData)))
        },
    });

    function uploadCroppedImgHndlr(blobFile: any) {
        const { imageName } = cropModalState.modalData;
        const imgUrl = URL.createObjectURL(blobFile)
        const newImage = new File([blobFile], imageName, { type: blobFile.type });
        studentIdCardForm.setValues((prevValues: any) => ({
            ...prevValues,
            studentPhoto: imageName,
            studentPhotoFile: newImage,
            studentPhotoPreviewUrl: imgUrl
        }))
        closeCropModalState();
    }

    function handleFileUploadHnlr(event: any) {
        const { name } = event.target;
        const file = event.target.files?.[0];
        if (!file) return;
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);
        const { studentPhotoPreviewUrl } = studentIdCardForm.values;
        if (studentPhotoPreviewUrl) {
            URL.revokeObjectURL(studentPhotoPreviewUrl);
        }
        if (errorMessage) {
            studentIdCardForm.setFieldTouched(name, true, false);
            studentIdCardForm.setFieldValue(name, "", false);
            studentIdCardForm.setFieldValue(`${name}File`, "");
            studentIdCardForm.setFieldValue(`${name}PreviewUrl`, "");
            studentIdCardForm.setFieldError(name, errorMessage);
            return;
        }
        else {
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                openCropModalState({
                    imageName: file?.name,
                    imageType: file.type,
                    imageSrc: previewUrl || '',
                    cropWidth: 208,
                    cropHeight: 264,
                    rotate: 0,
                })
            }
        }
    }

    return (
        <>
            <form onSubmit={studentIdCardForm.handleSubmit}>
                <div className="tw-p-3">
                    <div className="tw-grid tw-grid-cols-12 tw-py-3">
                        <div className="tw-col-span-12">
                            <div className="tw-flex tw-gap-2">
                                <div className="tw-flex-1">
                                    <UploadFileInput
                                        name="studentPhoto"
                                        labelText="Student Photo"
                                        formgroupClassName="tw-mb-0"
                                        labelClass="required"
                                        value={studentIdCardForm.values.studentPhoto || ""}
                                        onChange={handleFileUploadHnlr}
                                        hideUploadBtn={true}
                                        canRemove={false}
                                        invalid={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? true : false}
                                        error={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? studentIdCardForm.errors.studentPhoto : ""}
                                    />
                                </div>
                                <div className="tw-flex-shrink-0">
                                    <div
                                        className={classNames(
                                            "preview-img tw-flex-shrink-0 tw-ml-2",
                                            {
                                                "tw-border tw-border-2 tw-rounded":
                                                    !!studentIdCardForm.values.studentPhotoPreviewUrl,
                                            }
                                        )}
                                    >
                                        <img src={studentIdCardForm.values.studentPhotoPreviewUrl || ImgPreview} style={{ height: "100px", width: "100px" }} className="img-fluid" />

                                    </div>
                                </div>
                            </div>
                            <span className="tw-text-red-500 tw-font-bold tw-pt-3">
                                *Preferably Digital Photograph of 1MB Size
                            </span>
                        </div>
                    </div>
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="tw-px-3 tw-py-1"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
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

export default ReuploadStudentImage;