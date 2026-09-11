import React, { useState } from 'react'
import { SelectInput, } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { applicableToOptions } from './helper';
import Button from '../../../Components/Common/Button';

const initialValues = {
    name: "",
    academicYearId: "",
    branchCurriculumId: "",
    categoryId: "",
    feeTypeId: "",
    applicableTo: "",
    isActive : null,
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] =
        useState(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader, getSpecialFeeCategoryListResp,feeTypesResp, } =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData, librarysettings, masterFeeSettings }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                getSpecialFeeCategoryListResp: masterFeeSettings.getSpecialFeeCategoryListResp,
                feeTypesResp: masterFeeSettings.feeTypesResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    }
    function applyFilterHndlr() {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter()
    }

    return (
        <>
            <div className="tw-p-4 offcanvas-body">
                <div className="tw-mb-3">
                    <SelectInput
                        name="categoryId"
                        value={advanceFilterState.categoryId}
                        onChange={filterHandler}
                        menuItems={
                            Array.isArray(getSpecialFeeCategoryListResp)
                                ? getSpecialFeeCategoryListResp
                                : []
                        }
                        formgroupClassName="tw-mb-0"
                        valueKey="id"
                        textKey="categoryName"
                        defaultSelect="Select"
                        labelText="Category"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="feeTypeId"
                        labelText="Fee Type"
                        value={advanceFilterState.feeTypeId}
                        onChange={filterHandler}
                        menuItems={feeTypesResp}
                        valueKey="feeTypeId"
                        textKey="feeTypeName"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="applicableTo"
                        value={advanceFilterState.applicableTo}
                        onChange={filterHandler}
                        menuItems={applicableToOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText="Applicable To"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="isActive"
                        value={advanceFilterState.isActive}
                        onChange={filterHandler}
                        menuItems={[
                            { id: true, name: "Yes" },
                            { id: false, name: "No" },
                        ]}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText="Is Active"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-p-3 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        type="submit"
                        variant='primary'
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
