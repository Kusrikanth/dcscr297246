import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { CustomSelect, SelectInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { renderOptionsRoute, renderValueRoute } from './helper';
import Button from '../../../../Components/Common/Button';

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    routeId: "",
    slabId: "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, showApiLoader, routeRequestListResp, getSlabsListResp, feeTermByTypeResp } =
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
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                routeRequestListResp: transportrequest.routeRequestListResp,
                getSlabsListResp: transportrequest.getSlabsListResp,
                feeTermByTypeResp: feeReport.feeTermByTypeResp,
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }
    function applyFilterHndlr() {
        props.toggleAdvanceFilter();
        props.applyFilterCallback(enquiryFilterState);
    }
    function resetHandler() {
        setEnquiryFilterState((prev: any) => ({ ...prev, curriculumId: "", classId: "", admissionType: null, startDate: "", endDate: "", }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, curriculumId: "", classId: "", admissionType: null, startDate: "", endDate: "", });
    }


    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter.curriculumId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    function selectRouteHndlr(selectedOptions: any, config?: any) {
        setEnquiryFilterState((prev: any) => ({ ...prev, routeId: selectedOptions }))
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body tw-p-4">

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
                        options={routeRequestListResp?.data || []}
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="slabId"
                        value={enquiryFilterState.slabId}
                        onChange={filterHandler}
                        menuItems={getSlabsListResp || []}
                        valueKey="slabId"
                        textKey="slabName"
                        formgroupClassName="mb-0"
                        defaultSelect="Select"
                        labelText="Slab Name"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-3">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    {/* 
    <button
      type="button"
      onClick={resetHandler}
      className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-gray-100 hover:tw-bg-gray-200"
    >
      Reset
    </button>
    */}

                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
