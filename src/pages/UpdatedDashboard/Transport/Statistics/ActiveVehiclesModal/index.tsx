import { useEffect, useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getActiveVehiclesListAct } from "../../../../../store/fee/feereport/feereportactions";
import { Button } from "../../../../../Components/Common";

const ActiveVehiclesModal = (props: any) => {
  const { academicYearId, toggle, branchIdState } = props || {}

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getActiveVehiclesListResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getActiveVehiclesListResp: feeReport.getActiveVehiclesListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (instituteId && academicYearId) {
      getActiveVehicleApiCall();
    }
  }, [instituteId, academicYearId]);

  const getActiveVehicleApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchIdState,
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getActiveVehiclesListAct(generateActionPayload('get_active_vehicles_list', undefined, payload)))
  }
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="tw-container-fluid tw-px-0">
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full">
          <TableContainer
            columns={tableColumns || []}
            data={getActiveVehiclesListResp || []}
            divClass="table-responsive tw-mt-3"
            tableClass="table-nowrap"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showFooter={true}
            trFooterClass="tw-font-bold tw-bg-gray-100"
          ></TableContainer>
        </div>
        <div className="tw-w-full tw-py-3 tw-px-3 tw-flex tw-justify-end">
          <Button type="button" onClick={toggle} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveVehiclesModal;
