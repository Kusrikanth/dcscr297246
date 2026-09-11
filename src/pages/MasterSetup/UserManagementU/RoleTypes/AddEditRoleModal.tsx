import React, { useEffect } from "react";
import { shallowEqual } from "react-redux";

//Common Component
import {TextInput,} from "../../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import { useFormik, } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addInstRoleTypeV2Act, updateInstRoleTypeV2Act, } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Role Type is required."),
});

const initialValues = {
    description: "",
}

const AddEditRoleModal: React.FC<any> = (props) => {

    const dispatch = useAppDispatch();
    const { showApiLoader } = useAppSelector(({  globalData }) => ({
        showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

    useEffect(() => {
        if(props.modalData){
            addRoleTypeForm.setFieldValue("description", props.modalData?.description);
        }
        return ()=>{
            addRoleTypeForm.resetForm();
        }
    }, []);

    const addRoleTypeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if(!props.modalData){
                dispatch(addInstRoleTypeV2Act(generateActionPayload("add_inst_role_type_v2", undefined, {...values})));
            }
            // else{
            //     dispatch(updateInstRoleTypeV2Act(generateActionPayload("update_inst_role_type_v2", undefined, {...values})));
            // }
        },
    });

    return (

        <div className="tw-p-5">
            <div className="tw-w-full">
                <TextInput
                    name={"description"}
                    value={addRoleTypeForm.values.description}
                    labelText="Role Type"
                    formgroupClassName="tw-mb-3"
                    labelClass="required"
                    onChange={addRoleTypeForm.handleChange}
                    invalid={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? true : false}
                    error={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? addRoleTypeForm.errors.description : ""}
                />
            </div>

            <div className="tw-flex tw-gap-2 tw-justify-end">

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
                    onClick={(event: any) => addRoleTypeForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.roleTypeId ? "Update" : "Submit"}
                </Button>

            </div>
        </div>


    )
}

export default React.memo(AddEditRoleModal);
