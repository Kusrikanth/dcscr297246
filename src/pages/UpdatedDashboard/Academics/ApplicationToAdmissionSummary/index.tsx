import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  ModalContainerUpdated,
  SelectInput,
  TableExpandable,
} from "../../../../Components/Common";
import { generateColumns, formatCamelCase, curriculumTypes } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportAppToAdmSummaryAct, getAppToAdmSummaryAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

interface initialValues {
  academicYearId: string;
  curriculumName: string;
}

const initialValues: initialValues = {
  academicYearId: "",
  curriculumName: "",
}

const ApplicationToAdmissionSummary = () => {
  const dispatch = useAppDispatch()
  const [tableData, setTableData] = useState<any[]>([])
  const [filterState, setFilterState] = useState<initialValues>(initialValues)
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    currentInstIdResp: instituteId, getAppToAdmSummaryResp, academicYearListResp, exportAppToAdmSummaryResp } =
    useAppSelector(({ appData, reports, instAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getAppToAdmSummaryResp: reports.getAppToAdmSummaryResp,
      exportAppToAdmSummaryResp: reports.exportAppToAdmSummaryResp,
      academicYearListResp: instAcademics.academicYearListResp,
    }), shallowEqual)

  const appToAdmSummaryRef = useRef({
    prevExportAppToAdmSummaryResp: exportAppToAdmSummaryResp,
  });

  useEffect(() => {
    const { prevExportAppToAdmSummaryResp } =
      appToAdmSummaryRef.current;
    if (exportAppToAdmSummaryResp && exportAppToAdmSummaryResp !== prevExportAppToAdmSummaryResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportAppToAdmSummaryResp, "Application_to_Admission_Summary");
    }
    appToAdmSummaryRef.current.prevExportAppToAdmSummaryResp = exportAppToAdmSummaryResp;

  }, [exportAppToAdmSummaryResp]);

  const getAppToAdmSummaryApiCall = (otherProps?: any) => {
    const payload = { instituteId, ...filterState, ...otherProps };
    if (payload.academicYearId) {
      dispatch(getAppToAdmSummaryAct(generateActionPayload("get_app_to_adm_summary", undefined, payload)));
    }
  }

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "upcoming")?.academicYearId
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getAppToAdmSummaryApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  useEffect(() => {
    if (Array.isArray(getAppToAdmSummaryResp) && getAppToAdmSummaryResp.length > 0) {
      const totalRows = Object.entries(getAppToAdmSummaryResp[0])
        .filter(([key]) => key !== "branchId" && key !== "branchName")
        .map(([key]) => ({ key, show: formatCamelCase(key) }));

      const modifiedResp = totalRows.map((row) => {
        const key = row.key;

        const branchData = getAppToAdmSummaryResp.reduce((acc, curr) => {
          const branchName = curr?.branchName;
          if (key in curr) {
            return { ...acc, [branchName]: curr[key] };
          }
          return acc;
        }, {});

        return { ...row, ...branchData };
      });
      setTableData(modifiedResp)
    } else {
      setTableData([])
    }
  }, [getAppToAdmSummaryResp])

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value, }));
    getAppToAdmSummaryApiCall({ [name]: value });
  }

  const exportSubmitHndlr = () => {
    const payload = { instituteId, ...filterState, }
    dispatch(exportAppToAdmSummaryAct(generateActionPayload("export_app_to_adm_summary", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const tableColumns = useMemo(() => generateColumns(getAppToAdmSummaryResp), [getAppToAdmSummaryResp, tableData]);

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="application-to-admission-summary-table-container">
        <div className="card !tw-rounded-2xl">
          <div className="card-header !tw-rounded-t-2xl">
            <div className="tw-flex tw-items-center">
              <h4 className="card-title !tw-mb-0 tw-grow">
                Application to Admission Summary Table
              </h4>
            </div>
          </div>

          <div className="card-body !tw-p-0">
            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3 tw-p-4">
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
              <div className="tw-col-span-6 lg:tw-col-span-3 xxl:tw-col-span-2">
                <SelectInput
                  name="curriculumName"
                  value={filterState.curriculumName}
                  onChange={onChangeFilterHndlr}
                  menuItems={curriculumTypes}
                  valueKey="id"
                  textKey="name"
                  formgroupClassName="tw-mb-0"
                  labelText="Curriculum"
                  floatingLabel
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-6 xxl:tw-col-span-8">
                <div className="tw-flex tw-items-center tw-justify-end">
                  <Button
                    id="export-btn"
                    variant="exportBtn"
                    onClick={openExportModal}
                  >
                    <img src={ExportIcon} className="img-fluid tw-h-full tw-w-auto" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-overflow-x-auto">
                <TableExpandable
                  columns={tableColumns || []}
                  data={tableData || []}
                  divClass="table-responsive tw-mb-3 table-expandable table-sticky"
                  theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                  tableClass="tw-w-full tw-border-collapse"
                ></TableExpandable>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-app-to-adm-summary-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Application to Admission Summary"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"application_to_admission_summary"}
          remarksText="Enter remarks to export Application to Admission Summary ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ApplicationToAdmissionSummary;
