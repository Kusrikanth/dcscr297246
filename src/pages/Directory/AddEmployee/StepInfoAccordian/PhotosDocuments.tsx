import React, { useState, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";

import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch, BrowseFile, FileUpload,
    UploadImage
} from "../../../../Components/Common";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "./helper";
import { StepperFormContext } from "../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstDocumentTypeAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";

import { getEmployeeDocumentListAct, uploadEmployeeDocumentAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { toast } from "react-toastify";
import { TABS_ACTIONS } from "../helper";
import Button from "../../../../Components/Common/Button";


function getCamelCasing(fileName: string) {
    return fileName.charAt(0).toLowerCase() + fileName.slice(1)
}
const validationSchema = Yup.object().shape({
    // documents: Yup.array().of(
    //     Yup.object().shape({
    //         isUploaded: Yup.boolean().oneOf([true], 'Please upload the file.')
    //     })
    // ),
});



function getDocumentsInitialState(documentList: any, uploadedDocuments?: any) {
    const updateDocuments: any = [];
    let uploadedDocumentsDict = Array.isArray(uploadedDocuments) && uploadedDocuments.reduce((data, item) => {
        if (!Object.prototype.hasOwnProperty.call(data, item.documentName)) {
            data[item.documentName] = item;
        }
        return data;
    }, {}) || {};
    if (Array.isArray(documentList) && Object.keys(uploadedDocumentsDict).length > 0) {
        documentList.forEach((item: any) => {
            const { documentName } = item || {};
            const { documentName: uploadedDocumentName, id,
                fileName, fileType } = uploadedDocumentsDict[documentName] || {};
            updateDocuments.push({
                id: item.id,
                documentName,
                fileName,
                fileType,
                uploadedFile: "",
                isUploaded: !!uploadedDocumentName
            })
        })
    } else if (Array.isArray(documentList)) {
        documentList.forEach((item: any) => {
            updateDocuments.push({
                id: item.id,
                documentName: item.documentName,
                fileName: "",
                fileType: "",
                uploadedFile: "",
                isUploaded: false
            })
        })
    }
    return { documents: updateDocuments };
}

export const Documents: React.FC<any> = ({ branchId, instituteId }) => {
    const [documentsState, setDocumentState] = useState(() => getDocumentsInitialState([]));
    const { submitCurrentFormCllbck, previousStepHndlr, currentMultiFormKeys, editEmployeeData, storeMultiFormData } = useContext<any>(StepperFormContext);
    const [uploadingFileIdsState, setUploadingFileIdState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const [addedEmployeeIdState, setAddedEmployeeIdState] = useState("2510");

    const { getEmployeeDocumentListResp, addedEmployeeId, addEmployeeResp, uploadEmployeeDocumentResp } = useAppSelector(({
        appData, directoryEmployee }) => ({
            getEmployeeDocumentListResp: directoryEmployee.getEmployeeDocumentListResp,
            uploadEmployeeDocumentResp: directoryEmployee.uploadEmployeeDocumentResp,
            addEmployeeResp: directoryEmployee.addEmployeeResp,
            addedEmployeeId: appData.addedEmployeeId
        }), shallowEqual);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const documentsRespRef = useRef<any>({
        prevGetEmployeeDocumentListResp: undefined,
        pervAddEmployeeResp: undefined,
        prevUploadEmployeeDocumentResp: uploadEmployeeDocumentResp
    });

    useEffect(() => {
        if (!getEmployeeDocumentListResp) {
            const params = { instituteId };
            dispatch(getEmployeeDocumentListAct(generateActionPayload('get_employee_document_type')));
        }
    }, [getEmployeeDocumentListResp]);

    useEffect(() => {
        const { prevGetEmployeeDocumentListResp, pervAddEmployeeResp, prevUploadEmployeeDocumentResp } = documentsRespRef.current;
        // if (Array.isArray(getEmployeeDocumentListResp) && prevGetEmployeeDocumentListResp !== getEmployeeDocumentListResp) {
        //     setDocumentState(getDocumentsInitialState(getEmployeeDocumentListResp));
        // } else 
        if (uploadEmployeeDocumentResp && prevUploadEmployeeDocumentResp !== uploadEmployeeDocumentResp) {
            toast.success("Employee document uploaded successfully.");
            const { typeId } = uploadEmployeeDocumentResp,
                updateUploadingFileIds = [...uploadingFileIdsState],
                fileTypeIndex = updateUploadingFileIds.indexOf(typeId.toString()),
                rowFileIndex = documentsForm.values?.documents.findIndex((item: any) => item.id === +typeId);
            if (fileTypeIndex >= 0) {
                updateUploadingFileIds.splice(fileTypeIndex, 1);
                setUploadingFileIdState(updateUploadingFileIds);
            }
            if (rowFileIndex >= 0) {
                documentsForm.setFieldValue(`documents[${rowFileIndex}].uploadedFile`, "");
                documentsForm.setFieldValue(`documents[${rowFileIndex}].isUploaded`, true);
            }

        } else if (addEmployeeResp && pervAddEmployeeResp !== addEmployeeResp) {
            const { employeeBasicDetails } = addEmployeeResp,
                { id } = employeeBasicDetails || {};
            setAddedEmployeeIdState(id);
        }
        documentsRespRef.current.prevGetEmployeeDocumentListResp = getEmployeeDocumentListResp;
        documentsRespRef.current.prevUploadEmployeeDocumentResp = uploadEmployeeDocumentResp;
        documentsRespRef.current.pervAddEmployeeResp = addEmployeeResp;
    }, [getEmployeeDocumentListResp, addEmployeeResp, uploadEmployeeDocumentResp]);


    function submitDocumentHndlr() {
        submitCurrentFormCllbck(["employeeDocumentList"], TABS_ACTIONS.SUBMIT_TAB);
    }
    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["employeeDocumentList"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    const documentsForm = useFormik({
        enableReinitialize: true,
        initialValues: documentsState,
        validationSchema,
        onSubmit: (values) => {
            const { documents } = values,
                payload = documents.filter((item: any) => {
                    if (item.isUploaded) {
                        return { ...item }
                    }
                });
            const { employeeDocumentList } = editEmployeeData,
                { formData: UploadedDocument } = employeeDocumentList || {};
            let uploadedDocumentsDict = Array.isArray(UploadedDocument) && UploadedDocument.reduce((data, item) => {
                if (!Object.prototype.hasOwnProperty.call(data, item.documentName)) {
                    data[item.documentName] = item;
                }
                return data;
            }, {}) || {};
            payload.forEach((item: any) => {
                const { documentName } = item || {};
                const { fileName, fileType } = uploadedDocumentsDict[documentName] || {};
                if (Object.prototype.hasOwnProperty.call(uploadedDocumentsDict, documentName)) {
                    item.fileName = fileName;
                    item.fileType = fileType;
                    item.uploadedFile = "";
                }
            })
            storeMultiFormData("employeeDocumentList", true, payload);
        },
    });

    useEffect(() => {
        if (getEmployeeDocumentListResp || editEmployeeData) {
            const { employeeDocumentList } = editEmployeeData,
                { formData = undefined } = employeeDocumentList || {};
            const updatedDocumentState = getDocumentsInitialState(getEmployeeDocumentListResp, formData);
            setDocumentState(updatedDocumentState);
        }
    }, [getEmployeeDocumentListResp, editEmployeeData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeDocumentList")) {
            documentsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    function browseFileHndlr(event: any) {
        const file = event.target.files[0];

    }

    function onChangeFileInputHndlr(event: any) {
        const file = event.target.files[0];
        const documentIndexKey = event.target.name.split(".")[0];
        documentsForm.setFieldValue(`${documentIndexKey}.fileName`, file.name);
        documentsForm.setFieldValue(`${documentIndexKey}.uploadedFile`, file);
    }

    function fileUploadHndlr(event: React.MouseEvent<HTMLInputElement>) {
        const uploadFileId = event.currentTarget.getAttribute("data-id") || "";
        const rowFileInfo = documentsForm.values?.documents.find((item: any) => item.id === +uploadFileId);
        if (!addedEmployeeIdState) {
            toast.error("Employee ID is missing. Please ensure the employee is added before uploading documents.");
            return;
        }
        if (rowFileInfo && addedEmployeeIdState) {
            const updateUploadingFileIds = [...uploadingFileIdsState];
            updateUploadingFileIds.push(uploadFileId);
            setUploadingFileIdState(updateUploadingFileIds);
            const formData = new FormData();
            formData.append("employeeId", addedEmployeeIdState);
            formData.append("documentTypeId", uploadFileId);
            formData.append("document", rowFileInfo.uploadedFile);
            dispatch(uploadEmployeeDocumentAct(generateActionPayload("upload_employee_document", undefined, formData, { uploadFileId })));
        }
    }
    return (
        <form id="employee-document-form" onSubmit={documentsForm.handleSubmit}>
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-border-b">
                        <h5>4. Documents</h5>
                    </div>
                </div>
            </div>

            <UncontrolledAccordion open="sibling-details" defaultOpen={["sibling-details"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="sibling-details">
                        Upload Documents
                    </AccordionHeader>
                    <AccordionBody accordionId="sibling-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12">
                                <p className="tw-font-bold">
                                    Specifications for uploading documents
                                </p>
                                <p className="tw-text-gray-500">
                                    All files must be in JPG/JPEG format to be accepted for uploading.
                                    However, all the pages of report cards should be saved as PDF format before uploading. Maximum size allowed is 500kb. You must scan your original documents. Photographs of documents are acceptable.
                                </p>
                                <p className="tw-text-green-600 tw-font-bold">
                                    Note: Please save the entire document (all pages) in PDF format before uploading. Size limit – 500kb (Only for Report Cards)
                                </p>
                            </div>
                            <div className="tw-col-span-7">
                                <FormikProvider value={documentsForm}>
                                    <FieldArray name="documents">
                                        {(arrayHelpers: ArrayHelpers) => {
                                            if (!formikArrayHelpers.current) {
                                                formikArrayHelpers.current = arrayHelpers;
                                            }
                                            return (
                                                <>
                                                    {documentsForm.values.documents.length > 0 &&
                                                        documentsForm.values.documents.map((document: any, index: any) => {
                                                            const inputFieldErrors: any = Array.isArray(documentsForm.errors.documents) && documentsForm.errors.documents[index] || {};
                                                            const inputFieldTouched = Array.isArray(documentsForm.touched.documents) && documentsForm.touched.documents[index] || {};
                                                            return (
                                                                <React.Fragment key={document.id}>
                                                                    <BrowseFile
                                                                        containerClassName="tw-mb-3"
                                                                        labelText={document.documentName}
                                                                        name={`documents[${index}].documentName`}
                                                                        fileName={document.fileName}
                                                                        uploadFileId={document.id}
                                                                        uploadHndlr={fileUploadHndlr}
                                                                        uploadedFile={document.uploadedFile}
                                                                        onChangeFileHndlr={onChangeFileInputHndlr}
                                                                        isUploaded={document.isUploaded}
                                                                        invalid={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? true : false}
                                                                        error={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? inputFieldErrors.isUploaded : ""}
                                                                    />
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                </>
                                            )
                                        }}
                                    </FieldArray>
                                </FormikProvider>
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-mt-6 tw-flex tw-justify-end tw-gap-3">
                    <Button
                        type="button"
                        onClick={previousBtnHndlr}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        onClick={submitDocumentHndlr}
                        variant="primary"
                    >
                        Submit
                    </Button>
            </div>
        </form >
    )
}
// import React from "react";
// import { BrowseFile } from "../../../../Components/Common";
// import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

// export const Documents: React.FC<any> = (props) => {
//     return (
//         <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
//             <div className="row">
//                 <div className="col-12 mb-3">
//                     <div className="border-bottom">
//                         <h5>4. Documents</h5>
//                     </div>

//                 </div>
//             </div>

//             <UncontrolledAccordion open="sibling-details" defaultOpen={["sibling-details"]} stayOpen>
//                 <AccordionItem>
//                     <AccordionHeader tag="h4" targetId="sibling-details">
//                         Upload Documents
//                     </AccordionHeader>
//                     <AccordionBody accordionId="sibling-details">
//                         <div className="row">
//                             <div className="col-12">
//                                 <p className="fw-bold">
//                                     Specifications for uploading documents
//                                 </p>
//                                 <p className="text-muted">
//                                     All files must be in JPG/JPEG-format to be accepted for uploading. However all the pages of report cards be saved as pdf format and then upload. Maximum size allowed 500kb. You must scan your original documents, Photographs of documents are acceptable
//                                 </p>
//                                 <p className="text-success fw-bold">
//                                     Note : Please save the entire document (all the pages) in pdf format and then upload. Size - 500kb(Only for Report Cards)
//                                 </p>
//                             </div>
//                             <div className="col-7">
//                                 <BrowseFile
//                                     labelText="Aadhar Proof"
//                                     name="aadhar-proof"
//                                     containerClassName="mb-3"
//                                 />
//                                 <BrowseFile
//                                     labelText="Pan Number Proof"
//                                     name="pan-number-proof"
//                                     containerClassName="mb-3"
//                                 />
//                                 <BrowseFile
//                                     labelText="Highest Qualification Certificate"
//                                     name="highest-qualification-certificate"
//                                     containerClassName="mb-3"
//                                 />
//                             </div>
//                         </div>
//                     </AccordionBody>
//                 </AccordionItem>
//             </UncontrolledAccordion>
//             <div className="row mt-3">
//                 <div className="col-12 text-end mt-2">
//                     <button type="submit" className="btn btn-soft-success me-2">
//                         Cancel
//                     </button>
//                     <button onClick={() => { }} className="btn btn-success">
//                         Submit
//                     </button>
//                 </div>
//             </div>
//         </form>
//     )
// }