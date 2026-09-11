import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
//Helper
import { StepperFormContext, stepInfo } from "../helper";
import {
    NgFileUploader
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    uploadRegDocumentAct, getDocumentDetailsByIdAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { getCountriesAct } from "../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../helper";
import {
    uploadRegPhotosAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { toast } from "react-toastify";
import SamplePhoto from "../../../assets/imagesdps/registrations/sample_photo.png";
import SampleSignature from "../../../assets/imagesdps/registrations/sample_signature.png";
import UploaderCrop from "./UploaderCrop";

const reverseMappingKeys: any = {
    "MOTHER PHOTO": "motherPhoto",
    "FATHER PHOTO": "fatherPhoto",
    "STUDENT PHOTO": "studentPhoto",
    "GUARDIAN PHOTO": "guardianPhoto",
    "MOTHER SIGNATURE": "motherSignature",
    "FATHER SIGNATURE": "fatherSignature",
    "GUARDIAN SIGNATURE": "guardianSignature"
};

const payloadMappingKeys: any = {
    motherPhoto: "MOTHER PHOTO",
    fatherPhoto: "FATHER PHOTO",
    studentPhoto: "STUDENT PHOTO",
    guardianPhoto: "GUARDIAN PHOTO",
    motherSignature: "MOTHER SIGNATURE",
    fatherSignature: "FATHER SIGNATURE",
    guardianSignature: "GUARDIAN SIGNATURE"
};
const initialValues = {
    studentPhotoRequired: false,
    studentPhoto: false,
    fatherPhotoRequired: false,
    fatherPhoto: false,
    fatherSignatureRequired: false,
    fatherSignature: false,
    motherPhotoRequired: false,
    motherPhoto: false,
    motherSignatureRequired: false,
    motherSignature: false,
    guardianPhotoRequired: false,
    guardianPhoto: false,
    guardianSignatureRequired: false,
    guardianSignature: false,
}
const validationSchema = Yup.object().shape({
    isGuardianSelected: Yup.string(),
    studentPhotoRequired: Yup.bool(),
    studentPhoto: Yup.bool().when('studentPhotoRequired', {
        is: (isStudentPhotoRequired: any) => isStudentPhotoRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading student photo is required.'
        )
    }),
    fatherPhotoRequired: Yup.bool(),
    fatherPhoto: Yup.bool().when('fatherPhotoRequired', {
        is: (isFatherPhotoRequired: any) => isFatherPhotoRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading father photo is required.'
        )
    }),
    fatherSignatureRequired: Yup.bool(),
    fatherSignature: Yup.bool().when('fatherSignatureRequired', {
        is: (isFatherSignatureRequired: any) => isFatherSignatureRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading father signature is required.'
        )
    }),
    motherPhotoRequired: Yup.bool(),
    motherPhoto: Yup.bool().when('motherPhotoRequired', {
        is: (isMotherPhotoRequired: any) => isMotherPhotoRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading mother photo is required.'
        )
    }),
    motherSignatureRequired: Yup.bool(),
    motherSignature: Yup.bool().when('motherSignatureRequired', {
        is: (isMotherSignatureRequired: any) => isMotherSignatureRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading mother signature is required.'
        )
    }),

    guardianPhotoRequired: Yup.bool(),
    guardianPhoto: Yup.bool().when('guardianPhotoRequired', {
        is: (isGuardianPhotoRequired: any) => isGuardianPhotoRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading guardian photo is required.'
        )
    }),
    guardianSignatureRequired: Yup.bool(),
    guardianSignature: Yup.bool().when('guardianSignatureRequired', {
        is: (isGuardianSignatureRequired: any) => isGuardianSignatureRequired,
        then: Yup.bool().oneOf(
            [true],
            'Uploading guardian signature is required.'
        )
    }),
})


