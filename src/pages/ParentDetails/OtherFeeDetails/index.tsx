import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsslice";
import ParentFeeLedger from "./FeeLedger";
import PayFee from "./PayFee";
import { toast } from "react-toastify";
import { SelectInput } from "../../../Components/Common";

const tabOptions = [
  {
    id: "payFee",
    labelName: "Pay Fee",
    customPadding: "0px 10px",
  }, {
    id: "feeLedger",
    labelName: "Fee Ledger",
    customPadding: "0px 10px",
  }];


function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "feeLedger":
      return ParentFeeLedger;
    case "payFee":
      return PayFee;
    default:
      return null;
  }
}


const OtherFeeDetials = () => {
  const [academicYearId, setAcademicYearId] = useState("");
  const [activeId, setActiveId] = useState("payFee");
  const [menuOptions, setMenuOptions] = useState<any>([]);
  const dispatch = useDispatch()
  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    currentStudentId,
    parentChildrensResp,
    getSpecialFeePayDetailsResp,
    feeCollectionErrorResp,
  }: any = useAppSelector(
    ({ instAcademics, directoryStudent, feeCollections, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      getSpecialFeePayDetailsResp: feeCollections.getSpecialFeePayDetailsResp,
      feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,

      currentStudentId: appData.currentStudentId,
    }), shallowEqual);

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    return () => {
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  const feeDetailsRespRef = useRef({
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    const { prevFeeCollectionErrorResp } = feeDetailsRespRef.current;
    if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
      const { details } = feeCollectionErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [feeCollectionErrorResp]);


  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId || '');
  }

  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return null;
  }, [parentChildrensResp, currentStudentId]);

  useEffect(() => {
    if (currentStudentId && parentChildrensResp) {
      const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
      setAcademicYearId(studentDetails?.academicYearId);
    }
  }, [currentStudentId, parentChildrensResp])

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    if (selectedChild && TabComponent) {
      return (
        <TabComponent
          studentId={selectedChild?.childId}
          branchId={selectedChild?.childBranchId}
          academicYearId={academicYearId}
        />
      );
    }
    return <></>;
  }, [activeId, selectedChild, academicYearId]);

  function onChangeAcademicYearHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setAcademicYearId(value);
  }

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Parent" />

          <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="card-title tw-mb-0 tw-grow">
                    Other Fee Details
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="tw-flex tw-flex-wrap tw-mb-5">
                <div className="tw-w-1/2 lg:tw-w-3/4">
                  <UpdatedHorizontalTab
                    MenuOptions={tabOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    showBadge={true}
                  />
                </div>
                <div className="tw-w-1/2 lg:tw-w-1/4 tw-ml-auto tw-pt-2">
                  <SelectInput
                    name="academicYearId"
                    value={academicYearId}
                    onChange={onChangeAcademicYearHandler}
                    menuItems={academicYearListResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText='Academic Year'
                    hideSelectOption={Array.isArray(academicYearListResp?.data) && !!academicYearListResp?.data.length}
                    floatingLabel
                  />
                </div>
              </div>
              {activeComponent}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default OtherFeeDetials;
