import React, { useContext, useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "reactstrap";
import { StepperFormContext } from "../helper";
import { CropModal, ModalContainerUpdated, TextInput, UploadFileInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, CircleArrowRight01Icon, CircleArrowLeft01Icon, FavouriteIcon, IdentityCardIcon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getGeneralInformationByIdAct, saveSurroundingAct, setUploadFamilySurroundingPhotoAct, setUploadStudentSurroundingPhotoAct, updateSurroundingAct, uploadFamilySurroundingPhotoAct, uploadStudentSurroundingPhotoAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import classNames from "classnames";
import ImgPreview from "../../../../../assets/imagesdps/directory/image_preview.png";
import * as Yup from "yup";
import { useModal } from "../../../../../hooks/modalhook";
import { toast } from "react-toastify";

const initialValues = {
    aspiration: "",
    studentPhoto: null,
    studentPhotoPreviewUrl: null,
    familyPhoto: null,
    familyPhotoPreviewUrl: null,
    photo2: null,
    friends: [
        { id: generateUniqueNumber(), name: "" }
    ],

    color: "",
    flower: "",
    food: "",
    sport: "",
    animal: "",
    subject: ""

}

const validationSchema = Yup.object().shape({
    studentPhoto: Yup.string().required("Student photo is required").nullable(),
    familyPhoto: Yup.string().required("Family photo is required").nullable(),
});
const StudentSurroundings = (props: any) => {
    const { stepId, branchId, entryId } = props;
    const {
        nextStepHndlr,
        submitCurrentFormCllbck,
        tabsData,
        isViewMode,
    } = useContext(StepperFormContext);
    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
    const [isFileTooLarge, setIsFileTooLarge] = useState(false);

    const {

        saveGeneralInformationResp,
        uploadStudentSurroundingPhotoResp,
        uploadFamilySurroundingPhotoResp,
        getGeneralInformationByIdResp,
        saveSurroundingResp

    } = useAppSelector(
        ({ examinationManagement }) => ({

            saveGeneralInformationResp: examinationManagement.saveGeneralInformationResp,
            uploadStudentSurroundingPhotoResp: examinationManagement.uploadStudentSurroundingPhotoResp,
            uploadFamilySurroundingPhotoResp: examinationManagement.uploadFamilySurroundingPhotoResp,
            getGeneralInformationByIdResp: examinationManagement.getGeneralInformationByIdResp,
            saveSurroundingResp: examinationManagement.saveSurroundingResp,

        }),
        shallowEqual
    );

    const studentSurroundingsForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => {

        },
    });


    useEffect(() => {
        if (tabsData?.[stepId]) {
            studentSurroundingsForm.setValues(tabsData[stepId]);
        } 
        else {
            studentSurroundingsForm.setValues(initialValues);
        }
    }, [tabsData, stepId]);


    const saveStudentSurroundings = () => {

            const payload = {
                studentFileId: uploadStudentSurroundingPhotoResp?.data?.id,
                familyFileId: uploadFamilySurroundingPhotoResp?.data?.id,
                friends: studentSurroundingsForm.values.friends.map((friend: any) => (friend.name)),
                favorite: {
                    "color": studentSurroundingsForm.values.color,
                    "flower": studentSurroundingsForm.values.flower,
                    "food": studentSurroundingsForm.values.food,
                    "sport": studentSurroundingsForm.values.sport,
                    "animal": studentSurroundingsForm.values.animal,
                    "subject": studentSurroundingsForm.values.subject
                },
                wantToBe: studentSurroundingsForm.values.aspiration
            }

            if (saveSurroundingResp?.data || getGeneralInformationByIdResp?.studentSurroundingsId) {
                const payload1 = { id: saveSurroundingResp?.data || getGeneralInformationByIdResp?.studentSurroundingsId, ...payload };
                dispatch(updateSurroundingAct(generateActionPayload("save_student_surrounding", { id: saveGeneralInformationResp?.data || entryId }, payload1)));
            } else {
                dispatch(saveSurroundingAct(generateActionPayload("save_student_surrounding", { id: saveGeneralInformationResp?.data || entryId }, payload)));
            }

    };

    const handleNext = () => {
            saveStudentSurroundings();
            submitCurrentFormCllbck([], "NEXT_TAB");
            nextStepHndlr(stepId, studentSurroundingsForm.values);
    };

    const handlePrevious = () => {
        dispatch(getGeneralInformationByIdAct(generateActionPayload("get_general_information_by_id", { id: saveGeneralInformationResp?.data || entryId }, undefined)));

        submitCurrentFormCllbck([], "PREVIOUS_TAB");
        nextStepHndlr(stepId, studentSurroundingsForm.values);
    };

    function addNewFriend(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (formikArrayHelpers.current) {
            const nextIndex = (studentSurroundingsForm.values.friends.length || 0) + (props.dataLength || 0);
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                name: "",
                domainIndex: String(nextIndex + 1),
            });
        }
    }

    useEffect(() => {
        if (saveGeneralInformationResp?.data || entryId) {
            dispatch(getGeneralInformationByIdAct(generateActionPayload("get_general_information_by_id", { id: saveGeneralInformationResp?.data || entryId }, undefined)));
        }
    }, [entryId, saveGeneralInformationResp]);


    function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

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

    function handleFileUploadHnlr(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        event.currentTarget.value = null;

        if (!file) return;
        
        
        const { studentPhotoPreviewUrl } = studentSurroundingsForm.values;
        if (studentPhotoPreviewUrl) {
            URL.revokeObjectURL(studentPhotoPreviewUrl);
        }

        setIsFileTooLarge(false);
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);

        if (errorMessage) {
            if (file.size > 2 * 1024 * 1024) {  
                setIsFileTooLarge(true);
            }
            studentSurroundingsForm.setFieldTouched(name, true, false);
            studentSurroundingsForm.setFieldValue(name, null, false);
            studentSurroundingsForm.setFieldValue("fileName", "", false);
            studentSurroundingsForm.setFieldValue("studentPhotoPreviewUrl", "", false);
            studentSurroundingsForm.setFieldError(name, errorMessage);
            toast.error(errorMessage);
        } else {
            studentSurroundingsForm.setFieldError(name, "");
            studentSurroundingsForm.setFieldTouched(name, false, false);
            
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                
                const fileKeyName = `${name}File`;
                const filePreviewUrl = `${name}PreviewUrl`;
                
                studentSurroundingsForm.setValues(prevValues => ({
                    ...prevValues,
                    [name]: file?.name,
                    [fileKeyName]: file,
                    [filePreviewUrl]: previewUrl
                }));

                openCropModalState({
                    imageName: file?.name,
                    imageType: file.type,
                    imageSrc: previewUrl || "",
                    fieldName: name, 
                });
            };
        }
    }

    function uploadCroppedImgHndlr(blobFile: Blob) {
        const { imageName, imageType, fieldName } = cropModalState.modalData;
        const newImage = new File([blobFile], imageName, { type: imageType });
        const imgUrl = URL.createObjectURL(newImage);
        
        const fileKeyName = `${fieldName}File`;
        const filePreviewUrl = `${fieldName}PreviewUrl`;
        
        studentSurroundingsForm.setFieldValue(fieldName, imageName, false);
        studentSurroundingsForm.setFieldValue(fileKeyName, newImage, false);
        studentSurroundingsForm.setFieldValue(filePreviewUrl, imgUrl, false);

        if (fieldName === "studentPhoto") {
            const formData = new FormData();
            formData.append("file", newImage);
            dispatch(uploadStudentSurroundingPhotoAct(generateActionPayload("upload_student_surrounding_photo", { branchId }, formData)));
        }
        else if (fieldName === "familyPhoto") {
            const formData = new FormData();
            formData.append("file", newImage);
            dispatch(uploadFamilySurroundingPhotoAct(generateActionPayload("upload_student_surrounding_photo", { branchId }, formData)));
        }

        closeCropModalState();
    }


    useEffect(() => {
        if (getGeneralInformationByIdResp) {
            studentSurroundingsForm.setFieldValue("aspiration", getGeneralInformationByIdResp?.wantToBe || "");
            studentSurroundingsForm.setFieldValue("color", getGeneralInformationByIdResp?.favorite?.color || "");
            studentSurroundingsForm.setFieldValue("flower", getGeneralInformationByIdResp?.favorite?.flower || "");
            studentSurroundingsForm.setFieldValue("food", getGeneralInformationByIdResp?.favorite?.food || "");
            studentSurroundingsForm.setFieldValue("sport", getGeneralInformationByIdResp?.favorite?.sport || "");
            studentSurroundingsForm.setFieldValue("animal", getGeneralInformationByIdResp?.favorite?.animal || "");
            studentSurroundingsForm.setFieldValue("subject", getGeneralInformationByIdResp?.favorite?.subject || "");
            if (getGeneralInformationByIdResp?.friends && getGeneralInformationByIdResp?.friends.length > 0) {
                const friends = getGeneralInformationByIdResp.friends.map((friendName: string) => ({
                    id: generateUniqueNumber(),
                    name: friendName,
                }));
                studentSurroundingsForm.setFieldValue("friends", friends);
            }
            if (getGeneralInformationByIdResp?.studentFileBase64 ? getGeneralInformationByIdResp?.studentFileBase64 : getGeneralInformationByIdResp?.studentImageBase64) {
                const base64Image = `data:image/png;base64,${ getGeneralInformationByIdResp?.studentFileBase64 ? getGeneralInformationByIdResp?.studentFileBase64 : getGeneralInformationByIdResp?.studentImageBase64}`;

                try {
                    fetch(base64Image)
                        .then(res => res.blob())
                        .then(blob => {
                            const previewUrl = URL.createObjectURL(blob);

                            const file = new File([blob], 'student-photo.png', { type: 'image/png' });

                            studentSurroundingsForm.setFieldValue("studentPhoto", "student-photo.png");
                            studentSurroundingsForm.setFieldValue("studentPhotoFile", file);
                            studentSurroundingsForm.setFieldValue("studentPhotoPreviewUrl", previewUrl);
                        })
                        .catch(error => {
                            console.error('Error converting base64 to blob:', error);
                            studentSurroundingsForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
                        });
                } catch (error) {
                    console.error('Error processing base64 image:', error);
                    studentSurroundingsForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
                }
            }
            if (getGeneralInformationByIdResp?.familyFileBase64) {
                const base64Image = `data:image/png;base64,${getGeneralInformationByIdResp?.familyFileBase64}`;

                try {
                    fetch(base64Image)
                        .then(res => res.blob())
                        .then(blob => {
                            const previewUrl = URL.createObjectURL(blob);

                            const file = new File([blob], 'student-photo.png', { type: 'image/png' });

                            studentSurroundingsForm.setFieldValue("familyPhoto", "family-photo.png");
                            studentSurroundingsForm.setFieldValue("familyPhotoFile", file);
                            studentSurroundingsForm.setFieldValue("familyPhotoPreviewUrl", previewUrl);
                        })
                        .catch(error => {
                            console.error('Error converting base64 to blob:', error);
                            studentSurroundingsForm.setFieldValue("familyPhotoPreviewUrl", base64Image);
                        });
                } catch (error) {
                    console.error('Error processing base64 image:', error);
                    studentSurroundingsForm.setFieldValue("familyPhotoPreviewUrl", base64Image);
                }
            }
        }
    }, [getGeneralInformationByIdResp]);

    useEffect(() => {
        return () => {
            dispatch(setUploadFamilySurroundingPhotoAct(undefined))
            dispatch(setUploadStudentSurroundingPhotoAct(undefined))
        }
    }, [])

    return (
        <> 
            <div>
                <UncontrolledAccordion
                    open="studentSurroundingsAspiration"
                    defaultOpen={[
                        "studentSurroundingsAspiration",
                        "studentFavorites",
                    ]}
                    stayOpen
                >
                    {/* Student's Surroundings & Aspiration */}
                    <AccordionItem>
                        <AccordionHeader tag="h5" targetId="studentSurroundingsAspiration">
                            <div className="d-flex align-items-center">
                                <HugeiconsIcon
                                    icon={IdentityCardIcon}
                                    size={22}
                                    className="me-2"
                                    style={{ color: "#0ab39c" }}
                                />
                                <div className="fw-bold">Student's Surroundings & Aspiration</div>
                            </div>
                        </AccordionHeader>
                        <AccordionBody accordionId="studentSurroundingsAspiration">
                            <div className="row">
                                <div className="col-12">
                                    <TextInput
                                        name="aspiration"
                                        labelText="I want to be a"
                                        value={studentSurroundingsForm.values.aspiration}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter your aspiration"
                                        isDisabled={isViewMode}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="col-12 col-xl-6 mb-1 d-flex ">

                                <div className="tw-flex-grow">
                                    <UploadFileInput
                                        name="studentPhoto"
                                        labelText="Student Photo"
                                        formgroupClassName="mb-0"
                                        labelClass="required"
                                        value={studentSurroundingsForm.values.studentPhoto || ""}
                                        onChange={handleFileUploadHnlr}
                                        hideUploadBtn={true}
                                        canRemove={false}
                                        invalid={(studentSurroundingsForm.touched.studentPhoto && studentSurroundingsForm.errors.studentPhoto) ? true : false}
                                        error={(studentSurroundingsForm.touched.studentPhoto && studentSurroundingsForm.errors.studentPhoto) ? studentSurroundingsForm.errors.studentPhoto : ""}
                                    />
                                </div>
                                <div className="flex-shrink-0 " style={{ display: "contents" }}>
                                    <div className={classNames("flex-shrink-0 preview-img ms-2 ", { "border border-2 rounded mb-1": !!studentSurroundingsForm.values.studentPhotoPreviewUrl })}>
                                        <img src={studentSurroundingsForm.values.studentPhotoPreviewUrl || ImgPreview} style={{ height: "100px", width: "100px" }} className="img-fluid" />
                                    </div>
                                </div>
                                </div>

                                <div  className="col-12 col-xl-6 mb-1 d-flex ">

                                <div className="tw-flex-grow">
                                    <UploadFileInput
                                        name="familyPhoto"
                                        labelText="Family Photo"
                                        formgroupClassName="mb-0"
                                        labelClass="required"
                                        value={studentSurroundingsForm.values.familyPhoto || ""}
                                        onChange={handleFileUploadHnlr}
                                        hideUploadBtn={true}
                                        canRemove={false}
                                        invalid={(studentSurroundingsForm.touched.studentPhoto && studentSurroundingsForm.errors.studentPhoto) ? true : false}
                                        error={(studentSurroundingsForm.touched.studentPhoto && studentSurroundingsForm.errors.studentPhoto) ? studentSurroundingsForm.errors.studentPhoto : ""}
                                    />
                                </div>
                                <div className="flex-shrink-0 " style={{ display: "contents" }}>
                                    <div className={classNames("flex-shrink-0 preview-img ms-2 ", { "border border-2 rounded mb-1": !!studentSurroundingsForm.values.familyPhotoPreviewUrl })}>
                                        <img src={studentSurroundingsForm.values.familyPhotoPreviewUrl || ImgPreview} style={{ height: "100px", width: "100px" }} className="img-fluid" />
                                    </div>
                                </div>
                                </div>
                                
                            </div>

                            {/* Student's Friends Section */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold mb-0">Student's Friends</h6>
                                        <button
                                            type="button"
                                            className="!tw-bg-[#5DA1C8] !tw-text-white !tw-text-sm btn-sm !tw-rounded-lg !tw-px-6 !tw-py-2"
                                            onClick={addNewFriend}
                                            disabled={isViewMode}
                                        >
                                            <HugeiconsIcon
                                                icon={PlusSignIcon}
                                                size={14}
                                                className="me-2"
                                                style={{ color: "#ffffff" }}
                                            />
                                            Add New
                                        </button>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 !tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                                            <FormikProvider value={studentSurroundingsForm}>
                                                <FieldArray name="friends">
                                                    {(arrayHelpers: ArrayHelpers) => {
                                                        if (!formikArrayHelpers.current) {
                                                            formikArrayHelpers.current = arrayHelpers;
                                                        }
                                                        return (
                                                            <>
                                                                {studentSurroundingsForm.values.friends.length >
                                                                    0 &&
                                                                    studentSurroundingsForm.values.friends.map(
                                                                        (friends: any, index: any) => {
                                                                            return (
                                                                                <div
                                                                                    key={friends.uniqueId}
                                                                                    className="row g-3 mb-3"
                                                                                >
                                                                                    <div className="col-11">
                                                                                        <TextInput
                                                                                            name={`friends[${index}].name`}
                                                                                            formgroupClassName="mb-0"
                                                                                            value={friends.name}
                                                                                            onChange={studentSurroundingsForm.handleChange}
                                                                                            labelText={`${index + 1}. Friend`}
                                                                                            maxLength={500}

                                                                                        />
                                                                                    </div>
                                                                                    <div className="col d-flex">
                                                                                        <div className="hstack mt-4">
                                                                                            {index !== 0 && (
                                                                                                <button
                                                                                                    data-index={index}
                                                                                                    onClick={removeDepartmentHndlr}
                                                                                                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                                                                                >
                                                                                                    <HugeiconsIcon
                                                                                                        icon={Delete02StrokeStandard}
                                                                                                        className="text-danger"
                                                                                                        size={18}
                                                                                                    />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                            </>
                                                        );
                                                    }}
                                                </FieldArray>
                                            </FormikProvider>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </AccordionBody>
                    </AccordionItem>


                    {/* Student's Favorites */}
                    <AccordionItem>
                        <AccordionHeader tag="h5" targetId="studentFavorites">
                            <div className="d-flex align-items-center">
                                <HugeiconsIcon
                                    icon={FavouriteIcon}
                                    size={22}
                                    className="me-2"
                                    style={{ color: "#D97705" }}
                                />
                                <div className="fw-bold">Student's Favorites</div>
                            </div>
                        </AccordionHeader>
                        <AccordionBody accordionId="studentFavorites">
                            <div className="row">
                                <div className="col-4">
                                    <TextInput
                                        name="color"
                                        labelText="Color"
                                        value={studentSurroundingsForm.values.color}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite color"
                                        isDisabled={isViewMode}
                                        maxLength={500}

                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="flower"
                                        labelText="Flower"
                                        value={studentSurroundingsForm.values.flower}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite flower"
                                        isDisabled={isViewMode}
                                        maxLength={500}

                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="food"
                                        labelText="Food"
                                        value={studentSurroundingsForm.values.food}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite food"
                                        isDisabled={isViewMode}
                                        maxLength={500}

                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="sport"
                                        labelText="Sport"
                                        value={studentSurroundingsForm.values.sport}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite sport"
                                        isDisabled={isViewMode}
                                        maxLength={500}

                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="animal"
                                        labelText="Animal"
                                        value={studentSurroundingsForm.values.animal}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite animal"
                                        isDisabled={isViewMode}
                                        maxLength={16}

                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="subject"
                                        labelText="Subject"
                                        value={studentSurroundingsForm.values.subject}
                                        onChange={studentSurroundingsForm.handleChange}
                                        placeHolder="Enter favorite subject"
                                        isDisabled={isViewMode}
                                        maxLength={500}

                                    />
                                </div>
                            </div>
                        </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion>

                {!isViewMode && (
                    <div className="row mt-4">
                        <div className="col-12 d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-outline-primary fs-12 px-3"
                                onClick={handlePrevious}
                                disabled={stepId === "generalInformation"}
                            >
                                <HugeiconsIcon
                                    icon={CircleArrowLeft01Icon}
                                    size={20}
                                    color="currentColor"
                                    className="!tw-mr-1"
                                />
                                Previous Step
                            </button>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleNext}
                                >
                                    Next Step <HugeiconsIcon
                                        icon={CircleArrowRight01Icon}
                                        size={20}
                                        color="currentColor"
                                        className="!tw-ml-1"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

export default StudentSurroundings;
