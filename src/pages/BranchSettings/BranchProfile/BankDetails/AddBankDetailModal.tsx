import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { TextInput, Switch, SelectInput } from "../../../../Components/Common";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addBranchBankDetailAct, updateBranchBankDetailAct } from "../../../../store/branchsettings/branchinfo/branchinfoactions";
import {
    getMasterBanksAct
} from "../../../../store/masterdata/masterdataactions";
import Button from "../../../../Components/Common/Button";
//Interface & Types

function getAddEditBankDetails(editData?: any): any {
    return {
        id: editData?.id || undefined,
        bankAccountNumber: editData?.bankAccountNumber || "",
        bankBranchName: editData?.bankBranchName || "",
        bankId: editData?.bankId || "",
        branchId: editData?.branchId || "",
        ifscCode: editData?.ifscCode || "",
        isDefault: editData?.isDefault || false,
        bankAccountName: editData?.bankAccountName || "",
        bankName: editData?.bankName || "",
    }
}

const validationSchema = Yup.object().shape({
    bankId: Yup.string().required("Bank Name required."),
    bankAccountNumber: Yup.number().typeError("Enter valid number").required("Bank account number required."),
    bankBranchName: Yup.string().required("Bank account name is required.").matches(/^[^-\s][a-zA-Z\s]+$/, 'Only alphabet are allowed.'),
    ifscCode: Yup.string().required("IFSC is required."),
    bankAccountName: Yup.string().required("Bank account branch is required.").matches(/^[^-\s][a-zA-Z\s]+$/, 'Only alphabet are allowed.'),
});

