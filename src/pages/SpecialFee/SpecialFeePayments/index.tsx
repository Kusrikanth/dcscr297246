import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumns, hasStateChanged, paymentModeOptions, } from "./helper";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { getSpecialFeePaymentListAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
    name: "",
    academicYearId: "",
    branchCurriculumId: "",
    classId: "",
    paymentMode: "",
};

const SpecialFeePayments = () => {

    const dispatch = useDispatch();
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [count, setCount] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);

    const [filterState, setFilterState] = useState(initialValues);


    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const specialFeePaymentList = (otherProps?: any) => {

        let payload = {
            branchId,
            ...filterState,
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getSpecialFeePaymentListAct(generateActionPayload("get_special_fee_payment_list", undefined, payload)));
    };

    const {
        currentBranchIdResp: branchId,
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentInstIdResp: instituteId,
        paymentActiveDetailsResp,
        sectionListResp,
        showApiLoader,
        getSpecialFeePaymentListResp,
        masterFeeSettingsErrorResp,
    }: any = useAppSelector(
        ({ instAcademics, appData, globalData, feeCollections, branchAcademics, classroomManagmentInfo, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            showApiLoader: globalData.showApiLoader,
            branchClassResp: branchAcademics.branchClassResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            paymentActiveDetailsResp: feeCollections.paymentActiveDetailsResp,
            getSpecialFeePaymentListResp: masterFeeSettings.getSpecialFeePaymentListResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
        }),
        shallowEqual
    );

    const specialFeePaymentRef = useRef({
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
    });

    useEffect(() => {
        const { prevMasterFeeSettingsErrorResp } = specialFeePaymentRef.current;

        if (masterFeeSettingsErrorResp && prevMasterFeeSettingsErrorResp !== masterFeeSettingsErrorResp) {
            const { details } = masterFeeSettingsErrorResp;
            toast.error(details || "Something went wrong.");
        }
        specialFeePaymentRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [masterFeeSettingsErrorResp]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        specialFeePaymentList({ academicYearId: yearId });
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        specialFeePaymentList(paginationInfo);
    }

    const roleColumns = useMemo(() => generateColumns(), []);

    const toggleAdvanceFilter = () => {
        setOpen(true);
    }

    function closeAdvanceFilterHandler() {
        setOpen(false);
    }

    function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === 'academicYearId') {
            const updatedState = { ...filterState, [name]: value, branchCurriculumId: "", classId: "", sectionId: "" };
            setFilterState(updatedState);
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
                dispatch(resetBrchClassAct(undefined));
                specialFeePaymentList({ [name]: value, classId: null, branchCurriculumId: "" });
            } else {
                dispatch(resetBrchCurriculumAct(undefined));
                dispatch(resetBrchClassAct(undefined));
            }
        } else if (name === "branchCurriculumId") {
            if (!value) {
                setFilterState((prev) => ({ ...prev, [name]: "" }));
                dispatch(resetBrchClassAct(undefined));
            } else {
                setFilterState((prev) => ({ ...prev, [name]: value, classId: "" }));
                specialFeePaymentList({ [name]: value, classId: "" });
                getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
            }
        } else {
            setFilterState((prevState) => ({ ...prevState, [name]: value }));
            specialFeePaymentList({ [name]: value });
        }
        const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange);
        setCount(stateChanged?.count === 0 ? null : stateChanged?.count);
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            pagination.current = { ...pagination.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setFilterState({ ...initialValues, academicYearId })
            specialFeePaymentList({ ...initialValues, academicYearId })
            setShowClearFilterState(false)
            getCurriculumApiCall({ academicYearId })
        }
    }
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { totalElements, totalPages, pageable } = getSpecialFeePaymentListResp || {};


    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Library" pageTitle="Special Fee" />

                    <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                                        Special Fee Payments
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-0">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-4 tw-pt-4">
                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <div className="search-box tw-relative">
                                        <TextInput
                                            name="name"
                                            formgroupClassName="tw-mb-3"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            value={filterState.name}
                                            onChange={filterHandler}
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                                    </div>
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={filterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-3"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <SelectInput
                                        name="branchCurriculumId"
                                        value={filterState.branchCurriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={filterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 lg:tw-col-span-2">
                                    <SelectInput
                                        name="paymentMode"
                                        value={filterState.paymentMode}
                                        onChange={filterHandler}
                                        menuItems={paymentModeOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Payment Mode"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 xl:tw-col-span-2 tw-mb-3 tw-flex tw-items-end tw-justify-end tw-gap-2 tw-flex-wrap">
                                    {showClearFilterState && (
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            variant="wrong"
                                        >
                                            Clear filter
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <TableContainer
                                columns={roleColumns || []}
                                data={getSpecialFeePaymentListResp?.data || []}
                                tableClass="tw-mb-0"
                                divClass="tw-overflow-x-auto tw-mb-4"
                                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                showCheckbox={false}
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageable?.pageNumber || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SpecialFeePayments;