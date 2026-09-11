import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import {  Button, CustomSelect, SelectInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { renderOptionsRoute, renderValueRoute } from './helper';

const initialValues: any = {

    curriculumId: "",
    classId: "",
    routeId : "",
    slabId : "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, showApiLoader,routeRequestListResp,getSlabsListResp }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData ,transportrequest}) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader : globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                routeRequestListResp: transportrequest.routeRequestListResp,
                getSlabsListResp: transportrequest.getSlabsListResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value }))
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
    function resetHandler (){
        setEnquiryFilterState((prev: any) => ({ ...prev, curriculumId: "",  classId: "",admissionType : null,startDate:"",endDate:"", }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, curriculumId: "",  classId: "",admissionType : null,startDate:"",endDate:"", });
    }


    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if(props.appliedFilter.curriculumId){
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    function selectRouteHndlr(selectedOptions: any, config?: any) {
        setEnquiryFilterState((prev:any) => ({ ...prev, routeId: selectedOptions }))
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="curriculumId"
                        value={enquiryFilterState?.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        // inputClassName="bg-light"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Curriculum"
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="classId"
                        value={enquiryFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="className"
                        // inputClassName="bg-light"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Class"
                    />
                </div>
                <div className='tw-mb-3'>
                {/* <SelectInput
                    name="routeId"
                    value={enquiryFilterState.routeId}
                    onChange={filterHandler}
                    menuItems={routeRequestListResp?.data || []}
                    valueKey="id"
                    textKey="routeName"
                    // inputClassName="bg-light border-0"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText='Route Name'
                  /> */}
                  <CustomSelect
                    name="routeId"
                    idKey="id"
                    defaultSelect="Select"
                    labelText='Route Name'
                    value={enquiryFilterState.routeId}
                    renderValue={renderValueRoute}
                    renderOptions={renderOptionsRoute}
                    onChange={selectRouteHndlr}
                    searchKey="routeName"
                    options={routeRequestListResp?.data || []}
                    />
                </div>
                <div className='tw-mb-3'>
                <SelectInput
                    name="slabId"
                    value={enquiryFilterState.slabId}
                    onChange={filterHandler}
                    menuItems={getSlabsListResp || []}
                    valueKey="slabId"
                    textKey="slabName"
                    // inputClassName="bg-light border-0"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText='Slab Name'
                  />
                </div>
               
               
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="hstack tw-gap-2 tw-justify-end">
                {/* <button
                        type="button"
                        className="btn btn-light"
                        onClick={resetHandler}
                    >
                        Reset
                    </button> */}
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
        </>
    )
}

export default AdvanceFilterModal
