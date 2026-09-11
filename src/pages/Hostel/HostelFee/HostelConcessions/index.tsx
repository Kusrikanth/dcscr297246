
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getStudentConcessionListAct } from "../../../../store/fee/feeconcessions/feeconcessionactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { deleteHostelConcessionAct, exportHostelConcessionAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import { useModal } from "../../../../hooks/modalhook";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const HostelConcessions = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { closeModal: closeHostelConceModal, modalState: delHostelConceState, openModal: openHostelConceModal } = useModal();

  const moveToNewStudentConcessionHandler = (id?: any) => {
    if (id) {
      history.push("/hostel-concession/create-concession", { id: id, fromComponent: 'Student Concession' });
    } else {
      history.push("/hostel-concession/create-concession");
    }
  };

  const hostelConcessionList = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, searchString } = hostelConcessionFilterState;
    let payload = {
      studentId: null,
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      classId: classId,
      searchString: searchString,
      branchId: branchId,
      sortBy: "createdAt",
      orderBy: "DESC",
      ...pagination.current,
      ...otherProps
    };
    if (payload.academicYearId) {
      dispatch(getStudentConcessionListAct(generateActionPayload('get_hostel_concession', undefined, payload)))
    }
  }

  const [hostelConcessionFilterState, setHostelConcessionFilterState] = useState(initialValues);

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    studentConcessionList,
    feeConcessionErrorState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    deleteHostelConcessionResp,
    exportHostelConcessionResp,
    hostelStuLedgerErrResp,
    showApiLoader,
  } = useAppSelector(
    ({  globalData, instAcademics, branchAcademics, appData, feeConcession, hostelStuLedger }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      studentConcessionList: feeConcession.studentConcessionList,
      feeConcessionErrorState: feeConcession.feeConcessionErrorState,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      exportHostelConcessionResp: hostelStuLedger.exportHostelConcessionResp,
      deleteHostelConcessionResp: hostelStuLedger.deleteHostelConcessionResp,
      hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
    }),
    shallowEqual
  );

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          moveToNewStudentConcessionHandler(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const concessionId = event.currentTarget.getAttribute('data-id');
          openHostelConceModal(concessionId);
        },
      },
      
    ],
    [studentConcessionList]
  );

  const roleColumns = useMemo(() => generateColumns(menuOptions), [studentConcessionList]);

  useEffect(() => {

    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setHostelConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    hostelConcessionList({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp,branchId,instituteId]);

  const StudentConcessionRef = useRef({
    prevFeeConcessionErrorState: feeConcessionErrorState,
    prevHostelStuLedgerErrResp: hostelStuLedgerErrResp,
    prevExportHostelConcessionResp: exportHostelConcessionResp,
    prevDeleteHostelConcessionResp: deleteHostelConcessionResp,
  })

  useEffect(() => {
    const { prevFeeConcessionErrorState,prevHostelStuLedgerErrResp, prevExportHostelConcessionResp, prevDeleteHostelConcessionResp } = StudentConcessionRef.current || {};
    if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { details } = feeConcessionErrorState || {}
      toast.error(details);
    }
    if (hostelStuLedgerErrResp && hostelStuLedgerErrResp !== prevHostelStuLedgerErrResp) {
      const { details } = hostelStuLedgerErrResp || {}
      toast.error(details);
    }
    else if (exportHostelConcessionResp && exportHostelConcessionResp !== prevExportHostelConcessionResp) {
      toast.success("Hostel Concession Data Download Successfully.");
      closeExportExcelModal();
      downloadExcelFile(exportHostelConcessionResp,'Hostel_Student_Concession.xlsx')
    }
    else if (deleteHostelConcessionResp && prevDeleteHostelConcessionResp !== deleteHostelConcessionResp) {
      toast.success("Hostel Concession Deleted Successfully.");
      closeHostelConceModal();
      hostelConcessionList();
    }

    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
    StudentConcessionRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp
    StudentConcessionRef.current.prevExportHostelConcessionResp = exportHostelConcessionResp
    StudentConcessionRef.current.prevDeleteHostelConcessionResp = deleteHostelConcessionResp
  }, [feeConcessionErrorState,hostelStuLedgerErrResp, exportHostelConcessionResp, deleteHostelConcessionResp])

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: hostelConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId,academicYearId : hostelConcessionFilterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0

    if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value })
        setHostelConcessionFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "" }))
        hostelConcessionList({ academicYearId: value, classId: "", curriculumId: "" })
        dispatch(resetBrchClassAct(undefined));
    }
    else if (name === 'curriculumId') {
      setHostelConcessionFilterState((prev: any) => ({ ...prev, [name]: value,classId:"" }))
      hostelConcessionList({ curriculumId: value, classId: "" })
      if (value) {
          getClassApiCall(value)
      }
      else {
          dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
        setHostelConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
        hostelConcessionList({ [name]: value })
    }
  }

  function delModalSubmitHndlr() {
    const { modalData } = delHostelConceState;
    dispatch(deleteHostelConcessionAct(generateActionPayload("delete_hostel_concession", { id: modalData })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    hostelConcessionList(paginationInfo)
  }

  const exportExcelHndler = () => {

    dispatch(exportHostelConcessionAct(generateActionPayload("export_hostel_fee_receipt", undefined, { ...hostelConcessionFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }
  const { data: academicYearList } = academicYearListResp || {};
  const { data: StudentConcessionData, pageNumber, totalPages, totalElements } = studentConcessionList || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Student Concessions" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Hostel Concessions Details
                  </h4>
                </div>
                <div className="tw-ml-auto">
                  <div className="tw-flex tw-gap-2">
                    <Button
                      variant="primary"
                      onClick={() => moveToNewStudentConcessionHandler()} >
                      <i className="ri-add-line tw-mr-1" />
                      Add New
                    </Button>

                    <Button
                      variant="info"
                      onClick={openExportExcelModal}
                    >
                      <i className="ri-add-line tw-mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3">
                <div>
                  <div className="tw-relative  search-box">
                    <TextInput
                      name="searchString"
                      value={hostelConcessionFilterState.searchString}
                      onChange={filterHandler}
                      inputClassName="tw-bg-gray-100"
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      placeHolder="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                  </div>
                </div>

                <div>
                  <SelectInput
                    name="academicYearId"
                    value={hostelConcessionFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div>
                  <SelectInput
                    name="curriculumId"
                    value={hostelConcessionFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>

                <div>
                  <SelectInput
                    name="classId"
                    value={hostelConcessionFilterState.classId}
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
            </div>

            <TableContainer
              columns={roleColumns || []}
              data={StudentConcessionData || []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
                id="Hostel-Concession-export"
                isOpen={exportExcelState.showModal}
                toggle={closeExportExcelModal}
                modalTitle="Export Hostel Concession Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcelState.showModal}
                    toggle={closeExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="hostel_concessions"
                    remarksText="Enter remarks to export hostel concession data?"
                />
            </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-hostel-concession-modal"
        isOpen={delHostelConceState.showModal}
        confirmMessage="Are you sure you want to delete this Concession ?"
        cancelHndlr={closeHostelConceModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default HostelConcessions;
