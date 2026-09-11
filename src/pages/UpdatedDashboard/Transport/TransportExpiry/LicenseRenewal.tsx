import { useEffect, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { licenseRenewalColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getLicenceRenewalAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";

const LicenseRenewal = (props:any) => {
  const { academicYearId, branchIdState } = props || {}
  const dispatch = useAppDispatch();
  const licenceRenewalApiCall = (otherProps?: any) => {
    const payload = {
      branchId:branchIdState,
      instituteId,
      ...otherProps,
    };
    dispatch(getLicenceRenewalAct(generateActionPayload('transport_license_renewal', undefined, payload)))
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getLicenceRenewalResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getLicenceRenewalResp: transportrequest.getLicenceRenewalResp

    }),
    shallowEqual
  )

  useEffect(() => {
    if(instituteId){
      licenceRenewalApiCall()
    }
  }, [instituteId, branchIdState])

  const tableColumns = useMemo(() => licenseRenewalColumns(), []);
  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={Array.isArray(getLicenceRenewalResp) ? getLicenceRenewalResp : []}
        tableClass="mb-0"
        divClass="table-responsive mb-3"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
      ></TableContainer>
    </div>
  );
};
export default LicenseRenewal;