const BranchDetails: React.FC<any> = (props) => {
    const [addBankDetailState, setAddBankDetailState] = useState<any>(() => getAddEditBankDetails());

    const dispatch = useAppDispatch();
    const { addBranchBankDetailResp, masterBanksResp, updateBranchBankDetailResp,showApiLoader } = useAppSelector(({ branchInfo, masterData,globalData }) => ({
        addBranchBankDetailResp: branchInfo.addBranchBankDetailResp,
        updateBranchBankDetailResp: branchInfo.updateBranchBankDetailResp,
        masterBanksResp: masterData.masterBanksResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);


    useEffect(() => {
        if (!masterBanksResp) {
            const payload = { pageNo: 0, pageSize: 100 };
            dispatch(getMasterBanksAct(generateActionPayload("get_master_banks", undefined, payload)));
        }
        // return () => addBankDetailForm.resetForm();
    }, [masterBanksResp]);
    useEffect(() => {
        if (!props.isOpen) {
            setAddBankDetailState(getAddEditBankDetails());
            addBankDetailForm.resetForm();
        }
    }, [props.isOpen]);

    const addBankDetailRespRef = useRef<any>({
        prevUpdateBranchBankDetailResp: updateBranchBankDetailResp,
        prevAddBranchBankDetailResp: addBranchBankDetailResp
    });

    useEffect(() => {
        const { prevUpdateBranchBankDetailResp, prevAddBranchBankDetailResp } = addBankDetailRespRef.current;
        if (updateBranchBankDetailResp && updateBranchBankDetailResp !== prevUpdateBranchBankDetailResp) {
            props.toggle(true);
            toast.success("Bank details updated successfully.");
        } else if (addBranchBankDetailResp && addBranchBankDetailResp !== prevAddBranchBankDetailResp) {
            toast.success("Bank details added successfully.");
            props.toggle(true);
        }
        addBankDetailRespRef.current.prevUpdateBranchBankDetailResp = updateBranchBankDetailResp;
        addBankDetailRespRef.current.prevAddBranchBankDetailResp = addBranchBankDetailResp;
    }, [updateBranchBankDetailResp, addBranchBankDetailResp]);

    const addBankDetailForm = useFormik({
        enableReinitialize: true,
        initialValues: addBankDetailState,
        validationSchema,
        onSubmit: (values) => {
            if (props.bankDetailId) {
                dispatch(updateBranchBankDetailAct(generateActionPayload("add_branch_bank", undefined, values)));
            } else {
                values.branchId = props.branchId;
                dispatch(addBranchBankDetailAct(generateActionPayload("add_branch_bank", undefined, values)));
            }
        },
    });

    function onChangeBankHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target,
            { bankName } = masterBanksResp?.content.find((item: any) => (item.id === +value)) || "";
        addBankDetailForm.setValues((prevState: any) => ({ ...prevState, [name]: value, bankName }))
    }
    useEffect(() => {
        if (props.isOpen && props.editModalData) {
            setAddBankDetailState(getAddEditBankDetails(props.editModalData));
        }
    }, [props.isOpen && props.editModalData]);

    return (

        <div className="tw-p-5">

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <div>
                    <SelectInput
                        name="bankId"
                        labelText="Bank Name"
                        value={addBankDetailForm.values.bankId}
                        onChange={onChangeBankHndlr}
                        onBlur={addBankDetailForm.handleBlur}
                        invalid={(addBankDetailForm.touched.bankId && addBankDetailForm.errors.bankId) ? true : false}
                        error={(addBankDetailForm.touched.bankId && addBankDetailForm.errors.bankId) ? addBankDetailForm.errors.bankId : ""}
                        menuItems={masterBanksResp?.content}
                        valueKey="id"
                        textKey="bankName"
                    />
                </div>
                <div>
                    <TextInput
                        name="bankAccountNumber"
                        labelText="Bank Account No"
                        value={addBankDetailForm.values.bankAccountNumber}
                        onChange={addBankDetailForm.handleChange}
                        onBlur={addBankDetailForm.handleBlur}
                        invalid={(addBankDetailForm.touched.bankAccountNumber && addBankDetailForm.errors.bankAccountNumber) ? true : false}
                        error={(addBankDetailForm.touched.bankAccountNumber && addBankDetailForm.errors.bankAccountNumber) ? addBankDetailForm.errors.bankAccountNumber : ""}
                    />
                </div>
                <div>
                    <TextInput
                        name="ifscCode"
                        labelText="IFSC Code"
                        value={addBankDetailForm.values.ifscCode}
                        onChange={addBankDetailForm.handleChange}
                        onBlur={addBankDetailForm.handleBlur}
                        invalid={(addBankDetailForm.touched.ifscCode && addBankDetailForm.errors.ifscCode) ? true : false}
                        error={(addBankDetailForm.touched.ifscCode && addBankDetailForm.errors.ifscCode) ? addBankDetailForm.errors.ifscCode : ""}
                    />
                </div>
                <div>
                    <TextInput
                        name="bankAccountName"
                        labelText="Account Branch"
                        value={addBankDetailForm.values.bankAccountName}
                        onChange={addBankDetailForm.handleChange}
                        onBlur={addBankDetailForm.handleBlur}
                        invalid={(addBankDetailForm.touched.bankAccountName && addBankDetailForm.errors.bankAccountName) ? true : false}
                        error={(addBankDetailForm.touched.bankAccountName && addBankDetailForm.errors.bankAccountName) ? addBankDetailForm.errors.bankAccountName : ""}
                    />
                </div>
                <div>
                    <TextInput
                        name="bankBranchName"
                        labelText="Bank Account Name"
                        value={addBankDetailForm.values.bankBranchName}
                        onChange={addBankDetailForm.handleChange}
                        onBlur={addBankDetailForm.handleBlur}
                        invalid={(addBankDetailForm.touched.bankBranchName && addBankDetailForm.errors.bankBranchName) ? true : false}
                        error={(addBankDetailForm.touched.bankBranchName && addBankDetailForm.errors.bankBranchName) ? addBankDetailForm.errors.bankBranchName : ""}
                    />
                </div>
                <div>
                    <div className="tw-mb-3">
                        <label
                            htmlFor="isDefault"
                            className="tw-block tw-text-sm tw-font-medium tw-mb-2"
                        >
                            Mark as Default Account
                        </label>
                        <Switch
                            attributeId="isDefault"
                            labelName=""
                            checked={addBankDetailForm.values.isDefault}
                            onChangeHndlr={addBankDetailForm.handleChange}
                            className="tw-mb-0 tw-py-2"
                        />
                    </div>
                </div>

            </div>
            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6 tw-mb-1">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addBankDetailForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>

            </div>

        </div>
 
    )
}

export default BranchDetails;