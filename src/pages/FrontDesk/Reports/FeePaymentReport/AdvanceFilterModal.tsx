import React, { useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import {  MultiSelectCheckbox, SelectInput } from '../../../../Components/Common';
import { paidAtMenuOptions, paymentModeMenuOptions, renderClassOptions, renderClassValue,  } from './helper';
import { getFeeTypesAct } from '../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions';
import { toast } from 'react-toastify';
import {
    getFeeNameByTypeAct, getFeeTermByTypeAct,
    setFeeNameByTypeAct, setfeeTermByTypeAct
} from '../../../../store/fee/feereport/feereportactions';
import {
    renderOptions, renderValue, renderFeeTypeOptions, renderFeeTypeValue,

    renderFeeNameOptions, renderFeeNameValues,
    renderFeeTermOptions, renderFeeTermValues
} from "./helper";
import { getBranchClassAct, getBranchCurriculumAct, setBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import Button from '../../../../Components/Common/Button';


const initialValues = {
    curriculumId: "",
    classIds: "",
    paidAt: "",
    paymentModes: "",
    feeTypes: "",
    feeNames: "",
    terms: "",
};



const AdvanceFilterModal = (props: any) => {
    const [filterState, setFilterState] = useState<any>(initialValues);

    const {
        showApiLoader, brchCurriculumResp, branchClassResp, feeTypesResp,
        feeNameByTypeResp, feeTermByTypeResp,currentInstIdResp: instituteId,
        brchAcademicErrorResp
    } = useAppSelector(
        ({ globalData, masterFeeSettings, branchAcademics, feeReport,appData }) => ({
            showApiLoader: globalData.showApiLoader,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            feeTypesResp: masterFeeSettings.feeTypesResp,
            feeNameByTypeResp: feeReport.feeNameByTypeResp,
            feeTermByTypeResp: feeReport.feeTermByTypeResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
        }), shallowEqual);

    useEffect(() => {
        setFilterState((prevState: any) => ({ ...prevState, ...props.appliedFilter }));
    }, [props.appliedFilter]);

    useEffect(() => {
        const { instituteId, branchId, dispatch } = props;
        if (instituteId && branchId) {
            const params = { instituteId };
            dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, params)));
            const brchCurriculumparams = { branchId: branchId, academicYearId: props.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));

        }
    }, [props.instituteId]);
    const filterRespRef = useRef({
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    })

    useEffect(() => {
        const { prevBrchAcademicErrorResp } = filterRespRef.current;
        if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { message } = brchAcademicErrorResp;
            toast.error(message || "Something went wrong.");
        }
        filterRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [brchAcademicErrorResp]);

    function applyFilterHndlr() {
        props.applyFilterCallback(filterState);
    }

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: "" }));
        }
    }

    const loadFeeData = (selectedFeeTypes: string[] = []) => {
        props.dispatch(
            getFeeNameByTypeAct(
                generateActionPayload(
                    "get_feename_bytype",
                    undefined,
                    {
                        branchId: props.branchId,
                        curriculumId: filterState.curriculumId,
                        feeTypes: selectedFeeTypes.join(",")
                    }
                )
            )
        );
        props.dispatch(
            getFeeTermByTypeAct(
                generateActionPayload(
                    "get_feeterm_bytype",
                    undefined,
                    {
                        feeType: selectedFeeTypes.includes("TERM")
                            ? "TERM"
                            : "",
                        instituteId
                    }
                )
            )
        );
    };
    
    const isInitialLoad = useRef(true);

    useEffect(() => {
        const selectedFeeTypes = Array.isArray(filterState.feeTypes)
            ? filterState.feeTypes.map(
                (item: any) => item.feeType
            )
            : [];
        if (isInitialLoad.current) {
            loadFeeData();
            isInitialLoad.current = false;
            return;
        }
        loadFeeData(selectedFeeTypes);
    }, [filterState.feeTypes, filterState.curriculumId]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }))
    }


    function onChangeCurriculumHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        props.dispatch(setBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classIds: "" }))
        if (value) {
            getClassApiCall(value);
        }
    }


    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId: props.branchId, academicYearId: props.academicYearId };
        props.dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const feeTypeList = useMemo(() => {
        if (Array.isArray(feeTypesResp)) {
            return feeTypesResp.filter(item => item?.feeType !== "MONTH");
        }
        return [];
    }, [feeTypesResp]);

    const { feeTypes } = filterState;
    const isFeeTypeSelected = Array.isArray(feeTypes) && feeTypes.length > 0;
    const isFeeTypeTermSelected = isFeeTypeSelected && feeTypes.find(item => item.feeType === "TERM") || false;
    return (
        <>
            <div className="tw-py-3 tw-px-4 offcanvas-body">
                <SelectInput
                    labelText="Curriculum"
                    name="curriculumId"
                    value={filterState.curriculumId}
                    onChange={onChangeCurriculumHandler}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    defaultSelect="Curriculum"
                />

                <MultiSelectCheckbox
                    name="classIds"
                    idKey="id"
                    labelText="Class"
                    containerClassName="tw-mb-3"
                    value={filterState.classIds}
                    renderValue={renderClassValue}
                    renderOptions={renderClassOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="shortName"
                    options={branchClassResp?.content}
                />

                <MultiSelectCheckbox
                    name="paidAt"
                    idKey="id"
                    labelText="Receipt Type"
                    containerClassName="tw-mb-3"
                    value={filterState.paidAt}
                    renderValue={renderValue}
                    renderOptions={renderOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="value"
                    options={paidAtMenuOptions}
                />

                <MultiSelectCheckbox
                    name="paymentModes"
                    idKey="id"
                    labelText="Payment Mode"
                    containerClassName="tw-mb-3"
                    value={filterState.paymentModes}
                    renderValue={renderValue}
                    renderOptions={renderOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="value"
                    options={paymentModeMenuOptions}
                />

                <MultiSelectCheckbox
                    name="feeTypes"
                    idKey="feeTypeId"
                    labelText="Fee Type"
                    containerClassName="tw-mb-3"
                    value={filterState.feeTypes}
                    renderValue={renderFeeTypeValue}
                    renderOptions={renderFeeTypeOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="feeTypeName"
                    options={feeTypeList}
                />

                <MultiSelectCheckbox
                    name="feeNames"
                    idKey="feeName"
                    labelText="Fee Name"
                    containerClassName="tw-mb-3"
                    value={filterState.feeNames}
                    renderValue={renderFeeNameValues}
                    renderOptions={renderFeeNameOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="feeName"
                    options={feeNameByTypeResp}
                />

                <MultiSelectCheckbox
                    name="terms"
                    idKey="termId"
                    labelText="Fee Term"
                    containerClassName="tw-mb-3"
                    value={filterState.terms}
                    renderValue={renderFeeTermValues}
                    renderOptions={renderFeeTermOptions}
                    onChange={onSelectOptionHandler}
                    searchKey="termTypeName"
                    options={feeTermByTypeResp}
                />
            </div>

            <div className="tw-border-t tw-p-2 tw-flex tw-justify-end">
                <Button
                    type="submit"
                    variant='primary'
                    onClick={applyFilterHndlr}
                    disabled={showApiLoader}
                    
                >
                    Submit
                </Button>
            </div>

        </>
    )
}

export default AdvanceFilterModal
