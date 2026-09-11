import React, { useEffect, useState } from 'react'
import { AutoSearchInput, SelectInput, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik'
import { shallowEqual } from 'react-redux'
import { getChangeStudentDetailListAct, getSecondLanForChangeStudentAct, getThirdLanForChangeStudentAct, saveChangeStudentDetailsAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction'
import { generateActionPayload } from '../../../utility/reduxutility'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { getBranchClassAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions'
import * as Yup from "yup";
import { getStreamList } from '../../../store/academic/assignGroup/assigngroupactions'
import Button from '../../../Components/Common/Button'

const initialValue = {
    registrationNo: "",
    studentName: "",
    changeClass: "",
    changeCurriculum:"",
    changeSecondLanguageTo:"",
    changethirdLanguageTo:"",
    search:"",
    studentId:"",
    changeGroupId:"",
}
const ChangeStudentDetailsModal = ({ toggle,academicYearId }: any) => {

    const dispatch = useAppDispatch()

    const [initialValues, setInitialValues] = useState(initialValue)
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [studentData, setStudentData] = useState<any>(null);

    const validationSchema =  Yup.object().shape({
        changeClass: Yup.string().required("Change Class is required."),
        changeCurriculum: Yup.string().required("Change Curriculum is required."),
        studentId: Yup.string().required("Student Id is required."),
        
    });
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const { changeClass,changeCurriculum,changeSecondLanguageTo,changethirdLanguageTo,changeGroupId} = values;
            const payload = { id:studentData?.id , changeClassId: changeClass,changeCurriculumId:changeCurriculum,changeSecondLanguageId:changeSecondLanguageTo,changeThirdLanguageId:changethirdLanguageTo , panelInterviewDetailId: studentData?.panelInterviewDetailId,changeGroupId:changeGroupId || null };
            dispatch(saveChangeStudentDetailsAct(generateActionPayload("save_change_student_by_id", undefined, payload)));            
        },
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getChangeStudentDetailListResp,
        getSecondLanForChangeStudentResp,
        getThirdLanForChangeStudentResp,
        showApiLoader,
        streamListResp,
    } = useAppSelector(
        ({applicationSale, globalData, instAcademics, branchAcademics, appData,assignGroupInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            streamListResp: assignGroupInfo.streamListResp,
            getChangeStudentDetailListResp:applicationSale.getChangeStudentDetailListResp,
            getSecondLanForChangeStudentResp:applicationSale.getSecondLanForChangeStudentResp,
            getThirdLanForChangeStudentResp:applicationSale.getThirdLanForChangeStudentResp,
            showApiLoader:globalData.showApiLoader,
        }),
        shallowEqual
    );
    
    function onInputSearchChange(inputString: any) {
        inputString &&  dispatch(getChangeStudentDetailListAct(generateActionPayload("get_change_student_list",undefined, {search : inputString,academicYearId,branchId})));
        }
        const selectedStudent = (student: any) => {
            // formik.setFieldValue('studentId', student?.id);
            setInitialValues((prev:any)=>({...prev,studentId : student?.id}))
            setSearchStudentState(student);

          }

          const getDetailsHandler = ()=>{
            setStudentData(searchStudentState)
            // dispatch(getChangeStudentListByIdAct(generateActionPayload("get_change_student_by_id", {id : searchStudentState.id})));
          }

          const { data: curriculumTypes } = brchCurriculumResp || {}
         const { content: classTypes } = branchClassResp || {};
         const { data: secondLanResp } = getSecondLanForChangeStudentResp || {};
         const { data: thirdLanResp } = getThirdLanForChangeStudentResp || {};

         const changeHandler = (e:any)=>{
            const { name , value } = e.target;

            

            if(name === "changeCurriculum"){
                const payload = { branchId: branchId,academicYearId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setInitialValues((prev: any) => ({ ...prev, [name]: value , changeGroupId:"",changeClass:"" }))
        }else if(name === "changeClass"){
            let params = { instituteId: instituteId, academicYearId: studentData?.academicYearId, branchId: branchId, curriculumId: initialValues?.changeCurriculum, classId: value, type: "SECOND" }
            dispatch(getSecondLanForChangeStudentAct(generateActionPayload('get_secound_language_list', undefined, params)))
            params = {...params , type : "THIRD"}
            dispatch(getThirdLanForChangeStudentAct(generateActionPayload('get_secound_language_list', undefined, params)))
            getStreams({classId:value})
            setInitialValues((prev: any) => ({ ...prev, [name]: value , changeGroupId:"" }))
            }else{
                setInitialValues((prev: any) => ({ ...prev, [name]: value }))
            }


         }

         const autoSearchInputChangeHndler = (string: any) => {
            if (!string) formik.setFieldValue('studentId', "");
            onInputSearchChange(string)
          }

          
  const getStreams = (otherProps?: any) => {
    const payload = { academicYearId: studentData?.academicYearId,curriculumId: initialValues?.changeCurriculum, branchId: branchId, ...otherProps }
    dispatch(
      getStreamList(
        generateActionPayload("get_stream_list", undefined, payload)
      )
    );
  }

  const { content: branchStreamList } = streamListResp || {};
  const { data: academicYearList } = academicYearListResp || {};
    return (
        <div>
            {/* Top Section */}
            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    {/* Academic Year */}
                    <div className="tw-col-span-12 tw-mb-3">
                        <SelectInput
                            name="academicYearId"
                            value={academicYearId}
                            onChange={undefined}
                            isDisabled={true}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                        />
                    </div>

                    {/* Search */}
                    <div className="tw-col-span-10">
                        <AutoSearchInput
                            formgroupClassName="search-box"
                            name="searchString"
                            placeHolder="Search by Student Reg No. or Name ..."
                            onChange={autoSearchInputChangeHndler}
                            valueKey="id"
                            labelKey="studentName"
                            subLabelKey="registrationNo"
                            labelHeader="Registration No"
                            subLabelHeader="Student Name"
                            labelText="Student"
                            options={getChangeStudentDetailListResp || []}
                            selected={searchStudentState}
                            selectedOptionCallbck={selectedStudent}
                            invalid={
                                formik.touched.studentId &&
                                    formik.errors.studentId
                                    ? true
                                    : false
                            }
                            error={
                                formik.touched.studentId &&
                                    formik.errors.studentId
                                    ? formik.errors.studentId
                                    : ""
                            }
                        >
                            <i className="ri-search-line search-icon"></i>
                        </AutoSearchInput>
                    </div>

                    {/* Get Details Button */}
                    <div className="tw-col-span-2 tw-flex tw-items-end">
                        <Button
                        variant='soft'
                            onClick={getDetailsHandler}
                        >
                            Get Details
                        </Button>
                    </div>
                </div>
            </div>

            <hr className="tw-border-gray-300/30 tw-m-0" />

            {/* Student Info */}
            {studentData && (
                <div>
                    <div className="tw-grid tw-grid-cols-2 tw-gap-6 tw-p-4">

                        {/* Left Column */}
                        <div className="tw-space-y-2">
                            <div className="tw-grid tw-grid-cols-2">
                                <p>Registration No. :</p>
                                <p>{studentData?.registrationNo}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Student Name :</p>
                                <p>{studentData?.studentName}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Email ID :</p>
                                <p className="tw-break-words">{studentData?.emailId}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Class :</p>
                                <p>{studentData?.classShortName}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p className="tw-m-0">Second Language :</p>
                                <p className="tw-m-0">{studentData?.secondLanguage}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="tw-space-y-2">
                            <div className="tw-grid tw-grid-cols-2">
                                <p>Academic Year :</p>
                                <p>{studentData?.academicYearName}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Admission Type :</p>
                                <p>{studentData?.admissionType}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Phone No :</p>
                                <p>{studentData?.phoneNo}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p>Curriculum :</p>
                                <p>{studentData?.curriculumName}</p>
                            </div>

                            <div className="tw-grid tw-grid-cols-2">
                                <p className="tw-m-0">Third Language :</p>
                                <p className="tw-m-0">{studentData?.thirdLanguage}</p>
                            </div>
                        </div>

                    </div>

                    <hr className="tw-border-gray-300/30 tw-m-0" />

                    {/* Change Details */}
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4">

                        <div className="tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="changeCurriculum"
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                menuItems={curriculumTypes || []}
                                value={formik.values.changeCurriculum}
                                onChange={changeHandler}
                                labelClass="required"
                                formgroupClassName="tw-pr-5"
                                labelText="Change Curriculum"
                                invalid={formik.touched.changeCurriculum && !!formik.errors.changeCurriculum}
                                error={formik.errors.changeCurriculum || ""}
                            />
                        </div>

                        <div className="tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="changeClass"
                                valueKey="id"
                                textKey="shortName"
                                menuItems={classTypes || []}
                                value={formik.values.changeClass}
                                onChange={changeHandler}
                                labelClass="required"
                                formgroupClassName="tw-pr-5"
                                labelText="Change Class"
                                invalid={(formik.touched.changeClass && formik.errors.changeClass) ? true : false}
                                error={(formik.touched.changeClass && formik.errors.changeClass) ? formik.errors.changeClass : ""}
                            />
                        </div>

                        <div className="tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="changeGroupId"
                                valueKey="id"
                                textKey="shortName"
                                menuItems={branchStreamList || []}
                                value={formik.values.changeGroupId}
                                isDisabled={!branchStreamList?.length}
                                onChange={changeHandler}
                                formgroupClassName="tw-pr-5"
                                labelText="Change Group"
                            />
                        </div>

                        <div className="tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="changeSecondLanguageTo"
                                valueKey="languageId"
                                textKey="languageName"
                                menuItems={secondLanResp || []}
                                value={formik.values.changeSecondLanguageTo}
                                onChange={changeHandler}
                                formgroupClassName="tw-pr-5"
                                labelText="Change Second Language To"
                            />
                        </div>

                        <div className="tw-col-span-6 tw-mb-3">
                            <SelectInput
                                name="changethirdLanguageTo"
                                valueKey="languageId"
                                textKey="languageName"
                                menuItems={thirdLanResp || []}
                                value={formik.values.changethirdLanguageTo}
                                onChange={changeHandler}
                                formgroupClassName="tw-pr-5"
                                labelText="Change Third Language To"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Buttons */}
            <div className="tw-flex tw-justify-end tw-gap-3 tw-mx-4 tw-my-3 tw-mt-4">
                <Button
                    type="button"
                    variant='secondary'
                    onClick={toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant='primary'
                    onClick={() => formik.handleSubmit()}
                    disabled={!studentData || showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div>

    )
}

export default ChangeStudentDetailsModal
