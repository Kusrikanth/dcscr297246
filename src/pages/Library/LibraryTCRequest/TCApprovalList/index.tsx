import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateInput, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  DefaultersStudentsData,
  generateColumns,
  selectData1,
  selectData2,
  selectData4,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getTransportConcessionListAct } from "../../../../store/transportation/TransportationConcession/transportationconcessionaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  dateRange: "Date Range",
};

const TCApprovalList = () => {

  const dispatch = useDispatch();
  const [TcApprovalListFilter, setTcApprovalListFilter] = useState(initialValues);
  const [LibraryTCApprovalList, setLibraryTCApprovalList] = useState(initialValues);
  const LibraryTCApprovalListForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryTCApprovalList,
    onSubmit: (values) => { },
  });
  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
  })
  const transferRequestList = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, searchString } = TcApprovalListFilter;
    let payload = {
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      instituteId: instituteId,
      branchId,
      classId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(getTransportConcessionListAct(generateActionPayload('get_transport_concession_list', undefined, payload)))
    }
  }
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
  }: any = useAppSelector(
    ({ instAcademics, appData, branchAcademics, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchClassResp: branchAcademics.branchClassResp,
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
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setTcApprovalListFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
    transferRequestList( { academicYearId: yearId })
}, [academicYearListResp]);
  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
      // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setTcApprovalListFilter((prev: any) => ({ ...prev, classId: content[0].id }))
      // getSectionListResp({branchClassId: content[0].id});
    }
  }, [branchClassResp])
  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setTcApprovalListFilter((prev: any) => ({ ...prev, [name]: value }))
    pagination.current.pageNo = 0;
    if (name === 'curriculumId') {
      const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      transferRequestList({ [name]: value })
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    else {
      transferRequestList({ [name]: value })
    }
  }
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  const columns = useMemo(() => generateColumns(), []);
  return (
    <>
      <div className="tw-flex tw-flex-wrap tw-px-3 tw-pt-3">
        <div className="tw-w-full lg:tw-w-1/4 tw-px-2">
          <div className="tw-relative search-box">
            <TextInput
              name="searchString"
              formgroupClassName="tw-mb-3"
              placeHolder="Search..."
              value={LibraryTCApprovalListForm.values.searchString}
              onChange={filterHandler}
            />
            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
          </div>
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <SelectInput
            name="academicYearId"
            value={LibraryTCApprovalListForm.values.academicYearId}
            onChange={filterHandler}
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
            value={LibraryTCApprovalListForm.values.curriculumId}
            onChange={filterHandler}
            menuItems={curriculumTypes || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            formgroupClassName="tw-mb-3"
            defaultSelect="Curriculum"
          />
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <SelectInput
            name="classId"
            value={LibraryTCApprovalListForm.values.classId}
            onChange={filterHandler}
            menuItems={classTypes || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-3"
          />
        </div>
        <div className="tw-w-full lg:tw-w-1/6 tw-px-2">
          <DateInput
            name="dateRange"
            labelClass="tw-font-bold"
            value={LibraryTCApprovalListForm.values.dateRange}
            onChange={LibraryTCApprovalListForm.handleChange}
            placeHolder="Issuances Date"
          />
        </div>
      </div>
      <TableContainer
        columns={columns || []}
        data={DefaultersStudentsData}
        tableClass="tw-mb-0"
        divClass="table-responsive tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        showCheckbox={false}
        showPagination={true}
        totalPages={10}
        callbackPaginationHndlr={() => { }}
        currentPageNumber={1}
      />
    </>
  );
};

export default TCApprovalList;
