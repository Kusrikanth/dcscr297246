import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { rejectedListFilterhProps } from "./RejectedListTypes";
import { shallowEqual, useDispatch } from "react-redux";
import { getRejectItFormActList } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";

const RejectedList = (props: any) => {

  const dispatch=useDispatch();

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp,
    rejectITFormListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId
  } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections, feeApprovals,
      instAcademics }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        rejectITFormListResp: feeApprovals.rejectITFormListResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,

      }), shallowEqual);

  const [filterState, setFilterState] = useState({
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    approvedStatus: "REJECTED",
    classId: ""
  });


  const roleColumns = useMemo(() => generateColumns(), []);

  function getItFormRequestApiCall(otherProps?: any) {
    const payload = {branchId, ...filterState, ...otherProps, ...paginationDetailRef.current };
    dispatch(getRejectItFormActList(generateActionPayload("get_itform", undefined, payload)));
  }
  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId: branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "", curriculumId: "" }));
      getItFormRequestApiCall({ [name]: value, classId: "", curriculumId: "" });
      props.setCurrentAcademicYearId(value);
      if (value) {
        const payload = { branchId, academicYearId: value, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 100, };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else if (name === "curriculumId") {
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
      if (value) {
        getClassApiCall(value);
      }
      getItFormRequestApiCall({ [name]: value, classId: "" });
    }
    else {
      setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getItFormRequestApiCall({ [name]: value });
    }
  }

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
      getItFormRequestApiCall({academicYearId:academicYearId});
      props.setCurrentAcademicYearId(academicYearId);
      const payload = {
        branchId,
        academicYearId,
        sortBy: "curriculumName",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }, [])

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getItFormRequestApiCall(paginationInfo);
  }


  const {content:ITFormData,pageNumber,totalElements,totalPages}=rejectITFormListResp||{}

  return (
    <div className="tw-inline-block tw-w-full">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-3 tw-px-3 tw-pt-1 tw-pb-3">

        <div className="lg:tw-col-span-2 xl:tw-col-span-1">
          <div className="search-box tw-relative">
            <TextInput
              name="searchString"
              value={filterState.searchString}
              onChange={onChangeFilterHndlr}
              formgroupClassName="tw-mb-0"
              placeHolder="Search"
              labelText="Search"
              floatingLabel
            />
            <i className="ri-search-line search-icon" />
          </div>
        </div>

        <div>
          <SelectInput
            name="academicYearId"
            value={filterState.academicYearId}
            onChange={onChangeFilterHndlr}
            menuItems={academicYearListResp?.data || []}
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
            value={filterState.curriculumId}
            onChange={onChangeFilterHndlr}
            menuItems={brchCurriculumResp?.data || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            formgroupClassName="tw-mb-0"
            labelText="Curriculum"
            floatingLabel
          />
        </div>

        <div className="xl:tw-col-span-1">
          <SelectInput
            name="classId"
            value={filterState.classId}
            onChange={onChangeFilterHndlr}
            menuItems={branchClassResp?.content || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-0"
            labelText="Class"
            floatingLabel
          />
        </div>
      </div>

      <TableContainer
        columns={roleColumns || []}
        data={ITFormData || []}
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
        showPagination
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber}
      />
    </div>
  );
};

export default RejectedList;
