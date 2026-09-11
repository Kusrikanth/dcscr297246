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
import { getPayFeeDetailsAct, setPayFeeDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
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

const FeeDetails = () => {
  const [activeId, setActiveId] = useState("");
  const [menuOptions, setMenuOptions] = useState<any>([]);
  const [filterState , setFilterState] = useState({academicYearId: ""})
  const dispatch = useDispatch()
  const {
    feeCollectionErrorResp,
    currentInstIdResp: instituteId,
    currentStudentId,
    getPayFeeDetailsResp,
    academicYearListResp,
    parentChildrensResp,
  } = useAppSelector(
    ({ directoryStudent, feeCollections, appData , instAcademics }) => ({
      getPayFeeDetailsResp: feeCollections.getPayFeeDetailsResp,
      feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      currentStudentId: appData.currentStudentId,
      academicYearListResp: instAcademics.academicYearListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(setPayFeeDetailsAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (getPayFeeDetailsResp) {
      const duePayments = getPayFeeDetailsResp?.ledgers?.filter((i: any) =>
        ((i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")));
      if (duePayments && duePayments.length) {
        setActiveId("payFee")
        setMenuOptions(tabOptions)
      } else {
        setActiveId("feeLedger")
        setMenuOptions(tabOptions.filter(item => item.id === 'feeLedger'));
      }
    }
  }, [getPayFeeDetailsResp]);

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
    setActiveId(menuId || "");
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
      const payload = {
        studentId: studentDetails?.childId,
        branchId: studentDetails?.childBranchId,
        // academicYearId: studentDetails?.academicYearId,
        studentInfo: "studentInfo",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: [],
        // instituteDeptId: [1, 4],
        instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
        paymentStatus: "",
        ledgerId: "",
      }
      dispatch(getPayFeeDetailsAct(generateActionPayload("get_pay_fee_details", undefined, payload)));
    }
  }, [currentStudentId, parentChildrensResp])

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    if (selectedChild && TabComponent) {
      return (
        <TabComponent branchId={selectedChild?.childBranchId} academicYearId={filterState.academicYearId} />
      );
    }
    return <></>;
  }, [activeId, selectedChild , filterState.academicYearId]);

  useEffect(() => {
    if(academicYearListResp){
      const yearId = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "";
      setFilterState({academicYearId: yearId})
    }
    }, [academicYearListResp]);

  const changeHandler = (event : React.ChangeEvent<HTMLSelectElement>)=>{
    const { name, value } = event.target;
    if(value){
      setFilterState((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  const { data: academiYearList } = academicYearListResp || {}

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Parent" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Student Fee Details
                </h4>
              </div>
            </div>

            <div className="tw-px-3 tw-py-4">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-items-center">

                <div className="lg:tw-col-span-6">
                  <UpdatedHorizontalTab
                    MenuOptions={menuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    showBadge={true}
                  />
                </div>

                {activeId === "feeLedger" && (
                  <div className="lg:tw-col-span-6 lg:tw-ml-auto tw-pt-2">
                    <SelectInput
                      name="academicYearId"
                      value={filterState.academicYearId}
                      onChange={changeHandler}
                      menuItems={academiYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>
                )}

              </div>
              {activeComponent}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default FeeDetails;
