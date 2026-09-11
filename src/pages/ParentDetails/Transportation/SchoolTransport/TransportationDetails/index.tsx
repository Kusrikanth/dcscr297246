import React, { useState, useMemo, useEffect, useRef, useInsertionEffect } from "react";

import {
  generateColumns
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";

import { useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { getTransportRequestAct, setGetTransportRequestAct } from "../../../../../store/transportation/transportationaction";


const TransportationDetails = ({ childInfo, loggedInUserInfo, branchId }: any) => {
  const dispatch = useDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const { showApiLoader, getTransportRequestResp }: any =
    useAppSelector(
      ({ transportrequest, globalData }) => ({
        getTransportRequestResp: transportrequest.getTransportRequestResp,
        showApiLoader: globalData.showApiLoader,
      }),
      shallowEqual
    );

  useEffect(() => {
    if (childInfo) {
      getTransportDetailsApiCall();
    }
  }, [childInfo]);

  useEffect(() => {
    return () => {
      dispatch(setGetTransportRequestAct(undefined));
    }
  }, []);

  function getTransportDetailsApiCall() {
    const payload = {
      academicYearId: childInfo?.academicYearId,
      branchId, branchCurriculumId: childInfo?.curriculumId, classId: childInfo?.classId,
      searchString: childInfo?.childCode,
      status: 'ACCEPTED,REJECTED,SUBMITTED'
    }
    dispatch(getTransportRequestAct(generateActionPayload("get_transport_request", undefined, payload)));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getTransportDetailsApiCall();
  }

  const detailsColumns = useMemo(() => generateColumns(childInfo, loggedInUserInfo), [childInfo, loggedInUserInfo, getTransportRequestResp]);
  const { data: transportDetailsData, pageNumber, totalPages, totalElements } = getTransportRequestResp || {};
  return (
    <>
      <div className="tw-p-0 tw-mt-3">
        <TableContainer
          columns={detailsColumns}
          data={Array.isArray(transportDetailsData) ? transportDetailsData : []}
          divClass="table-responsive tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />
      </div>
    </>
  );
};

export default TransportationDetails;
