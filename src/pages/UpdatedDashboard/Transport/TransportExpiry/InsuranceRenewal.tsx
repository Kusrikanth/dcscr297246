import { useEffect, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { InsuranceRenewalColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getInsuranceRenewalAct, getLicenceRenewalAct } from "../../../../store/transportation/transportationaction";


const InsuranceRenewal = () => {
  
   const dispatch = useAppDispatch();
    const licenceRenewalApiCall = (otherProps?: any) => {
  
      let payload = {
        instituteId,
        ...otherProps,
      };
      dispatch(getInsuranceRenewalAct(generateActionPayload('transport_insurance_renewal', undefined, payload)))
    }
  
    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
      academicYearListResp, getInsuranceRenewalResp
    } = useAppSelector(
      ({ instAcademics, appData, transportrequest }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getInsuranceRenewalResp: transportrequest.getInsuranceRenewalResp
  
      }),
      shallowEqual
    )
   
  useEffect(() => {
    licenceRenewalApiCall()
  },[branchId,instituteId])
  
  const tableColumns = useMemo(() => InsuranceRenewalColumns(), []);

  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={Array.isArray(getInsuranceRenewalResp) ? getInsuranceRenewalResp : []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={false}
      ></TableContainer>
    </div>
  );
};

export default InsuranceRenewal;
