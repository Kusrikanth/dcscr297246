import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TableExpandable, CustomTooltip, Button } from "../../../../../Components/Common";
import { CustomDatePicker } from "../../../../DashBoardBranchSummary/CustomDatePicker";
import { curriculumTypes, generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { exportBranchWiseAdmAnalysisAct, getBranchWiseAdmAnalysisAct } from "../../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useFilterState } from "../../../../../hooks/filterhook";
import { setBranchWiseAdmAnalysisAct } from "../../../../../store/FrontDesk/Reports/reportsslice";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../../../hooks/modalhook";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../utility/commonutility";

const initialValues = {
  curriculumName: "",
  startDate: "",
  endDate: "",
};

const BranchWiseApplicationsAdmissions = (props: any) => {
  const { branchId, academicYearId } = props
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [filterState, setFilterState] = useState(initialValues);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { currentBranchIdResp, currentInstIdResp: instituteId,
    getBranchWiseAdmAnalysisResp, exportBranchWiseAdmAnalysisResp
  } = useAppSelector(
    ({ appData, reports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getBranchWiseAdmAnalysisResp: reports.getBranchWiseAdmAnalysisResp,
      exportBranchWiseAdmAnalysisResp: reports.exportBranchWiseAdmAnalysisResp,
    }),
    shallowEqual
  );

  const branchWiseNetPaidByDateRef = useRef({
    prevExportBranchWiseAdmAnalysisResp: exportBranchWiseAdmAnalysisResp,
  });

  useEffect(() => {
    const { prevExportBranchWiseAdmAnalysisResp } =
      branchWiseNetPaidByDateRef.current;
    if (exportBranchWiseAdmAnalysisResp && exportBranchWiseAdmAnalysisResp !== prevExportBranchWiseAdmAnalysisResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportBranchWiseAdmAnalysisResp, "Branch_Wise_Applications_To_Admissions");
    }
    branchWiseNetPaidByDateRef.current.prevExportBranchWiseAdmAnalysisResp = exportBranchWiseAdmAnalysisResp;

  }, [exportBranchWiseAdmAnalysisResp]);

  const branchWiseAdmAnalysisApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      academicYearId,
      type: "APPLICATIONS TO ADMISSIONS",
      ...filterState,
      ...otherProps,
    };
    dispatch(getBranchWiseAdmAnalysisAct(generateActionPayload('get_branch_wise_adm_analysis', undefined, payload)))
  }

  useEffect(() => {
    return () => {
      dispatch(setBranchWiseAdmAnalysisAct(undefined))
    }
  }, [])

  useEffect(() => {
    if (branchId || academicYearId) {
      branchWiseAdmAnalysisApiCall()
    }
  }, [branchId, academicYearId])

  useEffect(() => {
    if (Array.isArray(getBranchWiseAdmAnalysisResp)) {

      // Find Dyamic Columns
      const findCol = Array.from(
        new Map(
          getBranchWiseAdmAnalysisResp.map((item: any) => [item.academicYearId, { academicYearId: item.academicYearId, academicYear: item.academicYear }])
        ).values()
      )

      const modifiedResp = getBranchWiseAdmAnalysisResp.reduce((acc: any[], curr: any) => {
        const findBranchIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)

        const appKey = `academicYear${curr.academicYear}Applications`;
        const admKey = `academicYear${curr.academicYear}Admissions`;

        const classWiseObj = {
          curriculumType: curr?.classShortName,
          [appKey]: curr.applications || 0,
          [admKey]: curr.admissions || 0,
        }

        // Find Same Branch data if available
        if (findBranchIdx > -1) {
          const findCurriculumNameIdx = acc[findBranchIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr.curriculumName)

          // Find same curriculum data if available
          if (findCurriculumNameIdx > -1) {
            const findClassIdx = acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr?.classShortName)

            // Find same class data if available
            if (findClassIdx > -1) {
              acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows[findClassIdx][appKey] = curr.applications || 0
              acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows[findClassIdx][admKey] = curr.admissions || 0
            } else {

              acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows = [...acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows, classWiseObj]
            }
          } else {
            acc[findBranchIdx] = {
              ...acc[findBranchIdx], subRows: [...acc[findBranchIdx]?.subRows, {
                curriculumType: curr?.curriculumName,
                subRows: [classWiseObj]
              }]
            }
          }
        } else {
          acc = [...acc, {
            branchId: curr.branchId,
            branchName: curr.branchName,
            curriculumType: "Total",
            subRows: [{
              curriculumType: curr.curriculumName,
              subRows: [classWiseObj]
            }
            ]
          }]
        }
        return acc
      }, [])
        .map((item: any) => {
          const updatedSubRows = item.subRows?.map((subItem: any) => {
            // Aggregate from subItem.subRows into subItem
            const subAggregates = findCol.map((col: any) => {
              const appKey = `academicYear${col.academicYear}Applications`;
              const admKey = `academicYear${col.academicYear}Admissions`;
              return {
                [appKey]: subItem?.subRows?.reduce((acc: number, curr: any) => acc + (curr[appKey] || 0), 0),
                [admKey]: subItem?.subRows?.reduce((acc: number, curr: any) => acc + (curr[admKey] || 0), 0),
              };
            });
            return {
              ...subItem,
              ...Object.assign({}, ...subAggregates),
            };
          });

          // Aggregate from updatedSubRows into item
          const itemAggregates = findCol.map((col: any) => {
            const appKey = `academicYear${col.academicYear}Applications`;
            const admKey = `academicYear${col.academicYear}Admissions`;
            return {
              [appKey]: updatedSubRows?.reduce((acc: number, curr: any) => acc + (curr[appKey] || 0), 0),
              [admKey]: updatedSubRows?.reduce((acc: number, curr: any) => acc + (curr[admKey] || 0), 0),
            };
          });

          return {
            ...item,
            subRows: updatedSubRows,
            ...Object.assign({}, ...itemAggregates),
          };
        });

      setTableColumns(findCol)
      setTableData(modifiedResp)
    } else {
      setTableData([])
    }
  }, [getBranchWiseAdmAnalysisResp])

  const onChangeHndler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterState({ ...filterState, [name]: value });
    branchWiseAdmAnalysisApiCall({ [name]: value });
    advanceFilterChange({ keys: { ...filterState, [name]: value }, ignoredKeys: [] })
  };

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev: any) => ({ ...prev, startDate, endDate }));
      branchWiseAdmAnalysisApiCall({ startDate, endDate });
      advanceFilterChange({ keys: { ...filterState, startDate, endDate }, ignoredKeys: [] })
    }
  }

  const clearFilterHndlr = () => {
    setFilterState({ ...initialValues });
    branchWiseAdmAnalysisApiCall({ ...initialValues })
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] })
  }

  const exportSubmitHndlr = () => {
    const payload = { branchId, instituteId, academicYearId, ...filterState }
    dispatch(exportBranchWiseAdmAnalysisAct(generateActionPayload("export_branch_wise_adm_analysis", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const expandableTableColumns = useMemo(() => generateColumns(tableColumns), [tableColumns, tableData]);

  return (
    <div className="branch-wise-drill-down-table-container">
      <div className="tw-flex tw-flex-wrap tw-px-2 tw-gap-3 tw-py-3 tw-w-full tw-mx-auto">
        <div className="tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-1/6">
          <SelectInput
            name="curriculumName"
            value={filterState.curriculumName}
            onChange={onChangeHndler}
            menuItems={curriculumTypes}
            valueKey="id"
            textKey="name"
            formgroupClassName="tw-mb-0"
            defaultSelect="Select"
            labelText="Curriculum Type"
            floatingLabel
          ></SelectInput>
        </div>

        <div className="tw-w-1/2 lg:tw-w-1/4">
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
        <div className="tw-w-auto tw-ml-auto tw-flex">
          {showClearFilterState && (
            <Button
              variant="wrong"
              onClick={clearFilterHndlr}
            >
              Clear filter
            </Button>
          )}
        </div>
        <div className="tw-w-auto">
          <div className="tw-flex tw-items-center">
            <Button
              id="export-btn"
              variant="exportBtn"
              onClick={openExportModal}
            >
              <img src={ExportIcon} className="img-fluid h-100" />
              <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
              </UncontrolledTooltip>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <TableExpandable
          columns={expandableTableColumns || []}
          data={Array.isArray(tableData) ? tableData : []}
          divClass="table-responsive mb-3 table-expandable table-sticky tw-h-[468px]"
          theadClass="text-muted align-middle theadPrimary"
          tableClass="table-bordered table-nowrap"
        ></TableExpandable>
      </div>
      <ModalContainerUpdated
        id="export-branch-wise-net-paid-by-date-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Branch wise Application To Admissions"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"branch_applications_to_admissions"}
          remarksText="Enter remarks to export Branch wise Application To Admissions?"
        />
      </ModalContainerUpdated>
    </div>
  );
};

export default BranchWiseApplicationsAdmissions;
