import { useEffect, useMemo, useRef, useState } from "react";
import { curriculumTypes, generateColumns } from "./helper";
import { ModalContainerUpdated, SelectInput, TableExpandable } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useFilterState } from "../../../hooks/filterhook";
import { shallowEqual } from "react-redux";
import { exportBranchWiseAdmAnalysisAct, getBranchWiseAdmAnalysisAct } from "../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { setBranchWiseAdmAnalysisAct } from "../../../store/FrontDesk/Reports/reportsslice";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";

const initialValues = {
  curriculumName: "",
  startDate: "",
  endDate: "",
};

const ClassWiseTarget = ({ academicYearId }: any) => {
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const [tableData, setTableData] = useState<any[]>([]);
  const [filterState, setFilterState] = useState(initialValues);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getBranchWiseAdmAnalysisResp, academicYearListResp, exportBranchWiseAdmAnalysisResp,
  } = useAppSelector(
    ({ appData, reports, instAcademics }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getBranchWiseAdmAnalysisResp: reports.getBranchWiseAdmAnalysisResp,
      academicYearListResp: instAcademics.academicYearListResp,
      exportBranchWiseAdmAnalysisResp: reports.exportBranchWiseAdmAnalysisResp,
    }),
    shallowEqual
  );

  const classWiseTargetRef = useRef({
    prevExportBranchWiseAdmAnalysisResp: exportBranchWiseAdmAnalysisResp,
  });

  useEffect(() => {
    const { prevExportBranchWiseAdmAnalysisResp } =
      classWiseTargetRef.current;
    if (exportBranchWiseAdmAnalysisResp && exportBranchWiseAdmAnalysisResp !== prevExportBranchWiseAdmAnalysisResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportBranchWiseAdmAnalysisResp, "Class_Wise_Targets");
    }
    classWiseTargetRef.current.prevExportBranchWiseAdmAnalysisResp = exportBranchWiseAdmAnalysisResp;

  }, [exportBranchWiseAdmAnalysisResp]);

  const branchWiseAdmAnalysisApiCall = (otherProps?: any) => {
    // const academicYearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "upcoming")?.academicYearId
    const payload = {
      branchId,
      instituteId,
      academicYearId,
      type: "ADMISSION TARGETS",
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
    if (branchId && academicYearId) {
      branchWiseAdmAnalysisApiCall()
    }
  }, [branchId, academicYearId])

  useEffect(() => {
    if (Array.isArray(getBranchWiseAdmAnalysisResp)) {

      const modifiedResp = getBranchWiseAdmAnalysisResp.reduce((acc: any, curr: any) => {
        const { admissions, admissionsTarget, applications, desiredStrength, promotedStudents, totalStrength, vacancies, totalSections } = curr || {}

        const commonObj = { admissions, admissionsTarget, applications, desiredStrength, promotedStudents, totalStrength, vacancies, totalSections, }

        // Find Same Curriculum data if available
        const findCurriculumIdx = acc.findIndex((item: any) => item.curriculumType === curr.curriculumName)
        if (findCurriculumIdx > -1) {
          const findClassIdx = acc[findCurriculumIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr?.classShortName)

          // Find same class data if available
          if (findClassIdx > -1) {
            acc[findCurriculumIdx].subRows[findClassIdx] = { ...acc[findCurriculumIdx]?.subRows[findClassIdx], ...commonObj, curriculumType: curr?.classShortName, }
          } else {
            acc[findCurriculumIdx].subRows = [...acc[findCurriculumIdx]?.subRows, { ...commonObj, curriculumType: curr?.classShortName, },]
          }

        } else {
          acc = [...acc, {
            curriculumType: curr?.curriculumName,
            subRows: [{ ...commonObj, curriculumType: curr?.classShortName }]
          }]
        }
        return acc

      }, [])
        ?.map((item: any) => {
          const keyArr = ["admissions", "admissionsTarget", "applications", "desiredStrength", "promotedStudents", "totalStrength", "vacancies", "totalSections"]

          // Aggregate from subRows into item
          const itemAggregates = keyArr.map((key: any) => {
            return {
              [key]: item?.subRows?.reduce((acc: number, curr: any) => acc + (curr[key] || 0), 0),
            };
          });

          return {
            ...item,
            ...Object.assign({}, ...itemAggregates),
          };
        });

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
    const payload = { branchId, instituteId, ...filterState }
    dispatch(exportBranchWiseAdmAnalysisAct(generateActionPayload("export_branch_wise_adm_analysis", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const expandableTableColumns = useMemo(() => generateColumns(), [tableData]);

  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm">
        <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3 ">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-items-center tw-gap-y-3">

            <div className="lg:tw-col-span-4 ">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Class Wise Target
              </h4>
            </div>

            {/* Uncomment if needed
              <div className="lg:tw-col-span-8 tw-flex tw-justify-end">
                <button
                  id="export-btn"
                  className="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-bg-cyan-100 hover:tw-bg-cyan-200 tw-transition"
                  onClick={openExportModal}
                >
                  <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                </button>
              </div>
              */}
          </div>
        </div>

        <div className="tw-p-0">
          <TableExpandable
            columns={expandableTableColumns || []}
            data={Array.isArray(tableData) ? tableData : []}
            divClass="tw-overflow-x-auto tw-mb-3 tw-h-[468px]"
            theadClass="table-light tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-10"
            tableClass="tw-font-normal tw-bottom-0 tw-border tw-border-gray-200 tw-whitespace-nowrap"
          />
        </div>
      </div>

      <ModalContainerUpdated
        id="export-class-wise-targets-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Class Wise Targets"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"class_wise_targets"}
          remarksText="Enter remarks to export Class Wise Targets?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ClassWiseTarget;