import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DateInput, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames"
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns, getUserTypeId, MenuOptions, ignoredKeys } from "./helper";
import { useHistory } from "react-router-dom";
import { exportEmpHealthRecordsAct, exportHealthRecordsAct, getHealthRecordsListAct } from "../../../store/healthrecords/healthrecordsaction";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilter";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { setBookIssuanceUserTypeListAct } from "../../../store/library/bookissuance/bookissuanceslice";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { resetSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentslice";
import { EyeIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    fromDate: "",
    toDate: "",
};

const HealthRecordsDetails = () => {

    const dispatch = useAppDispatch();
    const history = useHistory();
    const [menuId, setMenuId] = useState("STUDENT");
    const { showClearFilterState, count , advanceFilterChange } = useFilterState();
    const [open, setOpen] = useState<boolean>(false);
    const pagination: any = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [exportConfirmationModal, setExportConfirmationModal] =
        useState({
            showModal: false,
            receiptId: "",
        });

    const moveAddHealthRecordScreen = (id?: any, route?: string) => {
        if (id) {
            history.push(`/health-records/${route}`, { id: id });
        } else {
            history.push("/health-records/add");
        }
    };

    const healthRecordsList = (otherProps?: any) => {
        let payload = {
            branchId,
            userType: menuId,
            ...healthRecordFilterState,
            ...pagination.current,
            ...otherProps,
        };
        payload.userType = getUserTypeId(payload.userType)
        dispatch(getHealthRecordsListAct(generateActionPayload('get_health_records_list', undefined, payload)))
    }

    const [healthRecordFilterState, setHealthRecordFilterState] = useState<any>(initialValues);

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        brchCurriculumResp,
        getHealthRecordsListResp,
        healthRecordsErrResp,
        exportHealthRecordsResp,
        exportEmpHealthRecordsResp,
    } = useAppSelector(
        ({ applicationSale, globalData, branchAcademics, instAcademics, healthRecords, appData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            getHealthRecordsListResp: healthRecords.getHealthRecordsListResp,
            healthRecordsErrResp: healthRecords.healthRecordsErrResp,
            exportHealthRecordsResp: healthRecords.exportHealthRecordsResp,
            exportEmpHealthRecordsResp: healthRecords.exportEmpHealthRecordsResp,
        }),
        shallowEqual
    );

    const healthRecordRef = useRef<any>({
        prevHealthRecordsErrResp: healthRecordsErrResp,
        prevexportHealthRecordsResp: exportHealthRecordsResp,
        prevExportEmpHealthRecordsResp: exportEmpHealthRecordsResp,
    })

    useEffect(() => {
        const { prevHealthRecordsErrResp, prevexportHealthRecordsResp, prevExportEmpHealthRecordsResp } = healthRecordRef.current;

        if (healthRecordsErrResp && prevHealthRecordsErrResp !== healthRecordsErrResp) {
            const { details } = healthRecordsErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (exportHealthRecordsResp && exportHealthRecordsResp !== prevexportHealthRecordsResp) {
            downloadExcelFile(exportHealthRecordsResp)
            toast.success("Student Health Records Details Downloaded Successfully.")
            toggleExportConfirmationModal();
        }
        else if (exportEmpHealthRecordsResp && exportEmpHealthRecordsResp !== prevExportEmpHealthRecordsResp) {
            downloadExcelFile(exportEmpHealthRecordsResp)
            toast.success("Employee Health Records Details Downloaded Successfully.")
            toggleExportConfirmationModal();
        }
        healthRecordRef.current.prevHealthRecordsErrResp = healthRecordsErrResp;
        healthRecordRef.current.prevexportHealthRecordsResp = exportHealthRecordsResp;
        healthRecordRef.current.prevExportEmpHealthRecordsResp = exportEmpHealthRecordsResp;

    }, [healthRecordsErrResp, exportHealthRecordsResp, exportEmpHealthRecordsResp])

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    moveAddHealthRecordScreen(id, "edit");
                },
            },
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
                actionName: "View",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    moveAddHealthRecordScreen(id, "view");
                },
            }
        ],
        [menuId]
    );

    const roleColumns = useMemo(() => {
        const newColumns = generateColumns(menuOptions);
        return newColumns.filter((item: any) => {
            if (item?.Header === "Class" || item?.Header === "Section" || item?.Header === "Curriculum") {
              if (menuId !== "EMPLOYEE") {
                return true
              }
              return false
            }
            return true
          })
        }, [menuId, getHealthRecordsListResp]);

    useEffect(() => {
        let yearId = academicYearListResp && menuId && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setHealthRecordFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        healthRecordsList({ academicYearId: yearId, userType: menuId })
        if (menuId === "STUDENT"){
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [menuId]);

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
      }
      const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: healthRecordFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : healthRecordFilterState?.academicYearId, curriculumId: healthRecordFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
         dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      useEffect(() => {
        return () => {
          dispatch(resetBrchCurriculumAct(undefined));
          dispatch(resetBrchClassAct(undefined));
          dispatch(setBookIssuanceUserTypeListAct(undefined))
        }
      }, [])  

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            if (value) {
                healthRecordsList({ [name]: value, classId: "", curriculumId: "", sectionId: "" });
                getCurriculumApiCall({ academicYearId: value });
                dispatch(resetBrchClassAct(undefined));
                dispatch(resetSectionListAct(undefined));
                setHealthRecordFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "", sectionId: "" }));

            }
        } else if (name === 'curriculumId') {
            setHealthRecordFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }));
            healthRecordsList({ [name]: value, classId: "", sectionId: "" });
            dispatch(resetBrchClassAct(undefined)); 
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: healthRecordFilterState.academicYearId });
                dispatch(resetSectionListAct(undefined));
            }
        }  else {
            healthRecordsList({ [name]: value })
            setHealthRecordFilterState((prev: any) => ({ ...prev, [name]: value }))

        }
        advanceFilterChange({
            keys: { ...healthRecordFilterState, [name]: value, academicYearId: "" },
            ignoredKeys
        });
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }
        advanceFilterChange({ keys : { ...healthRecordFilterState, ...appliedFilters , academicYearId: "" } , ignoredKeys })
        setHealthRecordFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        healthRecordsList(appliedFilters)    
      }

      const clearFilterHndlr = () => {
        pagination.current = { ...pagination.current, pageNo: 0 };
        const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
        setHealthRecordFilterState({ ...initialValues , academicYearId : academicYearId || "" });
        healthRecordsList({ ...initialValues , academicYearId });
        advanceFilterChange({ keys : { ...initialValues}, ignoredKeys  })
        getCurriculumApiCall({ academicYearId });
      };

    const toggleExportConfirmationModal = (id?: any) => {
        setExportConfirmationModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            receiptId: id || "",
        }));
    };

    const exportHandler = () => {
        if (menuId === "STUDENT") {
            exportExcelHndler();
        } else if (menuId === "EMPLOYEE") {
            exportEmpExcelHndler();
        }
    };

    const exportExcelHndler = () => {
        dispatch(exportHealthRecordsAct(generateActionPayload('export_health_records', undefined, { ...healthRecordFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }
    const exportEmpExcelHndler = () => {
        dispatch(exportEmpHealthRecordsAct(generateActionPayload('export_emp_health_records', undefined, { ...healthRecordFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    function downloadExcelFile(blobStream: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Health_Record_List.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        healthRecordsList(paginationInfo)
    }

    const { totalElements, totalPages, pageble } = getHealthRecordsListResp || {}
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};  

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Health Records" />

                    <div className="tw-bg-white tw-rounded tw-shadow">

                        {/* Card Header */}
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">

                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Health Records Details
                                </h4>

                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => moveAddHealthRecordScreen()}
                                    >
                                        Add New
                                    </Button>

                                    <Button
                                        variant="info"
                                        onClick={() => toggleExportConfirmationModal()}
                                    >
                                        <div className="tw-flex tw-items-center">
                                            <i className="ri-add-line tw-mr-1" />
                                            Export
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tw-overflow-x-auto">
                            <ModifiedHorizontalTab
                                MenuOptions={MenuOptions}
                                getActiveMenuId={(menuId: any) => {
                                    setMenuId(menuId);
                                }}
                                activeTabId={menuId}
                                horizontalClass="tw-pt-2 tw-overflow-x-auto"
                                labelClass="tw-whitespace-nowrap"
                            />
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">

                                {/* Search */}
                                <div className="tw-col-span-12 lg:tw-col-span-3">
                                    <div className="tw-relative">
                                        <div className="search-box">
                                            <TextInput
                                                name="searchString"
                                                value={healthRecordFilterState.searchString}
                                                onChange={filterHandler}
                                                inputClassName="tw-bg-gray-100"
                                                formgroupClassName="tw-mb-0"
                                                placeHolder="Search"
                                                labelText="Search"
                                                floatingLabel
                                            />
                                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={healthRecordFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {/* Curriculum (Student only) */}
                                {menuId === "STUDENT" && (
                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="curriculumId"
                                            value={healthRecordFilterState.curriculumId}
                                            onChange={filterHandler}
                                            menuItems={curriculumTypes}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Curriculum"
                                            floatingLabel
                                        />
                                    </div>
                                )}

                                
                                <div className="tw-relative">
                                    <div
                                        onClick={toggleAdvanceFilter}
                                        className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                                    >
                                        <FilterSvg height="18px" width="18px" />
                                        <span>Filters</span>
                                    </div>

                                    <span
                                        className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                                    >
                                        {count}
                                    </span>
                                </div>

                                {/* Clear Filter */}
                                {showClearFilterState && (
                                    <div className="tw-col-span-12 tw-flex tw-justify-end">
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            variant="wrong"
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={getHealthRecordsListResp?.data || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="health-records-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={healthRecordFilterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                    menuId={menuId}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="health-records-export-modal"
                isOpen={exportConfirmationModal.showModal}
                toggle={toggleExportConfirmationModal}
                modalTitle="Export Health Records Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModal.showModal}
                    toggle={toggleExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportHandler}
                    feature="health_records"
                    subFeature= {`${menuId.toLowerCase()}`}
                    remarksText="Enter remarks to export health records data?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default HealthRecordsDetails;