export default function Photos({ formId, stepId, instituteId, branchId, storeMultiFormDataCallback }: any) {
    const { tabsData, studentId, isResubmission = false, currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const [resubmitListState, setResubmitListState] = useState<any>([]);
    const [uploadedFileState, setUploadedFileState] = useState<any>({
        studentPhoto: null,
        fatherPhoto: null,
        fatherSignature: null,
        motherPhoto: null,
        motherSignature: null,
        guardianPhoto: null,
        guardianSignature: null
    });
    const { showApiLoader, uploadRegPhotosResp, uploadRegDocumentResp, documentDetailsByIdResp } =
        useAppSelector(({ globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            uploadRegPhotosResp: admissionRegistration.uploadRegPhotosResp,
            uploadRegDocumentResp: admissionRegistration.uploadRegDocumentResp,
            documentDetailsByIdResp: admissionRegistration.documentDetailsByIdResp
        }), shallowEqual);

    const photosRespRef = useRef({
        prevUploadRegPhotosResp: uploadRegPhotosResp,
        prevUploadRegDocumentResp: uploadRegDocumentResp,
        prevDocumentDetailsByIdResp: documentDetailsByIdResp
    });

    useEffect(() => {
        if (tabsData?.studentProfile && studentId) {
            const { admissionSoughtId } = tabsData?.studentProfile || {};
            const params = { studentId, classId: admissionSoughtId };
            dispatch(getDocumentDetailsByIdAct(generateActionPayload("get_document_byid", params)));
        }
    }, [studentId, tabsData]);


    useEffect(() => {
        const { prevUploadRegDocumentResp, prevDocumentDetailsByIdResp } = photosRespRef.current;
        if (uploadRegDocumentResp && prevUploadRegDocumentResp !== uploadRegDocumentResp) {
            const { uploadFileId } = uploadRegDocumentResp;
            if (uploadFileId) {
                toast.success("Uploaded successfully.");
                setUploadedFileState((prevState: any) => ({
                    ...prevState, [uploadFileId]: {
                        id: uploadRegDocumentResp?.id,
                        documentId: uploadRegDocumentResp?.documentId,
                        documentName: uploadRegDocumentResp?.documentName,
                        uploadedFileId: uploadRegDocumentResp?.systemFile?.id,
                        fileName: uploadRegDocumentResp?.systemFile?.originalFileName,
                        downloadUrl: uploadRegDocumentResp?.systemFile?.s3URL,
                        approvalStatus: uploadRegDocumentResp?.approvalStatus,
                        isDisabled: false,
                        isUploaded: true
                    }
                }));
                photosForm.setFieldValue(uploadFileId, true);
            }
        } else if (documentDetailsByIdResp && prevDocumentDetailsByIdResp !== documentDetailsByIdResp) {
            if (Array.isArray(documentDetailsByIdResp)) {
                const photoDocuments = documentDetailsByIdResp.filter(item => item.documentType === "PHOTO" || item.documentType === "SIGNATURE");
                const updateUploadedFileState: any = {},
                    photoFormValues: any = { ...photosForm.values };
                const resubmitDocument: any = [];
                photoDocuments.forEach((item: any) => {
                    const { documentName } = item,
                        fileKeyName = reverseMappingKeys[documentName];
                    const checkDocResubmission = (item?.approvalStatus === "RESUBMISSION");
                    if (checkDocResubmission) {
                        resubmitDocument.push(item.documentName);
                    }
                    if (fileKeyName) {
                        photoFormValues[fileKeyName] = checkDocResubmission ? false : !!(item?.systemFile?.id);
                        photoFormValues[`${fileKeyName}Required`] = item?.isRequired || false;
                        updateUploadedFileState[fileKeyName] = {
                            id: item?.id,
                            documentId: item?.documentId,
                            documentName: checkDocResubmission ? "" : item?.documentName,
                            uploadedFileId: item?.systemFile?.id,
                            fileName: item?.systemFile?.originalFileName,
                            downloadUrl: checkDocResubmission ? "" : item?.systemFile?.s3URL,
                            approvalStatus: item?.approvalStatus,
                            documentResubmission: checkDocResubmission,
                            isDisabled: isResubmission ? !(checkDocResubmission) : false,
                            isUploaded: checkDocResubmission ? false : !!(item?.systemFile?.id)
                        }
                    }
                })
                setResubmitListState(resubmitDocument);
                setUploadedFileState((prevState: any) => ({ ...prevState, ...updateUploadedFileState }));
                photosForm.resetForm({
                    values: photoFormValues
                })
            }
        }
        photosRespRef.current.prevUploadRegDocumentResp = uploadRegDocumentResp;
        photosRespRef.current.prevDocumentDetailsByIdResp = documentDetailsByIdResp;
    }, [uploadRegDocumentResp, documentDetailsByIdResp]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            photosForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    const photosForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            storeMultiFormDataCallback(formId, true, photosForm.dirty, {});
        }
    });

    function fileUploadHndlr(fileUploadId: string, fileName: string, uploadFile: any) {
        if (Array.isArray(documentDetailsByIdResp) && documentDetailsByIdResp.length === 0) {
            toast.error("Something went wrong.");
            return;
        }
        if (fileUploadId && Object.prototype.hasOwnProperty.call(uploadedFileState, fileUploadId)) {
            const documentInfo = uploadedFileState[fileUploadId];
            const params = { studentId }, formData = new FormData();
            const documentRequest = {
                id: documentInfo?.id || "",
                instituteId,
                branchId,
                isReSubmission: documentInfo?.documentResubmission,
                documentId: documentInfo?.documentId
            };
            formData.append("file", uploadFile);
            if (documentInfo?.uploadedFileId) {
                formData.append("systemFileId", documentInfo.uploadedFileId);
            }
            formData.append("documentRequest", JSON.stringify(documentRequest));
            formData.append("fileType", 'IMAGE');
            dispatch(uploadRegDocumentAct(generateActionPayload("upload_reg_document", params, formData, { uploadFileId: fileUploadId })));
        }
    }

    function newFileUploadHandler(fileUploadId: string, fileError: string) {
        setUploadedFileState((prevState: any) => ({
            ...prevState, [fileUploadId]: {
                ...prevState[fileUploadId],
                downloadUrl: "",
                isUploaded: false
            }
        }));
        if (fileError) {
            photosForm.setFieldTouched(fileUploadId, true, false);
            photosForm.setFieldValue(fileUploadId, false, false);
            photosForm.setFieldError(fileUploadId, fileError);
        } else {
            photosForm.setFieldValue(fileUploadId, false);
        }
    }

    const resubmitDocs = resubmitListState.join(", ");
    return (
        <React.Fragment>
            <div className="tw-mb-2">
                {resubmitDocs && <p className="tw-text-red-500">
                    <span className="tw-font-bold">Please re-submit your following documents: </span>{resubmitDocs}.
                </p>}
            </div>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                <div className="tw-col-span-12">
                    <h5 className="tw-mb-3" style={{
                        textDecoration: 'underline',
                        textDecorationColor: '#B5C6FD',
                        textDecorationThickness: '2px',
                    }}>UPLOAD IMAGES</h5>
                </div>
                <div className="tw-col-span-12 xl:tw-col-span-8">
                    <UploaderCrop
                        labelText="Student Photo"
                        labelClass={photosForm.values.studentPhotoRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="studentPhoto"
                        newFileUploadHandler={newFileUploadHandler}
                        uploadFileHandler={fileUploadHndlr}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["studentPhoto"]}
                        invalid={(photosForm.touched.studentPhoto && photosForm.errors.studentPhoto) ? true : false}
                        error={(photosForm.touched.studentPhoto && photosForm.errors.studentPhoto) ? photosForm.errors.studentPhoto : ""}
                    />
                    <UploaderCrop
                        labelText="Father Photo"
                        labelClass={photosForm.values.fatherPhotoRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="fatherPhoto"
                        newFileUploadHandler={newFileUploadHandler}
                        uploadFileHandler={fileUploadHndlr}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["fatherPhoto"]}
                        invalid={(photosForm.touched.fatherPhoto && photosForm.errors.fatherPhoto) ? true : false}
                        error={(photosForm.touched.fatherPhoto && photosForm.errors.fatherPhoto) ? photosForm.errors.fatherPhoto : ""}
                    />
                    <UploaderCrop
                        labelText="Mother Photo"
                        labelClass={photosForm.values.motherPhotoRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="motherPhoto"
                        uploadFileHandler={fileUploadHndlr}
                        newFileUploadHandler={newFileUploadHandler}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["motherPhoto"]}
                        invalid={(photosForm.touched.motherPhoto && photosForm.errors.motherPhoto) ? true : false}
                        error={(photosForm.touched.motherPhoto && photosForm.errors.motherPhoto) ? photosForm.errors.motherPhoto : ""}
                    />
                    <UploaderCrop
                        labelText="Guardian Photo"
                        labelClass={photosForm.values.guardianPhotoRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="guardianPhoto"
                        uploadFileHandler={fileUploadHndlr}
                        newFileUploadHandler={newFileUploadHandler}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["guardianPhoto"]}
                        invalid={(photosForm.touched.guardianPhoto && photosForm.errors.guardianPhoto) ? true : false}
                        error={(photosForm.touched.guardianPhoto && photosForm.errors.guardianPhoto) ? photosForm.errors.guardianPhoto : ""}
                    />
                </div>
                <div className="tw-col-span-12 xl:tw-col-span-4 tw-mt-2 xl:tw-mt-0">
                    <h5 className="tw-block xl:tw-hidden tw-mb-2 tw-underline tw-text-muted">Sample Photo</h5>
                    <div className="tw-flex tw-justify-center">
                        <img src={SamplePhoto} style={{ maxWidth: '200px' }} className="tw-max-w-full tw-h-auto" alt="Sample Photo" />
                    </div>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                <div className="tw-col-span-12">
                    <h5 className="tw-mb-3" style={{
                        textDecoration: 'underline',
                        textDecorationColor: '#B5C6FD',
                        textDecorationThickness: '2px',
                    }}>UPLOAD SIGNATURES</h5>
                </div>
                <div className="tw-col-span-12 xl:tw-col-span-8">
                    <UploaderCrop
                        labelText="Father Signature"
                        labelClass={photosForm.values.fatherSignatureRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="fatherSignature"
                        uploadFileHandler={fileUploadHndlr}
                        newFileUploadHandler={newFileUploadHandler}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["fatherSignature"]}
                        invalid={(photosForm.touched.fatherSignature && photosForm.errors.fatherSignature) ? true : false}
                        error={(photosForm.touched.fatherSignature && photosForm.errors.fatherSignature) ? photosForm.errors.fatherSignature : ""}
                    />
                    <UploaderCrop
                        labelText="Mother Signature"
                        labelClass={photosForm.values.motherSignatureRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="motherSignature"
                        uploadFileHandler={fileUploadHndlr}
                        newFileUploadHandler={newFileUploadHandler}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["motherSignature"]}
                        invalid={(photosForm.touched.motherSignature && photosForm.errors.motherSignature) ? true : false}
                        error={(photosForm.touched.motherSignature && photosForm.errors.motherSignature) ? photosForm.errors.motherSignature : ""}
                    />
                    <UploaderCrop
                        labelText="Guardian Signature"
                        labelClass={photosForm.values.guardianSignatureRequired ? "required tw-font-bold" : "tw-font-bold"}
                        uploadFileId="guardianSignature"
                        uploadFileHandler={fileUploadHndlr}
                        newFileUploadHandler={newFileUploadHandler}
                        isLoading={showApiLoader}
                        isCropImg
                        uploadedFileInfo={uploadedFileState["guardianSignature"]}
                        invalid={(photosForm.touched.guardianSignature && photosForm.errors.guardianSignature) ? true : false}
                        error={(photosForm.touched.guardianSignature && photosForm.errors.guardianSignature) ? photosForm.errors.guardianSignature : ""}
                    />
                </div>
                <div className="tw-col-span-12 xl:tw-col-span-4 tw-mt-2 xl:tw-mt-0">
                    <h5 className="tw-block xl:tw-hidden tw-mb-2 tw-underline tw-text-muted">Sample Photo</h5>
                    <div className="tw-flex tw-justify-center">
                        <img src={SampleSignature} style={{ maxWidth: '200px' }} className="tw-max-w-full tw-h-auto" alt="Sample Photo" />
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}