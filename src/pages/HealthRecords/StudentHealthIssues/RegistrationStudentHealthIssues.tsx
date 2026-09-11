import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
  deleteMiRoomListAct,
  exportStudentHealthIssuesAct,
  getRegistrationHealthIssueListAct,
  getStuHealthIssueListAct,
} from "../../../store/healthrecords/healthrecordsaction";
import { generateColumns, recordTypes } from "./helper";
import ExportModal from "../../Directory/StudentManagement/ExportModal";

const initialValues = {
  searchString: "",
  classId: "",
  curriculumId: "",
  academicYearId: "",
};

const RegistrationStudentHealthIssues = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    scrutinyId: undefined,
  });
  const [delMiRoomModalState, setDelMiRoomModalState] = useState<any>({
    showModal: false,
    id: "",
  });

  const stuHealthIssuesList = (otherProps?: any) => {
    const payload = {
      instituteId: instituteId,
      branchId,
      ...healthIssuesFilterState,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(
      getRegistrationHealthIssueListAct(
        generateActionPayload(
          "get_registration_health_issues",
          undefined,
          payload
        )
      )
    );
  };

  const [healthIssuesFilterState, setHealthIssuesFilterState] =
    useState<any>(initialValues);

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getRegistrationHealthIssueListResp,
    healthRecordsErrResp,
    exportStudentHealthIssuesResp,
  } = useAppSelector(
    ({
      globalData,
      instAcademics,
      branchAcademics,
      appData,
      healthRecords,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getMiRoomListResp: healthRecords.getMiRoomListResp,
      getRegistrationHealthIssueListResp: healthRecords.getRegistrationHealthIssueListResp,
      healthRecordsErrResp: healthRecords.healthRecordsErrResp,
      exportStudentHealthIssuesResp:
        healthRecords.exportStudentHealthIssuesResp,
    }),
    shallowEqual
  );

  const hostelFeeReversalRef = useRef<any>({
    prevHealthRecordsErrResp: healthRecordsErrResp,
    prevexportStudentHealthIssuesResp: exportStudentHealthIssuesResp,
  });

  useEffect(() => {
    const { prevHealthRecordsErrResp, prevexportStudentHealthIssuesResp } =
      hostelFeeReversalRef.current;

    if (
      healthRecordsErrResp &&
      prevHealthRecordsErrResp !== healthRecordsErrResp
    ) {
      const { details } = healthRecordsErrResp || {};
      toast.error(details || "Something went wrong.");
    } else if (
      exportStudentHealthIssuesResp &&
      exportStudentHealthIssuesResp !== prevexportStudentHealthIssuesResp
    ) {
      downloadExcelFile(exportStudentHealthIssuesResp);
      toast.success("Student Health Issues Downloaded Successfully.");
      toggleExportExcelModal();
    }

    hostelFeeReversalRef.current.prevHealthRecordsErrResp =
      healthRecordsErrResp;
    hostelFeeReversalRef.current.prevexportStudentHealthIssuesResp =
      exportStudentHealthIssuesResp;
  }, [healthRecordsErrResp, exportStudentHealthIssuesResp]);

  const roleColumns = useMemo(() => generateColumns(), []);
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: healthIssuesFilterState.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
  };
  const getClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: healthIssuesFilterState?.academicYearId,
      curriculumId: healthIssuesFilterState?.curriculumId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  };

  useEffect(() => {
    let yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;
    setHealthIssuesFilterState((prev: any) => ({
      ...prev,
      academicYearId: yearId,
    }));
    stuHealthIssuesList({ academicYearId: yearId });

    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      stuHealthIssuesList({ [name]: value, classId: "", curriculumId: "" });
      setHealthIssuesFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
        curriculumId: "",
      }));
    } else if (name === "curriculumId") {
      stuHealthIssuesList({ [name]: value, classId: "" });
      setHealthIssuesFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
      }));
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      } else {
        getClassApiCall({
          curriculumId: value,
          academicYearId: healthIssuesFilterState.academicYearId,
        });
      }
    } else {
      stuHealthIssuesList({ [name]: value });
      setHealthIssuesFilterState((prev: any) => ({ ...prev, [name]: value }));
    }
  };
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    stuHealthIssuesList(paginationInfo);
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      scrutinyId: id || "",
    }));
  };
  const exportExcelHndler = () => {
    dispatch(
      exportStudentHealthIssuesAct(
        generateActionPayload(
          "export_stu_health_issues",
          undefined,
          { ...healthIssuesFilterState, branchId, instituteId },
          {
            responseType: "blob",
          }
        )
      )
    );
  };
  function downloadExcelFile(blobStream: any) {
    const url = window.URL.createObjectURL(new Blob([blobStream]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Student_health_Issues_List.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  const toggleDelMiRoomModal = (id?: any) => {
    setDelMiRoomModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const delStuLongLeaveConfirmHndler = () => {
    dispatch(
      deleteMiRoomListAct(
        generateActionPayload("delete_mi_room_list", {
          id: delMiRoomModalState.id,
        })
      )
    );
  };

  const {
    content: studentResp,
    totalElements,
    totalPages,
    pageble,
  } = getRegistrationHealthIssueListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-mb-0">
        <div className="tw-p-4">
          <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-12">

            {/* Search */}
            <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-2">
              <div className="search-box">
                
                <TextInput
                  name="searchString"
                  value={healthIssuesFilterState.searchString}
                  onChange={filterHandler}
                  inputClassName="tw-bg-slate-100"
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>

            {/* Academic Year */}
            <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
              <SelectInput
                name="academicYearId"
                value={healthIssuesFilterState.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                labelText="Academic Year"
                floatingLabel
              />
            </div>

            {/* Curriculum */}
            <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
              <SelectInput
                name="curriculumId"
                value={healthIssuesFilterState.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes || []}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                floatingLabel
                formgroupClassName="tw-mb-0"
              />
            </div>

            {/* Class */}
            <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
              <SelectInput
                name="classId"
                value={healthIssuesFilterState.classId}
                onChange={filterHandler}
                menuItems={classTypes || []}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                floatingLabel
                formgroupClassName="tw-mb-0"
              />
            </div>

            
            <div className="tw-col-span-12 lg:tw-col-span-2 tw-hidden tw-justify-end">
              <button
                className="tw-bg-[#405189] tw-text-white tw-px-4 tw-py-2 tw-rounded
                     tw-flex tw-items-center tw-gap-1 hover:tw-opacity-90"
                onClick={() => toggleExportExcelModal()}
              >
                <i className="ri-add-line" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <TableContainer
          columns={roleColumns || []}
          data={getRegistrationHealthIssueListResp?.content || []}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageble?.pageNumber || 0}
        />
      </div>

      <ModalContainerUpdated
        id="health-issues-export-modal"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle="Export Health Issues Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="health_records"
          subFeature="student_health_issues"
          remarksText="Enter remarks to export health issues data?"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-mi-room-modal"
        isOpen={delMiRoomModalState.showModal}
        confirmMessage="Are you sure you want to delete this MI Room ?"
        cancelHndlr={() => toggleDelMiRoomModal()}
        confirmHndlr={delStuLongLeaveConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default RegistrationStudentHealthIssues;
