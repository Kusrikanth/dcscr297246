import React, { useState, useMemo, useEffect, useRef } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  generateColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import { IAcademicsModal } from "../academicsTypes";
import GenerateRollNumModal from "./GenerateRollNumModal";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct, resetBrchClassAct, resetBrchSectionsAct, setBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { getGenerateRollNo, sectionListFilterAct, updateStuRollNoAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
  searchString: "",
  academicYearId: "",
  // branchId: "",
  branchClassId: "",
  curriculumId: "",
  sectionId: "",
};

const GenerateRollNumbers = () => {
  const [generateRollNumFilterState, setGenerateRollNumFilterState] =
    useState<any>(initialValues);
  const [sectionList, setSectionList] = useState([]);
  const [classList, setClassList] = useState<any>([]);
  const [generateRollNoList, setGenerateRollNoList] = useState<any>([]);
  const dispatch = useDispatch();
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    brchSectionsResp,
    getGenerateRollNoResp,
    assignRollNoState,
    updateStuRollNoResp,
    classroomManagmentErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    sectionListFilterResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, classroomManagmentInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      getGenerateRollNoResp: classroomManagmentInfo.getGenerateRollNoResp,
      assignRollNoState: classroomManagmentInfo.assignRollNoState,
      updateStuRollNoResp: classroomManagmentInfo.updateStuRollNoResp,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      sectionListFilterResp: classroomManagmentInfo.sectionListFilterResp
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getGenerateRollNoResp) {
      const proposedadmissionListRespData = getGenerateRollNoResp?.content;

      const updatedData = proposedadmissionListRespData?.map((item: any) => ({
        ...item,
        isEdit: false,
      }));
      setGenerateRollNoList(updatedData)
    }
  }, [getGenerateRollNoResp])

  const [filterState, setFilterState] = useState<any>({
    pageNo: 0, pageSize: 10, branchId: branchId,
  });
  const [generateRollNumModalState, setGenerateRollNumModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });

  const toggleGenerateRollNumModal = (apiCall?: any) => {
    setGenerateRollNumModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      generateRollNumber();
    }
  };

  const generateRollNumber = (otherProps?: any) => {
    let params = {
      ...generateRollNumFilterState,
      ...filterState, ...otherProps
    }
    if (params.academicYearId && params.curriculumId && params.branchClassId) {
      dispatch(getGenerateRollNo(generateActionPayload('get_generate_roll_no', undefined, params)))
    }
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setGenerateRollNumFilterState((prev: any) => {
      if (name === "academicYearId") {
        return {
          ...prev,
          academicYearId: value,
          curriculumId: "",
          branchClassId: "",
          sectionId: "",
        };
      }
      if (name === "curriculumId" && !value) {
        return { ...prev, curriculumId: "", branchClassId: "", sectionId: "" };
      }
      if (name === "branchClassId" && value === "") {
        return { ...prev, branchClassId: "", sectionId: "" };
      }

      return { ...prev, [name]: value };
    });

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
    } else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      } else {
        getClassApiCall({
          curriculumId: value,
          academicYearId: generateRollNumFilterState.academicYearId,
        });
        setGenerateRollNumFilterState((prev: any) => ({
          ...prev,
          branchClassId: "",
          sectionId: "",
        }));
      }
    } else if (name === "branchClassId") {
      if (value === "") {
        dispatch(resetBrchSectionsAct(undefined));
        setSectionList([]);
      } else {
        const payload = {  masterAcademicYearId: generateRollNumFilterState.academicYearId, branchCurriculumId: generateRollNumFilterState.curriculumId, branchClassId: value, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
        dispatch(sectionListFilterAct(generateActionPayload("get_section_list", undefined, payload)));
      }
    } else {
      generateRollNumber({ [name]: value });
    }
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-mr-2 tw-text-gray-500" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const academicStudentId = event.currentTarget.getAttribute("data-id");

          const updatedData = generateRollNoList.map((item: any) => {
            if (+(item?.academicStudentId) === +academicStudentId) {
              return { ...item, isEdit: true };
            } else {
              return { ...item, isEdit: false };
            }
          });

          setGenerateRollNoList(updatedData)
        },
      },
      {
        id: "success",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="tw-mr-2 tw-text-[#1bb3a6]" size={18} />,
        actionName: "Success",
        onClickHndlr: (event: any) => {
          const academicStudentId = event.currentTarget.getAttribute("data-id");
          const newData = generateRollNoList?.find((i: any) => {
            return +i?.academicStudentId === +academicStudentId
          })
          const payload = {
            id: academicStudentId,
            rollNo: newData?.rollNo
          }

          dispatch(
            updateStuRollNoAct(
              generateActionPayload("update_generate_roll_no_list", { ...payload })
            )
          );
        },
      },
    ],
    [generateRollNoList]
  );

  const curriculumColumns = useMemo(() => generateColumns(menuOptions), [generateRollNoList]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: generateRollNumFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: generateRollNumFilterState?.academicYearId, curriculumId: generateRollNumFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  useEffect(() => {
    if (academicYearListResp) {
      const yearId = academicYearListResp.data.find(
        (year: any) => year.yearStatus === "CURRENT"
      )?.academicYearId;

      if (yearId && yearId !== generateRollNumFilterState.academicYearId) {
        setGenerateRollNumFilterState((prev: any) => ({
          ...prev,
          academicYearId: yearId,
        }));
        getCurriculumApiCall({ academicYearId: yearId });
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (brchCurriculumResp?.data?.length > 0) {
      const curriculumId = brchCurriculumResp.data[0].branchCurriculumId;

      if (curriculumId !== generateRollNumFilterState.curriculumId) {
        const payload = {
          branchId,
          curriculumId,
          academicYearId: generateRollNumFilterState.academicYearId,
          sortBy: "classSequence",
          orderBy: "asc",
          pageNo: 0,
          pageSize: 100,
        };
        setGenerateRollNumFilterState((prev: any) => ({
          ...prev,
          curriculumId,
          branchClassId: "",
          sectionId: "",
        }));
        dispatch(
          getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
        );
      }
    }
  }, [brchCurriculumResp]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0 && generateRollNumFilterState.curriculumId && !generateRollNumModalState.showModal) {
      setGenerateRollNumFilterState((prev: any) => ({ ...prev, branchClassId: content[0].id }));
      const payload = {  masterAcademicYearId: generateRollNumFilterState.academicYearId,  branchClassId: content[0].id, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc", };
      dispatch(sectionListFilterAct(generateActionPayload("get_section_list", undefined, payload)));
      setClassList(content);
      setGenerateRollNumFilterState((prev: any) => ({ ...prev, branchClassId: content[0].id, sectionId: "" }))
    }
  }, [branchClassResp])

  useEffect(() => {
    if (sectionListFilterResp && !generateRollNumModalState.showModal) {
      const sections = sectionListFilterResp.data;      

      if (sections?.length > 0) {
        setSectionList(sections || []);
        setGenerateRollNumFilterState((prev: any) => ({
          ...prev,
          sectionId: sections[0].sectionId,
        }));
        generateRollNumber({ sectionId: sections[0].sectionId });
      }
    }
  }, [sectionListFilterResp]);


  const GenerateRollNoRef = useRef<any>({
    prevAssignRollNo: assignRollNoState,
    prevUpdateStuRollNoResp: updateStuRollNoResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp,

  });
  useEffect(() => {
    const { prevAssignRollNo, prevUpdateStuRollNoResp, prevClassroomManagmentErrorResp } = GenerateRollNoRef.current || {};
    if (assignRollNoState && assignRollNoState !== prevAssignRollNo) {
      toast.success('Roll No is Assigned Successfully')
      toggleGenerateRollNumModal(true);
    }
    else if (updateStuRollNoResp && updateStuRollNoResp !== prevUpdateStuRollNoResp) {
      toast.success('Roll No is Updated Successfully')
      generateRollNumber()
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp || {};
      toast.error(details || "Something went wrong.")
    }
    GenerateRollNoRef.current.prevAssignRollNo = assignRollNoState;
    GenerateRollNoRef.current.prevUpdateStuRollNoResp = updateStuRollNoResp;
    GenerateRollNoRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [assignRollNoState, updateStuRollNoResp, classroomManagmentErrorResp])

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
    generateRollNumber(paginationInfo);
  }

  const tableChangeHandler = (event: any, academicStudentId: any) => {
    const { value } = event.target;
    const data: any = generateRollNoList.map((adm: any) => +adm.academicStudentId === +academicStudentId ? ({ ...adm, rollNo: value }) : adm);
    setGenerateRollNoList(data)
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { content: generateStudentRollNo, totalPages, totalElements, pageable: pageDetails } = getGenerateRollNoResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Generate Roll Numbers" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Generate Roll Numbers
                </h4>
                <Button type="button" variant="primary" onClick={toggleGenerateRollNumModal}>
                  Generate New
                </Button>
              </div>
            </div>
            <div className="tw-px-4 tw-py-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={generateRollNumFilterState.searchString}
                      onChange={filterHandler}
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={generateRollNumFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={generateRollNumFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="branchClassId"
                    value={generateRollNumFilterState.branchClassId}
                    onChange={filterHandler}
                    menuItems={classList}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="sectionId"
                    value={generateRollNumFilterState.sectionId}
                    onChange={filterHandler}
                    menuItems={sectionList || []}
                    valueKey="sectionId"
                    textKey="sectionName"
                    formgroupClassName="tw-mb-0"
                    labelText="Section"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
            <TableContainer
              columns={curriculumColumns || []}
              data={generateRollNoList || []}
              divClass="table-responsive tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageDetails?.pageNumber}
              sortingHandler={() => { }}
              onChangeInputHndlr={tableChangeHandler}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="generate-roll-number-modal"
        isOpen={generateRollNumModalState.showModal}
        toggle={toggleGenerateRollNumModal}
        modalTitle="Generate Roll Numbers"
        modalSize="lg"
      >
        <GenerateRollNumModal
          isOpen={generateRollNumModalState.showModal}
          toggle={toggleGenerateRollNumModal}
          modalTitle="Generate Roll Numbers"
          instituteId={instituteId}
          instituteName={"Generate Roll Numbers"}
          branchId={branchId}
          editData={generateRollNumFilterState}
        />
      </ModalContainerUpdated>
      {/* <ToastContainer/> */}
    </>
  );
};

export default GenerateRollNumbers;
