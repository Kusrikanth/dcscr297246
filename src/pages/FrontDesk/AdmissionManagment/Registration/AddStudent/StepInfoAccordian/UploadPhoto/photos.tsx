import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
//Helper


//Custom Hooks


//Action Generator




import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
import { uploadRegPhotosAct } from "../../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import Uploader from "./uploader";


const payloadMappingKeys: any = {
    motherPhotoUploded: "MOTHER_PHOTO",
    fathterPhotoUploded: "FATHER_PHOTO",
    studentPhotoUploded: "STUDENT_PHOTO",
    guardianPhotoUploded: "GUARDIAN_PHOTO",
    motherSignatureUploded: "MOTHER_SIGNATURE",
    fatherSignatureUploded: "FATHER_SIGNATURE",
    studentSignatureUploded: "STUDENT_SIGNATURE",
    guardianSignatureUploded: "GUARDIAN_SIGNATURE"
};
const initialValues = {
    studentPhotoUploded: false,
    studentSignatureUploded: false,
    fatherPhotoUploaded: false,
    fatherSignatureUploded: false,
    motherPhotoUploded: false,
    motherSignatureUploded: false,
    guardianPhotoUploded: false,
    guardianSignatureUploded: false
}


export default function Photos() {
    const dispatch = useAppDispatch();
    const { uploadRegPhotosResp } =
        useAppSelector(({ admissionRegistration }) => ({
            uploadRegPhotosResp: admissionRegistration.uploadRegPhotosResp,
        }), shallowEqual);

    const photosRespRef = useRef({
        prevUploadRegPhotosResp: uploadRegPhotosResp
    });

    useEffect(() => {
        const { prevUploadRegPhotosResp } = photosRespRef.current;
        if (uploadRegPhotosResp && prevUploadRegPhotosResp !== uploadRegPhotosResp) {
            toast.success("Uploaded successfully.");
        }
        photosRespRef.current.prevUploadRegPhotosResp = uploadRegPhotosResp;
    }, [uploadRegPhotosResp]);

    const photosForm = useFormik({
        initialValues,
        onSubmit: (values) => {
        }
    });


    function fileUploadHndlr(fileUploadId: string, uploadFile: any) {
        if (fileUploadId) {
            const uploadPhotoKey = payloadMappingKeys[fileUploadId];
            const formData = new FormData();
            formData.append("imageType", uploadPhotoKey);
            formData.append("file", uploadFile);
            const params = { studentId: "35692" };
            dispatch(uploadRegPhotosAct(generateActionPayload("upload_photos", params, formData, { uploadFileId: uploadPhotoKey })));
        }
    }

    return (
        <React.Fragment>
            <div className="mb-4">
                <h6 className="text-dc-dark mb-2">
                    Student Details
                </h6>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Photo"
                            uploadFileId="studentPhotoUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.studentPhotoUploded}
                        />
                    </div>
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Signature"
                            uploadFileId="studentSignatureUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.studentSignatureUploded}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h6 className="text-dc-dark mb-2">
                    Father's Details
                </h6>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Photo"
                            uploadFileId="fatherPhotoUploaded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.fatherPhotoUploaded}
                        />
                    </div>
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Signature"
                            uploadFileId="fatherSignatureUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.fatherSignatureUploded}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h6 className="text-dc-dark mb-2">
                    Mother's Details
                </h6>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Photo"
                            uploadFileId="motherPhotoUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.motherPhotoUploded}
                        />
                    </div>
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Signature"
                            uploadFileId="motherSignatureUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.motherSignatureUploded}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h6 className="text-dc-dark mb-2">
                    Guardian Details
                </h6>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Photo"
                            uploadFileId="guardianPhotoUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.guardianPhotoUploded}
                        />
                    </div>
                    <div className="col-12 col-lg-7">
                        <Uploader
                            labelText="Signature"
                            uploadFileId="guardianSignatureUploded"
                            uploadFileHandler={fileUploadHndlr}
                            isUploaded={photosForm.values.guardianSignatureUploded}
                        />
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}