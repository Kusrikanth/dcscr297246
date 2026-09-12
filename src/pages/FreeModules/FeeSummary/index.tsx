import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, MultiSelectCheckbox, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    feeDueStatus,
    generateColumns,
    ignoredKeys,
    jodoOptedStatusOptions,
    serializeFeeSummaryFilters,
    USE_SAMPLE_STUDENT_FEE_LEDGER_LIST,
    sampleAcademicYearsForList,
    sampleCurriculumTypes,
    sampleClassTypes,
    sampleFeeSummaryListRows,
    sampleFeeSummaryListMeta,
} from "./helper";
import { StudentConcessionFilterhProps } from "./FeeSummaryTypes";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { createCredentialsAct, downloadDueAmountStudentListAct, exportFeeSummaryAct, getFeeSummaryListAct } from "../../../store/fee/feecollections/feecollectionactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modalhook";
import { ConfirmSendsmsDuePassed } from "./ConfirmSendsmsDuePassed";
import { useFilterState } from "../../../hooks/filterhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { resetDownloadDueAmountStudentListAct, setFeeSummaryListAct } from "../../../store/fee/feecollections/feecollectionsslice";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, Notebook01Icon, Notification03Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import AdvanceFilterModal from "./AdvancedFilterModal";
// import FeeSummary from "../../Dashboard/FeeSummary";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import DueChallanModal from "./DueChallanModal";

const initialValues: StudentConcessionFilterhProps = {
    searchString: "",
    academicYearId: "",
    branchId: "",
    curriculumId: "",
    classId: "",
    type: "",
    feeDueStatus: "",
    recentFollowupRemarksStartDate: "",
    recentFollowupRemarksEndDate: "",
    nextFollowupRemarksStartDate: "",
    nextFollowupRemarksEndDate: "",
    jodoOptedStatuses: [],
    termIds: [],
    isEliteParent: "",
    chronicParentTypeIds: [],
};

