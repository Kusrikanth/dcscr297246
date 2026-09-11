
import { useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumns, } from "./helper";
import { toast } from "react-toastify";
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSpecialFeeCategoryListAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

const initialValues = {
    name: "",
};

const SpecialFeeCategory = () => {

    const dispatch = useDispatch();

    const [filterState, setFilterState] = useState(initialValues);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const specialFeeCategoryList = (otherProps?: any) => {

        let payload = {
            branchId,
            ...filterState,
            ...otherProps,
        };
        dispatch(getSpecialFeeCategoryListAct(generateActionPayload("get_special_fee_category_list", undefined, payload)));
    };

    const {
        currentBranchIdResp: branchId,
        academicYearListResp,
        showApiLoader,
        getSpecialFeeCategoryListResp,
        masterFeeSettingsErrorResp,
    } = useAppSelector(
        ({ instAcademics, appData, globalData, feeCollections, branchAcademics, classroomManagmentInfo, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getSpecialFeeCategoryListResp: masterFeeSettings.getSpecialFeeCategoryListResp,
            masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
        }),
        shallowEqual
    );

    const specialFeeCategoryRef = useRef({
        prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
    });

    useEffect(() => {
        const { prevMasterFeeSettingsErrorResp } = specialFeeCategoryRef.current;

        if (masterFeeSettingsErrorResp && prevMasterFeeSettingsErrorResp !== masterFeeSettingsErrorResp) {
            const { details } = masterFeeSettingsErrorResp;
            toast.error(details || "Something went wrong.");
        }
        specialFeeCategoryRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
    }, [masterFeeSettingsErrorResp]);

    useEffect(() => {
        if (branchId) {
            const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        }
    }, [branchId]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        specialFeeCategoryList();
    }, [academicYearListResp]);


    const roleColumns = useMemo(() => generateColumns(), []);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        specialFeeCategoryList({ [name]: value })
    }

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
                                        Special Fee Category
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
                                            value={filterState.name}
                                            onChange={filterHandler}
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <TableContainer
                                columns={roleColumns || []}
                                data={Array.isArray(getSpecialFeeCategoryListResp) ? getSpecialFeeCategoryListResp : []}
                                tableClass="tw-mb-0"
                                divClass="tw-overflow-x-auto tw-mb-4"
                                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                showCheckbox={false}
                                showPagination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SpecialFeeCategory;