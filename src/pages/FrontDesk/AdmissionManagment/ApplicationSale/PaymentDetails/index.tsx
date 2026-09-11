import React, { useEffect, useRef, useState } from 'react'
import { AutoSearchInput, DateInput, ModalContainerUpdated, RadioInput, RadioInputContainer, SelectInput, TextIconInput, TextInput } from '../../../../../Components/Common'
import { useFormik } from 'formik';
import { isEmployeeOption, paymentMode, paymentType } from '../helper';
import { shallowEqual } from 'react-redux';
import { getEmployeeByFilterAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getStudentFatherEmployeeDetailsAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateFeeReceipt, getAmountForApplicationSaleAct, setAmountForApplicationSaleAct } from '../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import * as Yup from 'yup';
import PreviewModal from '../PreviewModal';
import { getYyyyMmDdFormat } from '../../../../../utility/dateutility';
import { setShowGlobalLoaderAct } from '../../../../../store/global/globalslice';
import Button from '../../../../../Components/Common/Button';

const initialValue = {
    dpsEmployee: "no",
    paymentType: "",
    paymentMode: "",
    registrationFee: 0,
    applicationFee: 0,
    bankName: "",
    transactionDate: "",
    comments:"",
    transactionId: "",
    dpsEmployeeId: "",
    registrationFeeFromResp : 0,
    applicationFeeFromResp : 0,
}

