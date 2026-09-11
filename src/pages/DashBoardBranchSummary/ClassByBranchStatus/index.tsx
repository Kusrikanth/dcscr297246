import React, { useEffect, useMemo, useRef, useState } from 'react'
import CurriculumWiseStrengthExpand from '../../UpdatedDashboard/SchoolStrengthTab/StrengthTables/CurriculumWiseStrengthExpand'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import { exportClassByBranchStatusAct, getClassByBranchStatusAct } from '../../../store/FrontDesk/Reports/reportsactions'
import { generateActionPayload } from '../../../utility/reduxutility'
import { ModalContainerUpdated, SelectInput } from '../../../Components/Common'
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportModal from '../../Directory/StudentManagement/ExportModal'
import { toast } from 'react-toastify'
import { downloadExcelFile } from '../../../utility/commonutility'
import Button from '../../../Components/Common/Button'

const ClassByBranchStatus = () => {
    const dispatch = useAppDispatch();
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()
    
    const [filterState, setFilterState] = useState({
        academicYearId: "",
    });
    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, academicYearListResp, exportClassByBranchStatusResp } =
        useAppSelector(({ appData, instAcademics, reports }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            academicYearListResp: instAcademics.academicYearListResp,
            exportClassByBranchStatusResp: reports.exportClassByBranchStatusResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            
        }), shallowEqual)

          const clasByBranchStatusRef = useRef({
            prevExportClassByBranchStatusResp: exportClassByBranchStatusResp,
          });
        
          useEffect(() => {
            const { prevExportClassByBranchStatusResp } = clasByBranchStatusRef.current;
            if (exportClassByBranchStatusResp && exportClassByBranchStatusResp !== prevExportClassByBranchStatusResp) {
              toast.success("Exported successfully");
              closeExportModal()
              downloadExcelFile(exportClassByBranchStatusResp, "class_wise_student_count");
            }
            clasByBranchStatusRef.current.prevExportClassByBranchStatusResp = exportClassByBranchStatusResp;
        
          }, [exportClassByBranchStatusResp]);
        

    const classbyBranchStatusApiCall = (otherProps?: any) => {
        const payload = {
            instituteId,
            branchId,
            type: "CURRICULUM",
            ...otherProps,
        };
        if (instituteId) {
            dispatch(getClassByBranchStatusAct(generateActionPayload('get_class_by_branch_status', undefined, payload)))
        }
    }

    useEffect(() => {
        if (branchId && Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0) {
            const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            classbyBranchStatusApiCall({ academicYearId });
            setFilterState((prev) => ({ ...prev, academicYearId }) );
        }
    }, [branchId, instituteId, academicYearListResp]);

    const academicYearId = useMemo(() => academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "", [academicYearListResp])

    const exportSubmitHndlr = () => {
        const payload = {
            academicYearId: filterState.academicYearId,
            branchId,
            instituteId,
            type: "CURRICULUM",
        };
        dispatch(exportClassByBranchStatusAct(generateActionPayload("export_class_by_branch_status", undefined, payload, {
            responseType: 'blob'
        })));
    }

    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-pb-1">
            <div className="tw-py-2 tw-px-4 tw-border-b">
                <div className="tw-flex tw-items-center">
                    <div className="tw-flex-1 tw-pr-0">
                        <h4 className="tw-text-[15px] tw-font-semibold tw-mb-0">
                            Class Wise Student Count
                        </h4>
                    </div>

                    <div className="tw-ml-auto">
                        <div className="tw-flex tw-items-center">
                            <Button
                                variant='exportBtn'
                                id="export-btn"
                                onClick={openExportModal}
                            >
                                <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                            </Button>

                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                Export
                            </UncontrolledTooltip>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-p-0">

                <div className="tw-flex tw-flex-wrap tw-gap-3 tw-px-2 tw-py-3 tw-w-full tw-mx-auto">
                    <div className="tw-w-1/3">
                        <SelectInput
                            name="academicYearId"
                            value={filterState.academicYearId}
                            onChange={undefined}
                            menuItems={academicYearListResp?.data || []}
                            isDisabled
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            floatingLabel
                        />
                    </div>
                </div>
                <CurriculumWiseStrengthExpand academicYearId={academicYearId} />
            </div>
            <ModalContainerUpdated
                id="export-section-wise-language-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Section Wise Languages"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="academic"
                    subFeature={"section_wise_languages"}
                    remarksText="Enter remarks to export section wise languages?"
                />
            </ModalContainerUpdated>
        </div>
        
    )
}

export default ClassByBranchStatus