import { useEffect, useMemo, useRef, useState } from "react";
import { curriculumTypes, generateColumns } from "./helper";
import { Button, ModalContainerUpdated, SelectInput, TableExpandable } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFilterState } from "../../../../../hooks/filterhook";
import { shallowEqual } from "react-redux";
import { exportBranchWiseAdmAnalysisNewAct, getBranchWiseAdmAnalysisNewAct } from "../../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { setBranchWiseAdmAnalysisAct } from "../../../../../store/FrontDesk/Reports/reportsslice";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../utility/commonutility";

const initialValues = {
  curriculumName: "",
  startDate: "",
  endDate: "",
};

const BranchWiseAdmissionTargets = (props: any) => {
  const { branchId, academicYearId } = props || {}
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const [tableData, setTableData] = useState<any[]>([]);
  const [filterState, setFilterState] = useState(initialValues);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { currentBranchIdResp, currentInstIdResp: instituteId,
    getBranchWiseAdmAnalysisNewResp, exportBranchWiseAdmAnalysisNewResp,
  } = useAppSelector(
    ({ appData, reports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getBranchWiseAdmAnalysisNewResp: reports.getBranchWiseAdmAnalysisNewResp,
      exportBranchWiseAdmAnalysisNewResp: reports.exportBranchWiseAdmAnalysisNewResp,
    }),
    shallowEqual
  );

  const admissionTargetRef = useRef({
    prevExportBranchWiseAdmAnalysisNewResp: exportBranchWiseAdmAnalysisNewResp,
  });

  useEffect(() => {
    const { prevExportBranchWiseAdmAnalysisNewResp } =
      admissionTargetRef.current;
    if (exportBranchWiseAdmAnalysisNewResp && exportBranchWiseAdmAnalysisNewResp !== prevExportBranchWiseAdmAnalysisNewResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportBranchWiseAdmAnalysisNewResp, "Applications_Targets");
    }
    admissionTargetRef.current.prevExportBranchWiseAdmAnalysisNewResp = exportBranchWiseAdmAnalysisNewResp;

  }, [exportBranchWiseAdmAnalysisNewResp]);

  const branchWiseAdmAnalysisApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      academicYearId,
      type: "ADMISSION TARGETS",
      ...filterState,
      ...otherProps,
    };
    dispatch(getBranchWiseAdmAnalysisNewAct(generateActionPayload('get_branch_wise_adm_analysis', undefined, payload)))
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
    if (Array.isArray(getBranchWiseAdmAnalysisNewResp)) {

      const modifiedResp = getBranchWiseAdmAnalysisNewResp.reduce((acc: any, curr: any) => {
        const { admissions, admissionsTarget, applications, desiredStrength, promotedStudents, totalStrength, vacancies, totalSections } = curr || {}

        const commonObj = { admissions, admissionsTarget, applications, desiredStrength, promotedStudents, totalStrength, vacancies, totalSections, }

        // Find Same Branch data if available
        const findBranchIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)
        if (findBranchIdx > -1) {
          const findCurriculumNameIdx = acc[findBranchIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr.curriculumName)

          // Find same curriculum data if available
          if (findCurriculumNameIdx > -1) {
            const findClassIdx = acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr?.classShortName)

            // Find same class data if available
            if (findClassIdx > -1) {
              acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows[findClassIdx] = { ...acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows[findClassIdx], ...commonObj, curriculumType: curr?.classShortName, }
            } else {
              acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows = [...acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows, { ...commonObj, curriculumType: curr?.classShortName, },]
            }

          } else {
            acc[findBranchIdx] = {
              ...acc[findBranchIdx], subRows: [...acc[findBranchIdx]?.subRows, {
                curriculumType: curr?.curriculumName,
                subRows: [{ ...commonObj, curriculumType: curr?.classShortName }]
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
              subRows: [{ ...commonObj, curriculumType: curr?.classShortName, }]
            }
            ]
          }]
        }
        return acc

      }, [])
        .map((item: any) => {
          const keyArr = ["admissions", "admissionsTarget", "applications", "desiredStrength", "promotedStudents", "totalStrength", "vacancies", "totalSections"]
          const updatedSubRows = item.subRows?.map((subItem: any) => {

            // Aggregate from subItem.subRows into subItem
            const subAggregates = keyArr.map((key: any) => {
              return {
                [key]: subItem?.subRows?.reduce((acc: number, curr: any) => acc + (curr[key] || 0), 0),
              };
            });
            return {
              ...subItem,
              ...Object.assign({}, ...subAggregates),
            };
          });

          // Aggregate from updatedSubRows into item
          const itemAggregates = keyArr.map((key: any) => {
            return {
              [key]: updatedSubRows?.reduce((acc: number, curr: any) => acc + (curr[key] || 0), 0),
            };
          });

          return {
            ...item,
            subRows: updatedSubRows,
            ...Object.assign({}, ...itemAggregates),
          };
        });

      setTableData(modifiedResp)
    } else {
      setTableData([])
    }
  }, [getBranchWiseAdmAnalysisNewResp])

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
    dispatch(exportBranchWiseAdmAnalysisNewAct(generateActionPayload("export_branch_wise_adm_analysis_new", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const expandableTableColumns = useMemo(() => generateColumns(), [tableData]);

  return (
    <>
      <div className="branch-wise-drill-down-table-container">
        <div className="tw-grid tw-grid-cols-12 tw-px-2 tw-g-3 tw-py-3 tw-w-full tw-mx-auto">
          {/* <div className="col-6 col-lg-3 col-xxl-2">
            <SelectInput
              name="curriculumName"
              value={filterState.curriculumName}
              onChange={onChangeHndler}
              menuItems={curriculumTypes}
              valueKey="id"
              textKey="name"
              formgroupClassName="mb-0"
              defaultSelect="Select"
              labelText="Curriculum Type"
              floatingLabel
            ></SelectInput>
          </div>

          <div className="col-6 col-lg-3">
            <CustomDatePicker
              name="dateRange"
              startDate={filterState.startDate}
              endDate={filterState.endDate}
              onChange={handleDateChange}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="mb-0"
              labelText="Date Range"
              floatingLabel
            ></CustomDatePicker>
          </div> */}
          <div className="tw-col-span-12 tw-mr-3 tw-ml-auto">
            <div className="tw-flex tw-items-center">
              <Button
                id="export-btn"
                variant="exportBtn"
                onClick={openExportModal}
              >
                <img src={ExportIcon} className="tw-max-w-full tw-h-full" alt="Export" />
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
      </div>
      <ModalContainerUpdated
        id="export-branch-wise-net-paid-by-date-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Branch wise Admission Targets"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"branch_wise_admission_targets"}
          remarksText="Enter remarks to export Branch wise Admission Targets?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BranchWiseAdmissionTargets;
