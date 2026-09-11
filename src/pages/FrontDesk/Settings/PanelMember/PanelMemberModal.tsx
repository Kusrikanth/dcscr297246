import React, { useEffect, useState } from 'react'
import { MultiSelectCheckbox, SelectInput, TextInput, UserDetails } from '../../../../Components/Common'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { addPanelMemberAct, editPanelMemberAct, getPanelEmployeesListAct, getPanelMemberByIdAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { renderOptionsClasses, renderValueClasses } from './helper';
import Button from '../../../../Components/Common/Button';

const PanelMemberModal = (props: any) => {

  const [isCheck, setIsCheck] = useState<Array<number>>([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [initialValues,setInitialValues] = useState({
    academicYearId: "",
    curriculumId: "",
    classes: [],
    subjectTeachers: [],
    searchStudent: ""
  }
  )
  const dispatch = useAppDispatch()
    
  const { currentBranchIdResp: branchId,branchClassResp,showApiLoader,getPanelMemberByIdResp,
    currentInstIdResp: instituteId,panelEmployeesListResp,academicYearListResp,brchCurriculumResp } = useAppSelector(
        ({  branchAcademics,appData,assignGroupInfo,classSubjectsInfo,admissionAvailabilityRequest,instAcademics,globalData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            branchClassResp: branchAcademics.branchClassResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentInstIdResp: appData.currentInstIdResp,
            panelEmployeesListResp : admissionAvailabilityRequest.panelEmployeesListResp,
            getPanelMemberByIdResp : admissionAvailabilityRequest.getPanelMemberByIdResp,
            addPanelMemberResp : admissionAvailabilityRequest.addPanelMemberResp,
            showApiLoader : globalData.showApiLoader,
        }),
        shallowEqual
    ); 

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};

    const validationSchema =  Yup.object().shape({
      academicYearId: Yup.string().required("Academic Year is required."),
      curriculumId: Yup.string().required("Curriculum is required."),
      classes: Yup.array().min(1,"Minimum one need to select").required('classes is required.'),
      subjectTeachers: Yup.array().min(1,"Minimum one need to select").required('Evaluation Process is required.'),
      
  });

  const PanelMemberForm = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize:true,
    onSubmit: (values:any) => {
      
    if(getPanelMemberByIdResp && props.id){
      const payload = {
        employeeIds:values.subjectTeachers.join(","),classIds:values.classes.map((i:any)=>i.id).join(',')
      }
      dispatch(editPanelMemberAct(generateActionPayload("edit_panel_member_by_id", {id:props.id}, payload)))
    }else{
      const payload = {
        instituteId,academicYearId : values.academicYearId,branchId,curriculumId:values.curriculumId,employeeIds:values.subjectTeachers.join(","),classIds:values.classes.map((i:any)=>i.id).join(',')
      }    
      dispatch(addPanelMemberAct(generateActionPayload("add_panel_member_list", undefined, payload)))
    }
    }
  })

  useEffect(() => {
    const payload = { instituteId ,branchId , searchString : ""}
    dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
  }, []) 
  useEffect(()=>{
    if(props.id){
      dispatch(getPanelMemberByIdAct(generateActionPayload('get_panel_member_by_id', {id:props.id})))
    }
  },[props.id])

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0 && !props.id) {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
        setInitialValues((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({academicYearId:yearId})
    }
}, [academicYearListResp]);

  useEffect(() => {
    
    if(getPanelMemberByIdResp && props.id){
      
      getCurriculumApiCall({academicYearId:getPanelMemberByIdResp?.academicYearId})
      getClassApiCall({academicYearId:getPanelMemberByIdResp?.academicYearId , curriculumId:getPanelMemberByIdResp?.curriculumId})

      setIsCheck(getPanelMemberByIdResp.employeeDetailsPanelMembersDTOS.map((i:any)=>i.employeeId))
      const initial = {
        academicYearId : getPanelMemberByIdResp.academicYearId,
        curriculumId : getPanelMemberByIdResp.curriculumId,
        classes : [],
        subjectTeachers : getPanelMemberByIdResp.employeeDetailsPanelMembersDTOS.map((i:any)=>i.employeeId),
        searchStudent: ""
      }
      
      setInitialValues(initial);
    }
  }, [getPanelMemberByIdResp])

  useEffect(() => {
    if(branchClassResp && props.id){
      let classes:any =[];
      const abc = getPanelMemberByIdResp.classIds.split(',').map((i:any)=>{
        const data = branchClassResp?.content?.filter((d:any)=>{return d.id==i})
        if(data) classes= [...classes,...data];
      })
      setInitialValues((prev: any) => ({ ...prev, classes: classes }))
    }
  }, [branchClassResp])
  
