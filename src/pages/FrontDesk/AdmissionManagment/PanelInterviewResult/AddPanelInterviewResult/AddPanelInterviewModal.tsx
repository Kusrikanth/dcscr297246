import React, { useEffect, useState } from "react";

import { Col, Row } from "reactstrap";

import { useFormik } from "formik";

import { shallowEqual, useDispatch } from "react-redux";

import { useAppSelector } from "../../../../../hooks/storehook";
import DefaultUser from "../../../../../assets/imagesdps/default-user.png";
import { removeUnderscore } from "./helper";

const initialValues: any = {

};
const AddPanelInterViewModal = (props: any) => {

    const { reportChangeHandler, panIntResList, observationId } = props;
    const dispatch = useDispatch();
    const [
        addObservationAndInterviewReportFilterState,
        setAddObservationAndInterviewReportFilterState,
    ] = useState<any>(initialValues);
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [img, setImg] = useState<any>();
    const [panelInterviewData, setPanelInterviewData] = useState<any>({});

    const [studentState, setStudentState] = useState<any>({
        studentName : "",
        studentRegNo : "",
    });

    const AddObservationAndInterviewReportModalFilterForm = useFormik({
        initialValues: addObservationAndInterviewReportFilterState,
        enableReinitialize: true,
        // validationSchema,
        onSubmit: (values) => {

            reportChangeHandler(values)
            props.toggle()
        },
    });


    useEffect(() => {
        if (props.isOpen) {
            if (panIntResList?.length > 0) {
                let newData: any;
                panIntResList?.map((item: any) => {
                    if (+item?.id === +observationId && item?.observationAndInterviewDetailsOtherDTOS?.length) {
                       
                        newData = item;
                    } else if (+item?.id === +observationId && item?.interviewResultResponseDTO
                        ?.observationAndInterviewDetailsOtherDTOS?.length) {
                            newData = item?.interviewResultResponseDTO;  
                    }
                })

                setPanelInterviewData(newData)
            }
        } else {
            setPanelInterviewData({})
        }

        if(panIntResList?.length){
            let studentName : any;
            let studentRegNo : any;
            panIntResList?.map((item:any)=>{
                if(+item?.id === +observationId){
                    studentName= item?.studentName;
                    studentRegNo= item?.studentRegNo;
                    setImg(item?.studentImageS3URL)
                }
            })
            setStudentState({
                studentName,
                studentRegNo,
            })
        }else{
            setStudentState({
                studentName:"",
                studentRegNo:"",
            })
        }
    }, [props.isOpen])

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, notDetentionedPromotionedStudends, detainedOrPromotedClasses }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo }: any) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                notDetentionedPromotionedStudends: classroomManagmentInfo.notDetentionedPromotionedStudends,
                detainedOrPromotedClasses: classroomManagmentInfo.detainedOrPromotedClasses,
            }),
            shallowEqual
        );

    useEffect(() => {
        if (!props.isOpen) {
            AddObservationAndInterviewReportModalFilterForm.resetForm();
            setSearchStudentState(null);
            //   dispatch(resetNotDetentionedPromotionedStudentList(undefined));
        }
    }, [props.isOpen])

    useEffect(() => {
        if (academicYearListResp) {
            let yearDetails = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current");
            AddObservationAndInterviewReportModalFilterForm.setFieldValue('academicYearId', yearDetails?.academicYearId);
        }
    }, [academicYearListResp])

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    return (
        <>

            <div style={{ padding: "1.25rem" }}>

                <div className="tw-flex tw-items-center tw-justify-center tw-flex-col">
                    <div className="tw-w-16 tw-h-16 tw-flex-shrink-0 tw-rounded-full tw-mr-2">
                        <img
                            src={img || DefaultUser}
                            className="tw-w-full tw-h-full tw-block tw-rounded-full tw-object-cover"
                            style={{ border: "1px solid grey" }}
                        />

                    </div>
                    <div className="tw-font-bold tw-mt-2">
                        {studentState?.studentName}
                    </div>
                    <div style={{ color: "#405189" }} className="tw-mt-1">
                        {studentState?.studentRegNo}
                    </div>
                </div>

                <div
                    style={{ background: "#E7F0F8", margin: "1rem -1.2rem" }}
                    className="tw-text-black tw-pt-2 tw-pb-2 tw-pl-3"
                >
                    Observation and Interviewer Report - Student
                </div>

                {!(panelInterviewData?.observationAndReportDetailsDTOS?.length > 0) ? (
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <span style={{ color: "#495057" }}> Academics : </span>
                            <span className="tw-font-bold">
                                {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                    ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademics === "OTHER"))
                                        ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademics)
                                        : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademicsRemarks)}
                            </span>
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <span style={{ color: "#495057" }}> Attitude : </span>
                            <span className="tw-font-bold">
                                {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                    ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitude === "OTHER"))
                                        ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitude)
                                        : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitudeRemarks)}
                            </span>
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <span style={{ color: "#495057" }}> Communication : </span>
                            <span className="tw-font-bold">
                                {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                    ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunication === "OTHER"))
                                        ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunication)
                                        : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunicationRemarks)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                        {panelInterviewData?.observationAndReportDetailsDTOS?.map((item: any, idx: any) => (
                            <div className="tw-col-span-12 md:tw-col-span-6" key={idx}>
                                <span style={{ color: "#495057" }}> {item?.subjectName} : </span>
                                <span className="tw-font-bold">
                                    {item?.status ? removeUnderscore(item?.status) : item?.otherRemarks}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    style={{ background: "#E7F0F8", margin: "1rem -1.2rem" }}
                    className="tw-text-black tw-pt-2 tw-pb-2 tw-pl-3"
                >
                    Observation and Interviewer Report - Parent
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <span style={{ color: "#495057" }}> Attitude : </span>
                        <span className="tw-font-bold">
                            {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitude === "OTHER"))
                                    ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitude)
                                    : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitudeRemarks)}
                        </span>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <span style={{ color: "#495057" }}> Qualification : </span>
                        <span className="tw-font-bold">
                            {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualification === "OTHER"))
                                    ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualification)
                                    : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualificationRemarks)}
                        </span>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <span style={{ color: "#495057" }}> Profession : </span>
                        <span className="tw-font-bold">
                            {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfession === "OTHER"))
                                    ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfession)
                                    : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfessionRemarks)}
                        </span>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <span style={{ color: "#495057" }}> Finance : </span>
                        <span className="tw-font-bold">
                            {panelInterviewData?.observationAndInterviewDetailsOtherDTOS?.length &&
                                ((panelInterviewData && !(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinance === "OTHER"))
                                    ? removeUnderscore(panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinance)
                                    : panelInterviewData?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinanceRemarks)}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPanelInterViewModal;
