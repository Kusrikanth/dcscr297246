import React, { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, statusOptions } from "./helper";
import { Button, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportVehicleTypeListDashboardAct, getVehicleTypeListDashboardAct } from "../../../../store/fee/feereport/feereportactions";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";

const initialValues = {
  status: ""
}

const BracnhWiseVehicleType = () => {

  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);
  const [tableData, setTableData] = useState<any[]>([])
  const [totalVehicleTypes, setTotalVehicleTypes] = useState<any[]>([])
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getVehicleTypeListDashboardResp, exportVehicleTypeListDashboardResp
  } = useAppSelector(
    ({ instAcademics, appData, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleTypeListDashboardResp: feeReport.getVehicleTypeListDashboardResp,
      exportVehicleTypeListDashboardResp: feeReport.exportVehicleTypeListDashboardResp,
    }),
    shallowEqual
  )

  const branchWiseVehicleTypeRef = useRef({
    prevExportVehicleTypeListDashboardResp: exportVehicleTypeListDashboardResp,
  });

  useEffect(() => {
    const { prevExportVehicleTypeListDashboardResp } = branchWiseVehicleTypeRef.current;
    if (exportVehicleTypeListDashboardResp && exportVehicleTypeListDashboardResp !== prevExportVehicleTypeListDashboardResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportVehicleTypeListDashboardResp, "Branch_Wise_Vehicle_Type");
    }
    branchWiseVehicleTypeRef.current.prevExportVehicleTypeListDashboardResp = exportVehicleTypeListDashboardResp;

  }, [exportVehicleTypeListDashboardResp]);

  const getVehicleTypeApiCall = (otherProps?: any) => {
    dispatch(getVehicleTypeListDashboardAct(generateActionPayload('get_vehicle_type_list_dashboard', undefined, { ...filterState, instituteId, ...otherProps })))
  }

  const exportSubmitHndlr = () => {
    const payload = { ...filterState, instituteId, };
    dispatch(exportVehicleTypeListDashboardAct(generateActionPayload("export_vehicle_type_list_dashboard", undefined, payload, {
      responseType: 'blob'
    })));
  }

  useEffect(() => {
    if (instituteId) {
      getVehicleTypeApiCall()
    }
  }, [instituteId])

  useEffect(() => {
    if (Array.isArray(getVehicleTypeListDashboardResp) && getVehicleTypeListDashboardResp.length > 0) {
      const modifiedData = getVehicleTypeListDashboardResp.reduce((acc: any[], curr: any, index: number) => {
        const branchObj = {
          branchId: curr.branchId,
          branchName: curr.branchName
        }
        const findIndex = acc.findIndex((item: any) => +item.branchId === +curr.branchId)
        if (findIndex > -1) {
          acc[findIndex] = { ...acc[findIndex], [curr.vehicleType]: curr.noOfVehicles, total: +acc[findIndex].total + +curr.noOfVehicles }
        } else {
          acc = [...acc, { ...branchObj, [curr.vehicleType]: curr.noOfVehicles, total: curr.noOfVehicles }]
        }
        return acc
      }, [])
      setTableData(modifiedData)

      const distinctVehicleTypes = Array.from(new Map(getVehicleTypeListDashboardResp.map((item: any) => [item.vehicleTypeId, item])).values());
      setTotalVehicleTypes(distinctVehicleTypes)
    }
  }, [getVehicleTypeListDashboardResp])

  const onChangeHndler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
    getVehicleTypeApiCall({ [name]: value })
  }

  const tableColumns = useMemo(() => generateColumns(totalVehicleTypes), [tableData, totalVehicleTypes]);
  return (
    <>
      <div className="card !tw-shadow-sm !tw-rounded-2xl">
        <div className="card-header !tw-rounded-t-2xl">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <h4 className="card-title !tw-mb-0">
                Vehicle Types
              </h4>
            </div>
            <div className="tw-flex tw-gap-3">
              <Button
                id="export-btn"
                variant="exportBtn"
                onClick={openExportModal}
              >
                <img src={ExportIcon} className="img-fluid tw-h-5 tw-w-5" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body !tw-p-4">
          <div className="tw-w-full lg:tw-w-1/4">
            <SelectInput
              name="status"
              value={filterState.status}
              onChange={onChangeHndler}
              menuItems={statusOptions}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              defaultSelect="Select"
              labelText="Vehicle Status"
              floatingLabel
            ></SelectInput>
          </div>
        </div>
        <div className="">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive tw-overflow-x-auto !tw-mb-3"
            theadClass="table-light tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            trFooterClass="tw-font-semibold"
            showFooter={true}
          ></TableContainer>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-transport-fee-term-wise-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Vehicle Type"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="transportation"
          subFeature={"vehicle_types"}
          remarksText="Enter remarks to export Vehicle Type ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BracnhWiseVehicleType;
