import { useEffect, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getTransportOptedAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";



const TransportClasswise = () => {
  const dispatch = useAppDispatch();

  const transportOptedApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    let payload = {
      branchId,
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getTransportOptedAct(generateActionPayload('transport_opted', undefined, payload)))
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getTransportOptedResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getTransportOptedResp: transportrequest.getTransportOptedResp

    }),
    shallowEqual

  )

  useEffect(() => {
    transportOptedApiCall()
  }, [branchId,instituteId])
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="">
      <TableContainer
        columns={tableColumns || []}
        data={getTransportOptedResp || []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={false}
      ></TableContainer>
    </div>
  );
};

export default TransportClasswise;
