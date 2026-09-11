import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import {
  ModalContainer,
  NewPhoneInput,
  RadioInputContainer,
  SelectInput,
  Switch,
  TextIconInput,
  TextInput,
  UserDetails, InputCheckbox,
  Button
} from "../../../../../Components/Common";
import NoDataComp from "../../../../../Components/Common/NoDataComp";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { selectData1, selectData2 } from "../../helper";
import {
  CreateStudentAccModalProps,
  ManageStudentFilterProps,
} from "../../ManageUserTypes";
import { CreateStudentData, generateColumns, StudentList } from "./helper";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct, } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
  setStudentsListAct,
  getStudentsListAct
} from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getInstRoleTypeAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { multipleCreateUserAct } from "../../../../../store/usermanagement/usermanagementactions";
import { generateApiUrl } from "../../../../../api/apihelper";
import { toast } from "react-toastify";
//Constants
import { roleTypes } from "../../../../../Components/constants/common";

//Utility
import { searhWithTextInList, debounce } from "../../../../../utility/commonutility";

const initialValues: ManageStudentFilterProps = {
  // search: "",
  userType: "",
  academicYear: "",
  curriculumId: "",
  classId: "",
  searchString: ""
};

const   CreateStudentAccModal = (props: any) => {
  const [filterState, setFilterState] = useState({
    academicYearId: "",
    curriculumId: "",
    classId: "",
  });
  const [searchFilterState, setSearchFilterState] = useState({
    searchString: ""
  });
  const [roleDetailState, setRoleDetailState] = useState<any>({
    roleId: "",
    roleType: "",
  });
  const [selectAllStudentState, setSelectAllStudentState] = useState(false);
  const [availableStudentsState, setAvailableStudentState] = useState<any>([]);
  const [searchStudentListState, setSearchStudentListState] = useState<any>([]);

  const dispatch = useAppDispatch();
  const { studentsListResp, instRoleTypeListResp, branchClassResp,
    academicYearListResp, brchCurriculumResp, multipleCreateUserResp, studentManagementErrorResp,showApiLoader } =
    useAppSelector(({ instituteInfo, directoryStudent, branchAcademics, instAcademics, userManagement,globalData }) => ({
      studentsListResp: directoryStudent.studentsListResp,
      instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      academicYearListResp: instAcademics.academicYearListResp,
      multipleCreateUserResp: userManagement.multipleCreateUserResp,
      studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
      showApiLoader:globalData.showApiLoader,
    }), shallowEqual);

  const createAccountRespRef = useRef({
    prevStudentsListResp: studentsListResp,
    prevInstRoleTypeListResp: instRoleTypeListResp,
    prevMultipleCreateUserResp: multipleCreateUserResp,
    prevStudentManagementErrorResp: studentManagementErrorResp,
  });

  useEffect(() => {
    const { prevStudentsListResp, prevInstRoleTypeListResp, prevMultipleCreateUserResp } = createAccountRespRef.current;
    if (studentsListResp && prevStudentsListResp !== studentsListResp) {
      const { data } = studentsListResp || {};
      if (Array.isArray(data)) {
        const studentData = JSON.parse(JSON.stringify(data));
        setAvailableStudentState(studentData);
        searchStudentByNameHndlr(searchFilterState.searchString, studentData);
      } else {
        setAvailableStudentState([]);
        setSearchStudentListState([]);
      }
      setSelectAllStudentState(false);
    } else if (instRoleTypeListResp && prevInstRoleTypeListResp !== instRoleTypeListResp) {
      const { data } = instRoleTypeListResp;
      if (Array.isArray(data)) {
        const { id, roleType }: any = data.find(item => item.roleType === roleTypes.STUDENT) || {};
        // setFilterState((prevState: any) => ({ ...prevState, roleId: id, roleType }));
        setRoleDetailState((prevState: any) => ({ ...prevState, roleId: id, roleType }))
      }
    } else if (multipleCreateUserResp && prevMultipleCreateUserResp !== multipleCreateUserResp) {
      toast.success("Students login id's created successfully.");
      props.toggle(true);
    }
    createAccountRespRef.current.prevStudentsListResp = studentsListResp;
    createAccountRespRef.current.prevInstRoleTypeListResp = instRoleTypeListResp;
    createAccountRespRef.current.prevMultipleCreateUserResp = multipleCreateUserResp;
  }, [studentsListResp, instRoleTypeListResp, multipleCreateUserResp]);

  useEffect(() => {
    const { instituteId, isOpen } = props;
    if (isOpen && instituteId) {
      const rolesApiPayload = { instituteId };
      const roleApiParams = { roleType: "STUDENT" };
      dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", roleApiParams, rolesApiPayload)));
    } else {
      setFilterState({
        academicYearId: "",
        curriculumId: "",
        classId: "",
      });
      setRoleDetailState({
        roleId: "",
        roleType: ""
      })
      dispatch(setBrchClassAct(undefined));
      dispatch(setStudentsListAct({}));
    }
  }, [props.isOpen, props.instituteId]);

  useEffect(() => {
    const { branchId, isOpen } = props;
    if(academicYearListResp && isOpen && branchId){
      const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      getCurriculumApiCall({ academicYearId : yearId });
      setFilterState((prevState: any) => ({ ...prevState, academicYearId: yearId }));
    }
  }, [academicYearListResp]);


  function searchStudentByNameHndlr(searchValue: any, studentList: any) {
    if (Array.isArray(studentList) && searchValue) {
      const filterAvailableStudent = searhWithTextInList(studentList, "studentName", searchValue);
      setSearchStudentListState(filterAvailableStudent);
    } else if (Array.isArray(studentList)) {
      setSearchStudentListState(studentList);
    }
  }
  const debouncedHandler = useCallback(debounce(searchStudentByNameHndlr, 200), [availableStudentsState]);
  function searchFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setSearchFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    debouncedHandler(value, availableStudentsState);
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const { branchId } = props;
    const payload1 = { academicYearId: filterState.academicYearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getClassApiCall = (otherProps?:any)=>{
    const { branchId } = props;
    const payload = { branchId: branchId, academicYearId : filterState.academicYearId, curriculumId: filterState.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      updatedState = { ...filterState };
    if (name === "curriculumId") {
      if (value) {
        getClassApiCall({ curriculumId: value });
      } else {
        dispatch(setBrchClassAct(undefined));
      }
      setFilterState((prev)=>({ ...prev,[name] : value, classId:"" }));
      Object.assign(updatedState, { [name]: value ,classId : "" })
    } else if (name === "academicYearId") {
      if (!value) {
        Object.assign(updatedState, { curriculumId: "", classId: "" })
      }else{
        Object.assign(updatedState, { [name]: value ,curriculumId : "", classId : "" })
      }
      dispatch(setBrchClassAct(undefined));
      getCurriculumApiCall({ academicYearId: value });
      setFilterState((prev)=>({ ...prev, [name] : value, curriculumId:"",classId:"" }));
    }else{
      setFilterState(Object.assign(updatedState, { [name]: value }));
    }
    
    if (value) {
      const isAnyEmpty = Object.values(updatedState).some(item => !item);
      if (!isAnyEmpty) {
        getStudentsApiCall(updatedState);
      } else {
        dispatch(setStudentsListAct({}));
      }
    } else {
      dispatch(setStudentsListAct({}));
    }
  }
  function getStudentsApiCall(otherProps?: any) {
    const params = {
      branchId: props.branchId, ...filterState, ...searchFilterState,
      ...otherProps, accountCreated: false, pageNo: 0, pageSize: 200,
    };
    dispatch(getStudentsListAct(generateActionPayload("get_students_users", undefined, params)));
  }

  function onSelectStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      studentId = event.target.getAttribute("data-id"),
      studentIndex = availableStudentsState.findIndex((item: any) => item.studentId === Number(studentId));
    if (studentIndex > -1) {
      const studentDetails = availableStudentsState[studentIndex],
        updatedAvailableStudentState = [...availableStudentsState];
      updatedAvailableStudentState.splice(studentIndex, 1, { ...studentDetails, selected: checked });
      updateSelectedAllHndlr(updatedAvailableStudentState);
      setAvailableStudentState(updatedAvailableStudentState);
      //Call for filter if search is present.
      searchStudentByNameHndlr(searchFilterState.searchString, updatedAvailableStudentState);
    }
  }

  function selectAllStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setSelectAllStudentState(checked);
    const updatedAvailableStudentState = [...availableStudentsState];
    updatedAvailableStudentState.forEach((item: any) => {
      item.selected = checked;
    });
    setAvailableStudentState(updatedAvailableStudentState);
    // updateSelectedAllHndlr(updatedAvailableStudentState);
  }

  function updateSelectedAllHndlr(studentList: any) {
    const isAnyUnselected = studentList.some((item: any) => !item.selected);
    setSelectAllStudentState(!isAnyUnselected);
  }
  function createAccountHndlr(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedStudentList = [...availableStudentsState],
      selectedStudents = selectedStudentList.filter(student => student.selected);
    if (selectedStudents.length > 0) {
      const { roleId, roleType } = roleDetailState,
        { instituteId, branchId } = props;
      const createUserPayload = selectedStudents.map((item: any) => ({
        firstName: item?.studentName,
        lastName: " ",
        email: item?.email,
        refId: item?.studentId,
        username: item?.studentCode,
        mobile: item?.phoneNumber,
        roleId: roleId,
        instituteId: instituteId,
        branchId: branchId,
        password: "1234567",
        enabled: true
      }));
      dispatch(multipleCreateUserAct(generateActionPayload("create_multiple_user", { roleType }, { users: createUserPayload })));
    }
  }

  return (
    <>
    
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-x-4 tw-mb-3">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <div>
                <TextInput
                  name="roleId"
                  labelText="Role Type"
                  value={roleTypes.STUDENT}
                  onChange={null}
                  isDisabled={true}
                />
              </div>
              <div className="tw-mt-3">
                <SelectInput
                  name="curriculumId"
                  labelText="Curriculum"
                  value={filterState.curriculumId}
                  onChange={filterHandler}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  menuItems={brchCurriculumResp?.data}
                />
              </div>
              <div className="tw-mt-3">
                <SelectInput
                  name="classId"
                  labelText="Class"
                  value={filterState.classId}
                  onChange={filterHandler}
                  menuItems={branchClassResp?.content}
                  valueKey="id"
                  textKey="shortName"
                />
              </div>

            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <div>
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  value={filterState.academicYearId}
                  onChange={filterHandler}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  menuItems={academicYearListResp?.data}
                />
              </div>
              <div className="tw-mt-3">
                <label className="tw-block tw-mb-1 tw-font-medium">Select Students</label>
                <div style={{ border: "1px solid #CED4DA", borderRadius: "5px", padding: "10px" }}>
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={searchFilterState.searchString}
                      onChange={searchFilterHndlr}
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                    />

                    <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                  </div>
                  <div className="tw-my-3">
                    {/* <span>Select All:</span> */}
                    <InputCheckbox
                      name="selectAllStudent"
                      labelName="Select All"
                      value={selectAllStudentState}
                      onChange={selectAllStudentHndlr}
                    />
                  </div>
                  <div style={{ height: "200px", maxHeight: "200px", overflowX: "hidden", overflowY: "auto" }}>
                    {searchStudentListState && searchStudentListState.map((student: any) => {
                      const { studentImageBase64 } = student,
                        imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";
                      return (<div key={`student-${student?.studentId}`} className="tw-flex tw-border-b tw-border-[#EFF2F7] tw-items-center tw-mb-2">
                        {/* <input
                            className="form-check-input me-3"
                            type="checkbox"
                            value=""
                            id="checkall"
                            name="allSubject"
                            checked={isCheck.includes(+student.id)}
                            onChange={onSelectStudentHndlr}
                          /> */}
                        <InputCheckbox
                          name={`checkbox-${student?.studentId}`}
                          // labelName={item.shortName}
                          value={student.selected}
                          onChange={onSelectStudentHndlr}
                          dataId={student?.studentId}
                        />
                        <UserDetails
                          imageUrl={imageBaseUrl}
                          displayName={student?.studentName}
                          displayId={student?.studentCode}
                          size="xs"
                          defaultImgType="student"
                        />
                      </div>)
                    })}
                    {
                      (searchStudentListState.length === 0) && <NoDataComp />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
           
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
             onClick={(event:any)=>createAccountHndlr(event)}
             disabled={showApiLoader}
           >
             Submit
           </Button>
         
       </div>
        </div>
    
    </>
  );
};

export default CreateStudentAccModal;
