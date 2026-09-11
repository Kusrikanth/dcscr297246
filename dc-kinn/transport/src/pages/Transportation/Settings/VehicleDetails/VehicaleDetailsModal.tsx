import { useEffect, useMemo, useState } from "react";
import { IVehicalDetailsModalProps } from "./VehiclesDetailsTypes";
import { NewStepsContainer } from "../../../../Components/Common/NewStepsContainer";
import VehicleRegistrationDetails from "./VehicleRegistrationDetails";
import VehicleOwnerDetails from "./VehicleOwnerDetails";
import VehicleDetailsTab from "./VehicleDetailsTab";
import { default as StepperBusSvg } from "../../../../assets/imagesdps/transportation/SteperBus.svg?react";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { createVehicleDetailesAct, getVehicleDetailsByIdAct, resetVehicleDetailByIdAct, updateVehicleDetailesAct } from "../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";

const VehicalsDetailsModal = (props: IVehicalDetailsModalProps) => {

  const [vehicleDetailsState, setvehicleDetailsState] = useState<any>({
    basicInfo :undefined,
    ownerInfo :undefined,
    permitInfo :undefined,
    file : undefined,
    vehicleDetailId: props.vehicleDetailId,
  })

  const dispatch = useDispatch()

  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    transportationErrorAct,
    getVehicleTypeListResp,
    vehicleDetaileByIdResp,
    academicYearListResp
   } = useAppSelector(({ transportrequest,appData,globalData,vehicleDetailRequest, instAcademics }) => ({
  
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader : globalData.showApiLoader,
   transportationErrorAct:transportrequest.transportationErrorAct,
   getVehicleTypeListResp:transportrequest.getVehicleTypeListResp,
   vehicleDetaileByIdResp:vehicleDetailRequest.vehicleDetaileByIdResp,
   academicYearListResp: instAcademics.academicYearListResp,

  }), shallowEqual);

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "1":
        return VehicleRegistrationDetails;
      case "2":
        return VehicleOwnerDetails;
      case "3":
        return VehicleDetailsTab;
    }
  }
  const [activeStepId, setActiveStepId] = useState("1");
  const steps = [
    {
      id: 1,
      title: "Basic Info",
      iconImage: <StepperBusSvg fill="#878A99" />,
    },
    {
      id: 2,
      title: "Vehicle Owner & Engine",
      iconImage: <i className="ri-user-3-fill"></i>,
    },
    {
      id: 3,
      title: "Permit & License Info",
      iconImage: <StepperBusSvg fill="#878A99" />,
    },
  ];
  const stepHandler = (name?:string,values?:any,id?:string) => {
    if(name === "file"){
      setvehicleDetailsState((prev:any)=>({
        ...prev,
        file : values
      }))
    }else{
      if(name === "stepup"){
          if(id === "1")   {
            setvehicleDetailsState((prev:any)=>({
              ...prev,
              basicInfo : values
            }))
          }  else if(id === "2"){
            setvehicleDetailsState((prev:any)=>({
              ...prev,
              ownerInfo : values
            }))
          }  else if(id === "3"){
            setvehicleDetailsState((prev:any)=>({
              ...prev,
              permitInfo : values
            }))
            const vehicleStatus = vehicleDetailsState.basicInfo?.vehicleStatus;

            const formData = new FormData();
            const data = {
              instituteId,
              branchId,
              ...vehicleDetailsState.basicInfo,
              ...vehicleDetailsState.ownerInfo,
              ...values,
            }
            delete data.speedCertificate;
            delete data.vehicleRc;
            const newInstituteId = data.newInstituteId;
            const newBranchId = data.newBranchId;
            delete data.newInstituteId;
            delete data.newBranchId;
            if (vehicleStatus === "TRANSFER") {
              data.newInstituteId = newInstituteId;
              data.newBranchId = newBranchId;
            }
            if (!props.vehicleDetailId) {
              delete data.vehicleStatus;
            }
            formData.append("request", JSON.stringify(data));
            formData.append("file", vehicleDetailsState.file);
            if(values?.speedCertificate){
              formData.append("speedCertificate", values?.speedCertificate);
            }
            if (values?.vehicleRc && values.vehicleRc.name) {
              formData.append("vehicleRc", values.vehicleRc);
            }

            if(props.vehicleDetailId){
              dispatch(updateVehicleDetailesAct(generateActionPayload("update_vehicle_details", {id:props.vehicleDetailId},formData)));
            }else{
              dispatch(createVehicleDetailesAct(generateActionPayload("create_vehicle_details", undefined,formData)));
            }

          }
        +activeStepId + 1 <= steps.length &&
          setActiveStepId((pre) => `${+pre + 1}`);
      }else{
        +activeStepId - 1 <= steps.length &&
        setActiveStepId((pre) => `${+pre - 1}`);
      }
    }
  };

  useEffect(() => {
    if (props.vehicleDetailId && academicYearListResp?.data?.length) {

      const currentAcademicYearIndex = academicYearListResp.data.findIndex(
        (year: any) => year.yearStatus === "CURRENT"
      );

      const { academicYearId = "" } =
        academicYearListResp.data[currentAcademicYearIndex] || {};

      dispatch(
        getVehicleDetailsByIdAct(
          generateActionPayload(
            "get_vehicle_details_by_id",
            { id: props.vehicleDetailId },
            { academicYearId }
          )
        )
      );
    }
  }, [props.vehicleDetailId, academicYearListResp]);

  useEffect(() => {
    return ()=>{
      dispatch(resetVehicleDetailByIdAct(undefined))
    }
  }, [])
  
  

 useEffect(() => {
  if(vehicleDetaileByIdResp && props.vehicleDetailId){
    const basicInfo = { 
    manufactureId: `${vehicleDetaileByIdResp?.manufactureId || ""}` ||  "",
    registrationAuthority:`${vehicleDetaileByIdResp?.registrationAuthority || ""}` ||"",
    vehicleTypeId:`${vehicleDetaileByIdResp?.vehicleTypeId || ""}`  ||"",
    registrationNo: `${vehicleDetaileByIdResp?.registrationNo || ""}` ||"",
    newInstituteId: `${vehicleDetaileByIdResp?.instituteId || ""}` ||"",
    newBranchId: `${vehicleDetaileByIdResp?.branchId || ""}` ||"",
    registrationDate: `${vehicleDetaileByIdResp?.registrationDate?.slice(0,10) || ""}` ||"",
    vehicleCapacity:`${vehicleDetaileByIdResp?.vehicleCapacity || ""}` ||"",
    vehicleStatus:`${vehicleDetaileByIdResp?.vehicleStatus || ""}` ||"",
    registrationRenewalDate:`${vehicleDetaileByIdResp?.registrationRenewalDate?.slice(0,10) || ""}` || "",
    maxPermissibleSpeed: `${vehicleDetaileByIdResp?.maxPermissibleSpeed || ""}`|| "",
    modelId: `${vehicleDetaileByIdResp?.modelId || ""}` ||"",
    year:`${vehicleDetaileByIdResp?.year || ""}` || "",
    s3Url: `${vehicleDetaileByIdResp?.s3Url || ""}` ||  "",
    isRouteOccupied: vehicleDetaileByIdResp?.isRouteOccupied || false,
    vehicleTypeDetailsId: vehicleDetaileByIdResp?.vehicleTypeDetailsId || "",
  }
  const ownerInfo = {
  ownerName: `${vehicleDetaileByIdResp?.ownerName || ""}` ||  "",
  ownerAddress: `${vehicleDetaileByIdResp?.ownerAddress || ""}` ||  "",
  engineNo: `${vehicleDetaileByIdResp?.engineNo || ""}` ||  "",
  chassisNo: `${vehicleDetaileByIdResp?.chassisNo || ""}` ||  "",
  busLength: `${vehicleDetaileByIdResp?.busLength || ""}` ||  "",
  busWidth: `${vehicleDetaileByIdResp?.busWidth || ""}` ||  "",
  weight: `${vehicleDetaileByIdResp?.weight || ""}` ||  "",
  wheelBase: `${vehicleDetaileByIdResp?.wheelBase || ""}` ||  "",
  groundClearance: `${vehicleDetaileByIdResp?.groundClearance || ""}` ||  "",
  mainEngineBatteries: `${vehicleDetaileByIdResp?.mainEngineBatteries || ""}` ||  "",
  acUnitBatteries: `${vehicleDetaileByIdResp?.acUnitBatteries || ""}` ||  "",
  invoicePrice: `${vehicleDetaileByIdResp?.invoicePrice || ""}` ||  "",
  onRoadPrice: `${vehicleDetaileByIdResp?.onRoadPrice || ""}` ||  "",
  typeOfBody: `${vehicleDetaileByIdResp?.typeOfBody || ""}` ||  "",
  fuelTankCapacity: `${vehicleDetaileByIdResp?.fuelTankCapacity || ""}` ||  "",
  mileage: `${vehicleDetaileByIdResp?.mileage || ""}` ||  "",
  measuringUnit: `${vehicleDetaileByIdResp?.measuringUnit || ""}` ||  "",
  odoMeterReading: +vehicleDetaileByIdResp?.odoMeterReading ||  0,
  challanNo: `${vehicleDetaileByIdResp?.challanNo || ""}` ||  "",
  challanCharges: `${vehicleDetaileByIdResp?.challanCharges || ""}` ||  "",
  challanPaidDate: `${vehicleDetaileByIdResp?.challanPaidDate?.slice(0,10) || ""}` ||  "",
  fuelTypeId: `${vehicleDetaileByIdResp?.fuelTypeId || ""}` ||  "",
  }
  const permitInfo = {
    permitNo:`${vehicleDetaileByIdResp?.permitNo || ""}` ||  "",
    insuranceCompanyId:`${vehicleDetaileByIdResp?.insuranceCompany || ""}` ||  "",
    insuranceTypeId:`${vehicleDetaileByIdResp?.insuranceTypeId || ""}` ||  "",
    permitArea:`${vehicleDetaileByIdResp?.permitArea || ""}` ||  "",
    permitCharges:`${vehicleDetaileByIdResp?.permitCharges || ""}` ||  "",
    permitExpiryDate: `${vehicleDetaileByIdResp?.permitExpiryDate?.slice(0,10) || ""}` ||  "",
    permitDate: `${vehicleDetaileByIdResp?.permitDate?.slice(0,10) || ""}` ||  "",
    rcBookNo:`${vehicleDetaileByIdResp?.rcBookNo || ""}` ||  "",
    rcIssuedStartDate:`${vehicleDetaileByIdResp?.rcIssuedStartDate || ""}` ||  "",
    rcExpiryDate:`${vehicleDetaileByIdResp?.rcExpiryDate || ""}` ||  "",
    insuranceStartDate:`${vehicleDetaileByIdResp?.insuranceStartDate || ""}` ||  "",
    insuranceEndDate:`${vehicleDetaileByIdResp?.insuranceEndDate || ""}` ||  "",
    insuranceRenewalDate:`${vehicleDetaileByIdResp?.insuranceRenewalDate || ""}` ||  "",
    hpaWith:`${vehicleDetaileByIdResp?.hpaWith || ""}` ||  "",
    roadTaxPaid:`${vehicleDetaileByIdResp?.roadTaxPaid || ""}` ||  "",
    registerCity:`${vehicleDetaileByIdResp?.registerCity || ""}` ||  "",
    pollutionExpiry:`${vehicleDetaileByIdResp?.pollutionExpiry || ""}` ||  "",
    fitnessDate:`${vehicleDetaileByIdResp?.fitnessDate || ""}` ||  "",
    speedCertificate:vehicleDetaileByIdResp?.speedCertificate || null,
    vehicleRc:vehicleDetaileByIdResp?.vehicleRc || null,
  }
  setvehicleDetailsState((prev:any)=>({
    ...prev,
    basicInfo,
    ownerInfo ,
    permitInfo ,
  }))
  }
 }, [vehicleDetaileByIdResp])
 
  
  return (
    <>
     
      <div style={{padding:"1.25rem 3rem"}}>
        <NewStepsContainer
          activeStepId={activeStepId}
          updateStepHndlr={stepHandler}
          showApiLoader={showApiLoader}
          getActiveMenuComponent={(menuId: string) =>
            getActiveMenuComponent(menuId)
          }
          stepsList={steps}
          toggle={props.toggle}
          state={vehicleDetailsState}
          containerClass="tw-w-100"
        />
        {/* {activeStepId === "1" && (
          <div className="d-flex justify-content-end">
            <button
              className="btn mb-3 d-flex align-items-center justify-content-center me-3"
              style={{ backgroundColor: "#0AB39C19", color: "#0AB39C" }}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              className="btn btn-success text-white mb-3 d-flex align-items-center justify-content-center"
              onClick={stepHandler}
            >
              Proceed
            </button>
          </div>
        )} */}
        {/* {activeStepId === "2" && (
          <div className="d-flex justify-content-end">
            <button
              className="btn mb-3 d-flex align-items-center justify-content-center me-3"
              style={{ backgroundColor: "#0AB39C19", color: "#0AB39C" }}
              onClick={previousStepHndler}
            >
              Previous
            </button>
            <button
              className="btn btn-success text-white mb-3 d-flex align-items-center justify-content-center"
              onClick={stepHandler}
            >
              Proceed
            </button>
          </div>
        )} */}
        {/* {activeStepId === "3" && (
          <div className="d-flex justify-content-end">
            <button
              className="btn mb-3 d-flex align-items-center justify-content-center me-3"
              style={{ backgroundColor: "#0AB39C19", color: "#0AB39C" }}
              onClick={previousStepHndler}
            >
              Previous
            </button>
            <button
              className="btn btn-success text-white mb-3 d-flex align-items-center justify-content-center"
              onClick={stepHandler}
            >
              Save
            </button>
          </div>
        )} */}
        </div>
      
    </>
  );
};

export default VehicalsDetailsModal;