const handleClick = (e: any) => {
    const { id, checked } = e.target; 
    let arr = [...isCheck];
    if (id === "selecteAll") {
      setIsCheckAll(checked);
      if (checked) {
        arr = panelEmployeesListResp?.map((std: any) => std?.employeeId) || [];
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
      if (arr.length === panelEmployeesListResp?.length) {
        setIsCheckAll(true)
      }
      else {
        setIsCheckAll(false);
      }
    }
    
    setIsCheck(arr);
    // setInitialValues((prev:any)=> ( { ...prev , 'subjectTeachers' : arr}))
    PanelMemberForm.setFieldValue('subjectTeachers', arr)
  };

  const getClassApiCall = (otherProps?:any)=>{
    const payload = { branchId: branchId, academicYearId : initialValues?.academicYearId, curriculumId: initialValues?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: initialValues.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  
  const handleChange = async(e:any)=>{
    const {name , value} = e.target
    if(name === "academicYearId"){
      setInitialValues((prev: any) => ({ ...prev, [name]: value , curriculumId : "" , classes : [] }));
      getCurriculumApiCall({academicYearId:value})
      dispatch(resetBrchClassAct(undefined));
    }
    else if(name === "curriculumId"){
      setInitialValues((prev: any) => ({ ...prev, [name]: value ,classes : [] }));
      getClassApiCall({curriculumId:value})
    }else if(name === "searchStudent"){
      setInitialValues((prev: any) => ({ ...prev, [name]: value }));
      const payload = { instituteId ,branchId , searchString : value}
    dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
    }

  }

  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        PanelMemberForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    } else {
        PanelMemberForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
    }
}

  useEffect(() => {
    return () => {
        dispatch(resetBrchClassAct(undefined));
    }
  }, []);


  return (
    <div className="tw-p-3 tw-grid tw-grid-cols-12 tw-gap-3">
      {/* Academic Year */}
      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="academicYearId"
          value={PanelMemberForm.values.academicYearId}
          onChange={handleChange}
          menuItems={academicYearList || []}
          valueKey="academicYearId"
          textKey="academicYearName"
          labelClass="required"
          formgroupClassName="tw-mb-0"
          isDisabled={props.id && true}
          invalid={
            PanelMemberForm.touched.academicYearId &&
              PanelMemberForm.errors.academicYearId
              ? true
              : false
          }
          error={
            PanelMemberForm.touched.academicYearId &&
              PanelMemberForm.errors.academicYearId
              ? PanelMemberForm.errors.academicYearId
              : ""
          }
          labelText="Academic Year"
        />
      </div>

      {/* Curriculum */}
      <div className="tw-col-span-12 md:tw-col-span-6">
        <SelectInput
          name="curriculumId"
          value={PanelMemberForm.values.curriculumId}
          onChange={handleChange}
          menuItems={curriculumTypes || []}
          valueKey="branchCurriculumId"
          textKey="curriculumName"
          labelClass="required"
          formgroupClassName="tw-mb-0"
          isDisabled={props.id && true}
          defaultSelect="Curriculum"
          invalid={
            PanelMemberForm.touched.curriculumId &&
              PanelMemberForm.errors.curriculumId
              ? true
              : false
          }
          error={
            PanelMemberForm.touched.curriculumId &&
              PanelMemberForm.errors.curriculumId
              ? PanelMemberForm.errors.curriculumId
              : ""
          }
          labelText="Curriculum"
        />
      </div>

      {/* Class MultiSelect */}
      <div className="tw-col-span-12">
        <MultiSelectCheckbox
          name="classes"
          labelText="Class"
          containerClassName="tw-mb-3"
          idKey="id"
          searchKey="shortName"
          value={PanelMemberForm.values.classes}
          renderValue={renderValueClasses}
          renderOptions={renderOptionsClasses}
          onChange={onSelectOptionHandler}
          isDisabled={props.id && true}
          labelClass="required"
          options={branchClassResp?.content}
          invalid={
            PanelMemberForm.touched.classes && PanelMemberForm.errors.classes
              ? true
              : false
          }
          error={
            PanelMemberForm.touched.classes && PanelMemberForm.errors.classes
              ? PanelMemberForm.errors.classes
              : ""
          }
        />
      </div>

      {/* Teacher Selection */}
      <div className="tw-col-span-12 md:tw-col-span-6">
        <label className="tw-form-label required">Select Teacher</label>
        <div className="tw-bg-white tw-shadow tw-rounded tw-p-3">
          {/* Search Box */}
          <div className="tw-relative tw-mb-3">
            <TextInput
              name="searchStudent"
              value={PanelMemberForm.values.searchStudent}
              onChange={handleChange}
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-mb-0"
              placeHolder="Search..."
            />
            <i className="ri-search-line tw-absolute tw-right-2 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
          </div>

          {/* Employee List */}
          <div className="tw-overflow-y-scroll tw-h-40 tw-space-y-2">
            {panelEmployeesListResp?.map((std: any) => (
              <div className="tw-flex tw-items-center" key={std.employeeId}>
                <input
                  className="tw-form-checkbox tw-me-3"
                  type="checkbox"
                  id={std.employeeId}
                  value={std.employeeId}
                  name="allSubject"
                  checked={isCheck.includes(std.employeeId)}
                  onClick={handleClick}
                />
                <UserDetails
                  imageUrl={std.thumbnailImage}
                  displayName={std.employeeName}
                  displayId={std.employeeCode}
                  defaultImgType="employee"
                  size="xs"
                />
              </div>
            ))}
          </div>

          {/* Error Message */}
          <span className="tw-text-red-500 tw-text-sm">
            {PanelMemberForm?.errors?.subjectTeachers &&
              "Minimum One Teacher need to select"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-4 tw-mt-3">
        <Button
          type="button"
          variant='secondary'
          onClick={() => props.toggle()}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant='primary'
          disabled={showApiLoader}
          onClick={() => PanelMemberForm.handleSubmit()}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default PanelMemberModal
