import  { useState } from 'react'
import {  SelectInput, } from '../../../../../Components/Common';
import { useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { statusMenuOptions } from './helper';

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    status: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] =
        useState(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader } =
        useAppSelector(
            ({ appData, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const filterHandler = (event : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    }
    function applyFilterHndlr() {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter()
    }

    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                    <SelectInput
                        name="status"
                        value={advanceFilterState.status}
                        onChange={filterHandler}
                        menuItems={statusMenuOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText='Issue Status'
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="hstack tw-gap-2 tw-justify-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
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
