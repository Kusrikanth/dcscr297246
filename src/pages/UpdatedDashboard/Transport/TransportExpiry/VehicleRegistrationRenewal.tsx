import { useEffect, useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFitnessRenewalAct, getPermitRenewalAct, getPollutionRenewalAct, getVehicleRegRenewalAct } from "../../../../store/transportation/transportationaction";

const VehicleRegistrationRenewal = (props: any) => {
  const { academicYearId, branchIdState } = props || {}
  const dispatch = useAppDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getVehicleRegRenewalResp, getPermitRenewalResp,
    getPollutionRenewalResp, getFitnessRenewalResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleRegRenewalResp: transportrequest.getVehicleRegRenewalResp,
      getPermitRenewalResp: transportrequest.getPermitRenewalResp,
      getPollutionRenewalResp: transportrequest.getPollutionRenewalResp,
      getFitnessRenewalResp: transportrequest.getFitnessRenewalResp,
    }),
    shallowEqual
  )

  useEffect(() => {
    if(instituteId && props.activeId){
      vehicleRegRenewalApiCall()
    }
  }, [props.activeId,branchIdState])

  const vehicleRegRenewalApiCall = (otherProps?: any) => {

    const payload = {
      branchId: branchIdState,
      instituteId,
      ...otherProps,
    };
    if (props.activeId === "vehicleRegistrationRenewal") {
      dispatch(getVehicleRegRenewalAct(generateActionPayload('transport_vehicle_reg_renewal', undefined, payload)))
    }
    else if (props.activeId === "permitRenewal") {
      dispatch(getPermitRenewalAct(generateActionPayload('transport_permit_renewal', undefined, payload)))
    }
    else if (props.activeId === "pollutionRenewal") {
      dispatch(getPollutionRenewalAct(generateActionPayload('transport_pollution_renewal', undefined, payload)))
    }
    else if (props.activeId === "fitnessRenewal") {
      dispatch(getFitnessRenewalAct(generateActionPayload('transport_fitness_renewal', undefined, payload)))
    }
  }

  const tabledata = useMemo(() => {
    if (props.activeId === "vehicleRegistrationRenewal") {
      return getVehicleRegRenewalResp
    }
    else if (props.activeId === "permitRenewal") {
      return getPermitRenewalResp
    }
    else if (props.activeId === "pollutionRenewal") {
      return getPollutionRenewalResp
    }
    else if (props.activeId === "fitnessRenewal") {
      return getFitnessRenewalResp
    }
  }, [getVehicleRegRenewalResp, getPermitRenewalResp, getPollutionRenewalResp, getFitnessRenewalResp, props.activeId,branchIdState])

  const tableColumns = useMemo(() => generateColumns(), [props.activeId]);
  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={tabledata || []}
        tableClass="tw-mb-0"
        divClass="table-responsive tw-mb-3"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
      ></TableContainer>
    </div>
  );
};
export default VehicleRegistrationRenewal;
