import { useEffect, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { licenseRenewalColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getLicenceRenewalAct } from "../../../../store/transportation/transportationaction";


const LicenseRenewal = () => {
   const dispatch = useAppDispatch();
    const licenceRenewalApiCall = (otherProps?: any) => {
  
      let payload = {
        branchId,
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
    licenceRenewalApiCall()
  },[branchId,instituteId])
  
  const tableColumns = useMemo(() => licenseRenewalColumns(), []);

  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={getLicenceRenewalResp || []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={false}
      ></TableContainer>
    </div>
  );
};

export default LicenseRenewal;
