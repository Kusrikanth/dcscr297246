import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { SelectInput } from '../../../Components/Common';
import { bookConditionOptions, statusTypes } from './helper';
import { getLibraryCategoryListAct } from '../../../store/library/settings/librarysettingsaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import Button from '../../../Components/Common/Button';

const initialValues: any = {
    searchString: "",
    roomId: "",
    rackId: "",
    shelfId: "",
    bookCondition: "",
    issueStatus: "",
    recordTypeId: "",
    libraryId: "",
    categoryId: "",
    languageId: "",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader  , libraryRecordRequestListResp, libraryRackRequestListResp, libraryCategoryRequestListResp, libraryLanguageRequestListResp} =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData,librarysettings }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
                libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
                libraryCategoryRequestListResp: librarysettings.libraryCategoryRequestListResp,
                libraryLanguageRequestListResp: librarysettings.libraryLanguageRequestListResp,
            }),
            shallowEqual
        );
        
    const libraryCategoryList = (otherProps?: any) => {
        let payload = {
            branchId,
            pageNo: 0, pageSize: 500
        };
        dispatch(getLibraryCategoryListAct(generateActionPayload("get_library_category", undefined, payload)));
    };

    useEffect(() => {
        libraryCategoryList();
    }, [branchId,]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
    }

    function applyFilterHndlr() {
        const { rackId, ...rest } = enquiryFilterState;
        const payload = {
            ...rest,
            rackId: rackId === "NOT_AUTH" ? 0 : rackId,
        };
        props.applyFilterCallback(payload);
        props.toggleAdvanceFilter();
    }
    const rackMenuItems = [
        { id: "NOT_AUTH", rackName: "Not Assigned" },
        ...(libraryRackRequestListResp?.content || []),
    ];

    return (
        <>
            <div className="offcanvas-body">

                <div className="tw-mb-3">
                    <SelectInput
                        name="bookCondition"
                        value={enquiryFilterState.bookCondition}
                        onChange={filterHandler}
                        menuItems={bookConditionOptions}
                        valueKey="bookConditionType"
                        textKey="bookConditionTypeName"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText='Book Condition'
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="issueStatus"
                        value={enquiryFilterState.issueStatus}
                        onChange={filterHandler}
                        menuItems={statusTypes}
                        valueKey="statusType"
                        textKey="statusName"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText='Status'
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="recordTypeId"
                        value={enquiryFilterState.recordTypeId}
                        onChange={filterHandler}
                        menuItems={libraryRecordRequestListResp?.content}
                        valueKey="id"
                        textKey="recordType"
                        formgroupClassName="tw-mb-3"
                        defaultSelect="Select"
                        labelText='Record Type'
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="rackId"
                        value={enquiryFilterState.rackId}
                        onChange={filterHandler}
                        menuItems={rackMenuItems}
                        valueKey="id"
                        textKey="rackName"
                        labelText='Rack'
                        formgroupClassName="tw-mb-3"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="categoryId"
                        value={enquiryFilterState.categoryId}
                        onChange={filterHandler}
                        menuItems={libraryCategoryRequestListResp?.content}
                        valueKey="id"
                        textKey="category"
                        labelText='Category'
                        formgroupClassName="tw-mb-3"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="languageId"
                        value={enquiryFilterState.languageId}
                        onChange={filterHandler}
                        menuItems={libraryLanguageRequestListResp?.content}
                        valueKey="id"
                        textKey="language"
                        labelText='Language'
                        formgroupClassName="tw-mb-3"
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        variant="primary"
                        type="submit"
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
