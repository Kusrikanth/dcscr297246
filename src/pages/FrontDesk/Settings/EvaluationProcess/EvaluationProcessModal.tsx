import { useEffect, useState } from 'react'
import { MultiSelectCheckbox, SelectInput, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { addEvaluationProcessAct, classesForAddEvaluationAct, editEvaluationProcessAct, getClassesForEvaluation, getEvaluationProcessListByIdAct, getInstituteEvaluationList } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { getBranchCurriculumAct, resetBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { renderOptionsProcess, renderValueProcess } from './helper';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    evaluationProcess: [],
    classes: [],
    searchStudent: ""
}

const EvaluationProcessModal = (props: any) => {

    const [isCheck, setIsCheck] = useState<Array<number>>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [classArray, setClassArray] = useState<any>()

    const dispatch = useDispatch();
    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getInstituteEvaluationListResp,
        getEvaluationProcessByIdResp,
        classesForAddEvaluationResp,
        showApiLoader,
    } = useAppSelector(
        ({ admissionAvailabilityRequest, instAcademics, branchAcademics, appData,globalData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getInstituteEvaluationListResp : admissionAvailabilityRequest.getInstituteEvaluationListResp,
            getEvaluationProcessByIdResp : admissionAvailabilityRequest.getEvaluationProcessByIdResp,
            classesForAddEvaluationResp : admissionAvailabilityRequest.classesForAddEvaluationResp,
            showApiLoader : globalData.showApiLoader,
        }),
        shallowEqual
    );

    useEffect(() => {
        
    if(classesForAddEvaluationResp){
        setClassArray(classesForAddEvaluationResp)
    }
    }, [classesForAddEvaluationResp])

    const validationSchema =  Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),
        evaluationProcess: Yup.array().min(1,"Minimum one need to select").required('Evaluation Process is required.'),
        classes: Yup.array().min(1,"Minimum one need to select").required('classes is required.'),
        
    });

    const EvaluationProcessForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            
            if(props.modalId){
                const payload = {
                    academicYearId: values.academicYearId,curriculumId: values.curriculumId,evaluationProcessIds: values.evaluationProcess.map((i:any)=>i.id)}  
                    
                    dispatch(editEvaluationProcessAct(generateActionPayload("edit_evaluation_process_by_id",{id : props.modalId},payload)))
            }else{
                const payload = {
                    academicYearId: values.academicYearId,branchId,curriculumId: values.curriculumId,evaluationProcessIds: values.evaluationProcess.map((i:any)=>i.id),classIds: values.classes}  
                                 
                dispatch(addEvaluationProcessAct(generateActionPayload("add_evaluation_process",undefined,payload)))
            }
        }
    })

    const handleClick = (e: any) => {
        const { id, checked ,name} = e.target;
        let arr = [...isCheck];       
        if (id === "selecteAll") {   
          setIsCheckAll(checked);
          if (checked) {
            arr = classesForAddEvaluationResp?.map((std: any) => std?.branchClassId) || [];
          }
          else {
            arr = [];
          }
        } else if (id)
     {
          if (!checked) {
            arr = arr?.filter((item: any) => item !== +id);
          } else {
            arr = [...arr, +id];
          }
          if (arr.length === classesForAddEvaluationResp?.length) {
            setIsCheckAll(true)
          }
          else {
            setIsCheckAll(false);
          }
        }
        setIsCheck(arr);
        EvaluationProcessForm.setFieldValue('classes', arr)
      };

      const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: EvaluationProcessForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        if(payload1.academicYearId){
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : EvaluationProcessForm.values?.academicYearId, curriculumId: EvaluationProcessForm.values?.curriculumId, ...otherProps };
        dispatch(classesForAddEvaluationAct(generateActionPayload("classes_for_add_evaluation", undefined, payload)));
    }

    useEffect(() => {
        dispatch(getInstituteEvaluationList(generateActionPayload("institute_evaluations_list")))
        if(!props.modalId){           
            EvaluationProcessForm.resetForm();
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            getCurriculumApiCall({academicYearId:yearId})
            EvaluationProcessForm.setValues((prev: any)=>({...prev,academicYearId:yearId}))
        }
    }, [])

    const handleChange = (e:any)=>{
        const { name , value } = e.target
        if (name === "curriculumId"){
            if(value===""){               
                dispatch(resetBrchClassAct(undefined));
                setClassArray([])
            }else{
                getClassApiCall({curriculumId:value})
            }
            EvaluationProcessForm.setFieldValue(name,value)           
        }
        else if(name === "searchStudent"){
            const filteredClasses = classesForAddEvaluationResp?.filter((item:any) =>
                item.className.toLowerCase().includes(value.toLowerCase())
        );
        setClassArray(filteredClasses)
        EvaluationProcessForm.setFieldValue(name,value)           
        }else if(name === "academicYearId"){
            getCurriculumApiCall({academicYearId:value})
            EvaluationProcessForm.setValues((prev:any)=>({...prev, [name] : value, curriculumId:""}))         
        }
    }

    useEffect(() => {
    if(props.modalId){
        dispatch(getEvaluationProcessListByIdAct(generateActionPayload("get_evaluation_process_by_id", {id : props.modalId})));
    }
    }, [props.modalId])

    const editEvaluationProcess = (getEvaluationProcessByIdResp : any)=>{
        if(getEvaluationProcessByIdResp){
            const {academicYearId , curriculumId ,admissionInstituteEvaluationDTOS : instituteEvaluation ,classId} = getEvaluationProcessByIdResp
            const initial = {academicYearId ,curriculumId : curriculumId || 2,evaluationProcess : instituteEvaluation,classes : [classId],searchStudent : "" }
            const params = { branchId: branchId,academicYearId, curriculumId: curriculumId || 2, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getClassesForEvaluation(generateActionPayload("get_brch_curriculum_class", undefined, params)));
            setIsCheck([classId])
            EvaluationProcessForm.setValues((prev:any)=>({...prev,...initial}))
        }
    }

    useEffect(() => {
    if(getEvaluationProcessByIdResp && props.modalId){
        editEvaluationProcess(getEvaluationProcessByIdResp);
    }else{
        editEvaluationProcess(null);
    }
    }, [getEvaluationProcessByIdResp])


    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            EvaluationProcessForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            EvaluationProcessForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};

    return (
        <div className="tw-p-4">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                {/* Academic Year */}
                <div className="tw-col-span-12 sm:tw-col-span-6">
                    <SelectInput
                        name="academicYearId"
                        value={EvaluationProcessForm.values.academicYearId}
                        invalid={EvaluationProcessForm.touched.academicYearId && EvaluationProcessForm.errors.academicYearId ? true : false}
                        error={EvaluationProcessForm.touched.academicYearId && EvaluationProcessForm.errors.academicYearId ? EvaluationProcessForm.errors.academicYearId : ""}
                        onChange={handleChange}
                        menuItems={academicYearList || []}
                        isDisabled={props.modalId && true}
                        labelClass="required"
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                    />
                </div>

                {/* Curriculum */}
                <div className="tw-col-span-12 sm:tw-col-span-6">
                    <SelectInput
                        name="curriculumId"
                        value={EvaluationProcessForm.values.curriculumId}
                        invalid={EvaluationProcessForm.touched.curriculumId && EvaluationProcessForm.errors.curriculumId ? true : false}
                        error={EvaluationProcessForm.touched.curriculumId && EvaluationProcessForm.errors.curriculumId ? EvaluationProcessForm.errors.curriculumId : ""}
                        onChange={handleChange}
                        isDisabled={props.modalId && true}
                        menuItems={curriculumTypes || []}
                        labelClass="required"
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Curriculum"
                        labelText="Curriculum"
                    />
                </div>

                {/* Evaluation Process */}
                <div className="tw-col-span-12 sm:tw-col-span-6">
                    <MultiSelectCheckbox
                        name="evaluationProcess"
                        labelText="Evaluation Process"
                        containerClassName="tw-mb-3"
                        idKey="id"
                        searchKey="name"
                        value={EvaluationProcessForm.values.evaluationProcess}
                        renderValue={renderValueProcess}
                        renderOptions={renderOptionsProcess}
                        onChange={onSelectOptionHandler}
                        options={getInstituteEvaluationListResp}
                        invalid={EvaluationProcessForm.touched.evaluationProcess && EvaluationProcessForm.errors.evaluationProcess ? true : false}
                        error={EvaluationProcessForm.touched.evaluationProcess && EvaluationProcessForm.errors.evaluationProcess ? EvaluationProcessForm.errors.evaluationProcess : ""}
                    />
                </div>

                {/* Classes */}
                <div className="tw-col-span-12 sm:tw-col-span-6">
                    <label className="tw-block tw-font-medium tw-mb-2 required">Select Classes</label>
                    <div className="tw-bg-white tw-shadow tw-rounded tw-p-3">

                        {/* Search Box */}
                        <div className="tw-tw-mb-3 tw-relative">
                            <TextInput
                                name="searchStudent"
                                value={EvaluationProcessForm.values.searchStudent}
                                onChange={handleChange}
                                inputClassName="tw-bg-gray-100 tw-h-10"
                                formgroupClassName="tw-mb-0"
                                placeHolder="Search..."
                            />
                            <i className="ri-search-line tw-absolute tw-right-3 tw-top-3 tw-text-gray-400"></i>
                        </div>

                        {/* Class List */}
                        <div className="tw-h-72 tw-overflow-y-auto tw-overflow-x-hidden tw-p-1">
                            {classArray && classArray.length > 0 ? (
                                classArray.map((fee) => (
                                    <div className="tw-flex tw-items-center tw-mb-2" key={fee.branchClassId}>
                                        <input
                                            type="checkbox"
                                            className="tw-form-checkbox tw-mr-3"
                                            id={fee.branchClassId}
                                            value={fee.branchClassId}
                                            disabled={props.modalId && true}
                                            name="classes"
                                            checked={isCheck.includes(fee.branchClassId)}
                                            onClick={handleClick}
                                        />
                                        <p className="tw-tw-mb-0">{fee.className}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="tw-text-gray-400">No Classes are there</p>
                            )}
                        </div>

                        {/* Error */}
                        <span className="tw-text-red-600 tw-text-xs">
                            {EvaluationProcessForm?.errors?.classes && "Minimum One class need to select"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="tw-flex tw-justify-end tw-gap-4 tw-mt-4">
                <Button
                    type="button"
                    variant='secondary'
                    onClick={() => props.toggle()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant='primary'
                    disabled={showApiLoader}
                    onClick={(event: any) => EvaluationProcessForm.handleSubmit(event)}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}

export default EvaluationProcessModal
