import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {  useFormik, } from "formik";
import { SelectInput } from "../../Components/Common";
import TableContainer from "../../Components/Common/TableContainer";
import { useAppSelector } from "../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../utility/reduxutility";
import * as Yup from 'yup';
import { getAssignCurriculumListAct, getAssignLanClassListAct, getAssignLanSectionListAct, getStuLanguagesListAct, updateAssignLanguagesAct } from "../../store/assignlanguages/assignlanguagesaction";
import { addAssignLangGenerateColumns, computeSubmitButtonError } from "./helper";
import { getSecoundLanguagesList, getThirdLanForChangeStudentAct, resetSecoundLanguageListAct, resetThirdLanForChangeStudentAct } from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { resetAssignLanClassListAct, resetAssignLanSectionListAct, resetStuLanguagesListAct } from "../../store/assignlanguages/assignlanguagesslice";
import { toast } from "react-toastify";
import { getBranchCurriculumAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../Components/Common/Button";


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required'),
    curriculumId: Yup.string().required('Curriculum is required'),
    classId: Yup.string().required('Class is required'),
    sectionId: Yup.string().required('Section is required'),
})

const AddAssignLanguageModel: React.FC<any> = (props) => {

    const { modalData } = props || {};
    const [languageState, setLanguageState] = useState<any>({
        secondLanguageId: "",
        thirdLanguageId:"",
    });
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

    const [studentList, setStudentList] = useState<any>([]);

    const dispatch = useDispatch();

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        secoundLanguageResp,
        assignLanguagesErrResp, 
        getAssignLanSectionListResp,
        getThirdLanForChangeStudentResp,
        getStuLanguagesListResp,
        getAssignLanClassListResp,
        getAssignListCurriculumResp
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData,  assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            secoundLanguageResp:applicationSale.secoundLanguageResp,
            assignLanguagesErrResp: assignLanguages.assignLanguagesErrResp,
            getStuLanguagesListResp: assignLanguages.getStuLanguagesListResp,
            getThirdLanForChangeStudentResp:applicationSale.getThirdLanForChangeStudentResp,
            getAssignLanSectionListResp:assignLanguages.getAssignLanSectionListResp,
            getAssignLanClassListResp:assignLanguages.getAssignLanClassListResp,
            getAssignListCurriculumResp:assignLanguages.getAssignListCurriculumResp
        }),
        shallowEqual
    );

    const addAssignLangRef = useRef<any>({
        prevAssignLanguagesErrResp: assignLanguagesErrResp,
        prevGetStuLanguagesListResp:getStuLanguagesListResp,
    });

    useEffect(() => {
        const { prevAssignLanguagesErrResp, prevGetStuLanguagesListResp } = addAssignLangRef.current;

        if(assignLanguagesErrResp && assignLanguagesErrResp !== prevAssignLanguagesErrResp) {
            const {details} = assignLanguagesErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if(getStuLanguagesListResp && getStuLanguagesListResp !== prevGetStuLanguagesListResp) {
            const { data } = getStuLanguagesListResp || {};
            setStudentList(data?.map((i:any)=>({...i,isSelected : false})) || []);
        }

        addAssignLangRef.current.prevAssignLanguagesErrResp = assignLanguagesErrResp;
        addAssignLangRef.current.prevGetStuLanguagesListResp = getStuLanguagesListResp;
    }, [assignLanguagesErrResp,getStuLanguagesListResp]);

    const addLanguageStateFormik = useFormik({
        // enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            setAllStudentSelectedState(false)
            stuLanguagesList(values)
            thirdLanguageApi(values)
            secondLanguageApi(values)
        },
    });

    useEffect(() => {

        if (modalData) {
            const { academicYearId, curriculumId, classId, sectionId } = modalData || {};
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId }));

            if(academicYearId){
                getCurriculumApiCall({ academicYearId })
            }
            if(curriculumId){                
                const payload = { branchId: branchId, academicYearId, curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            if(classId){
                getSectionListResp({masterAcademicYearId: academicYearId, curriculumId,branchClassId: classId,})
            }

            if (academicYearId && curriculumId && classId && sectionId) {
                stuLanguagesList({ academicYearId, curriculumId, classId, sectionId })
                secondLanguageApi({ academicYearId, curriculumId, classId, sectionId })
                thirdLanguageApi({ academicYearId, curriculumId, classId, sectionId })
            }

        }

        return () => {
            addLanguageStateFormik.resetForm();
            dispatch(resetThirdLanForChangeStudentAct(undefined))
            dispatch(resetSecoundLanguageListAct(undefined))
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetStuLanguagesListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
        }
    }, [])

    const stuLanguagesList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId, sectionId } = addLanguageStateFormik.values;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            sectionId,
            pageNo: 0, pageSize: 100,
            ...otherProps,
        };
        if (payload.academicYearId && payload.curriculumId && payload.classId && payload.sectionId) {
            dispatch(getStuLanguagesListAct(generateActionPayload('assign_language_list', undefined, payload)))
        }
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : addLanguageStateFormik.values?.academicYearId, curriculumId: addLanguageStateFormik.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addLanguageStateFormik.values?.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: addLanguageStateFormik.values.classId || null, masterAcademicYearId: addLanguageStateFormik.values.academicYearId, curriculumId: addLanguageStateFormik.values.curriculumId,sortBy:"sectionName",orderBy:"asc", pageNo: 0, pageSize: 20, ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(getAssignLanSectionListAct(generateActionPayload("get_section_list", undefined, payload)));
        }
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value })
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value,curriculumId:"",classId:"", sectionId: "" }))
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetAssignLanClassListAct(undefined))
                dispatch(resetAssignLanSectionListAct(undefined))
            }
            else {
                getClassApiCall({ [name]: value, academicYearId: addLanguageStateFormik.values.academicYearId });
                dispatch(resetAssignLanSectionListAct(undefined))
                addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value,sectionId:"",classId:"" }))
            }
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
            dispatch(resetAssignLanSectionListAct(undefined))
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value,sectionId:"" }))
        }
        else{
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const fetchStudentList = (e: any) => {
        e.preventDefault();
        addLanguageStateFormik.handleSubmit(e);
    }

    const languageChangeHndler = (e:any)=>{
        const { name, value } = e.target;
        setLanguageState((prev:any)=>({...prev,[name]:value}))

        setStudentList(studentList?.map((i:any)=>{
            if(i?.isSelected){
                return {...i, [name]:value}
            }else{
                return {...i}
            }
        }))
    }

    const secondLanguageApi = (otherProps?:any)=>{
        const { academicYearId, curriculumId, classId, sectionId } = addLanguageStateFormik.values;
        const params = { instituteId: instituteId, academicYearId: academicYearId, branchId: branchId, curriculumId: curriculumId, classId, type: "SECOND",...otherProps }
        if (params.classId) {
            dispatch(getSecoundLanguagesList(generateActionPayload('get_secound_language_list', undefined, params)));
        } 
    }

    const thirdLanguageApi = (otherProps?:any)=>{
        const { academicYearId, curriculumId, classId, sectionId } = addLanguageStateFormik.values;
        const params = { instituteId: instituteId, academicYearId: academicYearId, branchId: branchId, curriculumId: curriculumId, classId, type: "THIRD",...otherProps }
        if (params.classId) {
            dispatch(getThirdLanForChangeStudentAct(generateActionPayload('get_secound_language_list', undefined, params)));
        } 
    }

    const onChangeInputHndlr = (event:any,name:any,studentId:any)=>{
        const { value } = event.target;
        setStudentList(studentList?.map((i:any)=>{
            if(+i?.studentId === +studentId){
                return {...i,[name]:value}
            }else{
                return {...i}
            }
        }))
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...studentList];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setStudentList(updateStudentState);
    }, [studentList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            studentIdNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = studentList.findIndex((item: any) => +item.studentId === Number(studentIdNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = studentList[studentRowIndex];
            let updateStudentState: any = [...studentList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setStudentList(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [studentList]);

    const addAssignLanguageSubmitHndler = ()=>{
        const payload = studentList?.map((i:any)=>{
            if(i?.isSelected){
                return { 
                    studentId: i?.studentId,
                    secondLanguageId: i?.secondLanguageId,
                    thirdLanguageId : i?.thirdLanguageId,
                 }
            }else{
                return null
            }
        }).filter((f:any)=>f)

        dispatch(updateAssignLanguagesAct(generateActionPayload("update_assign_languages", {academicYearId : addLanguageStateFormik.values.academicYearId}, payload)));
    }

    const submitButtonError = useMemo(() => computeSubmitButtonError(studentList), [studentList]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = getAssignListCurriculumResp || {}
    const { data: secoundLanguageList } = secoundLanguageResp || {};
    const { data: thirdLanguageList } = getThirdLanForChangeStudentResp || {};
    const { content: classTypes } = getAssignLanClassListResp || {};

    const roleColumns = useMemo(() => addAssignLangGenerateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [studentList]);

    return (
        <>
            <form className="">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-6 tw-py-4">
                    <div className="tw-col-span-12 md:tw-col-span-3">
                        <SelectInput
                            name="academicYearId"
                            value={addLanguageStateFormik.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Academic Year"
                            labelClass="required"
                            onBlur={addLanguageStateFormik.handleBlur}
                            invalid={(addLanguageStateFormik.touched.academicYearId && addLanguageStateFormik.errors.academicYearId) ? true : false}
                            error={(addLanguageStateFormik.touched.academicYearId && addLanguageStateFormik.errors.academicYearId) ? addLanguageStateFormik.errors.academicYearId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-3">
                        <SelectInput
                            name="curriculumId"
                            value={addLanguageStateFormik.values.curriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Curriculum"
                            labelClass="required"
                            onBlur={addLanguageStateFormik.handleBlur}
                            invalid={(addLanguageStateFormik.touched.curriculumId && addLanguageStateFormik.errors.curriculumId) ? true : false}
                            error={(addLanguageStateFormik.touched.curriculumId && addLanguageStateFormik.errors.curriculumId) ? addLanguageStateFormik.errors.curriculumId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-2">
                        <SelectInput
                            name="classId"
                            value={addLanguageStateFormik.values.classId}
                            onChange={filterHandler}
                            menuItems={classTypes || []}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText="Class"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            onBlur={addLanguageStateFormik.handleBlur}
                            invalid={(addLanguageStateFormik.touched.classId && addLanguageStateFormik.errors.classId) ? true : false}
                            error={(addLanguageStateFormik.touched.classId && addLanguageStateFormik.errors.classId) ? addLanguageStateFormik.errors.classId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-2">
                        <SelectInput
                            name="sectionId"
                            value={addLanguageStateFormik.values.sectionId}
                            onChange={filterHandler}
                            menuItems={getAssignLanSectionListResp?.data || []}
                            valueKey="sectionId"
                            textKey="sectionName"
                            defaultSelect="Select"
                            labelText="Section"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            onBlur={addLanguageStateFormik.handleBlur}
                            invalid={(addLanguageStateFormik.touched.sectionId && addLanguageStateFormik.errors.sectionId) ? true : false}
                            error={(addLanguageStateFormik.touched.sectionId && addLanguageStateFormik.errors.sectionId) ? addLanguageStateFormik.errors.sectionId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-items-end tw-justify-end">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={fetchStudentList}
                            disabled={showApiLoader}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                {studentList?.some((i: any) => i?.isSelected) && (
                    <div className="tw-px-6 tw-py-4">
                        <div className="tw-border-t tw-border-gray-300 tw-pt-3">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <SelectInput
                                        name="secondLanguageId"
                                        labelText="Second Language"
                                        value={languageState.secondLanguageId}
                                        onChange={languageChangeHndler}
                                        menuItems={secoundLanguageList || []}
                                        valueKey="languageId"
                                        textKey="languageName"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <SelectInput
                                        name="thirdLanguageId"
                                        labelText="Third Language"
                                        value={languageState.thirdLanguageId}
                                        onChange={languageChangeHndler}
                                        menuItems={thirdLanguageList || []}
                                        valueKey="languageId"
                                        textKey="languageName"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <TableContainer
                    columns={roleColumns || []}
                    data={studentList || []}
                    divClass="table-responsive"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    rowDataInfo={{ getThirdLanForChangeStudentResp, secoundLanguageResp }}
                    onChangeInputHndlr={onChangeInputHndlr}
                />
                <tr style={{ color: "#38414A26" }} />
                <div className="tw-flex tw-justify-end tw-gap-3 tw-mb-6 tw-px-6 tw-pt-4">
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
                        disabled={
                            submitButtonError === undefined ||
                            submitButtonError ||
                            showApiLoader
                        }
                        onClick={addAssignLanguageSubmitHndler}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </>
    );
};

export default AddAssignLanguageModel;
