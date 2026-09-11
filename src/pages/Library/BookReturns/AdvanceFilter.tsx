import React, { useEffect, useState } from 'react'
import { DateInput, SelectInput } from '../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getSectionList, setSectionListAct } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionactions';
import Button from '../../../Components/Common/Button';

const initialValues = {
    curriculumId: "",
    classId: "",
    sectionId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        brchCurriculumResp,
        classListForAdvanceFilter,
        sectionListResp,
    } = useAppSelector(
        ({ appData, branchAcademics, classroomManagmentInfo, feeCollections }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            sectionListResp: classroomManagmentInfo.sectionListResp,
        }),
        shallowEqual
    );
    
    const getSectionListResp = (otherProps?: any) => {
        let payload = { branchClassId: advanceFilterState.classId || null, masterAcademicYearId: advanceFilterState.academicYearId, curriculumId: advanceFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId, academicYearId : props.appliedFilter.academicYearId, ...otherProps };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
               getClassApiCall({ curriculumId: value, academicYearId: advanceFilterState.academicYearId })
            } else {
                dispatch(resetClassListForAdvanceFilterAct(undefined))
                dispatch(setSectionListAct(undefined))
            }
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
        }
        else if (name === 'classId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
            getSectionListResp({ branchClassId: value })
            if (!value) {
                dispatch(setSectionListAct(undefined))
            }
        } else {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};

    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="curriculumId"
                        value={advanceFilterState?.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Curriculum"
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="classId"
                        value={advanceFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Class"
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="sectionId"
                        value={advanceFilterState.sectionId}
                        onChange={filterHandler}
                        menuItems={sectionListResp?.data}
                        valueKey="sectionId"
                        textKey="sectionName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Section"
                        labelText='Section'
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={applyFilterHndlr}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AdvanceFilterModal;