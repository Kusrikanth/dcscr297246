import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../utility/reduxutility';
import { SelectInput } from '../../Components/Common';
import { useAppSelector } from '../../hooks/storehook';
import { setSectionListAct } from '../../store/academic/classroomManagment/classroommanagmentslice';
import { getSectionList } from '../../store/academic/classroomManagment/classroommanagmentactions';
import Button from '../../Components/Common/Button';

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    // isStopService : "",
    curriculumId: "",
    classId: "",
    routeId: "",
    slabId: "",
    sectionId: "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, showApiLoader, routeRequestListResp, getSlabsListResp, sectionListResp } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections, globalData, transportrequest }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                brchSectionByClassResp: branchAcademics.brchSectionByClassResp,
                showApiLoader: globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                sectionListResp: classroomManagmentInfo.sectionListResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                routeRequestListResp: transportrequest.routeRequestListResp,
                getSlabsListResp: transportrequest.getSlabsListResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", academicYearId: enquiryFilterState.academicYearId, orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            } else {
                dispatch(resetClassListForAdvanceFilterAct(undefined))
                dispatch(setSectionListAct(undefined))
            }
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
        }
        else if (name === 'classId') {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
            getSectionListResp({ branchClassId: value })
            if (!value) {
                dispatch(setSectionListAct(undefined))
            }
        } else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: enquiryFilterState.classId || null, masterAcademicYearId: enquiryFilterState.academicYearId, curriculumId: enquiryFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    function applyFilterHndlr() {
        props.toggleAdvanceFilter();
        props.applyFilterCallback(enquiryFilterState);
    }
    function resetHandler() {
        setEnquiryFilterState((prev: any) => ({ ...prev, curriculumId: "", classId: "", sectionId: "", admissionType: null, startDate: "", endDate: "", }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, curriculumId: "", classId: "", sectionId: "", admissionType: null, startDate: "", endDate: "", });
    }


    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter.curriculumId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", academicYearId: props.appliedFilter.academicYearId, orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="tw-p-4 tw-space-y-4 offcanvas-body">

                <SelectInput
                    name="curriculumId"
                    value={enquiryFilterState?.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Curriculum"
                />

                <SelectInput
                    name="classId"
                    value={enquiryFilterState?.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Class"
                />

                <SelectInput
                    name="sectionId"
                    value={enquiryFilterState.sectionId}
                    onChange={filterHandler}
                    menuItems={sectionListResp?.data}
                    valueKey="sectionId"
                    textKey="sectionName"
                    labelText="Section"
                    formgroupClassName="tw-mb-0"
                />

                <SelectInput
                    name="routeId"
                    value={enquiryFilterState.routeId}
                    onChange={filterHandler}
                    menuItems={routeRequestListResp?.data || []}
                    valueKey="id"
                    textKey="routeName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Route Name"
                />

                <SelectInput
                    name="slabId"
                    value={enquiryFilterState.slabId}
                    onChange={filterHandler}
                    menuItems={getSlabsListResp || []}
                    valueKey="slabId"
                    textKey="slabName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="Slab Name"
                />

            </div>

            <div className="tw-border-t tw-p-3 tw-flex tw-justify-end">

                <Button
                    type="submit"
                    onClick={applyFilterHndlr}
                    disabled={showApiLoader}
                    variant='primary'
                >
                    Submit
                </Button>

            </div>
        </>
    )
}

export default AdvanceFilterModal
