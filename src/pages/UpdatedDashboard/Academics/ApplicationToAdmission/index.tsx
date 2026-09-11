import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ModalContainerUpdated, SelectInput, TableExpandable } from "../../../../Components/Common";
import { generateColumns } from "./helper";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportApplicationToAdmissionAct, getApplicationToAdmissionAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";

const initialValues = {
  academicYearId: "",
  startDate: "",
  endDate: "",
}

const ApplicationToAdmission = (props: any) => {

  const dispatch = useAppDispatch()
  const [tableData, setTableData] = useState<any[]>([])
  const [filterState, setFilterState] = useState(initialValues)
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    currentInstIdResp: instituteId, getApplicationToAdmissionResp, academicYearListResp, exportApplicationToAdmissionResp } =
    useAppSelector(({ appData, reports, instAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getApplicationToAdmissionResp: reports.getApplicationToAdmissionResp,
      exportApplicationToAdmissionResp: reports.exportApplicationToAdmissionResp,
      academicYearListResp: instAcademics.academicYearListResp,
    }), shallowEqual)

  const appToAdmRef = useRef({
    prevExportApplicationToAdmissionResp: exportApplicationToAdmissionResp,
  });

  useEffect(() => {
    const { prevExportApplicationToAdmissionResp } =
      appToAdmRef.current;
    if (exportApplicationToAdmissionResp && exportApplicationToAdmissionResp !== prevExportApplicationToAdmissionResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportApplicationToAdmissionResp, "Applications_To_Admissions");
    }
    appToAdmRef.current.prevExportApplicationToAdmissionResp = exportApplicationToAdmissionResp;

  }, [exportApplicationToAdmissionResp]);

  const getApplicationToAdmApiCall = (otherProps?: any) => {
    const payload = { instituteId, ...filterState, ...otherProps };
    if (payload.academicYearId) {
      dispatch(getApplicationToAdmissionAct(generateActionPayload("get_applications_to_admissions", undefined, payload)));
    }
  }

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "upcoming")?.academicYearId
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getApplicationToAdmApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  useEffect(() => {
    if (Array.isArray(getApplicationToAdmissionResp) && getApplicationToAdmissionResp.length > 0) {
      const modifiedResp = getApplicationToAdmissionResp.reduce((acc: any, curr: any) => {
        const { curriculumName, branchId, branchName, applications, admissions } = curr || {}

        // Find If same branch data available
        const findIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)

        // Get Key Name
        const keyName = curriculumName === "CAMBRIDGE INTERNATIONAL" ? "igcse" : curriculumName === "CBSE" ? "cbse" : "earlyYear"

        // Common Object
        const commonObj = { [`${keyName}Applications`]: applications, [`${keyName}Admissions`]: admissions, [`${keyName}ApplicationToAdmissionPer`]: (((admissions || 0) * 100) / (applications || 1)).toFixed(2) }

        if (findIdx > -1) {
          acc[findIdx] = { ...acc[findIdx], ...commonObj }
        } else {
          acc = [...acc, {
            branchId, branchName, ...commonObj
          }]
        }
        return acc
      }, [])
      setTableData(modifiedResp)
    } else {
      setTableData([])
    }
  }, [getApplicationToAdmissionResp])

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value, }));
    getApplicationToAdmApiCall({ [name]: value });
  }

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev: any) => ({ ...prev, startDate, endDate }));
      getApplicationToAdmApiCall({ startDate, endDate })
      advanceFilterChange({ keys: { ...filterState, startDate, endDate }, ignoredKeys: [] })
    }
  }

  const clearFilterHndlr = () => {
    const currentYear = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "upcoming");
    const academicYearId = currentYear?.academicYearId || "";
    setFilterState({ ...initialValues, academicYearId });
    getApplicationToAdmApiCall({ ...initialValues, academicYearId })
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] })
  }

  const exportSubmitHndlr = () => {
    const payload = { instituteId, ...filterState }
    dispatch(exportApplicationToAdmissionAct(generateActionPayload("export_applications_to_admissions", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const tableColumns = useMemo(() => generateColumns(), []);

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="application-to-admission-table-container">
        <div className="card !tw-rounded-2xl">
          <div className="card-header !tw-rounded-t-2xl">
            <div className="tw-grid tw-grid-cols-12 tw-items-center">
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <h4 className="card-title !tw-mb-0">
                  Application to Admission
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body !tw-p-0">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center tw-p-4">
              <div className="tw-col-span-6 lg:tw-col-span-3 xxl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={filterState.academicYearId}
                  onChange={onChangeFilterHndlr}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0"
                  labelText="Academic Year"
                  floatingLabel
                />
              </div>
              <div className="tw-col-span-6 lg:tw-col-span-3">
                <CustomDatePicker
                  name="dateRange"
                  startDate={filterState.startDate}
                  endDate={filterState.endDate}
                  onChange={handleDateChange}
                  placeholder="Select a Date Range"
                  monthsShown={2}
                  formgroupClassName="tw-mb-0"
                  labelText="Date Range"
                  floatingLabel
                ></CustomDatePicker>
              </div>
              
              {/* Wrapper for buttons to align them to the end */}
              <div className="tw-col-span-12 lg:tw-col-span-6 tw-flex tw-items-center tw-justify-end tw-gap-x-2">
                {showClearFilterState && (
                  <Button type="button" onClick={clearFilterHndlr} variant="wrong">
                    Clear filter
                  </Button>
                )}
                <Button
                  id="export-btn"
                  variant="exportBtn"
                  onClick={openExportModal}
                >
                  <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
            
            <div className="tw-overflow-x-auto">
              <TableExpandable
                columns={tableColumns || []}
                data={tableData || []}
                divClass="tw-mb-3 table-expandable table-sticky"
                theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                tableClass="tw-w-full table-bordered border-collapse"
              // showFooter={true}
              ></TableExpandable>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-application-to-admission-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Application To Admissions"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"applications_to_admissions"}
          remarksText="Enter remarks to export Application To Admissions?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ApplicationToAdmission;
