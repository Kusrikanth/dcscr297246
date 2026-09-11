import { useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { SelectInput } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { getClassListAdvanceFilter } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { eligibleOptions } from './helper';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    startDate: "",
    endDate: "",
    isAdmissionEligible : "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] = useState(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,} =
        useAppSelector(
            ({ appData, }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
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
        props.applyFilterCallback(enquiryFilterState);
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    } 

    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="isAdmissionEligible"
                        value={enquiryFilterState.isAdmissionEligible}
                        onChange={filterHandler}
                        menuItems={eligibleOptions}
                        valueKey="key"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Eligibility Status"
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
                        portalId={"enquiry-advance-filter"}
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
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
