import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SelectInput } from '../../../Components/Common';
import { useFormik } from 'formik';
import { generateColumns, mapClassAnalysisToRowData } from './helper';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getBranchClassCurriculumAct, getClassWiseAnalysisAct, resetBrchClassCurriculumAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { InitialValueType, RowData } from './StudentAdmissionType';
import { getBranchClassAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import Button from '../../../Components/Common/Button';

const initialValues: InitialValueType = {
    academicYearId: "",
    curriculumId: "",
};

const StudentAdmissionClassWise = ({ academicYearId }: any) => {

    const dispatch = useAppDispatch()
    const StuAdmissionClassWiseApiCall = (otherProps?: any) => {

        const { academicYearId, curriculumId } = filterStateForm.values;
        let payload = {
            academicYearId,
            curriculumId,
            branchId,
            instituteId,
            ...otherProps,
        };
        dispatch(getClassWiseAnalysisAct(generateActionPayload('get_class_wise_analysis', undefined, payload)))
    }


    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getClassWiseAnalysisResp,
        brchClassCurriculumResp,
        branchClassResp
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getClassWiseAnalysisResp: applicationSale.getClassWiseAnalysisResp,
            brchClassCurriculumResp: applicationSale.brchClassCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
        }),
        shallowEqual
    );

    const filterStateForm = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
                filterStateForm.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
            }
            else {
                filterStateForm.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
                dispatch(resetBrchClassCurriculumAct(undefined))
            }
            StuAdmissionClassWiseApiCall({ [name]: value, curriculumId: "" })
        }
        else if (name === 'curriculumId') {
            filterStateForm.setValues((prev) => ({ ...prev, [name]: value }))
            StuAdmissionClassWiseApiCall({ [name]: value })
            getClassApiCall(value)
        }
    }

    useEffect(() => {
        if (academicYearId) {
            filterStateForm.setFieldValue("academicYearId", academicYearId)
            getCurriculumApiCall({ academicYearId });
        }
    }, [academicYearId]);

    useEffect(() => {
        if (brchClassCurriculumResp?.data?.length > 0 && filterStateForm.values.academicYearId) {
            const curriculumId = brchClassCurriculumResp.data[0].branchCurriculumId;
            StuAdmissionClassWiseApiCall({ academicYearId: filterStateForm.values.academicYearId, curriculumId });
            getClassApiCall(curriculumId);
            filterStateForm.setValues((prev) => ({ ...prev, curriculumId }));
        }
    }, [brchClassCurriculumResp])

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterStateForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchClassCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", academicYearId: filterStateForm.values.academicYearId, curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    const rowData: RowData[] = useMemo(() => mapClassAnalysisToRowData(branchClassResp, getClassWiseAnalysisResp), [branchClassResp, getClassWiseAnalysisResp]);

    const totalBoys = rowData.reduce((sum, row) => sum + row.boys, 0);
    const totalGirls = rowData.reduce((sum, row) => sum + row.girls, 0);
    const totalSum = rowData.reduce((sum, row) => sum + row.boys + row.girls, 0);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchClassCurriculumResp || {}

    return (
        <>
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-overflow-hidden section-count-card">

                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <div className="tw-flex tw-items-center tw-justify-between">

                        <h4 className="tw-text-lg tw-font-semibold tw-flex-1 tw-mb-0">
                            Class Analysis
                        </h4>

                        <div className="tw-flex tw-gap-3">
                            <Button
                                id="export-btn"
                                variant='exportBtn'
                            >
                                <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                            </Button>

                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                Export
                            </UncontrolledTooltip>
                        </div>
                    </div>
                </div>

                <div className="tw-px-0 tw-pb-2">

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-border-b tw-border-gray-200 tw-py-4 tw-w-full tw-mx-auto tw-px-4">

                        <div className="tw-col-span-6">
                            <SelectInput
                                name="academicYearId"
                                value={filterStateForm.values.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                labelText="Academic Year"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-col-span-6">
                            <SelectInput
                                name="curriculumId"
                                value={filterStateForm.values.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes || []}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                labelText="Curriculum"
                                floatingLabel
                            />
                        </div>

                    </div>

                    <div className="tw-px-2 tw-py-1 tw-m-2 tw-mr-0">

                        <div className="tw-grid tw-grid-cols-12 tw-border-b tw-border-gray-200 tw-py-1">

                            <div className="tw-col-span-4">
                                <p className="tw-font-bold tw-text-gray-500 tw-truncate tw-my-1">
                                    Class Name
                                </p>
                            </div>

                            <div className="tw-col-span-3 tw-text-center">
                                <p className="tw-font-bold tw-text-gray-500 tw-truncate tw-my-1">
                                    Boys
                                </p>
                            </div>

                            <div className="tw-col-span-2 tw-text-center">
                                <p className="tw-font-bold tw-text-gray-500 tw-truncate tw-my-1">
                                    Girls
                                </p>
                            </div>

                            <div className="tw-col-span-3 tw-text-center">
                                <p className="tw-font-bold tw-text-gray-500 tw-truncate tw-my-1">
                                    Total
                                </p>
                            </div>

                        </div>

                        <div
                            className="tw-w-full tw-overflow-y-auto tw-overflow-x-hidden tw-relative"
                            style={{
                                maxHeight: "325px",
                                minHeight: "100px",
                                scrollbarWidth: "thin",
                            }}
                        >
                            {rowData.map((row, index) => (
                                <div
                                    key={index}
                                    className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-between tw-py-1 tw-mx-1 tw-my-1 tw-border-b tw-border-gray-200"
                                    style={{ borderLeft: `4px solid ${row.borderColor}` }}
                                >
                                    <div className="tw-col-span-4">
                                        <p className="tw-font-medium tw-truncate tw-mb-1">
                                            {row.label}
                                        </p>
                                    </div>

                                    <div className="tw-col-span-3 tw-text-center">
                                        <p className="tw-font-medium tw-truncate tw-mb-1 tw-text-sky-600">
                                            {row.boys}
                                        </p>
                                    </div>

                                    <div className="tw-col-span-2 tw-text-center">
                                        <p className="tw-font-medium tw-truncate tw-mb-1 tw-text-sky-600">
                                            {row.girls}
                                        </p>
                                    </div>

                                    <div className="tw-col-span-3 tw-text-center">
                                        <p className="tw-font-medium tw-truncate tw-mb-1 tw-pl-3 tw-text-sky-600">
                                            {row.total}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-between tw-py-1 tw-mx-1 tw-my-1">

                            <div className="tw-col-span-4">
                                <p className="tw-font-medium tw-truncate tw-mb-1">
                                    Total
                                </p>
                            </div>

                            <div className="tw-col-span-3 tw-text-center">
                                <p className="tw-font-medium tw-truncate tw-mb-1">
                                    {totalBoys}
                                </p>
                            </div>

                            <div className="tw-col-span-2 tw-text-center">
                                <p className="tw-font-medium tw-truncate tw-mb-1">
                                    {totalGirls}
                                </p>
                            </div>

                            <div className="tw-col-span-3 tw-text-center">
                                <p className="tw-font-medium tw-truncate tw-mb-1">
                                    {totalSum}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentAdmissionClassWise;
