import React, { useEffect, useState } from 'react'
import { DateInput, ModalContainer, SelectInput, TextInput } from '../../../../Components/Common'
import Button from '../../../../Components/Common/Button';
import { useFormik } from 'formik';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import * as Yup from "yup";
import { ageCriteriaByIdAct, editAgeCriteriaByIdAct, generateAgeCriteria } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
});

const initialValue={
    academicYearId: "",
        curriculumId: "",
        classId: "",
        maximumAge: "",
        minimumAge: "",
        ageGroup: "",
        ageLimit : ""
}

const AgeCriteriaModal = (props: any) => {

    const dispatch = useDispatch();
    const [initialValues,setInitialValues] = useState(initialValue)

    const validationSchema = props.recordId ?  Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),
        ageLimit: Yup.string().required("Age Limit is required."),      
        classId: Yup.string().required("Class is required."),      
    }) : Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),  
    });

    const AgeCriteriaForm = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            
            if(props.recordId){
                
                const payload = { ageLimit :new Date(values.ageLimit).toISOString().slice(0,19)}
                dispatch(editAgeCriteriaByIdAct(generateActionPayload('edit_age_criteria', {id : props.recordId}, payload)))
            }else{
                const payload = {  branchId: branchId ,academicYearId:values.academicYearId,curriculumId:values.curriculumId}           
                dispatch(generateAgeCriteria(generateActionPayload('generate_age_criteria', undefined, payload)))
            }
            
        }
    })

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        ageCriteriaByIdResp,
        showApiLoader
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections, admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader : globalData.showApiLoader,
            ageCriteriaByIdResp : admissionAvailabilityRequest.ageCriteriaByIdResp,
        }),
        shallowEqual
    );

    useEffect(()=>{
        const params={id:props.recordId}
        if(props.recordId){dispatch(ageCriteriaByIdAct(generateActionPayload('age_criteria_by_id',params)));}    
    },[props.recordId])

    const EditAgeCriteria =(ageCriteriaByIdResp:any)=>{
        if(ageCriteriaByIdResp){
            const {academicYearId,curriculumId,ageLimit,classId} = ageCriteriaByIdResp;
            const initial = {academicYearId,curriculumId:curriculumId,classId,maximumAge:'',minimumAge:'',ageGroup:'',ageLimit :ageLimit.slice(0,10)}
            
            const payload = { branchId: branchId,curriculumId: curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

            setInitialValues(initial)
        }
    }

    useEffect(() => {
        if(!props.isOpen){
            AgeCriteriaForm.resetForm()
            setInitialValues(initialValue)
        }
    }, [props.isOpen])

    useEffect(() => {
    if(ageCriteriaByIdResp && props.recordId){
        EditAgeCriteria(ageCriteriaByIdResp)
    }else{
        EditAgeCriteria(null)
    }
    }, [ageCriteriaByIdResp])

    const { content: classTypes } = branchClassResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    return (<>
            <div className='tw-flex tw-flex-wrap tw-px-3 tw--mx-3 tw-gap-y-4 tw-py-3'>
                <div className='tw-w-1/2 tw-px-3'>
                    <SelectInput
                        name="academicYearId"
                        value={AgeCriteriaForm.values.academicYearId}
                        onChange={AgeCriteriaForm.handleChange}
                        menuItems={academicYearList || []}
                        isDisabled={props.recordId && true}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        // inputClassName="border-0"
                        labelClass='required'
                        formgroupClassName="tw-mb-0"
                        // isDisabled={true}
                        labelText='Academic Year'
                        invalid={
                            AgeCriteriaForm.touched.academicYearId &&
                                AgeCriteriaForm.errors.academicYearId
                                ? true
                                : false
                        }
                        error={
                            AgeCriteriaForm.touched.academicYearId &&
                                AgeCriteriaForm.errors.academicYearId
                                ? AgeCriteriaForm.errors.academicYearId
                                : ""
                        }
                    />
                </div>
                <div className='tw-w-1/2 tw-px-3'>
                    <SelectInput
                        name="curriculumId"
                        value={AgeCriteriaForm.values.curriculumId}
                        onChange={AgeCriteriaForm.handleChange}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        isDisabled={props.recordId && true}
                        labelClass='required'
                        // inputClassName="border-0"
                        formgroupClassName="tw-mb-0"
                        // isDisabled={true}
                        labelText='Curriculum'
                        invalid={
                            AgeCriteriaForm.touched.curriculumId &&
                                AgeCriteriaForm.errors.curriculumId
                                ? true
                                : false
                        }
                        error={
                            AgeCriteriaForm.touched.curriculumId &&
                                AgeCriteriaForm.errors.curriculumId
                                ? AgeCriteriaForm.errors.curriculumId
                                : ""
                        }
                    />
                </div>
              { props.recordId &&  <div className='tw-w-1/2 tw-px-3'>
                <SelectInput
                    name="classId"
                    value={AgeCriteriaForm.values.classId}
                    onChange={AgeCriteriaForm.handleChange}
                    isDisabled={props.recordId && true}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    // inputClassName="border-0"
                    formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    labelText='Class'
                />
            </div>}
            
                            {props.recordId && <div className="tw-w-1/2 tw-px-3">
                                <DateInput
                        name="ageLimit"
                        labelText="Age Limit"
                        value={AgeCriteriaForm.values.ageLimit}
                        onChange={AgeCriteriaForm.handleChange}
                        invalid={(AgeCriteriaForm.touched.ageLimit && AgeCriteriaForm.errors.ageLimit) ? true : false}
                        error={(AgeCriteriaForm.touched.ageLimit && AgeCriteriaForm.errors.ageLimit) ? AgeCriteriaForm.errors.ageLimit : ""}
                    />
                  </div>}
            {/* <div className='tw-w-1/2 tw-px-3'>
                <SelectInput
                    name="minimumAge"
                    value={AgeCriteriaForm.values.minimumAge}
                    onChange={AgeCriteriaForm.handleChange}
                    menuItems={[]}
                    valueKey="age"
                    textKey="age"
                    // inputClassName="border-0"
                    formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    labelText='Minimum Age'
                />
            </div> */}
            {/* <div className='tw-w-1/2 tw-px-3'>
                <SelectInput
                    name="maximumAge"
                    value={AgeCriteriaForm.values.maximumAge}
                    onChange={AgeCriteriaForm.handleChange}
                    menuItems={[]}
                    valueKey="age"
                    textKey="age"
                    // inputClassName="border-0"
                    formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    labelText='Maximum Age'
                />
            </div> */}
            {/* <div className='tw-w-1/2 tw-px-3'>
                <SelectInput
                    name="ageGroup"
                    value={AgeCriteriaForm.values.ageGroup}
                    onChange={AgeCriteriaForm.handleChange}
                    menuItems={[]}
                    valueKey="age"
                    textKey="age"
                    // inputClassName="border-0"
                    formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    labelText='Age Group'
                />
            </div> */}
            <div className="tw-w-full tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-px-3">
           
                <Button
                  type="button"
                  variant="secondary"
                  onClick={props.toggle}
                // disabled={props.isSubmitting||false}
                >
                  Cancel
                </Button>
              
                <Button
                  type="button"
                  variant="primary"
                  onClick={(event:any)=>AgeCriteriaForm.handleSubmit(event)}
                  disabled={showApiLoader}
                >
                  Submit
                </Button>
              
            </div>
            </div>
    </>
    )
}

export default AgeCriteriaModal
