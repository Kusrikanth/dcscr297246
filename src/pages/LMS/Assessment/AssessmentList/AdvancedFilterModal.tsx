import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CustomSelect, SelectInput, TextInput } from '../../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getAssignedClassSubjectsList } from '../../../../store/academic/classSubjects/classsubjectsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { assessmentTypes, renderOptionsEmployee, renderValueSection, statusTypes } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import { getEmployeeByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';

const initialValues = {
    subjectId: "",
    assessmentStatus: "",
    startDate: null,
    endDate: null,
    assesmentType:"",
    createdBy:"",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const location = useLocation();
    const {
        getAllAssessmentsResp,
        assignedClassSubjectsListResp,
        getEmployeesByFilterResp
    } = useAppSelector(
        ({ lmsAssessment, classSubjectsInfo,directoryEmployee }) => ({
            getAllAssessmentsResp: lmsAssessment.getAllAssessmentsResp,
            assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
        }),
        shallowEqual
    );

    const dispatch = useAppDispatch();

    const classSubjectListApicall = (otherProps?: any) => {
        const payload = { academicYearId: advanceFilterState.academicYearId, curriculumId: advanceFilterState.curriculumId, branchClassId: advanceFilterState.classId, ...otherProps, pageNo: 0, pageSize: 100, };
        if (payload.academicYearId && payload.branchClassId) {
            dispatch(
                getAssignedClassSubjectsList(
                    generateActionPayload("get_assigned_class_subject_list", undefined, payload)
                )
            );
        }
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            setAdvanceFilterState((prev: any) => ({ ...prev, startDate, endDate }));
        }
    }

    useEffect(() => {
        classSubjectListApicall();
    }, []);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };

    function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        const selectedContactPerson = getEmployeesByFilterResp.find((item: { userId: number }) => +item.userId === +selectedOptions);
        if (selectedContactPerson) {
            setAdvanceFilterState((prevState) => ({
                ...prevState, contactPerson: selectedContactPerson.employeeName, [name]: selectedOptions
            }))
        }
        else {
            setAdvanceFilterState((prevState) => ({ ...prevState, [name]: selectedOptions }))
        }
    }

    function onSearchMultiSelectHandleremployee(name: any, value: string) {
            if (value) {
                const params = { searchString: value };
                dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
            }
        }

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <SelectInput
                        name="subjectId"
                        labelText="Subject"
                        value={advanceFilterState.subjectId}
                        onChange={filterHandler}
                        menuItems={assignedClassSubjectsListResp?.data}
                        valueKey="subjectId"
                        textKey="subjectName"
                        defaultSelect="Select"
                        formgroupClassName='mb-3'
                        inputClassName=""
                    />
                </div>
                <div className="mb-3">
                    <SelectInput
                        name="assesmentType"
                        value={advanceFilterState?.assesmentType}
                        onChange={filterHandler}
                        menuItems={assessmentTypes}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="mb-3"
                        defaultSelect="Select"
                        labelText='Assesment Type'
                    />
                </div>
                <div className="mb-3">
                            <CustomSelect
                                name="createdBy"
                                idKey="userId"
                                defaultSelect="Select"
                                value={advanceFilterState.createdBy}
                                renderValue={renderValueSection}
                                renderOptions={renderOptionsEmployee}
                                onChange={selectSectionHndlr}
                                onSearchHandler={onSearchMultiSelectHandleremployee}
                                labelText='Created By'
                                containerClassName="mb-3"
                                labelClass='fs-12'
                                options={getEmployeesByFilterResp}
                            />
                </div>
                <div className="mb-3">
                    <SelectInput
                        name="assessmentStatus"
                        value={advanceFilterState?.assessmentStatus}
                        onChange={filterHandler}
                        menuItems={statusTypes}
                        valueKey="statusName"
                        textKey="statusType"
                        formgroupClassName="mb-3"
                        defaultSelect="Select"
                        labelText='Status'
                    />
                </div>
                <div className='mb-3'>
                     <CustomDatePicker
                        name="dateRange"
                        startDate={advanceFilterState.startDate}
                        endDate={advanceFilterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="mb-0"
                        labelText='Date Range'
                        portalId={"assessment-list-advance-filter"}
                        placement='bottom-end'
                    />
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
