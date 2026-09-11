import React, { useEffect, useState } from 'react'
import { DateInput, SelectInput } from '../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getSectionList, setSectionListAct } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';
const initialValues = {
    curriculumId: "",
    classId: "",
    sectionId: "",
    fromDate: "",
    toDate: "",
};
const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();
    const { menuId } = props;

    const {
        currentBranchIdResp: branchId,
        brchCurriculumResp,
        branchClassResp,
        sectionListResp,
    } = useAppSelector(
        ({ appData, branchAcademics, classroomManagmentInfo, }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
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

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === 'classId') {
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

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setAdvanceFilterState((prev:any) => ({ ...prev, fromDate:startDate,toDate:endDate }));
        }
    }
    
    const { content: classTypes } = branchClassResp || {};
    const { data: sectionTypes } = sectionListResp || [];

    return (
        <>
            <div className="offcanvas-body">
                {menuId === "STUDENT" && (
                    <>
                        <div className="tw-mb-3">
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

                        <div className="tw-mb-3">
                            <SelectInput
                                name="sectionId"
                                value={advanceFilterState.sectionId}
                                onChange={filterHandler}
                                menuItems={sectionTypes}
                                valueKey="sectionId"
                                textKey="sectionName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Section"
                                labelText="Section"
                            />
                        </div>
                    </>
                )}

                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={advanceFilterState.fromDate}
                        endDate={advanceFilterState.toDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId="health-records-advance-filter"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
};
export default AdvanceFilterModal;