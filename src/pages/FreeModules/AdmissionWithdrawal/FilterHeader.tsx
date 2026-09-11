import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { initialFilterValues } from "./helper";
import { shallowEqual } from "react-redux";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
    resetBrchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { SelectInput, TextInput, OffCanvasContainer } from "../../../Components/Common";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
//Custom Hooks
import { useAppSelector } from "../../../hooks/storehook";
import { debounce } from "../../../utility/commonutility";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import Button from "../../../Components/Common/Button";


const FilterHeader = forwardRef(({ branchId, instituteId, dispatch,
    filterValues, updateFilterHandler }: any, ref) => {
    const [filterState, setFilterState] = useState<any>(filterValues || initialFilterValues);
    const [isAdvanceFilterState, setIsAdvanceFilterState] = useState(false);
    const advanceFilterRef = useRef();
    const { showApiLoader, branchClassResp,
        academicYearListResp,
        brchCurriculumResp } =
        useAppSelector(({ globalData, branchAcademics, feeApprovals,
            instAcademics }) => ({
                showApiLoader: globalData.showApiLoader,
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                instAcademicErrorResp: instAcademics.instAcademicErrorResp,
                brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
            }), shallowEqual);

    React.useImperativeHandle(ref, () => ({
        closeAdvanceFilterHandler
    }));

    useEffect(() => {
        if (branchId && !academicYearListResp) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        } else if (academicYearListResp) {
            const currentAcademicYearIndex = academicYearListResp.data?.findIndex((year: any) => year.yearStatus === "CURRENT");
            const { academicYearId = "" } = academicYearListResp.data?.[currentAcademicYearIndex] || {};
            const { startDate = "" } = academicYearListResp.data?.[currentAcademicYearIndex - 1] || {};
            setFilterState((prevState: any) => ({
                ...prevState, academicYearId,
                startDate: startDate
            }));
            updateFilterHandler({ ...initialFilterValues, academicYearId, startDate });
            getCurriculumApiCall({academicYearId: academicYearId})
        }
    }, [branchId, academicYearListResp]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            const currentAcademicYearIndex: any = academicYearListResp?.data?.findIndex((year: any) => year.yearStatus.toLowerCase() === value);
            const { startDate = "" } = academicYearListResp?.data?.[currentAcademicYearIndex - 1] || {};
            setFilterState((prevState: any) => ({ ...prevState,academicYearId: value,startDate: startDate,curriculumId: "",classId: "" }));
            updateFilterHandler({ ...filterState, academicYearId: value, startDate: startDate, curriculumId: "", classId: "" });
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
            } else {
                dispatch(resetBrchCurriculumAct(undefined));
            }
        } else if (name === "curriculumId") {
            dispatch(setBrchClassAct(undefined));
            if (value) {
                getClassApiCall(value);
            }
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
            updateFilterHandler({ ...filterState, [name]: value, classId: "" });
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
            updateFilterHandler({ ...filterState, [name]: value });
        }
    }
    
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }
      
    function search(value: string) {
        updateFilterHandler({ ...filterState, searchString: value });
    }
    const debounceFun = debounce(search, 400);
    function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        debounceFun(value);
    }

    function getClassApiCall(curriculumId: string) {
        // sortBy: "className", orderBy: "asc"
        const payload = {
            academicYearId: filterState.academicYearId,
            curriculumId, branchId,
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function toggleAdvanceFilter() {
        setIsAdvanceFilterState(prevState => !prevState);
    }

    function closeAdvanceFilterHandler() {
        setIsAdvanceFilterState(false);
    }

    const [advanceFilterCountState, setAdvanceFilterCountState] = useState(0);
    function advanceFilterCallbckHndlr(appliedFilter: any) {
        advanceFilterRef.current = appliedFilter;
        const filterCount = Object.keys(appliedFilter).reduce((total, item) => {
            if (appliedFilter[item] && item!=="startDate") {
                total += 1;
            }
            return total;
        }, 0);
        updateFilterHandler({ ...filterState, ...appliedFilter });
        setAdvanceFilterCountState(filterCount);
    }

    function resetFilterState() {
        advanceFilterRef.current = undefined;
        setAdvanceFilterCountState(0);

        setFilterState((prevState: any) => ({
            ...prevState,
            searchString: "",
            curriculumId: "",
            classId: "",
        }));
        dispatch(setBrchClassAct(undefined));
        updateFilterHandler({
            ...initialFilterValues, academicYearId: filterState?.academicYearId,
            startDate: filterState?.startDate,
            endDate: filterState?.endDate
        });
    }

    const canResetFilter = useMemo(() => {
        const isBasicFilterApplice = Object.keys(filterState).some(item => {
            if (item === "academicYearId" || item === "startDate" || item === "endDate") {
                return false;
            }
            else { return !!filterState[item]; }
        })
        return isBasicFilterApplice || (!isNaN(advanceFilterCountState) && advanceFilterCountState > 0)
    }, [filterState, advanceFilterCountState]);

    return (
        <React.Fragment>
            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-6 lg:tw-col-span-3">
                    <div className="search-box tw-relative">
                        <TextInput
                            name="searchString"
                            value={filterState.searchString}
                            onChange={onSearchHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search"
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>

                <div className="tw-col-span-6 lg:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={filterState.academicYearId}
                        onChange={onChangeFilterHndlr}
                        menuItems={academicYearListResp?.data}
                        formgroupClassName="tw-mb-0"
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-6 lg:tw-col-span-2">
                    <SelectInput
                        name="curriculumId"
                        value={filterState.curriculumId}
                        onChange={onChangeFilterHndlr}
                        menuItems={brchCurriculumResp?.data}
                        formgroupClassName="tw-mb-0"
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-6 lg:tw-col-span-2">
                    <SelectInput
                        name="classId"
                        value={filterState.classId}
                        onChange={onChangeFilterHndlr}
                        menuItems={branchClassResp?.content}
                        formgroupClassName="tw-mb-0"
                        valueKey="id"
                        textKey="shortName"
                        labelText="Class"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-1 tw-relative">
                    <div
                        onClick={toggleAdvanceFilter}
                        className="tw-flex tw-items-center tw-p-2 tw-bg-[#F4F7FA] tw-rounded-md tw-cursor-pointer"
                    >
                        <FilterSvg height="18px" width="18px" />
                        <span className="tw-ml-2">Filters</span>
                    </div>

                    {!isNaN(advanceFilterCountState) && advanceFilterCountState > 0 && (
                        <span className="tw-absolute tw--top-2 tw-left-[78px] tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-px-2 tw-py-0.5">
                            {advanceFilterCountState}
                        </span>
                    )}
                </div>

                {canResetFilter && (
                    <div className="tw-col-auto tw-ml-auto tw-flex">
                        <Button 
                            type="button"
                            onClick={resetFilterState}
                            variant="wrong"
                        >
                            Clear filter
                        </Button >
                    </div>
                )}
            </div>

            <OffCanvasContainer
                isOpen={isAdvanceFilterState}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="admission-withdrawal-advance-filter"
            >
                <AdvanceFilterModal
                    showApiLoader={showApiLoader}
                    getClassApiCall={getClassApiCall}
                    appliedFilter={advanceFilterRef.current}
                    minStartDate={filterState.startDate}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={isAdvanceFilterState}
                />
            </OffCanvasContainer>
        </React.Fragment>

    )

});

FilterHeader.displayName = 'FilterHeader';
export default FilterHeader;