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

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct, } from "../../../../../store/mastersettings/instacademics/instacademicactions";

import { getAllParentsListAct, setAllParentsListAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

import { getInstRoleTypeAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { multipleCreateUserAct } from "../../../../../store/usermanagement/usermanagementactions";
import { generateApiUrl } from "../../../../../api/apihelper";
import { toast } from "react-toastify";
//Constants
import { roleTypes } from "../../../../../Components/constants/common";

//Utility
import { searhWithTextInList, debounce } from "../../../../../utility/commonutility";
import { UserTypeLists } from "./helper";

const initialValues: ManageStudentFilterProps = {
  // search: "",
  userType: "",
  academicYear: "",
  curriculumId: "",
  classId: "",
  searchString: ""
};

const CreateParentAccModal = (props: any) => {
  const [filterState, setFilterState] = useState({
    academicYearId: "",
    curriculumId: "",
    classId: "",
  });
  const [searchFilterState, setSearchFilterState] = useState({
    searchString: ""
  });
  const [roleDetailState, setRoleDetailState] = useState({
    roleId: "",
    roleType: "",
  });
  const [userTypeCreation, setUserTypeCreation] = useState("CODE");
  const [selectAllParentState, setSelectAllParentState] = useState(false);
  const [availableParentsState, setAvailableParentsState] = useState<any>([]);
  const [searchParentListState, setSearchParentListState] = useState<any>([]);

  const availableStudentRef = useRef([]);
  const [isCheck, setIsCheck] = useState<Array<number>>([]);


  const dispatch = useAppDispatch();
  const { allParentsListResp, instRoleTypeListResp, branchClassResp,
    academicYearListResp, brchCurriculumResp, multipleCreateUserResp, studentManagementErrorResp, showApiLoader } =
    useAppSelector(({ instituteInfo, directoryStudent, branchAcademics, instAcademics, userManagement , globalData }) => ({
      allParentsListResp: directoryStudent.allParentsListResp,
      instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      academicYearListResp: instAcademics.academicYearListResp,
      multipleCreateUserResp: userManagement.multipleCreateUserResp,
      studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
      showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

  const createAccountRespRef = useRef<any>({
    prevAllParentsListResp: allParentsListResp,
    prevInstRoleTypeListResp: instRoleTypeListResp,
    prevMultipleCreateUserResp: multipleCreateUserResp,
    prevStudentManagementErrorResp: studentManagementErrorResp,
  });

  useEffect(() => {
    const { prevAllParentsListResp, prevInstRoleTypeListResp, prevMultipleCreateUserResp } = createAccountRespRef.current;
    if (allParentsListResp && prevAllParentsListResp !== allParentsListResp) {
      const { data } = allParentsListResp || {};
      if (Array.isArray(data)) {
        const studentData = JSON.parse(JSON.stringify(data));
        setAvailableParentsState(studentData);
        searchParentByNameHndlr(searchFilterState.searchString, studentData);
      } else {
        setAvailableParentsState([]);
        setSearchParentListState([]);
      }
    } else if (instRoleTypeListResp && prevInstRoleTypeListResp !== instRoleTypeListResp) {
      const { data } = instRoleTypeListResp;
      if (Array.isArray(data)) {
        const { id, roleType }: any = data.find(item => item.roleType === roleTypes.PARENT) || {};
        // setFilterState((prevState: any) => ({ ...prevState, roleId: id, roleType }));
        setRoleDetailState((prevState: any) => ({ ...prevState, roleId: id, roleType }))
      }
    } else if (multipleCreateUserResp && prevMultipleCreateUserResp !== multipleCreateUserResp) {
      toast.success("Parents login id's created successfully.");
      props.toggle(true);
    }
    createAccountRespRef.current.prevAllParentsListResp = allParentsListResp;
    createAccountRespRef.current.prevInstRoleTypeListResp = instRoleTypeListResp;
    createAccountRespRef.current.prevMultipleCreateUserResp = multipleCreateUserResp;
  }, [allParentsListResp, instRoleTypeListResp, multipleCreateUserResp]);

  useEffect(() => {
    const { instituteId, isOpen } = props;
    if (isOpen && instituteId) {
      const rolesApiPayload = { instituteId };
      const roleApiParams = { roleType: roleTypes.PARENT };
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
      dispatch(setAllParentsListAct({}));
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


  function filterData(searchKey: any, searchValue: any) {
    // const { data } = allParentsListResp;
    const filterAvailableStudent = searhWithTextInList(availableParentsState, searchKey, searchValue);
    // setAvailableParentsState(JSON.parse(JSON.stringify(filterAvailableStudent)));
  }

  function searchParentByNameHndlr(searchValue: any, studentList: any) {
    if (Array.isArray(studentList) && searchValue) {
      const filterAvailableStudent = searhWithTextInList(studentList, "fatherName", searchValue);
      setSearchParentListState(filterAvailableStudent);
    } else if (Array.isArray(studentList)) {
      setSearchParentListState(studentList);
    }
  }
  const debouncedHandler = useCallback(debounce(searchParentByNameHndlr, 200), [availableParentsState]);
  function searchFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setSearchFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    debouncedHandler(value, availableParentsState);
    // debouncedHandler("studentName", value);
    // getParentsApiCall({ [name]: value });
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
        getParentsApiCall(updatedState);
      } else {
        dispatch(setAllParentsListAct({}));
      }
    } else {
      dispatch(setAllParentsListAct({}));
    }
  }
  function getParentsApiCall(otherProps?: any) {
    const params = {
      branchId: props.branchId,
      ...otherProps, hasAccount: false, pageNo: 0, pageSize: 50
    };
    dispatch(getAllParentsListAct(generateActionPayload("get_all_parents", undefined, params)));
  }

  function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      parentId = event.target.getAttribute("data-id"),
      studentIndex = availableParentsState.findIndex((item: any) => item.id === Number(parentId));
    if (studentIndex > -1) {
      const studentDetails = availableParentsState[studentIndex],
        updatedAvailableParentState = [...availableParentsState];
      updatedAvailableParentState.splice(studentIndex, 1, { ...studentDetails, selected: checked });
      updateSelectedAllHndlr(updatedAvailableParentState);
      setAvailableParentsState(updatedAvailableParentState);
      searchParentByNameHndlr(searchFilterState.searchString, updatedAvailableParentState);
    }
  }

  function selectAllParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setSelectAllParentState(checked);
    const updatedAvailableParentState = [...availableParentsState];
    updatedAvailableParentState.forEach((item: any) => {
      item.selected = checked;
    });
    setAvailableParentsState(updatedAvailableParentState);
    // updateSelectedAllHndlr(updatedAvailableParentState);
  }

  function updateSelectedAllHndlr(studentList: any) {
    const isAnyUnselected = studentList.some((item: any) => !item.selected);
    setSelectAllParentState(!isAnyUnselected);
  }
  function createAccountHndlr(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedStudentList = [...availableParentsState],
      selectedParents = selectedStudentList.filter(student => student.selected);
    if (selectedParents.length > 0) {
      const { roleId, roleType } = roleDetailState,
        { instituteId, branchId } = props;
        const createUserPayload: any = selectedParents.map((item: any) => {
          let newUsername = "";
          switch (userTypeCreation) {
            case "CODE":
              newUsername = item?.parentCode || "";
              break;
            case "EMAIL":
              newUsername = item?.emailId || "";
              break;
            case "PHONE":
              newUsername = item?.smsPriorityNumber || "";
              break;
            default:
              newUsername = item?.parentCode || "";
          }
    
          return {
            firstName: item?.fatherName,
            lastName: " ", 
            email: item?.fatherEmailId,
            refId: item?.id,
            username: newUsername,
            mobile: item?.fatherContactNo,
            roleId: roleId,
            instituteId: instituteId,
            branchId: branchId,
            password: "1234567",
            enabled: true
          }})
      dispatch(multipleCreateUserAct(generateActionPayload("create_multiple_user", { roleType }, { users: createUserPayload })));
    }
  }
  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUserType = event.target.value;
    setUserTypeCreation(selectedUserType);
  }
  return (
    <>
        <div className="tw-p-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-x-4 tw-mb-3">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <div>
                <TextInput
                  name="roleId"
                  labelText="Role Type"
                  value={roleTypes.PARENT}
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
              <div className="tw-mt-3">
                <SelectInput
                    name="userTypeCreation"
                    labelText="User Name Type"
                    menuItems={UserTypeLists}
                    value={userTypeCreation}
                    onChange={handleUserTypeChange}
                    valueKey="name"
                    textKey="name"
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
                <label className="tw-block tw-mb-1 tw-font-medium">Select Parents</label>
                <div className="tw-border tw-border-[#CED4DA] tw-rounded-[5px] tw-p-2.5">
                  <div className="tw-relative">
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
                      value={selectAllParentState}
                      onChange={selectAllParentHndlr}
                    />
                  </div>
                  <div style={{ height: "200px", maxHeight: "200px", overflowX: "hidden", overflowY: "auto" }}>
                    {searchParentListState && searchParentListState.map((student: any) => {
                      const { studentImageBase64 } = student,
                        imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";
                      return (<div key={`student-${student?.id}`} className="tw-flex tw-border-b tw-border-[#EFF2F7] tw-items-center tw-mb-2">
                        {/* <input
                            className="form-check-input me-3"
                            type="checkbox"
                            value=""
                            id="checkall"
                            name="allSubject"
                            checked={isCheck.includes(+student.id)}
                            onChange={onSelectParentHndlr}
                          /> */}
                        <InputCheckbox
                          name={`checkbox-${student?.id}`}
                          // labelName={item.shortName}
                          value={student.selected}
                          onChange={onSelectParentHndlr}
                          dataId={student?.id}
                        />
                        <UserDetails
                          imageUrl={imageBaseUrl}
                          displayName={student?.fatherName}
                          displayId={student?.parentCode}
                          size="xs"
                          defaultImgType="user"
                        />
                      </div>)
                    })}
                    {
                      (searchParentListState.length === 0) && <NoDataComp />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="tw-grid tw-grid-cols-12 tw-mt-4">
              <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2">
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
                  disabled={showApiLoader}
                  onClick={(e: any) => {createAccountHndlr(e)}}
                >
                  Submit
                </Button>
              </div>
            </div>
        </div>
    </>
  );
};

export default CreateParentAccModal
