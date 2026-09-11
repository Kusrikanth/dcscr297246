import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getSectionList, setSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getBranchClassAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getFeeNameByTypeAct, setFeeNameByTypeAct } from "../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { feeTypes, initialAdvncFilterState } from "./helper";
import Button from "../../../../Components/Common/Button";

interface IFilterState {
    curriculumId: string,
    classId: string,
    sectionId: string,
    feeType: string,
    feeName: string
}

export default function AdvanceFilter({ isOpen, branchId, academicYearId, curriculumId,
    appliedFilters, dispatch, applyFilterCallback, toggleModal }: any) {
    const [filterState, setFilterState] = useState<IFilterState>(() => ({
        ...initialAdvncFilterState,
        ...appliedFilters,
        curriculumId: curriculumId || "",
    }));

    const {
        brchCurriculumResp, branchClassResp, sectionListResp, feeNameByTypeResp, showApiLoader
    }: any = useAppSelector(
        ({ globalData, classroomManagmentInfo, branchAcademics, feeReport }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            feeNameByTypeResp: feeReport.feeNameByTypeResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (isOpen && curriculumId) {
            getClassApiCall(curriculumId);
        }
    }, [isOpen, curriculumId]);
    useEffect(() => {
        const { classId, feeType } = appliedFilters || {};
        if (isOpen && classId) {
            getSectionsApiCall(classId);
        }
        if (isOpen && feeType) {
            getFeenameApiCall(feeType);
        }
    }, [isOpen, appliedFilters]);

    useEffect(() => {
        return () => {
            dispatch(setBrchClassAct(undefined));
            dispatch(setSectionListAct(undefined));
            dispatch(setFeeNameByTypeAct(undefined));
        }
    }, []);

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function getFeenameApiCall(feeType: string) {
        dispatch(getFeeNameByTypeAct(generateActionPayload("get_feename_byfeetype", undefined, { branchId, feeType, academicYearId })));
    }

    const getSectionsApiCall = (branchClassId?: any) => {
        let payload = {
            branchClassId,
            masterAcademicYearId: academicYearId,
            curriculumId: curriculumId,
            pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc"
        }
        dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
    }

    function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
    }

    function onChangeClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value, sectionId: "" }));
        dispatch(setSectionListAct(undefined));
        if (value) {
            getSectionsApiCall(value);
        }
    }

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value, classId: "", sectionId: "" }));
        dispatch(setBrchClassAct(undefined));
        dispatch(setSectionListAct(undefined));
        if (value) {
            getClassApiCall(value);
        }
    }

    function onChangeFeeTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value, feeName: "" }));
        dispatch(setFeeNameByTypeAct(undefined));
        if (value) {
            getFeenameApiCall(value);
        }
    }

    function applyFilterHndlr() {
        applyFilterCallback(filterState);
    }

    const feeNameOptions = useMemo(() => {
        if (Array.isArray(feeNameByTypeResp)) {
            return feeNameByTypeResp.map(item => ({ name: item }));
        }
        return [];
    }, [feeNameByTypeResp]);

    return (
        <React.Fragment>
            <div className="offcanvas-body">
                <SelectInput
                    name="curriculumId"
                    value={filterState?.curriculumId}
                    onChange={onChangeCurriculumHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                />
                <SelectInput
                    name="classId"
                    value={filterState?.classId}
                    onChange={onChangeClassHndlr}
                    menuItems={branchClassResp?.content}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                />
                <SelectInput
                    name="sectionId"
                    value={filterState?.sectionId}
                    onChange={filterHandler}
                    menuItems={sectionListResp?.data}
                    valueKey="sectionId"
                    textKey="sectionName"
                    labelText="Section"
                />
                <SelectInput
                    name="feeType"
                    value={filterState?.feeType}
                    onChange={onChangeFeeTypeHndlr}
                    menuItems={feeTypes}
                    valueKey="id"
                    textKey="name"
                    labelText="Fee Type"
                />
                <SelectInput
                    name="feeName"
                    value={filterState?.feeName}
                    onChange={filterHandler}
                    menuItems={feeNameOptions}
                    valueKey="name"
                    textKey="name"
                    labelText="Fee Name"
                />
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={toggleModal}
                        disabled={showApiLoader}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>

        </React.Fragment>
    )
}