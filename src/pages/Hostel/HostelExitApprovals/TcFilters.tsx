import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { SelectInput, TextInput } from "../../../Components/Common";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
//Custom Hooks
import { useAppSelector } from "../../../hooks/storehook";
import { debounce } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

export const initialFilterValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
}

export function checkFitlersApplied(appliedFilters: any) {
    return Object.keys(appliedFilters).some(item => {
        if (item === "academicYearId") {
            return false;
        }
        return !!appliedFilters[item];
    });
}

export default function TcFilters({ branchId, instituteId, dispatch,
    filterValues, updateFilterHandler, children }: any) {
    const [filterState, setFilterState] = useState(filterValues || initialFilterValues);
    const { showApiLoader, branchClassResp,
        academicYearListResp,
        brchCurriculumResp } =
        useAppSelector(({ globalData, branchAcademics,
            instAcademics }) => ({
                showApiLoader: globalData.showApiLoader,
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                instAcademicErrorResp: instAcademics.instAcademicErrorResp,
                brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
            }), shallowEqual);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }
    
      function getClassApiCall(curriculumId: string) {
        const payload = {
          curriculumId, branchId,academicYearId : filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }

    // useEffect(() => {
    //     if (branchId && !brchCurriculumResp) {
    //         const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    //         dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
    //     }
    // }, [branchId, brchCurriculumResp]);

    useEffect(() => {
        if (instituteId && !academicYearListResp) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId, academicYearListResp]);

    useEffect(() => {
        if (academicYearListResp && !filterState.academicYearId) {
            const currentAcademicYearIndex = academicYearListResp.data?.findIndex((year: any) => year?.yearStatus?.toLowerCase() === "current");
            const { academicYearId = "" } = academicYearListResp.data?.[currentAcademicYearIndex] || {};
            
            getCurriculumApiCall({ academicYearId });
            setFilterState((prevState: any) => ({
                ...prevState, academicYearId, 
            }));
            filterValues = { ...filterValues, academicYearId };
            updateFilterHandler({ ...initialFilterValues, academicYearId, });
        }
    }, [academicYearListResp, filterState.academicYearId]);

    useEffect(() => {
      if(brchCurriculumResp && academicYearListResp){
        const { branchCurriculumId } = brchCurriculumResp.data?.find((item: any) => item?.curriculumName === "CBSE") || {};
        setFilterState((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
        getClassApiCall(branchCurriculumId);
        filterValues = { ...filterValues, curriculumId : branchCurriculumId };
        updateFilterHandler({ ...filterValues, curriculumId: branchCurriculumId });
      }
    }, [brchCurriculumResp])
    

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            setFilterState((prevState: any) => ({
                ...prevState, academicYearId: value, curriculumId: "", classId: "", }));
            updateFilterHandler({
                ...filterState,
                academicYearId: value,
                curriculumId: "",
                classId: "",
            });
            if (value) {
                const brchCurriculumparams = {
                    branchId,
                    academicYearId: value,
                    pageNo: 0,
                    pageSize: 100,
                    sortBy: "curriculumName",
                    orderBy: "asc",
                };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            }
        } else if (name === "curriculumId") {
            setFilterState((prevState: any) => ({
                ...prevState,
                curriculumId: value,
                classId: "",
            }));
            updateFilterHandler({
                ...filterState,
                curriculumId: value,
                classId: "",
            });
            if (value) {
                getClassApiCall(value);
            } else {
                dispatch(setBrchClassAct(undefined));
            }
        } else {
            setFilterState((prevState: any) => ({
                ...prevState,
                [name]: value,
            }));
            updateFilterHandler({
                ...filterState,
                [name]: value,
            });
        }
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

    function clearFilterHandler() {
        const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};
        const resetFilterState = { ...initialFilterValues, academicYearId };
        setFilterState(resetFilterState);
        updateFilterHandler(resetFilterState, true);
        getCurriculumApiCall({ academicYearId });
    }

    return (
        <React.Fragment>
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pb-3">
                <div className="tw-col-span-6 lg:tw-col-span-3">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            value={filterState.searchString}
                            onChange={onSearchHandler}
                            formgroupClassName="tw-mb-0"
                            labelText="Search"
                            placeHolder="Search"
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

                <div className="tw-col-span-auto tw-ml-auto tw-flex">
                    {checkFitlersApplied(filterState) && (
                        <Button
                            type="button"
                            onClick={clearFilterHandler}
                            // className="tw-text-red-600 tw-border tw-border-red-200 tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-red-50"
                            variant="wrong"
                        >
                            Clear filter
                        </Button>
                    )}
                </div>

                {children}
            </div>
        </React.Fragment>
    )
}