const FeeSummary = () => {
    const history = useHistory();
    const [open, setOpen] = useState<boolean>(false);
    const [feeSummuryListState, setFeeSummuryListState] = useState<any>(
        USE_SAMPLE_STUDENT_FEE_LEDGER_LIST
            ? sampleFeeSummaryListRows.map((row: any) => ({ ...row, isSelected: false }))
            : []
    )
    const [branchState, setBranchState] = useState([]);
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const { closeModal: closeDownloadDueStudentListModal, openModal: openDownloadDueStudentListModal, modalState: downloadDueStudentListModalState } = useModal()
    const dispatch = useDispatch();
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr,
        openModal: openDuedateSmsModalHndlr
    } = useModal();


    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<StudentConcessionFilterhProps>(initialValues);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,

    })
    const sorting = useRef({
        orderBy: "asc",
        sortBy: "name"
    })

    const FeeSummaryList = (otherProps?: any) => {
        const mergedFilters = {
            ...studentConcessionFilterState,
            ...otherProps,
        };
        const finalBranchId =
            showInstituteAdminUI
                ? mergedFilters.branchId
                : branchId;
        const params = serializeFeeSummaryFilters({ instituteId, ...mergedFilters, ...pagination.current, ...sorting.current, ...otherProps, branchId: finalBranchId });
        if (params.academicYearId) {
            dispatch(getFeeSummaryListAct(generateActionPayload('fee_summary_list', undefined, params)));
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        feeSummaryList,
        classroomManagmentErrorResp,
        currentBranchIdResp: branchId,
        createCredentialsResp,
        currentInstIdResp: instituteId,
        exportFeeSummaryResp,
        downloadDueAmountStudentListResp,
        feeCollectionErrorResp,
        showApiLoader,
        loggedInUserRole,
        branchListResp, virtualRoleResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeCollections, branch }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            feeSummaryList: feeCollections.feeSummaryList,
            createCredentialsResp: feeCollections.createCredentialsResp,
            exportFeeSummaryResp: feeCollections.exportFeeSummaryResp,
            downloadDueAmountStudentListResp: feeCollections.downloadDueAmountStudentListResp,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            loggedInUserRole: appData.loggedInUserRole,
            branchListResp: branch.branchListResp,
            virtualRoleResp: appData.virtualRoleResp
        }),
        shallowEqual
    );
    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

    const canExport = useMemo(() => {
        return loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
    }, [loggedInUserRole, virtualRoleResp]);

    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return (loggedInUserRole !== 'PRINCIPAL'
            && loggedInUserRole !== 'VICE_PRINCIPAL' && loggedInUserRole !== 'HOD' && loggedInUserRole !== 'PA'
            && loggedInUserRole !== 'TRANSPORT'
            && loggedInUserRole !== 'ADM_HEAD'
            && loggedInUserRole !== 'TEACHER'
            && loggedInUserRole !== 'GRIEVANCE'
            && loggedInUserRole !== 'HR'
            && loggedInUserRole !== 'EXAMINATION'
        );
    }, [loggedInUserRole, virtualRoleResp]);


    const menuOptions = useMemo(
        () => {
            const options = ([
                {
                    id: "view",
                    actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
                    actionName: "View Details",
                    onClickHndlr: (event: any) => {
                        const id = event.currentTarget.getAttribute("data-id");
                        if (!id) return;
                        const data = {
                            studentId: id,
                            academicYearId: studentConcessionFilterState.academicYearId,
                            curriculumId: studentConcessionFilterState.curriculumId,
                            classId: studentConcessionFilterState.classId,
                        };
                        sessionStorage.setItem("feeDetailsData", JSON.stringify(data));
                        window.open("/student-fee-ledger/fee-details", "_blank");
                    },
                },
                {
                    id: "collect",
                    actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="text-muted" size={18} />,
                    actionName: "Collect Fee",
                    onClickHndlr: (event: any) => {
                        const id = event.currentTarget.getAttribute("data-id");
                        const data = feeSummuryListState?.find((fee: any) => +fee.studentId === +id);
                        const { curriculumId, classId } = data || {},
                            { studentCode, studentId, studentName } = data || {};
                        history.push('/fee-receipts/create-receipt', {
                            curriculumId, classId,
                            studentCode, studentId, studentName,
                            academicYearId: studentConcessionFilterState.academicYearId
                        })
                    },
                },
                {
                    id: "createCredentials",
                    actionIcon: <HugeiconsIcon icon={Notification03Icon} className="text-muted" size={18} />,
                    actionName: "Create Credentials",
                    onClickHndlr: (event: any) => {
                        const id = event.currentTarget.getAttribute("data-id");
                        toggleSendCredentialsModal("single", id);
                    },
                }
            ])
            if (!canCreateAndUpdate) {
                return options.filter(item => item.id === 'view');
            }
            return options;
        }, [canCreateAndUpdate, studentConcessionFilterState, feeSummuryListState]
    );

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...feeSummuryListState];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setFeeSummuryListState(updateStudentState);
    }, [feeSummuryListState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = feeSummuryListState.findIndex((item: any) => +item.studentId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = feeSummuryListState[studentRowIndex];
            let updateStudentState: any = [...feeSummuryListState];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setFeeSummuryListState(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [feeSummuryListState]);

    useEffect(() => {
        if (branchId && !showInstituteAdminUI) {
            if (academicYearListResp) {
                const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                getCurriculumApiCall({ academicYearId })
            }
        }
    }, [branchId, showInstituteAdminUI]);


    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const currentYear = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT")
            || (USE_SAMPLE_STUDENT_FEE_LEDGER_LIST ? sampleAcademicYearsForList.find((year: any) => year.yearStatus === "CURRENT") : undefined);
        const yearId = currentYear?.academicYearId;
        FeeSummaryList({ academicYearId: yearId });
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }, [academicYearListResp]);

    useEffect(() => {
        if (branchListResp) {
            setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
        }
    }, [branchListResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === 'academicYearId') {
            if (value) {
                FeeSummaryList({ [name]: value, curriculumId: "", classId: "" });
                dispatch(setBrchClassAct(undefined));
                setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }));
                if (branchId || studentConcessionFilterState.branchId) {
                    const brchCurriculumparams = { branchId: showInstituteAdminUI ? studentConcessionFilterState.branchId : branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
                }
            }
            else {
                dispatch(setFeeSummaryListAct(undefined));
                setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }));
            }
        }
        else if (name === 'curriculumId') {
            setStudentConcessionFilterState((prev: any) => ({
                ...prev,
                [name]: value,
                classId: "",
            }));
            FeeSummaryList({ curriculumId: value, classId: "" });
            if (value) {
                const payload = {
                    branchId: showInstituteAdminUI ? studentConcessionFilterState.branchId : branchId,
                    academicYearId: studentConcessionFilterState.academicYearId,
                    curriculumId: value,
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100
                };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        }
        else if (name === 'branchId') {
            if (value) {
                const brchCurriculumparams = { branchId: value, academicYearId: studentConcessionFilterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
                setStudentConcessionFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
                FeeSummaryList({ [name]: value, curriculumId: "", classId: "" });
            }
            else {
                dispatch(resetBrchCurriculumAct(undefined));
                dispatch(resetBrchClassAct(undefined));
                setStudentConcessionFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
            }
        }
        else {
            setStudentConcessionFilterState((prev: any) => ({
                ...prev,
                [name]: value
            }));
            FeeSummaryList({ [name]: value });
        }
        advanceFilterChange({ keys: serializeFeeSummaryFilters({ ...studentConcessionFilterState, [name]: value }), ignoredKeys });
    };

    const multiSelectFilterHandler = (selectedOptions: any, config?: any) => {
        const { name } = config || {};
        if (!name) return;
        const value = Array.isArray(selectedOptions) ? selectedOptions : [];
        pagination.current = { ...pagination.current, pageNo: 0 };
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }));
        FeeSummaryList({ [name]: value });
        advanceFilterChange({ keys: serializeFeeSummaryFilters({ ...studentConcessionFilterState, [name]: value }), ignoredKeys });
    };

    const renderMultiSelectValue = (selectedItems: any) =>
        Array.isArray(selectedItems) ? (
            <div className="text-truncate">
                {selectedItems.map((item: any) => item?.name).join(", ")}
            </div>
        ) : null;

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: showInstituteAdminUI ? studentConcessionFilterState.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        setAllStudentSelectedState(false)
        FeeSummaryList(paginationInfo);
    }

    function downloadExcelFile(blobStream: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'fee_summary.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function convertBase64ToReceipt(base64: any, fileName: any) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const feeDetailsRespRef = useRef<any>({
        prevExportFeeSummaryResp: exportFeeSummaryResp,
        prevDownloadDueAmountStudentListResp: downloadDueAmountStudentListResp,
        prevCreateCredentialsResp: createCredentialsResp,
        prevFeeSummaryList: feeSummaryList,
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
    });

    useEffect(() => {
        const { prevExportFeeSummaryResp, prevFeeSummaryList, prevNotifyDueFeePaymentResp, prevCreateCredentialsResp, prevDownloadDueAmountStudentListResp, prevFeeCollectionErrorResp } = feeDetailsRespRef.current;
        if (exportFeeSummaryResp && exportFeeSummaryResp !== prevExportFeeSummaryResp) {
            toast.success("Fee Summary Data Download Successfully.");
            toggleExportExcelModal();
            downloadExcelFile(exportFeeSummaryResp)
        }
        else if (downloadDueAmountStudentListResp && downloadDueAmountStudentListResp !== prevDownloadDueAmountStudentListResp) {
            const pdfBase64 = downloadDueAmountStudentListResp?.pdfBase64;
            if (!pdfBase64?.trim()) {
                toast.error("No data found");
                closeDownloadDueStudentListModal();
                dispatch(resetDownloadDueAmountStudentListAct(undefined));
                return;
            }
            convertBase64ToReceipt(pdfBase64, "due_amount_student_list.pdf");
            toast.success("Due Amount Student List Download Successfully.");
            closeDownloadDueStudentListModal();
            dispatch(resetDownloadDueAmountStudentListAct(undefined));
            FeeSummaryList();
        }
        else if (feeSummaryList && feeSummaryList !== prevFeeSummaryList) {
            const { data } = feeSummaryList || {};
            setAllStudentSelectedState(false)
            setFeeSummuryListState(data?.map((i: any) => ({ ...i, isSelected: false })) || [])
        }
        else if (createCredentialsResp && createCredentialsResp !== prevCreateCredentialsResp) {
            toast.success("Credentials Created Successfully.");
            FeeSummaryList()
            toggleSendCredentialsModal();
        }
        else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            toast.error(feeCollectionErrorResp.message || "Some thing went wrong.");
        }
        feeDetailsRespRef.current.prevExportFeeSummaryResp = exportFeeSummaryResp;
        feeDetailsRespRef.current.prevDownloadDueAmountStudentListResp = downloadDueAmountStudentListResp;
        feeDetailsRespRef.current.prevCreateCredentialsResp = createCredentialsResp;
        feeDetailsRespRef.current.prevFeeSummaryList = feeSummaryList;
        feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [exportFeeSummaryResp, downloadDueAmountStudentListResp, feeSummaryList, createCredentialsResp, feeCollectionErrorResp]);

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
        scrutinyId: undefined
    })

    const [sendCredentials, setSendCredentials] = useState<any>({
        showModal: false,
        id: undefined,
        type: undefined,
    })

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const toggleSendCredentialsModal = (type?: any, id?: any) => {
        setSendCredentials((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
            type: type || "",
        }));
    };

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            pagination.current = { ...pagination.current, pageNo: 0 };

            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT" ) || {};
            dispatch(resetBrchClassAct(undefined));
            const updatedBranchId = showInstituteAdminUI ? "" : branchId;
            const resetState = { ...initialValues, academicYearId, branchId: updatedBranchId };
            setStudentConcessionFilterState(resetState);
            FeeSummaryList(resetState);
            if (!showInstituteAdminUI) {
                getCurriculumApiCall({ academicYearId,  branchId: updatedBranchId });
            } else {
                dispatch(resetBrchCurriculumAct(undefined));
            }
            advanceFilterChange({ keys: {}, ignoredKeys });
        }
    };
    const exportExcelHndler = () => {

        dispatch(exportFeeSummaryAct(generateActionPayload("export_fee_summary_list", undefined, serializeFeeSummaryFilters({ ...studentConcessionFilterState, branchId, instituteId, ...sorting.current }), {
            responseType: 'blob'
        })));
    }

    const exportSubmitHndlr = (data?: any) => {
        const { dueAmount, notifyTo } = data || {};
        const selectedStudentIds = feeSummuryListState
            ?.filter((i: any) => i?.isSelected)
            ?.map((i: any) => Number(i.studentId))
            .join(",");

        const studentIds =
            notifyTo === "ALL_STUDENT"
                ? ""
                : selectedStudentIds;

        const payload = {
            instituteId,
            branchId,
            dueAmount,
            studentIds,
            academicYearId: studentConcessionFilterState.academicYearId,
            curriculumId: studentConcessionFilterState.curriculumId,
            classId: studentConcessionFilterState.classId,
            feeDueStatus: studentConcessionFilterState.feeDueStatus,
            jodoOptedStatuses: serializeFeeSummaryFilters(studentConcessionFilterState).jodoOptedStatuses,
            termIds: serializeFeeSummaryFilters(studentConcessionFilterState).termIds,
        };

        dispatch(
            downloadDueAmountStudentListAct(
                generateActionPayload(
                    "download_due_amount_student_list",
                    undefined,
                    payload
                )
            )
        );
    };

    const sendCredentialsSubmitHndler = () => {
        if (sendCredentials.type === "multiple") {
            const studentIds = feeSummuryListState?.filter((i: any) => i?.isSelected)?.map((i: any) => i?.studentId)
            dispatch(createCredentialsAct(generateActionPayload('create_credentials_stu_fee_ledger_academic',
                { academicYearId: studentConcessionFilterState.academicYearId }, { studentIds })));
        } else {
            dispatch(createCredentialsAct(generateActionPayload('create_credentials_stu_fee_ledger_academic',
                { academicYearId: studentConcessionFilterState.academicYearId }, { studentIds: [sendCredentials.id] })));
        }
    }

    function notifyStudentHndlr() {
        const studentIds = feeSummuryListState?.filter((i: any) => i?.isSelected)?.map((i: any) => i?.studentId)
        openDuedateSmsModalHndlr(studentIds.join(','));
    }

    const roleColumns = useMemo(() => {
        const newColumns = generateColumns(canExport, menuOptions, allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, studentConcessionFilterState).filter(Boolean);
        if (showInstituteAdminUI) {
            return newColumns.filter((item: any) => item?.accessor !== "isStudentChecked" && item?.accessor !== "actions");
        } if (!canCreateAndUpdate) {
            return newColumns.filter((item: any) => item?.accessor !== "isStudentChecked" && item?.accessor !== "branchName");
        }
        return newColumns.filter((item: any) => item?.accessor !== "branchName");
    }, [canExport, canCreateAndUpdate, studentConcessionFilterState, feeSummuryListState, showInstituteAdminUI])

    function advanceFilterCallbckHndlr(appliedFilters?: any, isReset: boolean = false) {
        pagination.current = { ...pagination.current, pageNo: 0 };
        const updatedFilters = isReset
            ? {
                ...studentConcessionFilterState,
                branchId: studentConcessionFilterState.branchId,
                recentFollowupRemarksStartDate: "",
                recentFollowupRemarksEndDate: "",
                nextFollowupRemarksStartDate: "",
                nextFollowupRemarksEndDate: "",
                termIds: [],
                isEliteParent: "",
                chronicParentTypeIds: [],
            }
            : {
                ...studentConcessionFilterState,
                branchId: studentConcessionFilterState.branchId,
                ...appliedFilters,
            };
        setStudentConcessionFilterState(updatedFilters);
        advanceFilterChange({
            keys: isReset ? {} : serializeFeeSummaryFilters(updatedFilters),
            ignoredKeys,
        });
        FeeSummaryList(updatedFilters);
        toggleAdvanceFilter();
    }

    const useSampleAcademicYears = USE_SAMPLE_STUDENT_FEE_LEDGER_LIST && !(Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0);
    const academicYearList = useSampleAcademicYears ? sampleAcademicYearsForList : academicYearListResp?.data;

    const useSampleCurriculum = USE_SAMPLE_STUDENT_FEE_LEDGER_LIST && !(Array.isArray(brchCurriculumResp?.data) && brchCurriculumResp.data.length > 0);
    const curriculumTypes = useSampleCurriculum ? sampleCurriculumTypes : brchCurriculumResp?.data;

    const useSampleClasses = USE_SAMPLE_STUDENT_FEE_LEDGER_LIST && !(Array.isArray(branchClassResp?.content) && branchClassResp.content.length > 0);
    const classTypes = useSampleClasses ? sampleClassTypes : branchClassResp?.content;

    const useSampleFeeSummaryMeta = USE_SAMPLE_STUDENT_FEE_LEDGER_LIST && !feeSummaryList;
    const { totalPages, totalElements, pageNumber } = (useSampleFeeSummaryMeta ? sampleFeeSummaryListMeta : feeSummaryList) || {};
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Fee Summary" pageTitle="Fee" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Student Fee Ledger
                                    </h4>
                                </div>
                                <div className="tw-col-span-6 md:tw-col-span-2 xl:tw-col-span-2 tw-flex tw-items-center tw-ml-auto tw-gap-3">
                                    {feeSummuryListState?.some((i) => i?.isSelected) && (
                                        <Button
                                            type="button"
                                            className="tw-text-nowrap"
                                            onClick={() => openDownloadDueStudentListModal()}
                                            variant="info"
                                        >
                                            Download Due Amount
                                        </Button>
                                    )}
                                    {feeSummuryListState?.some((i) => i?.isSelected) && (
                                        <Button
                                            type="button"
                                            className="tw-text-nowrap"
                                            onClick={notifyStudentHndlr}
                                            variant="secondary"
                                        >
                                            Notify Due Payment
                                        </Button>
                                    )}

                                    {feeSummuryListState?.some((i) => i?.isSelected) && (
                                        <Button
                                            type="button"
                                            className="tw-text-nowrap"
                                            onClick={() => toggleSendCredentialsModal("multiple")}
                                            variant="primary"
                                        >
                                            Send Credentials
                                        </Button>
                                    )}
                                    {canExport && (
                                        <>    <Button
                                            id="export-btn"
                                            variant="exportBtn"

                                            onClick={toggleExportExcelModal}
                                        >
                                            <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                        </Button>

                                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                                Export
                                            </UncontrolledTooltip> </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4 tw-mt-2">
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={studentConcessionFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {showInstituteAdminUI && (
                                    <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                        <SelectInput
                                            name="branchId"
                                            valueKey="branchId"
                                            textKey="branchName"
                                            value={studentConcessionFilterState.branchId}
                                            menuItems={branchState}
                                            onChange={filterHandler}
                                            labelText="Branch Name"
                                            floatingLabel
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>
                                )}

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={studentConcessionFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="feeDueStatus"
                                        value={studentConcessionFilterState.feeDueStatus}
                                        onChange={filterHandler}
                                        menuItems={feeDueStatus || []}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Fee Due Status"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <MultiSelectCheckbox
                                        name="jodoOptedStatuses"
                                        idKey="id"
                                        labelText="Jodo Opted Status"
                                        containerClassName="mb-0"
                                        value={studentConcessionFilterState.jodoOptedStatuses || []}
                                        renderValue={renderMultiSelectValue}
                                        renderOptions={(item: any) => item?.name}
                                        onChange={multiSelectFilterHandler}
                                        searchKey="name"
                                        options={jodoOptedStatusOptions}
                                        floatingLabel
                                    />
                                </div>
                                {!canExport && (
                                    <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            className="tw-flex tw-items-center !tw-px-3 !tw-py-1"
                                            onClick={toggleAdvanceFilter}
                                            disabled={showApiLoader}
                                        >
                                            <FilterSvg height="18px" width="18px" />
                                            <span className="tw-ml-2">Filters</span>
                                        </Button>
                                        {(count ?? 0) > 0 && (
                                            <span className="tw-absolute tw--top-2 tw-right-0 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div
                                    className={`tw-col-span-6 ${canExport
                                        ? "md:tw-col-span-2 xl:tw-col-span-2"
                                        : "md:tw-col-span-3 xl:tw-col-span-3"
                                        } tw-flex tw-items-center tw-ml-auto`}
                                >
                                    {showClearFilterState && (
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            variant="wrong"
                                            className="!tw-px-3 !tw-py-1"
                                        >
                                            Clear filter
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={feeSummuryListState || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="fee-summury-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle='Export Fee Ledger Data'
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    submitHndlr={exportExcelHndler}
                    feature="fee"
                    subFeature="student_fee_ledger"
                    remarksText="Enter remarks to export fee ledger data?"
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="create-credentials-student-fee-ledger"
                isOpen={sendCredentials.showModal}
                confirmMessage="you want create new credentials ?"
                cancelHndlr={() => toggleSendCredentialsModal()}
                confirmHndlr={sendCredentialsSubmitHndler}
                isDisble={showApiLoader}
                btnClassName='btn w-sm btn-success'
                showImgIcon={true}
                iconType="approve"
            />
            <ModalContainerUpdated
                id="sendsmsduepassed-modal"
                modalSize="md"
                hideHeader
                isOpen={duedateSmsModalState.showModal}
                toggle={closeDuedateSmsModalHndlr}
            >
                <ConfirmSendsmsDuePassed
                    toggleModal={closeDuedateSmsModalHndlr}
                    selectedStudentIds={duedateSmsModalState.modalData}
                    academicYearId={studentConcessionFilterState.academicYearId}
                    branchId={branchId}
                />
            </ModalContainerUpdated>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="fee-summary-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={studentConcessionFilterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="export-class-wise-targets-modal"
                isOpen={downloadDueStudentListModalState.showModal}
                toggle={closeDownloadDueStudentListModal}
                modalTitle="Download Due Amount Student List"
                modalSize="md"
            >
                <DueChallanModal
                    isOpen={downloadDueStudentListModalState.showModal}
                    toggle={closeDownloadDueStudentListModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="fee"
                    subFeature={"download_due_amount_pdf"}
                    remarksText="Enter remarks to Download Due Amount Student List?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default FeeSummary;
