import React, { useEffect, useRef, useState } from 'react'
import { ConfirmationModal, InputCheckbox, ModalContainerUpdated, SelectInput, TextArea } from '../../../../Components/Common'
import { useFormik } from 'formik'
import { ScritinyPrevStatus, StatusLabelsOptions } from './helper';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateAdmissionFormPdf2Act, generateAdmissionFormPdfAct, getPreliminaryScrutinyById, resetPreliminaryScrutinyById, setPreliminaryScrutiny } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppSelector } from '../../../../hooks/storehook';
import { getInstBranchesAct } from '../../../../store/mastersettings/branch/branchactions';
import ShowDocumentModal from './ShowDocumentModal';
import * as Yup from 'yup'
import { getBranchClassAct, getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import Button from '../../../../Components/Common/Button';

const optionValues = [
    {
        text: "Docuements",
        id: "isDocumentTicked",
        value: false
    },
    {
        text: "Photographs",
        id: "isPhotosTicked",
        value: false
    },
    {
        text: "Signatures",
        id: "isSignatureTicked",
        value: false
    }
]

const PreliminaryScrutinyModal = ({ toggle, scrutinyId, studentRegId, modalData,isOpen }: any) => {

    function downloadExcelFile(blobStream: any, fileName: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const dispatch = useDispatch();

    const [correctionForValues, setCorrectionForValues] = useState(optionValues)
    const [campusState, setCampusState] = useState([]);
    const [showDocumentModal, setShowDocumentModal] = useState<any>({
        showModal: false,
        regId: undefined,
    })

    const initialValue = {
        academicYearId:"",
        status: "",
        campusId: "",
        remarks: "",
        reason:"",
        curriculumId: "",
        classId: "",
    }
    const [initialValues, setInitialValues] = useState(initialValue);
    const [consolidatedViewConformationModal, setConsolidatedViewConformationModal] = useState<any>({
        showModal: false,
        regId: undefined
    })

    useEffect(() => {
    if(!isOpen){
        setInitialValues(initialValue)
    }
    }, [isOpen])

    const {
        preliminaryScrutinyById,
        branchListResp,
        applicationSaleError,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        generateAdmissionFormPdfResp,
        generateAdmissionFormPdf2Resp,
        showApiLoader,
        brchCurriculumResp,
        branchClassResp,
        academicYearListResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale, branch }) => ({
            preliminaryScrutinyById: applicationSale.preliminaryScrutinyById,
            branchListResp: branch.branchListResp,
            applicationSaleError: applicationSale.applicationSaleError,
            generateAdmissionFormPdfResp: applicationSale.generateAdmissionFormPdfResp,
            generateAdmissionFormPdf2Resp: applicationSale.generateAdmissionFormPdf2Resp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    const toggleShowDocumentModal = (regId?: any) => {
        setShowDocumentModal((prev: any) => ({ ...prev, showModal: !prev.showModal, regId: regId }))
    }

    const preliminaryScrutinyModalRef = useRef({
        prevGenerateAdmissionFormPdf2Resp: generateAdmissionFormPdf2Resp
    })

    useEffect(() => {
        const { prevGenerateAdmissionFormPdf2Resp } = preliminaryScrutinyModalRef.current;
        if (generateAdmissionFormPdf2Resp && generateAdmissionFormPdf2Resp !== prevGenerateAdmissionFormPdf2Resp) {
            // toggleConsolidatedViewConfomationModal(undefined);
            downloadExcelFile(generateAdmissionFormPdf2Resp, "ConsolidatedView.pdf");
        }

        preliminaryScrutinyModalRef.current.prevGenerateAdmissionFormPdf2Resp = generateAdmissionFormPdf2Resp;
    }, [generateAdmissionFormPdf2Resp])

    // const handleChange = (event: any) => {
    //     const { name, value } = event.target;
    //     let checkboxValues = correctionForValues;
    //     checkboxValues = checkboxValues.map((val: any) => val.text === name ? { ...val, value: !val.value } : val);
    //     setCorrectionForValues(checkboxValues);
    // }

    const validationSchema = Yup.object().shape({
        status: Yup.string().required("Status is required."),
        reason: Yup.string().when('status', {
            is: (status: any) => status === "ON_HOLD",
            then: Yup.string().required("reason is required."),
            otherwise: Yup.string().notRequired(),
        }),
        campusId: Yup.string().when('reason', {
            is: (reason: any) => reason === "RECOMMENDED_FOR_OTHER_CAMPUS",
            then: Yup.string().required("Campus is required."),
            otherwise: Yup.string().notRequired(),
        }),
        curriculumId: Yup.string().when(["status", "reason"], {
            is: (status: string, reason: string) =>
            status === "ON_HOLD" && reason === "RECOMMENDED_FOR_OTHER_CAMPUS",
            then: (schema) => schema.required("Curriculum is required."),
            otherwise: (schema) => schema.notRequired(),
        }),

        classId: Yup.string().when(["status", "reason"], {
            is: (status: string, reason: string) =>
            status === "ON_HOLD" && reason === "RECOMMENDED_FOR_OTHER_CAMPUS",
            then: (schema) => schema.required("Class is required."),
            otherwise: (schema) => schema.notRequired(),
        }),

    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            let payload:any;
            if(values?.status == "ON_HOLD"){
                if(values?.reason === "RECOMMENDED_FOR_OTHER_CAMPUS"){
                    payload = {
                       recommendedCampus: values?.campusId,
                       remarks: null,
                       approvalStatus: values?.status,
                       scrutinyId: scrutinyId,
                       isRecommendedCampus : true,
                       curriculumId:values?.curriculumId,
                       recommendedClassId:values?.classId
                   }
                }else{
                    payload = {
                        remarks: values?.remarks || null,
                        approvalStatus: values?.status,
                        scrutinyId: scrutinyId,
                        isRecommendedCampus : false,
                    }
                }
            }else if(values?.status == "APPROVED"){
                payload = {
                    remarks: null,
                    approvalStatus: values.status,
                    scrutinyId: scrutinyId,
                }
            }else if(values?.status == "REJECTED"){
                payload = {
                    remarks: values?.remarks,
                    approvalStatus: values?.status,
                    scrutinyId: scrutinyId,
                }
            }
            dispatch(setPreliminaryScrutiny(generateActionPayload('update_priliminary_scrutiny', undefined, payload)))
        },
    });
    // useEffect(() => {
    //     if (preliminaryScrutinyById) {
    //         setInitialValues({
    //             status: preliminaryScrutinyById?.scrutinyStatus,
    //             campusId: "",
    //             remarks: preliminaryScrutinyById?.remarks,
    //             isDocumentTicked: preliminaryScrutinyById?.isDocumentTicked,
    //             isPhotosTicked: preliminaryScrutinyById?.isPhotosTicked,
    //             isSignatureTicked: preliminaryScrutinyById?.isSignatureTicked
    //         })
    //     }
    // }, [preliminaryScrutinyById])

    useEffect(() => {
        if (studentRegId) {
            dispatch(getPreliminaryScrutinyById(generateActionPayload('priliminary_scrutiny_by_id', undefined, { scrutinyId: scrutinyId, studentRegId: studentRegId })))
        }
    }, [studentRegId])

    useEffect(() => {
        const payload = { pageSize: 100, pageNo: 0, instituteId: instituteId };
        dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true })));
        return () => {
            dispatch(resetPreliminaryScrutinyById(undefined));
        }
    }, [])
    useEffect(() => {
        if (branchListResp) {
            setCampusState(branchListResp.data.filter((branch: any) => branch.branchId != branchId))
        }
    }, [branchListResp])

    useEffect(() => {
        if (preliminaryScrutinyById) {
            const {academicsApproveStatus,recommendedCampusName} = preliminaryScrutinyById || {};
            setInitialValues((prev:any) => ({...prev,academicYearId: preliminaryScrutinyById.academicYearId}))
            if(academicsApproveStatus?.toLowerCase() === "on_hold"){
                if(recommendedCampusName){
                    setInitialValues((prev: any) => ({ ...prev, status: preliminaryScrutinyById?.academicsApproveStatus, campusId: preliminaryScrutinyById?.recommendedCampus, remarks: preliminaryScrutinyById?.academicsApproveRemarks,
                    reason:"RECOMMENDED_FOR_OTHER_CAMPUS" }))
                }else{
                    setInitialValues((prev: any) => ({ ...prev, status: preliminaryScrutinyById?.academicsApproveStatus, remarks: preliminaryScrutinyById?.academicsApproveRemarks,reason:"OTHER", }))
                }
            }else{
                setInitialValues((prev: any) => ({ ...prev, remarks: preliminaryScrutinyById?.academicsApproveRemarks }))
            }
        }

    }, [preliminaryScrutinyById])

    const statusChangeHandler = (event: any) => {
        formik.handleChange(event);
        formik.setFieldValue('campusId', "")
        formik.setFieldValue('reason', "")
    }

    function fetchCurriculumList(otherProps?: any) {
        const payload = {
          academicYearId: formik.values.academicYearId,
          branchId:formik.values.campusId,
          pageNo: 0,
          pageSize: 100,
          sortBy: "curriculumName",
          orderBy: "asc",
          ...otherProps,
        };
    
        dispatch(
          getBranchCurriculumAct(
            generateActionPayload("get_brch_curriculum", undefined, payload)
          )
        );
      }

      function fetchClassNamesList(otherProps?: any) {
          const { academicYearId, curriculumId,campusId } = formik.values;
          const payload = {
            branchId:campusId,
            academicYearId,
            curriculumId,
            sortBy: "classSequence",
            orderBy: "asc",
            pageNo: 0,
            pageSize: 100,
            ...otherProps,
          };
      
          dispatch(
            getBranchClassAct(
              generateActionPayload("get_brch_curriculum_class", undefined, payload)
            )
          );
        }

    function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if(name === "reason"){
            formik.setValues((prev:any) => ({
                ...prev,
                [name]:value,
                campusId:"",
                curriculumId:"",
                classId:"",
            }))
        }
        else if(name === "campusId"){
            formik.setValues((prev:any) => ({
                ...prev,
                [name]:value,
                curriculumId:"",
                classId:"",
            }))
            if(value){
                fetchCurriculumList({ academicYearId: formik.values.academicYearId,branchId:value });
            }
        }
        else if(name === "curriculumId"){
            formik.setValues((prev:any) => ({
                ...prev,
                [name]:value,
                classId:"",
            }))
            if(value){
                fetchClassNamesList({
                    curriculumId:value
                })
            }
        }
        else {
            formik.setValues((prev:any) => ({
                ...prev,
                [name]:value
            }))
        }
    }



    const toggleConsolidatedViewConfomationModal = (regId?:any) => {
        setConsolidatedViewConformationModal((prev: any) => ({ ...prev, showModal: !prev.showModal, studentRegId: regId }));
    }
    const consolidateViewSubmitHandler = () => {
        dispatch(generateAdmissionFormPdfAct(generateActionPayload('generate_admission_form_pdf', { id: consolidatedViewConformationModal.studentRegId },undefined,{
            responseType: 'blob'
        })))
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};    

    return (
        <>
            <div>                <div className="tw-grid tw-grid-cols-12 tw-p-4">
                    <div className="tw-col-span-6">
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Registration No. :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.studentRegistrationNo}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Student Name :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.studentName}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Email ID :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p style={{ wordBreak: "break-word" }}>{preliminaryScrutinyById?.emailId}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Payment Mode :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.mode}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Points Description</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.pointsDescription}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Remarks :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.academicsApproveRemarks}</p>
                            </div>
                        </div>
                    </div>
                    <div className="tw-col-span-6">
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Academic Year :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.academicYearName}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Admission Type :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.admissionType}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Phone No :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.contactNo}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Total Points :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.totalPoints}</p>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-6">
                                <p>Address :</p>
                            </div>
                            <div className="tw-col-span-6">
                                <p>{preliminaryScrutinyById?.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr style={{ margin: 0, color: "#38414A26" }} />

                <div className="tw-grid tw-grid-cols-12 tw-p-4">
                    <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-3">
                        <SelectInput
                            name="status"
                            valueKey="id"
                            textKey="value"
                            menuItems={StatusLabelsOptions}
                            value={formik.values.status}
                            onChange={statusChangeHandler}
                            onBlur={formik.handleBlur}
                            formgroupClassName="tw-pr-5"
                            invalid={formik.touched.status && formik.errors.status ? true : false}
                            error={formik.touched.status && formik.errors.status ? formik.errors.status : ""}
                            labelText="Status"
                        />
                    </div>

                    {formik.values?.status === "ON_HOLD" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="reason"
                                valueKey="id"
                                textKey="value"
                                menuItems={ScritinyPrevStatus}
                                value={formik.values.reason}
                                onChange={filterHandler}
                                onBlur={formik.handleBlur}
                                formgroupClassName="tw-pr-5"
                                invalid={formik.touched.reason && formik.errors.reason ? true : false}
                                error={formik.touched.reason && formik.errors.reason ? formik.errors.reason : ""}
                                labelText="Reason"
                            />
                        </div>
                    )}

                    {formik.values?.status === "ON_HOLD" && formik.values?.reason === "RECOMMENDED_FOR_OTHER_CAMPUS" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="campusId"
                                valueKey="branchId"
                                textKey="branchName"
                                menuItems={campusState}
                                value={formik.values.campusId}
                                onChange={filterHandler}
                                formgroupClassName="tw-pr-5"
                                invalid={formik.touched.campusId && formik.errors.campusId ? true : false}
                                error={formik.touched.campusId && formik.errors.campusId ? formik.errors.campusId : ""}
                                isDisabled={formik.values.status !== "ON_HOLD"}
                                labelText="Recommend For Campus"
                            />
                        </div>
                    )}

                    {formik.values?.status === "ON_HOLD" && formik.values?.reason === "RECOMMENDED_FOR_OTHER_CAMPUS" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="curriculumId"
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                menuItems={curriculumTypes}
                                value={formik.values.curriculumId}
                                onChange={filterHandler}
                                formgroupClassName="tw-pr-5"
                                invalid={formik.touched.curriculumId && formik.errors.curriculumId ? true : false}
                                error={formik.touched.curriculumId && formik.errors.curriculumId ? formik.errors.curriculumId : ""}
                                isDisabled={formik.values.status !== "ON_HOLD"}
                                labelText="Curriculum"
                            />
                        </div>
                    )}

                    {formik.values?.status === "ON_HOLD" && formik.values?.reason === "RECOMMENDED_FOR_OTHER_CAMPUS" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="classId"
                                valueKey="id"
                                textKey="shortName"
                                menuItems={classTypes || []}
                                value={formik.values.classId}
                                onChange={filterHandler}
                                formgroupClassName="tw-pr-5"
                                invalid={formik.touched.classId && formik.errors.classId ? true : false}
                                error={formik.touched.classId && formik.errors.classId ? formik.errors.classId : ""}
                                isDisabled={formik.values.status !== "ON_HOLD"}
                                labelText="Class"
                            />
                        </div>
                    )}

                    {((formik.values?.status === "ON_HOLD" && formik.values?.reason === "OTHER") || formik.values?.status === "REJECTED") && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextArea
                                name="remarks"
                                value={formik.values.remarks}
                                onChange={formik.handleChange}
                                formgroupClassName="tw-mb-0"
                                labelText="Remarks"
                            />
                        </div>
                    )}
                </div>

                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12 tw-flex tw-w-auto tw-ml-auto tw-mx-4 tw-my-3 tw-gap-2">
                        <Button
                            type="submit"
                            variant='reject'
                            onClick={() => toggle()}
                        >
                            Cancel
                        </Button>
                        <Button
                        variant='info'
                            onClick={() => {
                                dispatch(generateAdmissionFormPdf2Act(generateActionPayload('generate_admission_form_pdf', { id: studentRegId }, undefined, {
                                    responseType: 'blob'
                                })))
                            }}
                        >
                            Download Consolidated Report
                        </Button>
                        <Button
                            type="submit"
                            variant='primary'
                            disabled={showApiLoader}
                            onClick={(event: any) => formik.handleSubmit(event)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
            {/* <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={consolidatedViewConformationModal.showModal}
                confirmMessage="Are you sure you want to download consolidated report ?"
                cancelHndlr={toggleConsolidatedViewConfomationModal}
                confirmHndlr={consolidateViewSubmitHandler}
            /> */}
            <ModalContainerUpdated
                id=""
                isOpen={showDocumentModal.showModal}
                toggle={() => toggleShowDocumentModal()}
                modalTitle={`Reg. No ${preliminaryScrutinyById?.studentRegistrationNo} Documents`}
                modalSize="lg"
            >
                <ShowDocumentModal regId={showDocumentModal.regId} />
            </ModalContainerUpdated>
        </>
    )
}

export default PreliminaryScrutinyModal
