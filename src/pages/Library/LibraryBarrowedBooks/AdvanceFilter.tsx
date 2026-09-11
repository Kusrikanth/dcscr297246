import React, { useEffect, useState } from 'react'
import { DateInput, SelectInput } from '../../../Components/Common';
import { issueStatusMenu } from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getSectionList, setSectionListAct } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import Button from '../../../Components/Common/Button';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';

const initialValues = {
    searchString: "",
    academicYearId: "",
    libraryId: "",
    issueStatus: "",
    recordTypeId: "",
    sectionId: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();
    const { menuId, isBorrowedBooks } = props;

    const {
        currentBranchIdResp: branchId,
        classListForAdvanceFilter,
        brchCurriculumResp,
        sectionListResp,
        libraryRecordRequestListResp
    } = useAppSelector(
        ({ appData, branchAcademics, classroomManagmentInfo, feeCollections, librarysettings }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
        }),
        shallowEqual
    );

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setAdvanceFilterState((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };
    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            setAdvanceFilterState((prev: any) => ({
                ...prev,
                fromDate: startDate,
                toDate: endDate
            }));
        }
    };
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: recordList } = libraryRecordRequestListResp || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    const { data: sectionTypes } = sectionListResp || [];

    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="issueStatus"
                        value={advanceFilterState.issueStatus}
                        onChange={filterHandler}
                        menuItems={issueStatusMenu}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText='Issue Status'
                    />
                </div>
                <div className='tw-mb-3'>
                    <SelectInput
                        name="recordTypeId"
                        value={advanceFilterState.recordTypeId}
                        onChange={filterHandler}
                        menuItems={recordList}
                        valueKey="id"
                        textKey="recordType"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText='Record Type'
                    />
                </div>
                {menuId === "STUDENT" && (
                    <>
                        <div className='tw-mb-3'>
                            <SelectInput
                                name="sectionId"
                                value={advanceFilterState.sectionId}
                                onChange={filterHandler}
                                menuItems={sectionTypes}
                                valueKey="sectionId"
                                textKey="sectionName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Section"
                                labelText='Section'
                            />
                        </div>
                    </>
                )}
                <div className='tw-mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={advanceFilterState.fromDate}
                        endDate={advanceFilterState.toDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId="advance-highest-borrowed-books"
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
