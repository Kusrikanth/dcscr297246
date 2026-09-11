import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import {
    Formik, FieldArray, useFormik, Form,
    setNestedObjectValues, ArrayHelpers, FormikErrors, FormikProvider
} from "formik";
import * as Yup from "yup";
import { TextInput, NgFileUploader, Button } from "../../../Components/Common";
import { getRegisterStudentByIdAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper

import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    uploadRegDocumentAct, getDocumentDetailsByIdAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

import {
    getCountryStateAct, getStateCityAct,
    setCountryStateAct, setStateCityAct
} from "../../../store/masterdata/masterdataactions";
import { nanoid } from "nanoid";
import NoDataComp from "../../../Components/Common/NoDataComp";
import classNames from 'classnames';

interface IDocumentInfo {
    uniqueId: string | undefined,
    id: string,
    documentId: string,
    documentName: string,


    documentResubmission: boolean,
    uploadedFileId: string,
    uploadedFile: string,
    fileName: string,
    downloadUrl: string,
    isUploaded: boolean,
    isRequired: boolean,
    approvalStatus: string,
}

// const formValues = documentList.map(item => {
//     const uniqueId = nanoid();
//     return ({
//         uniqueId,
//         id: "",
//         documentName: item.name,

//         uploadedFileId: "",
//         uploadedFile: "",
//         fileName: "",
//         downloadUrl: "",
//         isUploaded: false
//     })
// })
interface IUploadDocument {
    documentList: Array<IDocumentInfo> | []
}
function getInitialState(): IUploadDocument {
    return {
        documentList: []
    }
}
const initialValues = getInitialState();


const validationSchema = Yup.object().shape({
    documentList: Yup.array().of(
        Yup.object().shape({
            isRequired: Yup.bool(),
            isUploaded: Yup.bool().test("isFileUploaded", "Document upload is required.",
                (value: any, schema: any) => {
                    const isRequiredDoc = schema.parent.isRequired;
                    if (isRequiredDoc && !value) {
                        return false;
                    }
                    return true;
                })
            // isUploaded: Yup.bool().oneOf(
            //         [true],
            //         'Document upload is required.'
            //     ),
        })
    ),
})

export default function UploadDocuments({ stepId, formId, instituteId, branchId,
    storeMultiFormDataCallback }: any) {
    const { tabsData, setTabsDataHandler, studentId, isResubmission = false, currentMultiFormKeys, updateFormKeyDataHndlr,
        requestedMultiFormKeys } = useContext<any>(StepperFormContext);
    const requestedResidentialAddress = useRef<any>(false);
    const [resubmitListState, setResubmitListState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { showApiLoader, uploadRegDocumentResp,
        registerStudentByIdResp,
        documentDetailsByIdResp } =
        useAppSelector(({ globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            uploadRegDocumentResp: admissionRegistration.uploadRegDocumentResp,
            registerStudentByIdResp: admissionRegistration.registerStudentByIdResp,
            documentDetailsByIdResp: admissionRegistration.documentDetailsByIdResp
        }), shallowEqual);

    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const uploadDocumentRespRef = useRef({
        prevUploadRegDocumentResp: uploadRegDocumentResp,
        prevDocumentDetailsByIdResp: documentDetailsByIdResp,
        prevRegisterStudentByIdResp: registerStudentByIdResp,
    });

    useEffect(() => {
        const { prevUploadRegDocumentResp, prevDocumentDetailsByIdResp, prevRegisterStudentByIdResp } = uploadDocumentRespRef.current;
        if (uploadRegDocumentResp && prevUploadRegDocumentResp !== uploadRegDocumentResp) {
            const { uploadFileId } = uploadRegDocumentResp;
            if (uploadFileId) {
                toast.success("File uploaded successfully.")
                const rowIndex = uploadForm.values?.documentList.findIndex((item: any) => item.uniqueId === uploadFileId);
                if (rowIndex >= 0) {
                    const updatedRowDetails = {
                        ...uploadForm.values?.documentList[rowIndex],

                        id: uploadRegDocumentResp.id,
                        documentId: uploadRegDocumentResp?.documentId,
                        documentName: uploadRegDocumentResp.documentName,

                        uploadedFileId: uploadRegDocumentResp?.systemFile?.id || "",
                        uploadedFile: "",
                        fileName: uploadRegDocumentResp?.systemFile?.originalFileName || "",
                        downloadUrl: uploadRegDocumentResp?.systemFile?.s3URL || "",
                        isUploaded: !!(uploadRegDocumentResp?.systemFile?.id),
                        approvalStatus: uploadRegDocumentResp?.approvalStatus
                    };
                    formikArrayHelpers.current?.replace(rowIndex, updatedRowDetails);
                }
            }
        } else if (documentDetailsByIdResp && prevDocumentDetailsByIdResp !== documentDetailsByIdResp) {
            if (Array.isArray(documentDetailsByIdResp)) {
                const resubmitDocument: any = [];
                const formValues = documentDetailsByIdResp.filter(item => item.documentType === "DOCUMENT")
                    .map(item => {
                        const uniqueId = nanoid();
                        const checkDocResubmission = (item?.approvalStatus === "RESUBMISSION");
                        if (checkDocResubmission) {
                            resubmitDocument.push(item.documentName);
                        }
                        return ({
                            uniqueId,
                            id: item.id || "",
                            documentId: item.documentId || "",
                            documentName: item.documentName || "",

                            uploadedFileId: item?.systemFile?.id || "",
                            uploadedFile: "",
                            documentResubmission: checkDocResubmission,
                            fileName: checkDocResubmission ? "" : item?.systemFile?.originalFileName,
                            downloadUrl: checkDocResubmission ? "" : item?.systemFile?.s3URL,
                            isUploaded: checkDocResubmission ? false : !!(item?.systemFile?.id),
                            isRequired: typeof (item?.isRequired) === 'boolean' ? item.isRequired : true,
                            approvalStatus: item?.approvalStatus
                        })
                    });
                setResubmitListState(resubmitDocument);
                uploadForm.resetForm({
                    values: { documentList: formValues }
                })
                // uploadForm.resetForm
            }
        } else if (registerStudentByIdResp && prevRegisterStudentByIdResp !== registerStudentByIdResp) {
            setTabsDataHandler("studentProfile", registerStudentByIdResp);
        }
        uploadDocumentRespRef.current.prevUploadRegDocumentResp = uploadRegDocumentResp;
        uploadDocumentRespRef.current.prevDocumentDetailsByIdResp = documentDetailsByIdResp;
        uploadDocumentRespRef.current.prevRegisterStudentByIdResp = registerStudentByIdResp;
    }, [uploadRegDocumentResp, documentDetailsByIdResp, registerStudentByIdResp]);

    useEffect(() => {
        if (tabsData?.studentProfile && studentId) {
            const { admissionSoughtId } = tabsData?.studentProfile || {};
            const params = { studentId, classId: admissionSoughtId };
            dispatch(getDocumentDetailsByIdAct(generateActionPayload("get_document_byid", params)));
        } else if (!tabsData?.studentProfile && studentId) {
            const params = { studentId };
            dispatch(getRegisterStudentByIdAct(generateActionPayload("get_register_student_byid", params)));
        }
    }, [studentId, tabsData]);

    const uploadForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            storeMultiFormDataCallback(formId, true, false, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            uploadForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (Array.isArray(requestedMultiFormKeys) && requestedMultiFormKeys.includes("residentialAddress")) {
            uploadForm.validateForm().then(formKeys => {
                if (Object.keys(formKeys).length === 0) {
                    updateFormKeyDataHndlr("residentialAddress", uploadForm.values);
                    requestedResidentialAddress.current = true
                } else {
                    uploadForm.setTouched(setNestedObjectValues<any>(formKeys, true));
                }
            })
        }
    }, [requestedMultiFormKeys]);

    function onChangeFileInputHndlr(event: any) {
        const file = event.target.files[0];
        const documentIndexKey = event.target.name.split(".")[1];
        uploadForm.setFieldValue(`documentList.${documentIndexKey}.fileName`, file.name);
        uploadForm.setFieldValue(`documentList.${documentIndexKey}.downloadUrl`, "");
        uploadForm.setFieldValue(`documentList.${documentIndexKey}.isUploaded`, false);
        uploadForm.setFieldValue(`documentList.${documentIndexKey}.uploadedFile`, file);
    }

    function fileUploadHndlr(event: React.MouseEvent<HTMLInputElement>) {
        const uploadFileId = event.currentTarget.getAttribute("data-id") || "",
            rowFileInfo = uploadForm.values?.documentList.find((item: any) => item.uniqueId === uploadFileId);
        if (rowFileInfo) {
            const { fileName, documentResubmission } = rowFileInfo;
            const formData = new FormData();
            const documentInfo = {
                id: rowFileInfo.id,
                instituteId,
                branchId,
                isReSubmission: documentResubmission || false,
                documentId: rowFileInfo.documentId
            };

            const params = { studentId };
            formData.append("file", rowFileInfo.uploadedFile);
            formData.append("systemFileId", rowFileInfo.uploadedFileId);
            formData.append("documentRequest", JSON.stringify(documentInfo));
            formData.append("fileType", 'PDF');
            formData.append("profileStatus", "DOC_UPLOAD_PENDING");
            dispatch(uploadRegDocumentAct(generateActionPayload("upload_reg_document", params, formData, { uploadFileId })));
        }
    }

    const resubmitDocs = resubmitListState.join(", ");
    return (
        <form onSubmit={uploadForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                DOCUMENTS FOR {isResubmission ? "RE-SUBMISSION" : "SUBMISSION"}
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <h5 className="text-dc-dark">Specifications for uploading documents</h5>
                <p className="text-dc-muted">
                    All files must be in PDF-format to be accepted for uploading.However all the pages of report cards be saved as pdf format and then upload. Maximum size allowed 500kb.
                    You must scan your original documents, Photographs of documents are acceptable
                </p>
                <p className="tw-text-red-500">
                    Note : Please save the entire document (all the pages) in&nbsp;<a
                        href="https://www.ilovepdf.com"
                        className="tw-text-[#1492E6] hover:tw-text-[#1492E6] hover:tw-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        pdf
                    </a>&nbsp;format and then upload. Size - 500kb(Only for Report Cards)
                </p>
                {resubmitDocs && <p className="tw-text-red-500">
                    <span className="tw-font-bold">Please re-submit your following documents: </span>{resubmitDocs}.
                </p>}
                <div className="tw-hidden lg:tw-grid tw-grid-cols-10 tw-gap-4">
                    <div className="tw-col-span-4"><label className="form-label tw-font-bold">Document Name</label></div>
                    <div className="tw-col-span-6"><label className="form-label tw-font-bold">Choose File</label></div>
                </div>
                <FormikProvider value={uploadForm}>
                    <FieldArray name="documentList">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }
                            return (
                                <>
                                    {uploadForm.values.documentList.length > 0 &&
                                        uploadForm.values.documentList.map((document, index) => {
                                            const inputFieldErrors: any = Array.isArray(uploadForm.errors.documentList) && uploadForm.errors.documentList[index] || {};
                                            const inputFieldTouched = Array.isArray(uploadForm.touched.documentList) && uploadForm.touched.documentList[index] || {};
                                            return (
                                                <div key={document.uniqueId} className="tw-grid tw-grid-cols-1 tw-lg-grid-cols-10 tw-gap-4 tw-items-start tw-mb-3">
                                                    <div className="tw-col-span-1 lg:tw-col-span-4">
                                                        <div
                                                            style={{
                                                                padding: '0.625rem 0.9rem',
                                                                borderRadius: '0.4rem',
                                                                lineHeight: 1.5
                                                            }}
                                                            className="tw-mb-1 tw-mb-lg-0 tw-bg-gray-100 tw-flex tw-items-center">
                                                            <span className="tw-block tw-mb-0">
                                                                {document.documentName}
                                                                {document.isRequired && (
                                                                    <span className="tw-text-red-500 tw-ml-1">*</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {/* <TextInput
                                                            name="documentName"
                                                            formgroupClassName="mb-2 mb-lg-0"
                                                            inputClassName="ng-input"
                                                            labelClass={classNames("d-block d-lg-none", document.isRequired ? "required" : "")}
                                                            labelText={`${index + 1}. Document`}
                                                            value={document.documentName}
                                                            onChange={null}
                                                            isDisabled={true}

                                                        // helperText="Full name as displayed on Aadhar Number"
                                                        /> */}
                                                    </div>
                                                    <div className="tw-col-span-1 lg:tw-col-span-6">
                                                        <NgFileUploader
                                                            formgroupClassName="tw-mb-0"
                                                            name={`documentList.${index}.uploadedFile`}
                                                            fileName={document.fileName}
                                                            onChangeFileHndlr={onChangeFileInputHndlr}
                                                            uploadHndlr={fileUploadHndlr}
                                                            uploadedFile={document.uploadedFile}
                                                            downloadLink={document.downloadUrl}
                                                            isUploaded={document.isUploaded}
                                                            dataId={document.uniqueId}
                                                            isDisabled={showApiLoader || (document.approvalStatus === "APPROVED")}
                                                            invalid={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? true : false}
                                                            error={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? inputFieldErrors.isUploaded : ""}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </>
                            )
                        }}

                    </FieldArray >
                </FormikProvider>
                {(uploadForm.values.documentList.length === 0) && <div className="tw-grid tw-grid-cols-1">
                    <div className="tw-col-span-1 tw-text-[16px] tw-mt-3 tw-text-gray-500">
                        No document available to upload.
                    </div>
                </div>}
            </AccordionBody>
        </form>
    )
}