const PaymentDetails = (props: any) => {

    const dispatch = useAppDispatch();

    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);

    const { getEmployeesByFilterResp,getAmountForApplicationSaleResp, showApiLoader, currentBranchIdResp: branchId,currentInstIdResp: instituteId,currentInstCodeResp, } =
        useAppSelector(({ directoryEmployee, appData, applicationSale, globalData }) => ({
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            getAmountForApplicationSaleResp: applicationSale.getAmountForApplicationSaleResp,
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentInstCodeResp: appData.currentInstCodeResp,
        }), shallowEqual);

    const paymentDetailsRef = useRef({
        prevGetAmountForApplicationSaleResp: getAmountForApplicationSaleResp
    })

    useEffect(() => {
        const { prevGetAmountForApplicationSaleResp } = paymentDetailsRef.current;

        if(getAmountForApplicationSaleResp && getAmountForApplicationSaleResp !== prevGetAmountForApplicationSaleResp){
            const applicationFee = getAmountForApplicationSaleResp?.find((i:any)=>i?.settingKey==="APPLICATION_FEE")?.settingValue;
            const registrationFee = getAmountForApplicationSaleResp?.find((i:any)=>i?.settingKey==="REGISTRATION_FEE")?.settingValue;

            AcademicDatesFilterForm.setValues((prev)=>({...prev,
                applicationFee : +applicationFee || 0,
                registrationFee : +registrationFee || 0,
                applicationFeeFromResp : +applicationFee || 0,
                registrationFeeFromResp : +registrationFee || 0,
            }))
        }

        paymentDetailsRef.current.prevGetAmountForApplicationSaleResp = getAmountForApplicationSaleResp

    },[getAmountForApplicationSaleResp])

    const validationSchema = Yup.object().shape({
        dpsEmployee: Yup.string().required('Select Dps Employee'),
        paymentType: Yup.string().required('Select Payment Type'),
        paymentMode: Yup.string().when('paymentType', {
            is: (e: any) => {

                if (e === "NO_PAY") {
                    return true;
                }
            },
            then: () => Yup.string().notRequired(),
            otherwise: () => Yup.string().required("Payment Mode is required"),
        }),
        bankName: Yup.string().when(["paymentMode", "paymentType"], {
            is: (paymentMode: any, paymentType: any) => {
                if ((paymentMode === "CARD_PAYMENT" || paymentMode === "UPI") && paymentType !== "NO_PAY") {
                    return true;
                }
            },
            then: () => Yup.string().required("Bank Name is required"),
            otherwise: () => Yup.string().notRequired(),
        }),
        transactionDate: Yup.string().when(["paymentMode", "paymentType"], {
            is: (paymentMode: any, paymentType: any) => {
                if (paymentMode !== "CASH" && paymentType !== "NO_PAY") {
                    return true;
                }
            },
            then: () => Yup.string().required("Transaction Date is required"),
            otherwise: () => Yup.string().notRequired(),
        }),
        transactionId: Yup.string().when(["paymentMode", "paymentType"], {
            is: (paymentMode: any, paymentType: any) => {
                if (paymentMode !== "CASH" && paymentType !== "NO_PAY") {
                    return true;
                }
            },
            then: () => Yup.string().required("Transaction Id is required"),
            otherwise: () => Yup.string().notRequired(),
        }),
        dpsEmployeeId: Yup.string().when("dpsEmployee", {
            is: (e: any) => {
                if (e === "yes") {
                    return true;
                }
            },
            then: () => Yup.string().required("Employee Id is required"),
            otherwise: () => Yup.string().notRequired(),
        }),
    })

    const AcademicDatesFilterForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValue,
        validationSchema,
        onSubmit: (values) => {
            dispatch(setShowGlobalLoaderAct(true));
            let payload:any = { ...values, paymentMode: values.paymentType === "NO_PAY" ? "DEFAULT" : values.paymentMode, dpsEmployeeId: searchEmployeeState?.id || null, dpsEmployee: values.dpsEmployee === "yes" ? true : false, transactionDate: values.paymentMode === "CASH" ? getYyyyMmDdFormat(new Date().toDateString()) : values.transactionDate };

            delete payload.registrationFeeFromResp;
            delete payload.applicationFeeFromResp;
            dispatch(generateFeeReceipt(generateActionPayload('generate_fee_receipt', { applicationSaleId: props.applicationSaleId }, payload)))
        },
    });

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString }
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params)));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            AcademicDatesFilterForm.setFieldValue("dpsEmployeeId", id)
            dispatch(getStudentFatherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            AcademicDatesFilterForm.setFieldValue("dpsEmployeeId", "")
        }
    }

    const ChangeHandler = (event: any) => {
        AcademicDatesFilterForm.handleChange(event);
        const { applicationFeeFromResp , registrationFeeFromResp } = AcademicDatesFilterForm.values || {};
        const { name, value } = event.target;

        if (name === "dpsEmployee") {
            if (value === "yes") {
                AcademicDatesFilterForm.setFieldValue('applicationFee', +applicationFeeFromResp);
                AcademicDatesFilterForm.setFieldValue('registrationFee', 0);
            } else {
                AcademicDatesFilterForm.setFieldValue("dpsEmployeeId", "");
                setSearchEmployeeState(null);
                AcademicDatesFilterForm.setFieldValue('applicationFee', +applicationFeeFromResp);
                AcademicDatesFilterForm.setFieldValue('registrationFee', +registrationFeeFromResp);
            }
            AcademicDatesFilterForm.setFieldValue('comments', "");
        }
        else if (name === "paymentType") {
            if (value === "NO_PAY") {
                AcademicDatesFilterForm.setFieldValue('applicationFee', 0);
                AcademicDatesFilterForm.setFieldValue('registrationFee', 0);
                AcademicDatesFilterForm.setFieldValue('paymentMode', "");
                AcademicDatesFilterForm.setFieldValue('bankName', "");
                AcademicDatesFilterForm.setFieldValue('transactionId', "");
                AcademicDatesFilterForm.setFieldValue('dpsEmployeeId', "");
            }
            else {
                if (AcademicDatesFilterForm.values.dpsEmployee === "yes") {
                    AcademicDatesFilterForm.setFieldValue('applicationFee', +applicationFeeFromResp);
                    AcademicDatesFilterForm.setFieldValue('registrationFee', 0);
                } else {
                    AcademicDatesFilterForm.setFieldValue('applicationFee', +applicationFeeFromResp);
                    AcademicDatesFilterForm.setFieldValue('registrationFee', +registrationFeeFromResp);
                }
            }
            AcademicDatesFilterForm.setFieldValue('comments', "");
        }
        else if (name === "paymentMode") {
            // if (value === "UPI") {
            //     AcademicDatesFilterForm.setFieldValue('bankName', "");
            // }
            if (value === "CASH") {
                AcademicDatesFilterForm.setFieldValue('bankName', "");
                AcademicDatesFilterForm.setFieldValue('transactionDate', "");
                AcademicDatesFilterForm.setFieldValue('transactionId', "");
            }
            AcademicDatesFilterForm.setFieldValue('comments', "");
        }
    }

    useEffect(() => {
        const payload = {
            branchId: branchId,
            instituteId: instituteId,
        }
        dispatch(getAmountForApplicationSaleAct(generateActionPayload("get_amt_for_application_sale",undefined,payload)));

        return ()=>{
            dispatch(setAmountForApplicationSaleAct(undefined))
        }
    }, [])

    return (
        <>
            <div>
                <div className="tw-flex tw-flex-wrap tw--mx-3 tw-p-4">

                    {/* Employee Radio */}
                    <div className="tw-w-1/2 tw-px-3 tw-mb-4 tw-flex tw-items-center">
                        <span className="tw-mr-2">
                            Is Employee Of {currentInstCodeResp === "DPS" ? "DPS" : "PALLAVI"} :
                        </span>

                        <RadioInputContainer
                            name="dpsEmployee"
                            labelText=""
                            containerClassName="tw-flex"
                            labelClassName="tw-mb-0 tw-mr-3"
                            radioOptions={isEmployeeOption}
                            value={AcademicDatesFilterForm.values.dpsEmployee}
                            onChange={ChangeHandler}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    {/* Employee Search */}
                    {AcademicDatesFilterForm.values.dpsEmployee === "yes" ? (
                        <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                            <label>Employee :</label>

                            <AutoSearchInput
                                formgroupClassName="tw-w-full"
                                name="employeeId"
                                labelText=""
                                labelClass="required"
                                onChange={onInputSearchChange}
                                onBlur={AcademicDatesFilterForm.handleBlur}
                                valueKey="id"
                                labelKey="employeeName"
                                subLabelKey="employeeCode"
                                labelHeader="Employee Code"
                                subLabelHeader="Employee Name"
                                options={getEmployeesByFilterResp}
                                selected={searchEmployeeState}
                                selectedOptionCallbck={selectEmployeeHndlr}
                                invalid={(AcademicDatesFilterForm.touched.dpsEmployeeId && AcademicDatesFilterForm.errors.dpsEmployeeId) ? true : false}
                            error={(AcademicDatesFilterForm.touched.dpsEmployeeId && AcademicDatesFilterForm.errors.dpsEmployeeId) ? AcademicDatesFilterForm.errors.dpsEmployeeId : ""}
                        >
                                <i className="ri-search-line"></i>
                            </AutoSearchInput>
                        </div>
                    ) : (
                        <div className="tw-w-1/2 tw-px-3 tw-mb-4"></div>
                    )}

                    {/* Payment Type */}
                    <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                        <SelectInput
                            name="paymentType"
                            value={AcademicDatesFilterForm.values.paymentType}
                            onChange={ChangeHandler}
                            menuItems={paymentType || []}
                            valueKey="id"
                            textKey="name"
                            labelClass="required"
                            formgroupClassName="tw-w-full tw-mb-0"
                            labelText="Payment Type :"
                            invalid={(AcademicDatesFilterForm.touched.paymentType && AcademicDatesFilterForm.errors.paymentType) ? true : false}
                            error={(AcademicDatesFilterForm.touched.paymentType && AcademicDatesFilterForm.errors.paymentType) ? AcademicDatesFilterForm.errors.paymentType : ""}
                        />
                    </div>

                    {/* Payment Mode */}
                    {AcademicDatesFilterForm.values.paymentType !== "NO_PAY" && (
                        <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                            <SelectInput
                                name="paymentMode"
                                value={AcademicDatesFilterForm.values.paymentMode}
                                onChange={ChangeHandler}
                                menuItems={paymentMode || []}
                                valueKey="id"
                                textKey="name"
                                labelClass="required"
                                formgroupClassName="tw-w-full tw-mb-0"
                                labelText="Payment Mode :"
                                invalid={(AcademicDatesFilterForm.touched.paymentMode && AcademicDatesFilterForm.errors.paymentMode) ? true : false}
                                error={(AcademicDatesFilterForm.touched.paymentMode && AcademicDatesFilterForm.errors.paymentMode) ? AcademicDatesFilterForm.errors.paymentMode : ""}
                        />
                        </div>
                    )}

                    {/* Transaction Details */}
                    {AcademicDatesFilterForm.values.paymentMode &&
                        AcademicDatesFilterForm.values.paymentMode !== "CASH" && (
                            <>
                                <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                                    <TextInput
                                        name="transactionId"
                                        value={AcademicDatesFilterForm.values.transactionId}
                                        onChange={ChangeHandler}
                                        formgroupClassName="tw-mb-0"
                                        labelText="Transaction Id"
                                        labelClass="required"
                                        invalid={(AcademicDatesFilterForm.touched.transactionId && AcademicDatesFilterForm.errors.transactionId) ? true : false}
                                        error={(AcademicDatesFilterForm.touched.transactionId && AcademicDatesFilterForm.errors.transactionId) ? AcademicDatesFilterForm.errors.transactionId : ""}
                        />
                                </div>

                                <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                                    <DateInput
                                        name="transactionDate"
                                        labelText="Transaction Date"
                                        formgroupClassName="tw-mb-0"
                                        labelClass="required"
                                        value={AcademicDatesFilterForm.values.transactionDate}
                                        onChange={AcademicDatesFilterForm.handleChange}
                                        invalid={(AcademicDatesFilterForm.touched.transactionDate && AcademicDatesFilterForm.errors.transactionDate) ? true : false}
                                error={(AcademicDatesFilterForm.touched.transactionDate && AcademicDatesFilterForm.errors.transactionDate) ? AcademicDatesFilterForm.errors.transactionDate : ""}
                            />
                                </div>
                            </>
                        )}

                    {/* Bank Name */}
                    {(AcademicDatesFilterForm.values.paymentMode === "CARD_PAYMENT" ||
                        AcademicDatesFilterForm.values.paymentMode === "UPI") && (
                            <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                                <TextInput
                                    name="bankName"
                                    value={AcademicDatesFilterForm.values.bankName}
                                    onChange={ChangeHandler}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Bank Name"
                                    labelClass="required"
                                    invalid={(AcademicDatesFilterForm.touched.bankName && AcademicDatesFilterForm.errors.bankName) ? true : false}
                            error={(AcademicDatesFilterForm.touched.bankName && AcademicDatesFilterForm.errors.bankName) ? AcademicDatesFilterForm.errors.bankName : ""}
                        />
                            </div>
                        )}

                    {/* Amount */}
                    <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                        <TextIconInput
                            name="amount"
                            labelClass="required"
                            labelText="Amount"
                            value={
                                +AcademicDatesFilterForm.values.applicationFee +
                                +AcademicDatesFilterForm.values.registrationFee || "0"
                            }
                            onChange={AcademicDatesFilterForm.handleChange}
                            helperText={`( Application Fee : ₹${AcademicDatesFilterForm.values.applicationFee} ${AcademicDatesFilterForm.values.dpsEmployee !== "yes"
                                    ? `+ Registration Fee : ₹${AcademicDatesFilterForm.values.registrationFee}`
                                    : ""
                                } )`}
                            isDisabled={true}
                            isReadOnly={true}
                        >
                            <i>₹</i>
                        </TextIconInput>
                    </div>

                    {/* Comments */}
                    {AcademicDatesFilterForm.values.paymentType === "NO_PAY" && (
                        <div className="tw-w-1/2 tw-px-3 tw-mb-4">
                            <TextInput
                                name="comments"
                                value={AcademicDatesFilterForm.values.comments}
                                onChange={ChangeHandler}
                                formgroupClassName="tw-mb-0"
                                labelText="Comments"
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="tw-flex tw-justify-end tw-mx-4 tw-my-4 tw-gap-2">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant='primary'
                        onClick={(event: any) => AcademicDatesFilterForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            {/* <ModalContainerUpdated
                id="show-receipt-preview"
                isOpen={previewApplicationSale.showModal}
                toggle={togglePreviewApplicationSaleModal}
                modalTitle="Preview Receipt"
                modalSize="xl"
            >
                <PreviewModal isOpen={previewApplicationSale.showModal} applicationId={previewApplicationSale.applicationId} />
            </ModalContainerUpdated> */}
        </>
    )
}

export default PaymentDetails
