import React, { useState, useMemo, useEffect, useRef } from "react";
import {  SelectInput } from "../../../Components/Common";
import {
  IGenerateRollNumModalProps,
  searchInputProps,
} from "./generateRollTypes";
import { useFormik } from "formik";
import {
  generateRollModalColumns,
  rollType,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct, resetBrchClassAct, resetBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { assignRollNo,  getRollNoList, resetGenerateIdStatus, resetRollNoList, sectionListFilterAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesslice";
import Button from "../../../Components/Common/Button";
const initialValues: searchInputProps = {
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  sectionId: "",
  rollNumType: "",
};

const GenerateRollNumModal = (props: IGenerateRollNumModalProps) => {
  const dispatch = useDispatch();
  const [searchState, setSearchState] =
    useState<searchInputProps>(initialValues);
  const [sectionList, setSectionList] = useState([]);
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    brchSectionsResp,
    getGenerateIdStatus,
    getRollNoListState,
    assignRollNoState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    sectionListFilterResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, classroomManagmentInfo,globalData,assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      getGenerateIdStatus: classroomManagmentInfo.getGenerateIdStatus,
      getRollNoListState: classroomManagmentInfo.getRollNoListState,
      assignRollNoState: classroomManagmentInfo.assignRollNoState,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader:globalData.showApiLoader,
      getAssignLanClassListResp:assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      sectionListFilterResp: classroomManagmentInfo.sectionListFilterResp

    }),
    shallowEqual
  );
  const generateRollNumForm = useFormik({
    enableReinitialize: true,
    initialValues: searchState,
    onSubmit: (values) => {
      const { curriculumId, academicYearId, branchClassId, sectionId, rollNumType } = generateRollNumForm.values;
      let payload = {
        branchId: branchId,
        curriculumId: curriculumId,
        academicYearId: academicYearId,
        branchClassId: branchClassId,
        sectionId: sectionId,
        rollNumberGenerationType: rollNumType
      }
      dispatch(assignRollNo(generateActionPayload('assign_student_roll_no', undefined, payload)))
    },
  });

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: generateRollNumForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}
const getClassApiCall = (otherProps?:any)=>{
  const payload = { branchId: branchId, academicYearId : generateRollNumForm.values.academicYearId, curriculumId: generateRollNumForm.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
   dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
}


  const filterHandler = (event: any) => {

    const { name, value } = event.target;
    // generateRollNumForm.handleChange(event);
    // setSearchState((prev: any) => ({ ...prev, [name]: value }));
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetAssignLanClassListAct(undefined))
      dispatch(resetBrchSectionsAct(undefined))
      generateRollNumForm.setValues((prev:any)=>({...prev,[name]:value,curriculumId:"",branchClassId:"",sectionId:"", rollNumType:""}))
      setSearchState((prevState) => ({ ...prevState, [name]: value, curriculumId: "", branchClassId: "", sectionId: "",rollNumType:"" }));
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchSectionsAct(undefined));
      }
      else {
        getClassApiCall({ [name]: value, academicYearId: generateRollNumForm.values.academicYearId });
        dispatch(resetBrchSectionsAct(undefined));
        generateRollNumForm.setValues((prev:any)=>({...prev,[name]:value,branchClassId:"",sectionId:"",rollNumType:""}))
        setSearchState((prevState) => ({ ...prevState, [name]: value, branchClassId: "", sectionId: "", rollNumType: "" }));
      }
    }
    else if (name === 'branchClassId') {
      const payload = {masterAcademicYearId: searchState.academicYearId, branchClassId: value, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
      dispatch(sectionListFilterAct(generateActionPayload("get_section_list", undefined, payload)));
      generateRollNumForm.setValues((prev:any)=>({...prev,[name]:value,sectionId:"",rollNumType:""}));
      setSearchState((prevState) => ({ ...prevState, [name]: value, sectionId: "", rollNumType: "" }));
    }
    else{

      let data = generateRollNumForm.values;
      data={...data,[name]:value}
      if(data.rollNumType&&data.academicYearId&&data.curriculumId&&data.sectionId){
        let payload = {
          generationType: data.rollNumType,
          academicYearId: data.academicYearId,
          curriculumId: data.curriculumId,
          classId: data.branchClassId,
          sectionId: data.sectionId,
          branchId: branchId,
          pageNo:0,
          pageSize:10000
        }
        dispatch(getRollNoList(generateActionPayload('get_generate_roll_no_list', undefined, payload)))
      }
      generateRollNumForm.setValues((prev:any)=>({...prev,[name]:value}))
      setSearchState((prevState) => ({ ...prevState, [name]: value }));
    
    }
   
  }
  useEffect(() => {

    if(Array.isArray(sectionListFilterResp?.data) && sectionListFilterResp?.data.length > 0){
        sectionListFilterResp && setSectionList(sectionListFilterResp?.data)
    }else{
      setSectionList([])
    }
  }, [sectionListFilterResp])
  const generateRollNumberRef = useRef({
    prevGetGenerateIdStatus: getGenerateIdStatus
  })
  useEffect(() => {
    const { prevGetGenerateIdStatus } = generateRollNumberRef.current;
    if (getGenerateIdStatus && getGenerateIdStatus !== prevGetGenerateIdStatus && getGenerateIdStatus.status === true) {
      const { message } = getGenerateIdStatus || {}
      toast.error(message)
    }
    generateRollNumberRef.current.prevGetGenerateIdStatus = getGenerateIdStatus;

    if (getGenerateIdStatus && getGenerateIdStatus.status === false) {
      const { academicYearId, curriculumId, branchClassId, sectionId } = generateRollNumForm.values;
      let payload = {
        generationType: rollType[0].id,
        academicYearId: academicYearId,
        curriculumId: curriculumId,
        classId: branchClassId,
        sectionId: sectionId,
        branchId: branchId,
        pageNo:0,
        pageSize:10000
      }
      dispatch(getRollNoList(generateActionPayload('get_generate_roll_no_list', undefined, payload)))
      generateRollNumForm.setValues(prev=>({...prev,rollNumType:rollType[0].id}));
    }
  }, [getGenerateIdStatus])

  useEffect(() => {
    if (props.isOpen) {
      setSearchState(prev => ({ ...props.editData }))
      
      if (props.editData) {
        const { academicYearId, curriculumId, branchClassId, sectionId } = props.editData || {};
        generateRollNumForm.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, branchClassId, sectionId }));

        if (academicYearId) {
          getCurriculumApiCall({ academicYearId: academicYearId });
        }

        if(academicYearId && curriculumId){                
          getClassApiCall({ curriculumId: curriculumId, academicYearId: academicYearId });
        }

        if(academicYearId && curriculumId && branchClassId){
          const payload = {masterAcademicYearId: academicYearId, branchClassId: branchClassId, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc"};
          dispatch(sectionListFilterAct(generateActionPayload("get_section_list", undefined, payload)));
        }

    }


    }
    else {
      generateRollNumForm.resetForm();
      dispatch(resetRollNoList(undefined))
      dispatch(resetGenerateIdStatus(undefined))
    }
  }, [props.isOpen])

  const generateRollModalTableColumns = useMemo(
    () => generateRollModalColumns(),
    []
  );


  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};
  const { content: classTypes } = getAssignLanClassListResp || {};
  const { content: RollNoList } = getRollNoListState || {};

  return (
    <>
      <div>
        <div className="tw-px-4 tw-py-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                value={generateRollNumForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={generateRollNumForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="branchClassId"
                labelText="Class"
                value={generateRollNumForm.values.branchClassId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="sectionId"
                labelText="Section"
                value={generateRollNumForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionList || []}
                valueKey="sectionId"
                textKey="sectionName"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12">
              <SelectInput
                name="rollNumType"
                labelText="Roll No Type"
                value={generateRollNumForm.values.rollNumType}
                onChange={filterHandler}
                menuItems={rollType}
                valueKey="id"
                textKey="type"
                formgroupClassName="tw-mb-2"
              />
            </div>
          </div>
        </div>
        <TableContainer
          columns={generateRollModalTableColumns || []}
          data={RollNoList || []}
          divClass="table-responsive tw-mb-1"
          theadClass="tw-bg-gray-100 tw-text-muted tw-align-middle"
        />
        <div className="hstack gap-2 justify-content-end py-3 px-4">
          <Button type="button" variant="secondary" onClick={props.toggle}>
            Cancel
          </Button>
          <Button type="submit"
            variant="primary"
            onClick={(event: any) => generateRollNumForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default GenerateRollNumModal;
