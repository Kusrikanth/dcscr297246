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
import { uploadStudentDocumentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { toast } from "react-toastify";

import { TABS_ACTIONS } from "../helper";

// const data = [
//     {
//         "id": 1,
//         "instituteId": 49,
//         "documentName": "BonafideCertificate",
//         "base64Image": "",
//         "fileType": "",
//         "uploadedFile": "",
//     },
//     {
//         "id": 2,
//         "instituteId": 49,
//         "documentName": "AddressProof",
//         "base64Image": "",
//         "fileType": "",
//         "uploadedFile": "",
//     },
//     {
//         "id": 3,
//         "instituteId": 49,
//         "documentName": "AgeProof",
//         "base64Image": "",
//         "fileType": "",
//         "uploadedFile": "",
//     },
//     {
//         "id": 4,
//         "instituteId": 49,
//         "documentName": "ReportCard",
//         "base64Image": "",
//         "fileType": "",
//         "uploadedFile": "",
//     },
//     {
//         "id": 5,
//         "instituteId": 49,
//         "documentName": "IdProof",
//         "base64Image": "",
//         "fileType": "",
//         "uploadedFile": "",
//     }
// ];

function getCamelCasing(fileName: string) {
    return fileName.charAt(0).toLowerCase() + fileName.slice(1)
}
function getDocumentsInitialState(documentList: any, savedDocuments?: any) {
    if (savedDocuments && Array.isArray(savedDocuments)) {
        return { documents: savedDocuments };
    }
    const updateDocuments: any = [];
    if (Array.isArray(documentList)) {
        documentList.forEach(item => {
            updateDocuments.push({
                id: item.id,
                documentName: item.documentName,
                fileName: "",
                fileKeyName: getCamelCasing(item.documentName || ""),
                base64Image: "",
                fileType: "",
                uploadedFile: "",
                isUploaded: false
            })
        })
    }
    return { documents: updateDocuments };
}
export const Documents: React.FC<any> = ({ branchId, instituteId }) => {
    const { submitCurrentFormCllbck, currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);
    const savedDocs = editStudentData?.studentDocumentsDetails?.formData;
    const [documentsState, setDocumentState] = useState(getDocumentsInitialState([], savedDocs));
    const [uploadingFileIdsState, setUploadingFileIdState] = useState<any>([]);
    const [addedStudentIdState, setAddedStudentIdState] = useState("");
    const dispatch = useAppDispatch();

    const { instDocumentTypeResp, uploadStudentDocumentResp, addStudentResp } = useAppSelector(({ instituteInfo, directoryStudent }) => ({
        instDocumentTypeResp: instituteInfo.instDocumentTypeResp,
        uploadStudentDocumentResp: directoryStudent.uploadStudentDocumentResp,
        addStudentResp: directoryStudent.addStudentResp
    }), shallowEqual);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const documentsRespRef = useRef<any>({
        prevInstDocumentTypeResp: undefined,
        prevAddStudentResp: undefined,
        prevUploadStudentDocumentResp: uploadStudentDocumentResp
    });

    useEffect(() => {
        if (!instDocumentTypeResp) {
            dispatch(getInstDocumentTypeAct(generateActionPayload("get_inst_document_type")));
        }
    }, [instDocumentTypeResp]);

    useEffect(() => {
        const { prevInstDocumentTypeResp, prevAddStudentResp, prevUploadStudentDocumentResp } = documentsRespRef.current;
        if (Array.isArray(instDocumentTypeResp) && prevInstDocumentTypeResp !== instDocumentTypeResp) {
            const savedDocs = editStudentData?.studentDocumentsDetails?.formData;
            if (savedDocs && Array.isArray(savedDocs)) {
                setDocumentState(getDocumentsInitialState(instDocumentTypeResp, savedDocs));
            } else {
                setDocumentState(getDocumentsInitialState(instDocumentTypeResp));
            }
        } else if (uploadStudentDocumentResp && prevUploadStudentDocumentResp !== uploadStudentDocumentResp) {
            toast.success("Student document uploaded successfully.");
            const { typeId } = uploadStudentDocumentResp,
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

        }
        else if (addStudentResp && prevAddStudentResp !== addStudentResp) {
            const { studentDetails } = addStudentResp,
                { id } = studentDetails || {};
            setAddedStudentIdState(id);
            localStorage.setItem("currentStudentId", id);
        }
        documentsRespRef.current.prevInstDocumentTypeResp = instDocumentTypeResp;
        documentsRespRef.current.prevUploadStudentDocumentResp = uploadStudentDocumentResp;
        documentsRespRef.current.prevAddStudentResp = addStudentResp;
    }, [instDocumentTypeResp, uploadStudentDocumentResp, addStudentResp]);

    useEffect(() => {
        if (editStudentData && editStudentData.id) {
            setAddedStudentIdState(editStudentData.id);
            localStorage.setItem("currentStudentId", editStudentData.id);
        }
    }, [editStudentData]);

    useEffect(() => {
        if (!addedStudentIdState) {
            const storedId = localStorage.getItem("currentStudentId");
            if (storedId) {
                setAddedStudentIdState(storedId);
            }
        }
    }, []);

    function submitHndlr() {
        submitCurrentFormCllbck(["studentDocumentsDetails"], TABS_ACTIONS.SUBMIT_TAB);
    }
    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["studentDocumentsDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    const documentsForm = useFormik({
        enableReinitialize: true,
        initialValues: documentsState,
        onSubmit: (values) => {
            storeMultiFormData("studentDocumentsDetails", true, values.documents);
        },
    });

    useEffect(() => {
    }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys))
            documentsForm.handleSubmit();
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
        const uploadFileId = event.currentTarget.getAttribute("data-id") || "",
            rowFileInfo = documentsForm.values?.documents.find((item: any) => item.id === +uploadFileId);
        if (rowFileInfo && addedStudentIdState) {
            const updateUploadingFileIds = [...uploadingFileIdsState];
            updateUploadingFileIds.push(uploadFileId);
            setUploadingFileIdState(updateUploadingFileIds);
            const formData = new FormData();
            formData.append("studentId", addedStudentIdState);
            formData.append("documentTypeId", uploadFileId);
            formData.append("file", rowFileInfo.uploadedFile);
            dispatch(uploadStudentDocumentAct(generateActionPayload("upload_student_document", undefined, formData, { uploadFileId })));
        }
    }


    return (
        <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-border-b tw-pb-2">
                        <h5 className="tw-text-lg tw-font-semibold">
                            5. Documents
                        </h5>
                    </div>
                </div>
            </div>

            <UncontrolledAccordion open={["sibling-details"]} defaultOpen={["sibling-details"]}  stayOpen>
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
                                    All files must be in JPG/JPEG-format to be accepted for uploading.
                                    However all the pages of report cards be saved as pdf format and then upload.
                                    Maximum size allowed 500kb. You must scan your original documents,
                                    Photographs of documents are acceptable
                                </p>

                                <p className="tw-text-green-600 tw-font-bold">
                                    Note : Please save the entire document (all the pages) in pdf format and then upload.
                                    Size - 500kb (Only for Report Cards)
                                </p>
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-7">
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
                                                                        uploadFileId={document.id}
                                                                        labelText={document.documentName}
                                                                        name={`documents[${index}].documentName`}
                                                                        fileName={document.fileName}
                                                                        containerClassName="tw-mb-3"
                                                                        onChangeFileHndlr={onChangeFileInputHndlr}
                                                                        uploadHndlr={fileUploadHndlr}
                                                                        uploadedFile={document.uploadedFile}
                                                                        isUploaded={document.isUploaded}
                                                                    />
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                </>
                                            )
                                        }}
                                    </FieldArray>

                                </FormikProvider>
                                {/* <FileUpload
                                    name="Testing"
                                    labelText="Tetig"
                                /> */}
                                {/* <BrowseFile
                                    labelText="Bonafide Certificate"
                                    name="bonafide-cerficate"
                                    containerClassName="mb-3"
                                />
                                <BrowseFile
                                    labelText="Address Proof"
                                    name="address-proof"
                                    containerClassName="mb-3"
                                />
                                <BrowseFile
                                    labelText="Age Proof"
                                    name="age-proof"
                                    containerClassName="mb-3"
                                />
                                <BrowseFile
                                    labelText="Report Card"
                                    name="report-card"
                                    containerClassName="mb-3"
                                />
                                <BrowseFile
                                    labelText="Id Proof"
                                    name="report-card"
                                    containerClassName="mb-3"
                                /> */}
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    <button type="button" onClick={previousBtnHndlr} className="btn btn-soft-success me-2">
                        Previous
                    </button>
                    <button type="button" onClick={submitHndlr} className="btn btn-success">
                        Submit
                    </button>
                </div>
            </div>
        </form >
    )
}