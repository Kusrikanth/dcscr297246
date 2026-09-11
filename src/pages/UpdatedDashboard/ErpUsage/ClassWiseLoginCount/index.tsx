import { useEffect, useMemo, useRef, useState } from "react";
import { Button, TableExpandable } from "../../../../Components/Common";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportClassWiseLoginCountAct, getClassWiseLoginCountAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { ModalContainerUpdated } from "../../../../Components/Common";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

const ClassWiseLoginCount = (props: any) => {

    const { branchId, academicYearId } = props
    const dispatch = useAppDispatch();
    const [tableData, setTableData] = useState<any[]>([]);
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

    const { currentInstIdResp: instituteId,
        getClassWiseLoginCountResp, exportClassWiseLoginCountResp,
    } = useAppSelector(
        ({ appData, reports }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            getClassWiseLoginCountResp: reports.getClassWiseLoginCountResp,
            exportClassWiseLoginCountResp: reports.exportClassWiseLoginCountResp,
        }),
        shallowEqual
    );

    const classWiseLogiCountRef = useRef({
        prevExportClassWiseLoginCountResp: exportClassWiseLoginCountResp,
    });

    useEffect(() => {
        const { prevExportClassWiseLoginCountResp } = classWiseLogiCountRef.current;
        if (exportClassWiseLoginCountResp && exportClassWiseLoginCountResp !== prevExportClassWiseLoginCountResp) {
            toast.success("Exported successfully");
            closeExportModal()
            downloadExcelFile(exportClassWiseLoginCountResp, "class_wise_login_count");
        }
        classWiseLogiCountRef.current.prevExportClassWiseLoginCountResp = exportClassWiseLoginCountResp;

    }, [exportClassWiseLoginCountResp]);

    const classWiseLoginCountsApiCall = (otherProps?: any) => {
        const payload = {
            instituteId,
            academicYearId,
            ...otherProps,
        };
        dispatch(getClassWiseLoginCountAct(generateActionPayload('get_class_wise_login_count', undefined, payload)))
    }

    const exportSubmitHndlr = () => {
        const payload = { instituteId, academicYearId };
        dispatch(exportClassWiseLoginCountAct(generateActionPayload("export_class_wise_login_count", undefined, payload, {
            responseType: 'blob'
        })));
    }

    useEffect(() => {
        if (academicYearId) {
            classWiseLoginCountsApiCall()
        }
    }, [academicYearId, instituteId])

    useEffect(() => {
        if (Array.isArray(getClassWiseLoginCountResp)) {

            const modifiedResp = getClassWiseLoginCountResp.reduce((acc: any[], curr: any) => {
                const findBranchIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)

                const key = `${curr?.loggedInType === "not_logged_in" ? "notLoggedInCount" : "loggedInCount"}`

                const classWiseObj = {
                    curriculumType: curr?.classShortName,
                    [key]: curr?.count,
                }

                // Find Same Branch data if available
                if (findBranchIdx > -1) {
                    const findCurriculumNameIdx = acc[findBranchIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr.curriculumName)

                    // Find same curriculum data if available
                    if (findCurriculumNameIdx > -1) {
                        const findClassIdx = acc[findBranchIdx]?.subRows[findCurriculumNameIdx]?.subRows?.findIndex((item: any) => item.curriculumType === curr?.classShortName)

                        // Find same class data if available
                        if (findClassIdx > -1) {
                            acc[findBranchIdx].subRows[findCurriculumNameIdx].subRows[findClassIdx][key] = curr.count || 0
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
                    const columns = ["loggedInCount", "notLoggedInCount"]
                    const updatedSubRows = item.subRows?.map((subItem: any) => {
                        // Aggregate from subItem.subRows into subItem
                        const subAggregates = columns.map((key: any) => ({
                            [key]: subItem?.subRows?.reduce((acc: number, curr: any) => acc + (curr[key] || 0), 0),
                        }));
                        return {
                            ...subItem,
                            ...Object.assign({}, ...subAggregates),
                        };
                    });

                    // Aggregate from updatedSubRows into item
                    const itemAggregates = columns.map((key: any) => ({
                        [key]: updatedSubRows?.reduce((acc: number, curr: any) => acc + (curr[key] || 0), 0),
                    }));

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
    }, [getClassWiseLoginCountResp])

    const expandableTableColumns = useMemo(() => generateColumns(), [tableData]);
    return (
        <>
            <div className="class-wise-admission-analysis-container">
                <div className="card !tw-shadow-sm !tw-rounded-2xl !tw-pb-0 !tw-mb-4">
                    <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-y-3">
                            <div>
                                <h4 className="card-title !tw-mb-0">
                                    Class Wise Login Count
                                </h4>
                            </div>
                            <div>
                                <div className="tw-flex tw-gap-3">
                                    <Button
                                        id="export-btn"
                                        variant="exportBtn"
                                        onClick={openExportModal}
                                    >
                                        <img src={ExportIcon} className="img-fluid tw-w-5 tw-h-5" />
                                        <UncontrolledTooltip placement="bottom" target="export-btn">
                                            Export
                                        </UncontrolledTooltip>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body !tw-p-0">
                        <div className="branch-wise-drill-down-table-container">
                            <div>
                                <TableExpandable
                                    columns={expandableTableColumns}
                                    data={tableData || []}
                                    divClass="table-responsive !tw-overflow-x-auto tw-mb-3 table-expandable table-sticky tw-h-[468px]"
                                    theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                                    tableClass="tw-whitespace-nowrap"
                                ></TableExpandable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="export-class-wise-login-count-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Class Wise Login Count"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="admission"
                    subFeature={"branch_wise_login"}
                    remarksText="Enter remarks to Export Class Wise Login Count ?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default ClassWiseLoginCount;
