import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { SelectInput } from '../../../Components/Common';
import { AdmissionTypeMenuOptions, studentTypeMenuOptions } from './helper';
import { IAdvanceFilterState } from './types';
import { getBranchClassAct, setBrchClassAct, getBrchSectionByClassAct, setBrchSectionsAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';


interface IAdvanceModalProps {
    branchId: string | undefined,
    academicYearId: string | undefined,
    appliedFilter: IAdvanceFilterState;
    applyFilterCallback: (filters: any) => void;
    toggleAdvanceFilter: () => void;
    isOpen: boolean
}

export const initialValues = {
    curriculumId: "",
    classId: "",
    admissionType: "",
    studentType: "",
    sectionId: "",
    sectionAllocation: "",
    startDate: "",
    endDate: ""
};

const AdvanceFilterModal: React.FC<IAdvanceModalProps> = (props) => {
    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState(props.appliedFilter || initialValues);

    const { brchSectionByClassResp, brchCurriculumResp, branchClassResp, showApiLoader }: any =
        useAppSelector(
            ({ branchAcademics, classroomManagmentInfo, globalData }) => ({
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                brchSectionByClassResp: branchAcademics.brchSectionByClassResp,
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === "curriculumId") {
            dispatch(setBrchClassAct(undefined));
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, academicYearId: props.academicYearId, branchId: props.branchId };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, classId: '', sectionId: '' }))
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: '' }))
        } else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const getSectionListResp = (otherProps?: any) => {
        let payload = { branchClassId: enquiryFilterState.classId || null, masterAcademicYearId: props.academicYearId, curriculumId: enquiryFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        dispatch(setBrchSectionsAct(undefined));
        dispatch(getBrchSectionByClassAct(generateActionPayload("get_section_list", undefined, payload)));
    }
    function applyFilterHndlr() {
        props.toggleAdvanceFilter();
        props.applyFilterCallback(enquiryFilterState);
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            setEnquiryFilterState((prev: any) => ({ ...prev, startDate, endDate }));
        }
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
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
                        formgroupClassName="tw-mb-0"
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
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="sectionId"
                        value={enquiryFilterState.sectionId}
                        onChange={filterHandler}
                        menuItems={brchSectionByClassResp?.data || []}
                        valueKey="sectionId"
                        textKey="sectionName"
                        labelText='Section'
                        formgroupClassName="tw-mb-0"
                    />
                </div>
                <div className='tw-mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.startDate}
                        endDate={enquiryFilterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText='Date Range'
                        portalId={"student-mangement-advance-filter"}
                        placement='bottom-end'
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="admissionType"
                        value={enquiryFilterState?.admissionType}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        labelText='Admission Type'
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="studentType"
                        value={enquiryFilterState.studentType}
                        onChange={filterHandler}
                        menuItems={studentTypeMenuOptions}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        labelText='Student Type'
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="sectionAllocation"
                        value={enquiryFilterState.sectionAllocation}
                        onChange={filterHandler}
                        menuItems={[{ id: true, value: "YES" }, { id: false, value: "NO" }]}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        labelText='Section Allocated'
                    />
                </div>


            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="hstack gap-2 justify-content-end">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggleAdvanceFilter}
                    >
                        Close
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
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
