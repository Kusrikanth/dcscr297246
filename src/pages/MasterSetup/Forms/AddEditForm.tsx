
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {  TextInput, SelectInput } from "../../../Components/Common";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getMasterInstFormsAct } from "../../../store/masterdata/masterdataactions";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { assignFormToBranchAct, updateFormToBranchAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Interface & Types
import { IAddInstFormState } from "./formtypes";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    formTypeId: Yup.string().required("Select form."),
    formUrl: Yup.string().required("Form url required.").
        matches(
            /^(http:\/\/|https.\/\/).*$/,
            'Enter correct url with http://* or https://*'
        ),
    branchId: Yup.string().required("Select branch.")
})

function getAddEditFormData(editData?: any): IAddInstFormState {
    return {
        branchFormId: editData?.branchFormId || undefined,
        branchId: editData?.branchId || "",
        formTypeId: editData?.formTypeId || "",
        formUrl: editData?.formUrl || "",
    }
}

const AddEditForms: React.FC<any> = (props) => {
    const [selectedMulti, setselectedMulti] = useState<string | null>(null);

    const [addEditFormState, setAddEditFormState] = useState<IAddInstFormState>(() => getAddEditFormData());

    const dispatch = useAppDispatch();
    const { assignFormToBranchResp, updateFormToBranchResp, branchListResp, masterInstFormsResp,showApiLoader } = useAppSelector(({ instituteInfo, branch, masterData,globalData }) => ({
        assignFormToBranchResp: instituteInfo.assignFormToBranchResp,
        updateFormToBranchResp: instituteInfo.updateFormToBranchResp,
        branchListResp: branch.branchListResp,
        masterInstFormsResp: masterData.masterInstFormsResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);


    useEffect(() => {
        if (props.isOpen && !masterInstFormsResp) {
            const payload = { pageNo: 0, pageSize: 100 }
            dispatch(getMasterInstFormsAct(generateActionPayload("get_master_inst_forms", undefined, payload)))
        }
    }, [props.isOpen, masterInstFormsResp]);
    useEffect(() => {
        if (props.isOpen && !branchListResp) {
            const payload = { pageSize: 100, pageNo: 0, instituteId: props.instituteId };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        }
    }, [props.isOpen, branchListResp]);

    useEffect(() => {
        if (props.isOpen && props.editModalData) {
            setAddEditFormState(getAddEditFormData(props.editModalData));
        } else if (!props.isOpen) {
            setAddEditFormState(getAddEditFormData());
            addEditForms.resetForm();
        }
    }, [props.isOpen, props.editModalData]);

    const addEditFormRespRef = useRef<any>({
        prevAssignFormToBranchResp: assignFormToBranchResp,
        prevUpdateFormToBranchResp: updateFormToBranchResp
    });

    useEffect(() => {
        const { prevAssignFormToBranchResp, prevUpdateFormToBranchResp } = addEditFormRespRef.current;
        if (assignFormToBranchResp && assignFormToBranchResp !== prevAssignFormToBranchResp) {
            props.toggle(true);
            toast.success("Form added successfully.");
        } else if (updateFormToBranchResp && prevUpdateFormToBranchResp !== updateFormToBranchResp) {
            props.toggle(true);
            toast.success("Form updated successfully.");
        }
        addEditFormRespRef.current.prevAssignFormToBranchResp = assignFormToBranchResp;
        addEditFormRespRef.current.prevUpdateFormToBranchResp = updateFormToBranchResp;
    }, [assignFormToBranchResp, updateFormToBranchResp]);

    const addEditForms = useFormik({
        enableReinitialize: true,
        initialValues: addEditFormState,
        validationSchema,
        onSubmit: (values) => {
            const { branchId } = values,
                params = { branchId };
            if (props.formId) {
                dispatch(updateFormToBranchAct(generateActionPayload("update_form_to_branch", undefined, values)));
            } else {
                dispatch(assignFormToBranchAct(generateActionPayload("assign_form_to_branch", params, values)));
            }
        },
    });

    function handleMulti(selectedMulti: any) {
        setselectedMulti(selectedMulti);
    }
    return (

        <div className="tw-p-5">
            <SelectInput
                name="formTypeId"
                labelText="Form Name"
                value={addEditForms.values.formTypeId}
                onChange={addEditForms.handleChange}
                invalid={(addEditForms.touched.formTypeId && addEditForms.errors.formTypeId) ? true : false}
                error={(addEditForms.touched.formTypeId && addEditForms.errors.formTypeId) ? addEditForms.errors.formTypeId : ""}
                menuItems={masterInstFormsResp?.data}
                valueKey="masterFormTypeId"
                textKey="masterFormTypeName"
                isDisabled={props.formId}
            />
            <TextInput
                name="formUrl"
                labelText=" Form Url"
                maxLength={200}
                value={addEditForms.values.formUrl}
                onChange={addEditForms.handleChange}
                invalid={(addEditForms.touched.formUrl && addEditForms.errors.formUrl) ? true : false}
                error={(addEditForms.touched.formUrl && addEditForms.errors.formUrl) ? addEditForms.errors.formUrl : ""}
            />
            <SelectInput
                name="branchId"
                labelText="Branch Name"
                value={addEditForms.values.branchId}
                onChange={addEditForms.handleChange}
                invalid={(addEditForms.touched.branchId && addEditForms.errors.branchId) ? true : false}
                error={(addEditForms.touched.branchId && addEditForms.errors.branchId) ? addEditForms.errors.branchId : ""}
                menuItems={branchListResp?.data}
                valueKey="branchId"
                textKey="branchName"
                isDisabled={props.formId}
            />
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
                <Button
                variant="secondary"
                    type="button"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addEditForms.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.formId ? "Update" : "Submit"}
                </Button>
            </div>
        </div>
    )
}

export default AddEditForms;
