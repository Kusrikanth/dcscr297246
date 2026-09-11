import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { useFormik } from "formik";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { assignGroupFilterhProps } from "./assignGroupTypes";
import { SelectInput } from "../../../Components/Common";
import { IMenuOptions } from "../academicsTypes";
import VerticalTab from "../../../Components/Common/VerticalTab";

import StudentData from "./StudentData";
import {
  clearStudentList,
  getStreamList,
  resetAssigroupAct,
  resetStreamList,
} from "../../../store/academic/assignGroup/assigngroupactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import 'react-toastify/dist/ReactToastify.css';
import { getStreamClassList } from "../../../store/academic/classroomManagment/classroommanagmentactions";

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "3d6b8a04-1059-4394-92ee-4c1320d60b06",
    labelName: "Eleventh Class M.P.C",
  },
  // {
  //   id: "3d6b8a04-1059-4394-92ee-4c1320d60b06a",
  //   labelName: "Eleventh Class BI.P.C",
  // },
  // {
  //   id: "3d6b8a04-1059-4394-92ee-4c1320d60b06",
  //   labelName: "Eleventh Class M.BI.P.C",
  // },
];

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    default:
      return StudentData;
  }
}

const initialValues: assignGroupFilterhProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};
const filterData = {
  branchId: "",
  pageNo: 0,
  pageSize: 10,
  sortBy: "streamGroupName",
  orderBy: "asc"
}
const AssignGroup = () => {
  const dispatch = useAppDispatch();
  const [assignGroupFilterState, setAssignGroupFilterState] =
    useState<assignGroupFilterhProps>(initialValues);
  const [filterState, setFilterState] =
    useState<any>(filterData);
  const [academicDropDown, setAcademicDropDown] = useState<
    Array<{ academicTitle: string; id: string }>
  >([]);
  const [classDropDown, setClassDropDown] = useState<
    Array<{ classTitle: string; id: string }>
  >([]);
  // const [academicType, setAcademicType] = useState("");
  // const [classType, setClassType] = useState("");
  const [dropDownDetails, setDropDownDetails] = useState({
    academicId: "",
    classId: "",
  });
  const [streamListData, setStreamListData] = useState<Array<IMenuOptions>>([]);
  const { academicYearListResp, brchCurriculumResp, branchClassResp, streamListResp,streamClassList, classDetailsResp, updateClassroomStudentsResp, assignGroupErrorResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId }: any =
    useAppSelector(
      ({ assignGroupInfo, instAcademics, branchAcademics, appData,classroomManagmentInfo }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        streamClassList: classroomManagmentInfo.streamClassList,
        // academicDetailsResp: assignGroupInfo.academicDetailsResp,
        streamListResp: assignGroupInfo.streamListResp,
        classDetailsResp: assignGroupInfo.classDetailsResp,
        updateClassroomStudentsResp: assignGroupInfo.updateClassroomStudentsResp,
        assignGroupErrorResp: assignGroupInfo.assignGroupErrorResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,

      }),
      shallowEqual
    );

  const assignGroupFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: assignGroupFilterState,
    onSubmit: (values) => { },
  });

  useEffect(() => {
    return () => {
      dispatch(resetAssigroupAct(undefined))
    }
  }, [])


  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: assignGroupFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}


  useEffect(() => {
    let arr: Array<IMenuOptions> = [];
    streamListResp &&
      streamListResp.content.map((stream: any) => {
        arr.push({
          id: stream.id,
          labelName: stream.shortName,
        });
      });
    setStreamListData(arr);
  }, [streamListResp]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    getCurriculumApiCall({ academicYearId: yearId });
    setAssignGroupFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
  }, [academicYearListResp])

  useEffect(() => {
    const { data } = brchCurriculumResp || {}
    if(Array.isArray(data)&&data.length>0){
      const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId,academicYearId: assignGroupFilterState.academicYearId};
      dispatch(getStreamClassList(generateActionPayload("get_stream_class_list", undefined, payload)));
      setAssignGroupFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])

  useEffect(()=>{
    const { data } = streamClassList || {};
    if(Array.isArray(data)&&data.length>0){
      // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
      // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setAssignGroupFilterState((prev:any)=>({...prev,classId:data[0].id}))
      getStreams({classId:data[0].id})
    }
  }, [streamClassList])
  useEffect(() => {
    let arr =
      classDetailsResp &&
      classDetailsResp.map((cls: any) => {
        return {
          classTitle: `${cls?.branchClass?.instituteClassEntity?.name}`,
          id: cls?.id,
        };
      });
    setClassDropDown(arr);
  }, [classDetailsResp]);

  const getStreams = (otherProps?: any) => {
    const payload = { ...filterState, ...assignGroupFilterState, branchId: branchId, ...otherProps }
    dispatch(
      getStreamList(
        generateActionPayload("get_stream_list", undefined, payload)
      )
    );
  }

  const filterHandler = (event: any) => {
    assignGroupFilterForm.handleChange(event);

    const { name, value } = event.target;
    // setFilterState((prev: any) => ({ ...prev, [name]: value }));
    setAssignGroupFilterState((prev:any)=>({...prev,[name]:value}))
    if(name==="academicYearId"){
      getCurriculumApiCall({academicYearId:value})
      dispatch(resetStreamList(undefined));
      dispatch(clearStudentList(undefined));

    }
    else if (name === "classId") {
      if (value && assignGroupFilterForm.values.curriculumId && assignGroupFilterForm.values.academicYearId) {
        // dispatch(clearStudentList(undefined));
        getStreams({ [name]: value })
        dispatch(clearStudentList(undefined));
      }
    }
    else if (name === 'curriculumId') {
      // assignGroupFilterForm.setValues((prev:any)=>({...prev,curriculumId:value,classId:""}));
      const payload = { branchId: branchId, curriculumId: value, academicYearId: assignGroupFilterForm.values.academicYearId };
      dispatch(getStreamClassList(generateActionPayload("get_stream_class_list", undefined, payload)));
      dispatch(resetStreamList(undefined));
      dispatch(clearStudentList(undefined));
    }
    else if (name === "searchString") {
      getStreams({ [name]: value })
    }
    // getSectionListResp({pageNo: 0,classId: selectedDropDownDetails?.classId,})

  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { data: classTypes } = streamClassList || {};
  const { content: streamList } = streamListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Assign Group Details" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1 tw-mb-0">
                  Assign Group Details
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-px-4 tw-py-4">
                <form onSubmit={assignGroupFilterForm.handleSubmit}>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-2">
                      <SelectInput
                        name="academicYearId"
                        value={assignGroupFilterForm.values.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                      />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-2">
                      <SelectInput
                        name="curriculumId"
                        value={assignGroupFilterForm.values.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                      />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-2">
                      <SelectInput
                        name="classId"
                        value={assignGroupFilterForm.values.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                        floatingLabel
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <VerticalTab
            MenuOptions={streamListData}
            getActiveMenuComponent={(menuId: any) => {
              return getActiveMenuComponent(menuId)
            }}
            activeTabId={streamListResp && Array.isArray(streamListResp.content) && streamListResp.content.length > 0 ? streamListResp.content[0].id : ""}
            tabHeader="Group Name"
            optionalDetails={assignGroupFilterForm.values}
          />
        </div>
      </div>
      {/* <ToastContainer/> */}
    </>
  );
};

export default AssignGroup;
