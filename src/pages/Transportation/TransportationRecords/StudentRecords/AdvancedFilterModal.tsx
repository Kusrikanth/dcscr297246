import React, { useEffect, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { CustomSelect, SelectInput } from '../../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { renderOptionsRoute, renderValueRoute, studentStatusOption, terminationStatusOption } from './helper';
import { getSectionList, setSectionListAct } from '../../../../store/academic/classroomManagment/classroommanagmentactions';
import Button from '../../../../Components/Common/Button';

const initialValues = {

    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId : "",
    routeId: "",
    slabId: "",
    termIds: "",
    studentStatus:"",
    terminationStatus:"",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useAppDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, showApiLoader, routeRequestListResp, getSlabsListResp, sectionListResp } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections, globalData, transportrequest, feeReport }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                sectionListResp: classroomManagmentInfo.sectionListResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                routeRequestListResp: transportrequest.routeRequestListResp,
                getSlabsListResp: transportrequest.getSlabsListResp,
                feeTermByTypeResp: feeReport.feeTermByTypeResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: enquiryFilterState.academicYearId })
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

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter.curriculumId) {
                getClassApiCall({ curriculumId: props.appliedFilter.curriculumId, academicYearId: props.appliedFilter.academicYearId });
            }

        }
    }, [props.isOpen])

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId, academicYearId : props.appliedFilter.academicYearId, ...otherProps };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    function selectRouteHndlr(selectedOptions: any, config?: any) {
        setEnquiryFilterState((prev: any) => ({ ...prev, routeId: selectedOptions }))
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">
                <div className="tw-mb-3">
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
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="classId"
                        value={enquiryFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="className"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Class"
                    />
                </div>

                <div className="tw-mb-3">
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
                </div>

                <div className="tw-mb-3">
                    <CustomSelect
                        name="routeId"
                        idKey="id"
                        defaultSelect="Select"
                        labelText="Route Name"
                        value={enquiryFilterState.routeId}
                        renderValue={renderValueRoute}
                        renderOptions={renderOptionsRoute}
                        onChange={selectRouteHndlr}
                        searchKey="routeName"
                        options={routeRequestListResp?.data}
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="slabId"
                        value={enquiryFilterState.slabId}
                        onChange={filterHandler}
                        menuItems={getSlabsListResp}
                        valueKey="slabId"
                        textKey="slabName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Slab Name"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="studentStatus"
                        value={enquiryFilterState.studentStatus}
                        onChange={filterHandler}
                        menuItems={studentStatusOption}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Student Status"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="terminationStatus"
                        value={enquiryFilterState.terminationStatus}
                        onChange={filterHandler}
                        menuItems={terminationStatusOption}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Termination Status"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        variant='primary'
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
