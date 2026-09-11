import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getCasteListAct, getMasterBanksAct, getMotherToungeAct, getNationalityAct, getReligionAct } from "../../../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import { details, formSectionSaveKey } from "./helper";
import * as Yup from 'yup';
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";

export default function BankDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {

    const dispatch = useDispatch();

    const initialValues = (data?: any) => {
        return {
            bId: data ? data.id : "",
            bankAccountNo: data ? data.bankAccountNo : "",
            bankId: data ? data.bankId : "",
            bankBranchName: data ? data.bankBranchName : "",
            bankIfscCode: data ? data.bankIfscCode : "",
            bankBranchAddress: data ? data.bankBranchAddress : "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);

    const { getEmployeeByIdResp, updateStudentResp, affectedSection, nationalityResp, casteListResp, religionResp, masterBanksResp, motherToungeResp } = useAppSelector(
        ({ directoryEmployee, directoryStudent, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            nationalityResp: masterData.nationalityResp,
            casteListResp: masterData.casteListResp,
            religionResp: masterData.religionResp,
            motherToungeResp: masterData.motherToungeResp,
            masterBanksResp: masterData.masterBanksResp,
        }),
        shallowEqual
    );

    const EmployeeBankRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }
    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeBankRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Bank Details") {
                toast.success("Employee Bank Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeBankRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    useEffect(() => {
        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeBankDetails));
    }, [getEmployeeByIdResp]);

    const bankDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Bank Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.bankDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Bank Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        bankDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeBankDetails)).then(() => {
            bankDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    useEffect(() => {
        if (getEmployeeByIdResp !== undefined) {
            setInitialData(initialValues(getEmployeeByIdResp?.employeeBankDetails
            ));
        }
    }, [getEmployeeByIdResp]);

    useEffect(() => {
        dispatch(getNationalityAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "nationality", searchString: "", pageNo: 0, pageSize: 100, sortBy: "id", orderBy: "asc" })));
        dispatch(getReligionAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "religion", searchString: "", pageNo: 0, pageSize: 100, sortBy: "id", orderBy: "asc" })));
        dispatch(getCasteListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "caste", searchString: "", pageNo: 0, pageSize: 100, sortBy: "casteName", orderBy: "asc" })));
        dispatch(getMotherToungeAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "mother-tongue", searchString: "", pageNo: 0, pageSize: 100, sortBy: "id", orderBy: "asc" })));
        dispatch(getMasterBanksAct(generateActionPayload("get_master_banks", undefined, { pageNo: 0, pageSize: 100 })));
    }, []);

    const { content: BankData } = masterBanksResp || {};

    return (
        <div>
            <AccordionHeader tag="h4" targetId="bank-details">
                Bank Details
            </AccordionHeader>
            <AccordionBody accordionId="bank-details">
                <div id={divId} className="">
                    <div className="card-body tw-p-0">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-mb-2">
                            <div className="tw-col-span-1">
                                <TextInputWithRegex
                                    name="bankAccountNo"
                                    labelText="Bank A/C No"
                                    value={bankDetailsForm.values.bankAccountNo}
                                    onChange={bankDetailsForm.handleChange}
                                    onBlur={bankDetailsForm.handleBlur}
                                    inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent' : ""}`}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    allowedInputRegex="^[0-9]+$"
                                    maxLength={15}
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="bankId"
                                    labelText="Bank Name"
                                    value={bankDetailsForm.values.bankId}
                                    onChange={bankDetailsForm.handleChange}
                                    onBlur={bankDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="bankName"
                                    menuItems={BankData || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="bankBranchName"
                                    labelText="Branch Name"
                                    value={bankDetailsForm.values.bankBranchName}
                                    onChange={bankDetailsForm.handleChange}
                                    onBlur={bankDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="bankIfscCode"
                                    labelText="Bank IFSC Code"
                                    value={bankDetailsForm.values.bankIfscCode}
                                    onChange={bankDetailsForm.handleChange}
                                    onBlur={bankDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="bankBranchAddress"
                                    labelText="Bank Address"
                                    value={bankDetailsForm.values.bankBranchAddress}
                                    onChange={bankDetailsForm.handleChange}
                                    onBlur={bankDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>
                        </div>

                        {canCreateAndUpdate && <>{!edit && <div className="tw-grid">
                            <div className="tw-ml-auto tw-flex tw-items-center tw-justify-end">
                                <Button variant="hoverInfo" onClick={EditHandler}>
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        </div>}

                        {edit && <div className="tw-grid">
                            <div className="tw-col-auto tw-ml-auto tw-flex tw-pl-4 tw-gap-4">
                                <Button variant="secondary" onClick={CancelHandler}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={(e: any) => bankDetailsForm.handleSubmit(e)}>
                                    Update
                                </Button>
                            </div>
                        </div>}</>}                       
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}