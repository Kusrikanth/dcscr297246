import React, { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
//Common Component
import { TextInput, } from "../../../Components/Common";
// Formik validation
import * as Yup from "yup";
import { useFormik, } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";
import { mutateFeatureAct, mutatePermissionAct } from "../../../store/accessmanagement/accessmanagementaction";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Feature name is required."),
});

function getFeatureFormData(infoData?: any) {
    return ({
        description: infoData?.featureName || "",
    })
}
const initialValues = getFeatureFormData();
const AddEditFeatureModal: React.FC<any> = (props) => {
    const { modalData } = props,
        { action, featureName, parentsInfo } = modalData || {};
    const dispatch = useAppDispatch();
    const { mutateFeatureResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            mutateFeatureResp: accessManagement.mutateFeatureResp,
            showApiLoader: globalData.showApiLoader
        }), shallowEqual);


    useEffect(() => {
        const { action } = props.modalData
        if (action === 'UPDATE_ROOTFEATURE' || action === 'UPDATE_CHILDFEATURE') {
            const formData = getFeatureFormData(props.modalData);
            addRoleTypeForm.resetForm({
                values: formData
            });
        }
    }, [props.modalData]);

    const addEditModalRespRef = useRef({
        prevMutateFeatureResp: mutateFeatureResp,
    });

    useEffect(() => {
        const { prevMutateFeatureResp } = addEditModalRespRef.current;
        if (mutateFeatureResp && prevMutateFeatureResp !== mutateFeatureResp) {
            const { optionalConfig } = mutateFeatureResp;
            switch (optionalConfig?.type) {
                case 'CREATE_ROOTFEATURE':
                    toast.success('Root feature created successfully.');
                    break;
                case 'CREATE_CHILDFEATURE':
                    toast.success('Sub feature created successfully.');
                    break;
                case 'UPDATE_ROOTFEATURE':
                    toast.success('Root feature updated successfully.');
                    break;
                case 'UPDATE_CHILDFEATURE':
                    toast.success('Sub feature updated successfully.');
                    break;
                default:
                    break;
            }
            props.toggle(true);
        }
        addEditModalRespRef.current.prevMutateFeatureResp = mutateFeatureResp;
    }, [mutateFeatureResp]);


    const addRoleTypeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            let payload: any = {};
            switch (action) {
                case 'CREATE_ROOTFEATURE':
                    payload = { description: values.description };
                    break;
                case 'CREATE_CHILDFEATURE':
                    payload = {
                        parentFeatureId: modalData.featureId,
                        description: values.description
                    };
                    break;
                case 'UPDATE_ROOTFEATURE':
                    payload = {
                        id: modalData.featureId,
                        description: values.description
                    };
                    break;
                case 'UPDATE_CHILDFEATURE':
                    payload = {
                        id: modalData.featureId,
                        parentFeatureId: modalData.parentFeatureId,
                        description: values.description
                    };
                    break;
                default:
                    payload = null;
                    break;
            }
            dispatch(mutateFeatureAct(generateActionPayload("mutate_feature", undefined, payload, {
                type: action
            })));
        },
    });
    return (
        <form onSubmit={addRoleTypeForm.handleSubmit}>
            <div className="tw-px-4 tw-pt-4 tw-pb-0">
                <div className="tw-flex tw-flex-col tw-gap-3">
                    <div className="tw-w-full tw-mb-2">
                        <div className="tw-bg-gray-100 tw-py-2 tw-px-3 tw-rounded-md">
                            <span>
                                <b>Note:</b> {modalData?.descriptionNote}
                            </span>

                            {Array.isArray(parentsInfo) && parentsInfo.length > 0 ? (
                                <div
                                    className="tw-text-xs tw-text-gray-500"
                                    style={{ lineHeight: 1.2 }}
                                >
                                    {parentsInfo
                                        .map((item: any) => item.parentFeatureName)
                                        .join(" > ")}
                                    {` > ${featureName}`}
                                </div>
                            ) : (
                                <span
                                    className="tw-text-xs tw-text-gray-500"
                                    style={{ lineHeight: 1.2 }}
                                >
                                    {` ${featureName || ""}`}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="tw-w-full">
                        <TextInput
                            name="description"
                            value={addRoleTypeForm.values.description}
                            labelText="Feature Name"
                            formgroupClassName="tw-mb-3"
                            labelClass="required"
                            onChange={addRoleTypeForm.handleChange}
                            invalid={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? true : false}
                            error={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? addRoleTypeForm.errors.description : ""}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-px-4 tw-py-3 tw-flex tw-justify-end tw-gap-2 tw-border-t">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    onClick={(event: any) => addRoleTypeForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {modalData?.parentFeatureId ? "Update" : "Save"}
                </Button>
            </div>
        </form>
    )
}

export default AddEditFeatureModal;
