import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
  PaymentReceivedData,
  selectData2,
} from "./helper";
import { default as ViewLedger } from "../../../../assets/imagesdps/academics/ViewLedger.svg?react";
import { default as Approve } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../../assets/imagesdps/academics/CrossSvg.svg?react";
import TcRequestsViewModal from "./TcRequestsViewModal";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

const initialValues = {
  search: "",
  academicYearId: "",
  curriculumId: "",
  class: "Class",
  dateRange: "Date Range",
};

const TcRequests = () => {
  const dispatch = useDispatch();
  const [TcRequestFilter, setTcRequestFilter] = useState(initialValues);
  const [BookCollectionUploadModelState, setBookCollectionUploadModelState] =
    useState({
      showModal: false,
      branchId: "",
    });
  const [LibraryTCRequest, setLibraryTCRequest] = useState(initialValues);
  const LibraryTCRequestForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryTCRequest,
    onSubmit: (values) => { },
  });
  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: <ViewLedger />,
        actionName: "View",
        onClickHndlr: (event: any) => {
          toggleLibraryTCRequestModel()
        }
      },
      {
        id: "allow",
        actionIcon: <Approve fill="#707070" />,
        actionName: "Allow",

      },
      {
        id: "cancel",
        actionIcon: <CrossSvg />,
        actionName: "Cancel",
      },
    ],
    []
  );
  const toggleLibraryTCRequestModel = () => {
    setBookCollectionUploadModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    currentBranchIdResp: branchId,
  }: any = useAppSelector(
    ({ instAcademics, appData, branchAcademics, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
    }),
    shallowEqual
  );
  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload))
    );
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    return () => {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
    };
  }, []);
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
      setTcRequestFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
      // TcRequestList(undefined,{academicYearId:yearId})
    }
  }, [academicYearListResp]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}

  const columns = useMemo(() => generateColumns(menuOptions), []);
  return (
    <>
      <div className="tw-flex tw-flex-wrap tw-px-3 tw-pt-3">
        <div className="tw-w-full lg:tw-w-1/4 tw-px-2">
          <div className="tw-relative search-box">
            <TextInput
              name="search"
              formgroupClassName="tw-mb-3"
              placeHolder="Search..."
              value={LibraryTCRequestForm.values.search}
              onChange={LibraryTCRequestForm.handleChange}
            />
            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
          </div>
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <SelectInput
            name="academicYearId"
            value={LibraryTCRequestForm.values.academicYearId}
            onChange={LibraryTCRequestForm.handleChange}
            menuItems={academicYearList || []}
            valueKey="academicYearId"
            textKey="academicYearName"
            formgroupClassName="tw-mb-3"
            defaultSelect="Academic Year"
          />
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <SelectInput
            name="curriculumId"
            value={LibraryTCRequestForm.values.curriculumId}
            onChange={LibraryTCRequestForm.handleChange}
            menuItems={curriculumTypes || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            formgroupClassName="tw-mb-3"
            defaultSelect="Curriculum"
          />
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <SelectInput
            name="class"
            value={LibraryTCRequestForm.values.class}
            onChange={LibraryTCRequestForm.handleChange}
            menuItems={selectData2}
            valueKey="classType"
            textKey="classType"
            formgroupClassName="tw-mb-3"
          />
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <DateInput
            name="dateRange"
            labelClass="tw-font-bold"
            value={LibraryTCRequestForm.values.dateRange}
            onChange={LibraryTCRequestForm.handleChange}
            placeHolder="Issuances Date"
          />
        </div>
      </div>
      <TableContainer
        columns={columns || []}
        data={PaymentReceivedData}
        tableClass="tw-mb-0"
        divClass="table-responsive tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        showCheckbox={false}
        showPagination={true}
        totalPages={10}
        callbackPaginationHndlr={() => { }}
        currentPageNumber={1}
      />
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={BookCollectionUploadModelState.showModal}
        toggle={toggleLibraryTCRequestModel}
        modalTitle=""
        modalSize="xl"
      >
        <TcRequestsViewModal
          isOpen={BookCollectionUploadModelState.showModal}
          toggle={toggleLibraryTCRequestModel}
          modalTitle=""
          instituteId={""}
          instituteName={""}
          branchId={""}
          editBranchDetails={undefined}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TcRequests;
