import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {  TextInput, SelectInput } from "../../../../Components/Common";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  addBrchStreamGroupAct, updateBrchStreamGroupAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getBranchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../../Components/Common/Button";


const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Selet academic year."),
    curriculumId: Yup.string().required("Curriculum id is required."),
    classId: Yup.string().required("Class id is required."),
    branchStreamGroupNameDTOS: Yup.array().of(
        Yup.object().shape({
            groupName: Yup.string().required("Group name required."),
            shortName: Yup.string().required("Short name required.")
        })
    )
});

function getInitialState(editData?: any): any {
    return {
        academicYearId: editData?.academicYearId || "",
        branchId: editData?.branchId || "",
        id: editData?.id || undefined,
        curriculumId: editData?.curriculumId || "",
        classId: editData?.classId || "",
        branchStreamGroupNameDTOS: [
            {
                uniqueId: generateUniqueNumber(),
                groupName: editData?.groupName || "",
                shortName: editData?.shortName || ""
            }
        ]
    }
}



const AddStreamGroup: React.FC<any> = (props) => {
    const [addTermInfoState, setAddStreamGroupState] = useState<any>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [classListState, setClassListState] = useState([]);

    const dispatch = useAppDispatch();
    const { brchCurriculumResp,showApiLoader, branchClassResp, academicYearListResp, addBrchStreamGroupResp, updateBrchStreamGroupResp
    } = useAppSelector(({ branchAcademics, instAcademics,globalData }) => ({
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        academicYearListResp: instAcademics.academicYearListResp,
        addBrchStreamGroupResp: branchAcademics.addBrchStreamGroupResp,
        updateBrchStreamGroupResp: branchAcademics.updateBrchStreamGroupResp,
        showApiLoader:globalData.showApiLoader,

    }), shallowEqual);

    const addTermInfoRespRef = useRef<any>({
        prevAddBrchStreamGroupResp: addBrchStreamGroupResp,
        prevUpdateBrchStreamGroupResp: updateBrchStreamGroupResp,

    });

    useEffect(() => {
        if (!props.isOpen) {
            addStreamGroupForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editRoleDetails) {
            const { curriculumId } = props.editRoleDetails;
            if (curriculumId) {
                const payload = { curriculumId, pageSize: 100, pageNo: 0, branchId: props.branchId, sortBy: "className", orderBy: "asc" };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setAddStreamGroupState(getInitialState(props.editRoleDetails));
        } else {
            setAddStreamGroupState(getInitialState());
        }
    }, [props.editRoleDetails]);

    useEffect(() => {
        const { prevAddBrchStreamGroupResp, prevUpdateBrchStreamGroupResp } = addTermInfoRespRef.current;
        if (addBrchStreamGroupResp && prevAddBrchStreamGroupResp !== addBrchStreamGroupResp) {
            props.toggle(true);
            toast.success("Stream group added successfully.")
        }
        else if (updateBrchStreamGroupResp && prevUpdateBrchStreamGroupResp !== updateBrchStreamGroupResp) {
            props.toggle(true);
            toast.success("Stream group updated successfully.")
        }
        addTermInfoRespRef.current.prevAddBrchStreamGroupResp = addBrchStreamGroupResp;
        addTermInfoRespRef.current.prevUpdateBrchStreamGroupResp = updateBrchStreamGroupResp;
    }, [addBrchStreamGroupResp, updateBrchStreamGroupResp]);

    function addNewStreamGroupHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), groupName: "", shortName: "" });
        }
    }

    function removeGroupHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const addStreamGroupForm = useFormik({
        enableReinitialize: true,
        initialValues: addTermInfoState,
        validationSchema,
        onSubmit: (values) => {
            if (props.streamGroupId) {
                const { branchStreamGroupNameDTOS } = values,
                    filterSteamGroup = branchStreamGroupNameDTOS[0];
                const updateGroupPayload: any = {
                    id: values?.id,
                    branchId: values?.id,
                    streamName: filterSteamGroup?.groupName,
                    shortName: filterSteamGroup?.shortName,
                }
                dispatch(updateBrchStreamGroupAct(generateActionPayload("update_stream_group", undefined, updateGroupPayload)));
            } else {
                const { branchStreamGroupNameDTOS, ...otherPayload } = values,
                    filterSteamGroup = branchStreamGroupNameDTOS.map((item: any) => ({
                        groupName: item.groupName,
                        shortName: item.shortName
                    })),
                    payload = Object.assign(otherPayload, { branchStreamGroupNameDTOS: filterSteamGroup });
                payload.branchId = props.branchId;
                dispatch(addBrchStreamGroupAct(generateActionPayload("add_stream_group", undefined, payload)));
            }
        }
    });

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const payload = { branchId: props.branchId, curriculumId: value, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", };
        if (value) {
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
        addStreamGroupForm.setValues((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        setClassListState([]);
    }

    return (

        <div className="tw-w-full tw-px-3">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-pt-2">

                <div className="tw-col-span-6">
                    <SelectInput
                        name="academicYearId"
                        labelText="Academic Year"
                        value={addStreamGroupForm.values.academicYearId}
                        onChange={addStreamGroupForm.handleChange}
                        menuItems={academicYearListResp?.data}
                        invalid={(addStreamGroupForm.touched.academicYearId && addStreamGroupForm.errors.academicYearId) ? true : false}
                        error={(addStreamGroupForm.touched.academicYearId && addStreamGroupForm.errors.academicYearId) ? addStreamGroupForm.errors.academicYearId : ""}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        isDisabled={props.streamGroupId}
                    />
                </div>

                <div className="tw-col-span-6">
                    <SelectInput
                        name="curriculumId"
                        labelText="Curriculum"
                        value={addStreamGroupForm.values.curriculumId}
                        onChange={onChangeCurriculumHndlr}
                        invalid={(addStreamGroupForm.touched.curriculumId && addStreamGroupForm.errors.curriculumId) ? true : false}
                        error={(addStreamGroupForm.touched.curriculumId && addStreamGroupForm.errors.curriculumId) ? addStreamGroupForm.errors.curriculumId : ""}
                        menuItems={brchCurriculumResp?.data}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        isDisabled={props.streamGroupId}
                    />
                </div>

                <div className="tw-col-span-6">
                    <SelectInput
                        name="classId"
                        labelText="Class"
                        value={addStreamGroupForm.values.classId}
                        onChange={addStreamGroupForm.handleChange}
                        invalid={(addStreamGroupForm.touched.classId && addStreamGroupForm.errors.classId) ? true : false}
                        error={(addStreamGroupForm.touched.classId && addStreamGroupForm.errors.classId) ? addStreamGroupForm.errors.classId : ""}
                        menuItems={branchClassResp?.content}
                        valueKey="id"
                        textKey="shortName"
                        isDisabled={props.streamGroupId}
                    />
                </div>

            </div>

            <div className="tw-border-b tw-mb-2 tw-mt-4">
                <div className="tw-pb-2 tw-flex tw-items-center">
                    <h6 className="tw-text-sm tw-font-semibold">Groups</h6>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-mb-3">
                <div className="tw-col-span-6">
                    <h6 className="tw-text-sm tw-font-medium">Group</h6>
                </div>
                <div className="tw-col-span-6">
                    <h6 className="tw-text-sm tw-font-medium">Short Name</h6>
                </div>
            </div>

            <FormikProvider value={addStreamGroupForm}>
                <FieldArray name="branchStreamGroupNameDTOS">
                    {(arrayHelpers) => {
                        if (!formikArrayHelpers.current) {
                            formikArrayHelpers.current = arrayHelpers;
                        }

                        return (
                            <>
                                {addStreamGroupForm.values.branchStreamGroupNameDTOS.length > 0 &&
                                            addStreamGroupForm.values.branchStreamGroupNameDTOS.map((stream: any, index: any) => {
                                                const inputFieldErrors: any = Array.isArray(addStreamGroupForm.errors.branchStreamGroupNameDTOS) && addStreamGroupForm.errors.branchStreamGroupNameDTOS[index] || {};
                                                const inputFieldTouched = Array.isArray(addStreamGroupForm.touched.branchStreamGroupNameDTOS) && addStreamGroupForm.touched.branchStreamGroupNameDTOS[index] || {};
                                                return (
                                        <div key={stream.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3">

                                            <div className="tw-col-span-6">
                                                <TextInput
                                                    name={`branchStreamGroupNameDTOS.${index}.groupName`}
                                                    value={stream.groupName}
                                                    onChange={addStreamGroupForm.handleChange}
                                                    invalid={inputFieldTouched.groupName && inputFieldErrors.groupName}
                                                    error={inputFieldTouched.groupName && inputFieldErrors.groupName ? inputFieldErrors.groupName : ""}
                                                />
                                            </div>

                                            <div className="tw-col-span-6">
                                                <div className="tw-flex tw-items-center tw-gap-3">

                                                    <div className="tw-flex-1">
                                                        <TextInput
                                                            name={`branchStreamGroupNameDTOS.${index}.shortName`}
                                                            value={stream.shortName}
                                                            onChange={addStreamGroupForm.handleChange}
                                                            invalid={inputFieldTouched.shortName && inputFieldErrors.shortName}
                                                            error={inputFieldTouched.shortName && inputFieldErrors.shortName ? inputFieldErrors.shortName : ""}
                                                        />
                                                    </div>

                                                    {index !== 0 && (
                                                        <Button
                                                            type="button"
                                                            data-index={index}
                                                            onClick={removeGroupHndlr}
                                                            variant="wrong"
                                                            className="tw-rounded-full "
                                                        >
                                                            <i className="ri-delete-bin-2-fill" />
                                                        </Button>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </>
                        );
                    }}
                </FieldArray>
            </FormikProvider>

            {!props.streamGroupId && (
                <div className="tw-mt-2">
                    <Button
                        onClick={addNewStreamGroupHndlr}
                        type="button"
                        variant="hoverInfo"
                    >
                        Add New
                    </Button>
                </div>
            )}

            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6 tw-mb-4">

                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={(event: any) => addStreamGroupForm.handleSubmit(event)}
                    disabled={showApiLoader}
                    variant="primary"
                >
                    {props.academicYearId ? "Update" : "Submit"}
                </Button>

            </div>

        </div>

      
    )
}

export default AddStreamGroup;
