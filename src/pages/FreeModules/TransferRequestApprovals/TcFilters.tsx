import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
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

export const initialFilterValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
}


export default function TcFilters({ branchId, instituteId, dispatch,
    filterValues, updateFilterHandler, children }: any) {
    const [filterState, setFilterState] = useState(filterValues || initialFilterValues);
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

    const tcFiltersRef = useRef<any>({
        prevAcademicYearListResp: undefined,
        prevBrchCurriculumResp: brchCurriculumResp
    })

    // useEffect(() => {
    //     if (branchId && !brchCurriculumResp) {
    //         const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    //         dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
    //     }
    // }, [branchId, brchCurriculumResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        if (instituteId && !academicYearListResp) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId, academicYearListResp]);

    useEffect(() => {
        if (academicYearListResp) {
            const currentAcademicYearIndex = academicYearListResp.data?.findIndex((year: any) => year?.yearStatus?.toLowerCase() === "current");
            const { academicYearId = "" } = academicYearListResp.data?.[currentAcademicYearIndex] || {};
            const updatedFilter = { ...filterState, academicYearId };
            setFilterState(updatedFilter);
            updateFilterHandler(updatedFilter);
            getCurriculumApiCall({ academicYearId });
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const { branchCurriculumId } = brchCurriculumResp.data?.find((item: any) => item?.curriculumName === "CBSE") || {};
            setFilterState((prev: any) => {
                const updatedFilter = { ...prev, curriculumId: branchCurriculumId };
                updateFilterHandler(updatedFilter);
                return updatedFilter;
            });
            getClassApiCall(branchCurriculumId);
        }
    }, [brchCurriculumResp]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            setFilterState((prevState: any) => ({
                ...prevState,
                academicYearId: value,
                curriculumId: "",
                classId: "",
            }));
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
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
            updateFilterHandler({ ...filterState, [name]: value });
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

    function getClassApiCall(curriculumId: string) {
        // sortBy: "className", orderBy: "asc"
        const payload = {
            academicYearId: filterState.academicYearId,
            curriculumId, branchId,
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    return (
        <React.Fragment>
            <div className="row g-3 px-3 pb-3">
                <div className="col-6 col-lg-3">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            value={filterState.searchString}
                            onChange={onSearchHandler}
                            formgroupClassName="mb-0"
                            placeHolder="Search..."
                            floatingLabel
                            labelText="Search"
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>

                <div className="col-6 col-lg-2">
                    <SelectInput
                        name="academicYearId"
                        value={filterState.academicYearId}
                        onChange={onChangeFilterHndlr}
                        menuItems={academicYearListResp?.data}
                        formgroupClassName="mb-0"
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                <div className="col-6 col-lg-2">
                    <SelectInput
                        name="curriculumId"
                        value={filterState.curriculumId}
                        onChange={onChangeFilterHndlr}
                        menuItems={brchCurriculumResp?.data}
                        formgroupClassName="mb-0"
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

                <div className="col-6 col-lg-2">
                    <SelectInput
                        name="classId"
                        value={filterState.classId}
                        onChange={onChangeFilterHndlr}
                        menuItems={branchClassResp?.content}
                        formgroupClassName="mb-0"
                        valueKey="id"
                        textKey="shortName"
                        labelText="Class"
                        floatingLabel
                    />
                </div>
                {children}
            </div>
        </React.Fragment>
    )
}
