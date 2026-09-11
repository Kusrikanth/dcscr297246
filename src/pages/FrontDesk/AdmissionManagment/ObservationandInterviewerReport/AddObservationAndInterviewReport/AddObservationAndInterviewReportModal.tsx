import React, { useEffect, useState } from "react";

import { Col, Row } from "reactstrap";

import { useFormik } from "formik";

import { shallowEqual, useDispatch } from "react-redux";

import * as Yup from 'yup';
import { useAppSelector } from "../../../../../hooks/storehook";
import DefaultUser from "../../../../../assets/imagesdps/default-user.png";
import {  SelectInput, TextInput } from "../../../../../Components/Common";
import { observationData } from "./helper";
import Button from "../../../../../Components/Common/Button";

const initialValues: any = {
    studentAcademics: "",
    studentAcademicsRemarks: "",
    studentAttitude: "",
    studentAttitudeRemarks: "",
    parentAttitude: "",
    parentAttitudeRemarks: "",
    parentQualification: "",
    parentQualificationRemarks: "",
    parentProfession: "",
    parentProfessionRemarks: "",
    parentFinance: "",
    parentFinanceRemarks: "",
    studentCommunication: "",
    studentCommunicationRemarks: "",
    interviewSubjectDTOS:[],
};



const AddObservationAndInterviewReportModal = (props: any) => {

    const { reportChangeHandler, observationAndInterviewReportList, observationId } = props;
    const dispatch = useDispatch();
    const [
        addObservationAndInterviewReportFilterState,
        setAddObservationAndInterviewReportFilterState,
    ] = useState<any>(initialValues);
    const [img,setImg] = useState<any>()
    const [studentState, setStudentState] = useState<any>({
        studentName : "",
        registrationNo : "",
        className:"",
    });
    const [currentAcademicYear, setCurrentAcademicYear] = useState<any>()


    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, notDetentionedPromotionedStudends, detainedOrPromotedClasses, getObservationInterviewSubjectsResp }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, interview }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                getObservationInterviewSubjectsResp: interview?.getObservationInterviewSubjectsResp,
                notDetentionedPromotionedStudends: classroomManagmentInfo.notDetentionedPromotionedStudends,
                detainedOrPromotedClasses: classroomManagmentInfo.detainedOrPromotedClasses,
            }),
            shallowEqual
        );

    
    const validationSchema = Yup.object().shape({
        studentAcademics: Yup.string().test(
            'isStudentAcademicsRequired',
            'Student Academics is required',
            (value:any)=> {
              return getObservationInterviewSubjectsResp || (value && value.trim().length > 0) ;
            }
          ),
        studentAcademicsRemarks: Yup.string().when('studentAcademics', {
            is: (studentAcademics: any) => studentAcademics === "OTHER",
            then: Yup.string()
                .required('Student Academics Remarks is required.')
        }),
        studentAttitude: Yup.string().test(
            'isStudentAttitudeRequired',
            'Student Attitude is required',
            (value:any)=> {
              return getObservationInterviewSubjectsResp || (value && value.trim().length > 0) ;
            }
          ),
        studentAttitudeRemarks: Yup.string().when('studentAttitude', {
            is: (studentAttitude: any) => studentAttitude === "OTHER",
            then: Yup.string()
                .required('Student Attitude Remarks is required.')
        }),
        studentCommunication: Yup.string().test(
            'isStudentCommunicationRequired',
            'Student Communication is required',
            (value:any)=> {
              return getObservationInterviewSubjectsResp || (value && value.trim().length > 0) ;
            }
          ),
        studentCommunicationRemarks: Yup.string().when('studentCommunication', {
            is: (studentCommunication: any) => studentCommunication === "OTHER",
            then: Yup.string()
                .required('Student Communication Remarks is required.')
        }),
        parentAttitude: Yup.string().required("Parent Attitude is required"),
        parentAttitudeRemarks: Yup.string().when('parentAttitude', {
            is: (parentAttitude: any) => parentAttitude === "OTHER",
            then: Yup.string()
                .required('Parent Attitude Remarks is required.')
        }),
        parentQualification: Yup.string().required("Parent Qualification is required"),
        parentQualificationRemarks: Yup.string().when('parentQualification', {
            is: (parentQualification: any) => parentQualification === "OTHER",
            then: Yup.string()
                .required('Parent Qualification Remarks is required.')
        }),
        parentProfession: Yup.string().required("Parent Profession is required"),
        parentProfessionRemarks: Yup.string().when('parentProfession', {
            is: (parentProfession: any) => parentProfession === "OTHER",
            then: Yup.string()
                .required('Parent Profession Remarks is required.')
        }),
        parentFinance: Yup.string().required("Parent Finance is required"),
        parentFinanceRemarks: Yup.string().when('parentFinance', {
            is: (parentFinance: any) => parentFinance === "OTHER",
            then: Yup.string()
                .required('Parent Finance Remarks is required.')
        }),
        interviewSubjectDTOS: Yup.array().of(
            Yup.object().shape({
                status: Yup.string().nullable().required("Subject is Required"),
                otherRemarks: Yup.string().nullable()
                .transform((value, originalValue) => (originalValue === null ? '' : value))
                .when('status', {
                is: (status:any) => status === 'OTHER',
                then: Yup.string().required('Remarks are required'),
  }),
            })
          ),
    });
    const AddObservationAndInterviewReportModalFilterForm:any = useFormik({
        initialValues: addObservationAndInterviewReportFilterState,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            
            reportChangeHandler(values)
            props.toggle()
        },
    });
   
    useEffect(() => {
        if (props.isOpen ) {

            const updatedData: any = observationAndInterviewReportList?.filter((item: any) =>
                +item?.id === +observationId
            );
            setImg(updatedData[0]?.studentImageS3URL)
            
            if (getObservationInterviewSubjectsResp && updatedData?.length > 0 ) {

                if (updatedData[0]?.interviewSubjectDTOS?.length > 0) {
                    setAddObservationAndInterviewReportFilterState({
                        parentAttitude: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitude || "",
                        parentAttitudeRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitudeRemarks || "",
                    parentQualification: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualification || "",
                    parentQualificationRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualificationRemarks || "",
                    parentProfession: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfession || "",
                    parentProfessionRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfessionRemarks || "",
                    parentFinance: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinance || "",
                    parentFinanceRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinanceRemarks || "",
                    interviewSubjectDTOS : updatedData[0]?.interviewSubjectDTOS,
                    studentCommunication: "",
                    studentCommunicationRemarks: "",  studentAcademics: "",
                    studentAcademicsRemarks: "",
                    studentAttitude: "",
                    studentAttitudeRemarks: "",
                    })
                    
                }
                else {
                    const newData = getObservationInterviewSubjectsResp?.map((subject: any, index: any) => ({
                        subjectId: subject?.subjectId,
                        status:"",
                        otherRemarks: "",
                    }))
                    setAddObservationAndInterviewReportFilterState((prev: any) => ({ ...prev, interviewSubjectDTOS: newData,   studentCommunication: "",
                    studentCommunicationRemarks: "",  studentAcademics: "",
                    studentAcademicsRemarks: "",
                    studentAttitude: "",
                    studentAttitudeRemarks: "", }))
                }

            }
            else if (updatedData?.length > 0 && updatedData[0]?.observationAndInterviewDetailsOtherDTOS?.length > 0) {

               
                setAddObservationAndInterviewReportFilterState((prev: any) => ({
                    ...prev,
                    studentAcademics: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademics || "",
                    studentAcademicsRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademicsRemarks || "",
                    studentAttitude: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitude || "",
                    studentAttitudeRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitudeRemarks || "",
                    parentAttitude: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitude || "",
                    parentAttitudeRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitudeRemarks || "",
                    parentQualification: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualification || "",
                    parentQualificationRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualificationRemarks || "",
                    parentProfession: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfession || "",
                    parentProfessionRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfessionRemarks || "",
                    parentFinance: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinance || "",
                    parentFinanceRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinanceRemarks || "",
                    studentCommunication: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunication || "",
                    studentCommunicationRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunicationRemarks || "",
                }))
                AddObservationAndInterviewReportModalFilterForm.setValues({
                    studentAcademics: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademics || "",
                    studentAcademicsRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAcademicsRemarks || "",
                    studentAttitude: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitude || "",
                    studentAttitudeRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentAttitudeRemarks || "",
                    parentAttitude: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitude || "",
                    parentAttitudeRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentAttitudeRemarks || "",
                    parentQualification: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualification || "",
                    parentQualificationRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentQualificationRemarks || "",
                    parentProfession: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfession || "",
                    parentProfessionRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentProfessionRemarks || "",
                    parentFinance: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinance || "",
                    parentFinanceRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.parentFinanceRemarks || "",
                    studentCommunication: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunication || "",
                    studentCommunicationRemarks: updatedData[0]?.observationAndInterviewDetailsOtherDTOS[0]?.studentCommunicationRemarks || "",
                })
            }
         
        }else{
            setAddObservationAndInterviewReportFilterState(initialValues)
        }

        if(observationAndInterviewReportList?.length){
            let studentName : any;
            let registrationNo : any;
            let className : any;
            observationAndInterviewReportList?.map((item:any)=>{
                if(+item?.id === +observationId){
                    studentName= item?.studentName;
                    registrationNo= item?.registrationNo;
                    className= item?.className;
                }
            })
            setStudentState({
                studentName,
                registrationNo,
                className,
            })
        }else{
            setStudentState({
                studentName:"",
                registrationNo:"",
                className:"",
            })
        }

    }, [props.isOpen])


    useEffect(() => {

    }, [getObservationInterviewSubjectsResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        // setAddObservationAndInterviewReportFilterState((prev:any)=>({...prev,[name] : value}))
        AddObservationAndInterviewReportModalFilterForm.handleChange(event)
        const { branchCurriculumId } = AddObservationAndInterviewReportModalFilterForm.values;
    }


    const subjectChangeHandler = (subjectId?: any, event?: any) => {
      
        let updatedData:any;
        if(event?.target?.name === "otherRemarks"){
            updatedData = AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS?.map((item: any) => {
                if (+item?.subjectId === +subjectId) {
                    return { ...item, otherRemarks: event.target.value }
                } else {
                    return item
                }
            })
        }else{
            updatedData = AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS?.map((item: any) => {
                if (+item?.subjectId === +subjectId) {
                    return { ...item, status: event.target.value }
                } else {
                    return item
                }
            })
            
        }
        // setAddObservationAndInterviewReportFilterState((prev: any) => ({ ...prev, interviewSubjectDTOS: updatedData }))
        AddObservationAndInterviewReportModalFilterForm.setFieldValue('interviewSubjectDTOS',updatedData)
    }


    useEffect(() => {
        if (!props.isOpen) {
            AddObservationAndInterviewReportModalFilterForm.resetForm();
            //   dispatch(resetNotDetentionedPromotionedStudentList(undefined));
        }
    }, [props.isOpen])

    useEffect(() => {
        if (academicYearListResp) {
            let yearDetails = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current");
            setCurrentAcademicYear(yearDetails);
            AddObservationAndInterviewReportModalFilterForm.setFieldValue('academicYearId', yearDetails.academicYearId);
        }
    }, [academicYearListResp])


    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    return (
        <>

            <div style={{ padding: "1.25rem" }}>
                {/* Profile Section */}
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
                        {studentState?.registrationNo}
                    </div>
                </div>

                <div>
                    Class : <span className="tw-font-bold"> {studentState?.className}</span>
                </div>

                {/* Student Section Header */}
                <div
                    style={{ background: "#E7F0F8", margin: "1rem -1.2rem" }}
                    className="tw-text-black tw-pt-2 tw-pb-2 tw-pl-3"
                >
                    Observation and Interviewer Report - Student
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                    {!getObservationInterviewSubjectsResp ? (
                        <>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <div className="tw-relative">
                                    <SelectInput
                                        name="studentAcademics"
                                        labelText="Academics"
                                        value={AddObservationAndInterviewReportModalFilterForm?.values?.studentAcademics}
                                        onChange={filterHandler}
                                        menuItems={observationData}
                                        valueKey="behaviour"
                                        textKey="show"
                                        formgroupClassName="tw-mb-0"
                                        invalid={(AddObservationAndInterviewReportModalFilterForm.touched.studentAcademics && AddObservationAndInterviewReportModalFilterForm.errors.studentAcademics) ? true : false}
                                        error={(AddObservationAndInterviewReportModalFilterForm.touched.studentAcademics && AddObservationAndInterviewReportModalFilterForm.errors.studentAcademics) ? AddObservationAndInterviewReportModalFilterForm.errors.studentAcademics : ""}
                                    />
                                </div>
                            </div>

                            {AddObservationAndInterviewReportModalFilterForm?.values?.studentAcademics === "OTHER" && (
                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextInput
                                        name={'studentAcademicsRemarks'}
                                        value={AddObservationAndInterviewReportModalFilterForm?.values?.studentAcademicsRemarks}
                                        formgroupClassName="tw-mb-0"
                                        onChange={AddObservationAndInterviewReportModalFilterForm.handleChange}
                                        labelText='Academics Remarks'
                                        invalid={AddObservationAndInterviewReportModalFilterForm.touched.studentAcademicsRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentAcademicsRemarks ? true : false}
                                        error={AddObservationAndInterviewReportModalFilterForm.touched.studentAcademicsRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentAcademicsRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.studentAcademicsRemarks : ""}
                                    />
                                </div>
                            )}

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <SelectInput
                                    name="studentAttitude"
                                    labelText="Attitude"
                                    value={AddObservationAndInterviewReportModalFilterForm?.values?.studentAttitude}
                                    onChange={filterHandler}
                                    menuItems={observationData}
                                    valueKey="behaviour"
                                    textKey="show"
                                    invalid={(AddObservationAndInterviewReportModalFilterForm.touched.studentAttitude && AddObservationAndInterviewReportModalFilterForm.errors.studentAttitude) ? true : false}
                                    error={(AddObservationAndInterviewReportModalFilterForm.touched.studentAttitude && AddObservationAndInterviewReportModalFilterForm.errors.studentAttitude) ? AddObservationAndInterviewReportModalFilterForm.errors.studentAttitude : ""}
                                />
                            </div>

                            {AddObservationAndInterviewReportModalFilterForm?.values?.studentAttitude === "OTHER" && (
                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextInput
                                        name={'studentAttitudeRemarks'}
                                        value={AddObservationAndInterviewReportModalFilterForm?.values?.studentAttitudeRemarks}
                                        formgroupClassName="tw-mb-0"
                                        onChange={AddObservationAndInterviewReportModalFilterForm.handleChange}
                                        labelText='Attitude Remarks'
                                        invalid={AddObservationAndInterviewReportModalFilterForm.touched.studentAttitudeRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentAttitudeRemarks ? true : false}
                                        error={AddObservationAndInterviewReportModalFilterForm.touched.studentAttitudeRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentAttitudeRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.studentAttitudeRemarks : ""}
                                    />
                                </div>
                            )}

                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <SelectInput
                                    name="studentCommunication"
                                    labelText="Communication"
                                    value={AddObservationAndInterviewReportModalFilterForm?.values?.studentCommunication}
                                    onChange={filterHandler}
                                    menuItems={observationData}
                                    valueKey="behaviour"
                                    textKey="show"
                                    formgroupClassName="tw-mb-0"
                                    invalid={(AddObservationAndInterviewReportModalFilterForm.touched.studentCommunication && AddObservationAndInterviewReportModalFilterForm.errors.studentCommunication) ? true : false}
                                    error={(AddObservationAndInterviewReportModalFilterForm.touched.studentCommunication && AddObservationAndInterviewReportModalFilterForm.errors.studentCommunication) ? AddObservationAndInterviewReportModalFilterForm.errors.studentCommunication : ""}
                                />
                            </div>

                            {AddObservationAndInterviewReportModalFilterForm?.values?.studentCommunication === "OTHER" && (
                                <div className="tw-col-span-12 md:tw-col-span-6">
                                    <TextInput
                                        name={'studentCommunicationRemarks'}
                                        value={AddObservationAndInterviewReportModalFilterForm?.values?.studentCommunicationRemarks}
                                        formgroupClassName="tw-mb-0"
                                        onChange={AddObservationAndInterviewReportModalFilterForm.handleChange}
                                        labelText='Communication Remarks'
                                        invalid={AddObservationAndInterviewReportModalFilterForm.touched.studentCommunicationRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentCommunicationRemarks ? true : false}
                                        error={AddObservationAndInterviewReportModalFilterForm.touched.studentCommunicationRemarks && AddObservationAndInterviewReportModalFilterForm.errors.studentCommunicationRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.studentCommunicationRemarks : ""}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {getObservationInterviewSubjectsResp?.map((item: any, index: any) => (
                                <>
                                    <div className="tw-col-span-12 md:tw-col-span-6" key={index}>
                                        <SelectInput
                                            name={"status"}
                                            labelText={item?.subjectName}
                                            value={AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS?.length && AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS[index]?.status}
                                            onChange={(event: any) => subjectChangeHandler(item?.subjectId, event)}
                                            menuItems={observationData}
                                            valueKey="behaviour"
                                            textKey="show"
                                            invalid={Array.isArray(AddObservationAndInterviewReportModalFilterForm.touched.interviewSubjectDTOS) && Array.isArray(AddObservationAndInterviewReportModalFilterForm.errors.interviewSubjectDTOS) && (AddObservationAndInterviewReportModalFilterForm.touched?.interviewSubjectDTOS[index]?.status && AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.status) ? true : false}
                                            error={Array.isArray(AddObservationAndInterviewReportModalFilterForm.touched.interviewSubjectDTOS) && Array.isArray(AddObservationAndInterviewReportModalFilterForm.errors.interviewSubjectDTOS) && (AddObservationAndInterviewReportModalFilterForm.touched?.interviewSubjectDTOS[index]?.status && AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.status) ? AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.status : ""}
                                        />
                                    </div>
                                    {AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS?.length && AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS[index]?.status === "OTHER" && (
                                        <div className="tw-col-span-12 md:tw-col-span-6">
                                            <TextInput
                                                name={'otherRemarks'}
                                                value={AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS?.length && AddObservationAndInterviewReportModalFilterForm?.values?.interviewSubjectDTOS[index]?.otherRemarks}
                                                formgroupClassName="tw-mb-0"
                                                onChange={(event: any) => subjectChangeHandler(item?.subjectId, event)}
                                                labelText={item?.subjectName + " Remarks"}
                                                invalid={Array.isArray(AddObservationAndInterviewReportModalFilterForm.touched.interviewSubjectDTOS) && Array.isArray(AddObservationAndInterviewReportModalFilterForm.errors.interviewSubjectDTOS) && (AddObservationAndInterviewReportModalFilterForm.touched?.interviewSubjectDTOS[index]?.otherRemarks && AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.otherRemarks) ? true : false}
                                                error={Array.isArray(AddObservationAndInterviewReportModalFilterForm.touched.interviewSubjectDTOS) && Array.isArray(AddObservationAndInterviewReportModalFilterForm.errors.interviewSubjectDTOS) && (AddObservationAndInterviewReportModalFilterForm.touched?.interviewSubjectDTOS[index]?.otherRemarks && AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.otherRemarks) ? AddObservationAndInterviewReportModalFilterForm.errors?.interviewSubjectDTOS[index]?.otherRemarks : ""}
                                            />
                                        </div>
                                    )}
                                </>
                            ))}
                        </>
                    )}
                </div>

                {/* Parent Section Header */}
                <div
                    style={{ background: "#E7F0F8", margin: "1rem -1.2rem" }}
                    className="tw-text-black tw-pt-2 tw-pb-2 tw-pl-3"
                >
                    Observation and Interviewer Report - Parent
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <div className="tw-relative">
                            <SelectInput
                                name="parentAttitude"
                                labelText="Attitude"
                                value={AddObservationAndInterviewReportModalFilterForm?.values?.parentAttitude}
                                onChange={filterHandler}
                                menuItems={observationData}
                                valueKey="behaviour"
                                textKey="show"
                                formgroupClassName="tw-mb-0"
                                invalid={(AddObservationAndInterviewReportModalFilterForm.touched.parentAttitude && AddObservationAndInterviewReportModalFilterForm.errors.parentAttitude) ? true : false}
                                error={(AddObservationAndInterviewReportModalFilterForm.touched.parentAttitude && AddObservationAndInterviewReportModalFilterForm.errors.parentAttitude) ? AddObservationAndInterviewReportModalFilterForm.errors.parentAttitude : ""}
                            />
                        </div>
                    </div>

                    {AddObservationAndInterviewReportModalFilterForm?.values.parentAttitude === "OTHER" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name={'parentAttitudeRemarks'}
                                value={AddObservationAndInterviewReportModalFilterForm?.values.parentAttitudeRemarks}
                                formgroupClassName="tw-mb-0"
                                onChange={filterHandler}
                                labelText='Academics Remarks'
                                invalid={AddObservationAndInterviewReportModalFilterForm.touched.parentAttitudeRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentAttitudeRemarks ? true : false}
                                error={AddObservationAndInterviewReportModalFilterForm.touched.parentAttitudeRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentAttitudeRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.parentAttitudeRemarks : ""}
                            />
                        </div>
                    )}

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="parentQualification"
                            labelText="Qualification"
                            value={AddObservationAndInterviewReportModalFilterForm?.values.parentQualification}
                            onChange={filterHandler}
                            menuItems={observationData}
                            valueKey="behaviour"
                            textKey="show"
                            formgroupClassName="tw-mb-0"
                            invalid={(AddObservationAndInterviewReportModalFilterForm.touched.parentQualification && AddObservationAndInterviewReportModalFilterForm.errors.parentQualification) ? true : false}
                            error={(AddObservationAndInterviewReportModalFilterForm.touched.parentQualification && AddObservationAndInterviewReportModalFilterForm.errors.parentQualification) ? AddObservationAndInterviewReportModalFilterForm.errors.parentQualification : ""}
                        />
                    </div>

                    {AddObservationAndInterviewReportModalFilterForm?.values.parentQualification === "OTHER" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name={'parentQualificationRemarks'}
                                value={AddObservationAndInterviewReportModalFilterForm?.values.parentQualificationRemarks}
                                formgroupClassName="tw-mb-0"
                                onChange={filterHandler}
                                labelText='Qualification Remarks'
                                invalid={AddObservationAndInterviewReportModalFilterForm.touched.parentQualificationRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentQualificationRemarks ? true : false}
                                error={AddObservationAndInterviewReportModalFilterForm.touched.parentQualificationRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentQualificationRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.parentQualificationRemarks : ""}
                            />
                        </div>
                    )}

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="parentProfession"
                            labelText="Profession"
                            value={AddObservationAndInterviewReportModalFilterForm?.values?.parentProfession}
                            onChange={filterHandler}
                            menuItems={observationData}
                            valueKey="behaviour"
                            textKey="show"
                            formgroupClassName="tw-mb-0"
                            invalid={(AddObservationAndInterviewReportModalFilterForm.touched.parentProfession && AddObservationAndInterviewReportModalFilterForm.errors.parentProfession) ? true : false}
                            error={(AddObservationAndInterviewReportModalFilterForm.touched.parentProfession && AddObservationAndInterviewReportModalFilterForm.errors.parentProfession) ? AddObservationAndInterviewReportModalFilterForm.errors.parentProfession : ""}
                        />
                    </div>

                    {AddObservationAndInterviewReportModalFilterForm?.values?.parentProfession === "OTHER" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name={'parentProfessionRemarks'}
                                value={AddObservationAndInterviewReportModalFilterForm?.values?.parentProfessionRemarks}
                                formgroupClassName="tw-mb-0"
                                onChange={filterHandler}
                                labelText='Profession Remarks'
                                invalid={AddObservationAndInterviewReportModalFilterForm.touched.parentProfessionRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentProfessionRemarks ? true : false}
                                error={AddObservationAndInterviewReportModalFilterForm.touched.parentProfessionRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentProfessionRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.parentProfessionRemarks : ""}
                            />
                        </div>
                    )}

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="parentFinance"
                            labelText="Finance"
                            value={AddObservationAndInterviewReportModalFilterForm?.values?.parentFinance}
                            onChange={filterHandler}
                            menuItems={observationData}
                            valueKey="behaviour"
                            textKey="show"
                            formgroupClassName="tw-mb-0"
                            invalid={(AddObservationAndInterviewReportModalFilterForm.touched.parentFinance && AddObservationAndInterviewReportModalFilterForm.errors.parentFinance) ? true : false}
                            error={(AddObservationAndInterviewReportModalFilterForm.touched.parentFinance && AddObservationAndInterviewReportModalFilterForm.errors.parentFinance) ? AddObservationAndInterviewReportModalFilterForm.errors.parentFinance : ""}
                        />
                    </div>

                    {AddObservationAndInterviewReportModalFilterForm?.values?.parentFinance === "OTHER" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name={'parentFinanceRemarks'}
                                value={AddObservationAndInterviewReportModalFilterForm?.values?.parentFinanceRemarks}
                                formgroupClassName="tw-mb-0"
                                onChange={filterHandler}
                                labelText='Finance Remarks'
                                invalid={AddObservationAndInterviewReportModalFilterForm.touched.parentFinanceRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentFinanceRemarks ? true : false}
                                error={AddObservationAndInterviewReportModalFilterForm.touched.parentFinanceRemarks && AddObservationAndInterviewReportModalFilterForm.errors.parentFinanceRemarks ? AddObservationAndInterviewReportModalFilterForm.errors.parentFinanceRemarks : ""}
                            />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={(event: any) => AddObservationAndInterviewReportModalFilterForm.handleSubmit(event)}
                    >
                        Submit
                    </Button>
                </div>
            </div>

        </>
    );
};

export default AddObservationAndInterviewReportModal;
