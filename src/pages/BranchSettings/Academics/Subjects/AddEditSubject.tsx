import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {  TextInput, SelectInput,  RadioInputContainer, AutoSearchInputUpdated } from "../../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik,  ArrayHelpers, FormikProvider } from "formik";
//Common Utility
import { debounce, generateUniqueNumber } from "../../../../utility/commonutility";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { addBrchSubjectAct, getInstSubjectNameAct, updateBrchSubjectAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Helper
import { subjectTypeOptions, coscholasticData, scoscholasticData, languageTypeOptions } from "./helper";
import Button from "../../../../Components/Common/Button";
//Interface & Types

function getAddSubjectData(editData?: any): any {
    const { subjectAreaRequest } = editData || {};
    const subjectInfo: any = {
        id: editData?.id || undefined,
        curriculumId: editData?.curriculumId.toString() || "",
        branchId: editData?.branchId || "",
        subjectId: editData?.subjectId || "",
        shortName: editData?.shortName || "",
        subjectType: editData?.subjectType || "",
        scholasticType: editData?.scholasticType || "",
        coScholasticType: editData?.coScholasticType || "",
        languageType: editData?.languageType || "",
        numbering: editData?.numbering || "",
    }
    if (Array.isArray(subjectAreaRequest)) {
        subjectInfo.subjectAreaRequest = subjectAreaRequest.map((item: any) => {
            const { id, ...otherInfo } = item;
            return Object.assign(otherInfo, { uniqueId: id, id });
        });
    }
    return subjectInfo;
}

const validationSchema = Yup.object().shape({
    curriculumId: Yup.string().required("Curriculum required."),
    subjectId: Yup.string().required("Subject is required."),
    shortName: Yup.string().required("Short name required."),
    subjectType: Yup.string().required("Subject type required."),
    // numbering: Yup.string().required("Numbering of subject required."),
    languageType: Yup.mixed()
            .nullable()
            .when(["subjectType", "scholasticType"], {
                is: (subjectType: string, scholasticType: string) =>
                    subjectType === "SCHOLASTIC" && scholasticType === "LANGUAGE",
                then: (schema) => Yup.string().required("Language is required."),
                otherwise: (schema) => Yup.string().nullable(),
            }),
});



const AddEditSubject: React.FC<any> = (props) => {
    const [addSubjectState, setAddSubjectState] = useState<any>(() => getAddSubjectData(undefined));
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [searchSubjectState, setSearchSubjectState] = useState<{
        subjectId: string;
        subjectShortName: string;
        subjectName: string;
    } | null>(null);
    const [toggleUIState, setToggleUIState] = useState({
        showCoScholasticType: false,
        showScholasticType: false
    });
    const dispatch = useAppDispatch();
    const { addBrchSubjectResp, instSubjectNameResp, currentInstIdResp: instituteId,
        updateBrchSubjectResp, brchCurriculumResp, showApiLoader } = useAppSelector(({ instAcademics,
            branchAcademics, masterData, appData, globalData }) => ({
                addBrchSubjectResp: branchAcademics.addBrchSubjectResp,
                instSubjectNameResp: branchAcademics.instSubjectNameResp,
                currentInstIdResp: appData.currentInstIdResp,
                updateBrchSubjectResp: branchAcademics.updateBrchSubjectResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                showApiLoader:globalData.showApiLoader,
            }), shallowEqual);

    const addEditSubjectRespRef = useRef<any>({
        prevAddBrchSubjectResp: addBrchSubjectResp,
        prevUpdateBrchSubjectResp: updateBrchSubjectResp
    });
    useEffect(() => {
        const { prevAddBrchSubjectResp, prevUpdateBrchSubjectResp } = addEditSubjectRespRef.current;
        if (addBrchSubjectResp && addBrchSubjectResp !== prevAddBrchSubjectResp) {
            props.toggle(true);
            toast.success("Subject added successfully.");
        } else if (updateBrchSubjectResp && updateBrchSubjectResp !== prevUpdateBrchSubjectResp) {
            props.toggle(true);
            toast.success("Subject updated successfully.");
        }
        addEditSubjectRespRef.current.prevAddBrchSubjectResp = addBrchSubjectResp;
        addEditSubjectRespRef.current.prevUpdateBrchSubjectResp = updateBrchSubjectResp;
    }, [addBrchSubjectResp, updateBrchSubjectResp]);

    useEffect(() => {
        if (!props.isOpen) {
            setAddSubjectState(getAddSubjectData(undefined));
            addSubjectForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
    if (props.isOpen && props.editModalData) {
        const { subjectType } = props.editModalData;
        if (subjectType === "COSCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: true,
                showScholasticType: false
            });
        } else if (subjectType === "SCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: false,
                showScholasticType: true,
            });
        } else {
                setToggleUIState({
                    showCoScholasticType: false,
                    showScholasticType: false,
                });
            }
            const addData = getAddSubjectData(props.editModalData);
            setAddSubjectState(addData);
            addSubjectForm.setValues(addData);
            setSearchSubjectState({
                subjectId: props.editModalData.subjectId,
                subjectShortName: props.editModalData.shortName,
                subjectName: props.editModalData.subjectName,
            });

        }
    }, [props.isOpen, props.editModalData]);


    const addSubjectForm = useFormik({
        enableReinitialize: true,
        initialValues: addSubjectState,
        validationSchema,
        onSubmit: (values) => {
            if (props.subjectId && props.editModalData?.id) {
                const editpayload = 
                    {
                        id: props.editModalData.id,
                        instituteId,
                        curriculumId: addSubjectForm.values.curriculumId,
                        branchId: props.branchId,
                        numbering: addSubjectForm.values.numbering,
                        instituteSubjectId: addSubjectForm.values.subjectId,
                        languageType: addSubjectForm.values.languageType || null,
                        subjectAreaRequest: addSubjectForm.values.subjectAreaRequest?.map((item: any) => ({
                            id: item.id,
                            skillAreaName: item.skillAreaName,
                            areaShortName: item.areaShortName,
                            isDeleted: item.isDeleted || false,
                        }))
                    };
                dispatch(updateBrchSubjectAct(generateActionPayload("update_brch_subject", undefined, editpayload)));
            } else {
                const addpayload: any = {
                    instituteId,
                    curriculumId: addSubjectForm.values.curriculumId,
                    branchId: props.branchId,
                    instituteSubjectId: addSubjectForm.values.subjectId,
                    subjectType: addSubjectForm.values.subjectType,
                    scholasticType: addSubjectForm.values.scholasticType,
                    coScholasticType: addSubjectForm.values.coScholasticType,
                    languageType: addSubjectForm.values.languageType || null,
                    subjectAreaRequest: addSubjectForm.values.subjectAreaRequest?.map((item: any) => ({
                        skillAreaName: item.skillAreaName,
                        areaShortName: item.areaShortName
                    }))
                };
                if (addpayload.subjectType === "COSCHOLASTIC") {
                    delete addpayload.scholasticType;
                } else if (addpayload.subjectType === "SCHOLASTIC") {
                    delete addpayload.coScholasticType;
                }
                dispatch(addBrchSubjectAct(generateActionPayload("add_brch_subject", undefined, addpayload)));
            }
        },
    });

    function addNewSkillHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), skillAreaName: "", areaShortName: "" });
        }
    }

    function removeSkillsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined && rowIndex !== null) {
            const index = Number(rowIndex);
            const updatedList = [...addSubjectForm.values.subjectAreaRequest];
            updatedList[index] = {
                ...updatedList[index],
                isDeleted: true
            };
            addSubjectForm.setFieldValue("subjectAreaRequest", updatedList);
        }
    }

    function onChangeSubjectTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "COSCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: true,
                showScholasticType: false
            })
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, scholasticType: undefined, [name]: value
            }))
        } else if (value === "SCHOLASTIC") {
            setToggleUIState({
                showCoScholasticType: false,
                showScholasticType: true,
            });
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, coScholasticType: undefined, scholasticType: "CORE", subjectAreaRequest: undefined, [name]: value
            }))
        } else if (value === "INTERNAL") {
            setToggleUIState({
                showCoScholasticType: false,
                showScholasticType: false,
            });
            addSubjectForm.setValues((prevState: any) => ({
                ...prevState, scholasticType: undefined, [name]: value, coScholasticType: undefined,
            }))
        }
    }
    const debouncedSearch = debounce((input: string) => getSubjectApiCall(input), 1000);

    function getSubjectApiCall(inputString: string, otherProps?: any) {
        const payload = {
            instituteId,
            searchString: inputString,
        };
        dispatch(
            getInstSubjectNameAct(generateActionPayload("get_inst_subject_name", undefined, payload))
        );
    }

    function handleSubjectSearchChange(inputString: string) {
        if (!inputString) {
            addSubjectForm.setValues({
                ...addSubjectForm.values,
                subjectId: "",
                subjectName: "",
                subjectShortName: "",
            });
            setSearchSubjectState(null);
        } else {
            debouncedSearch(inputString);
        }
    }
    const selectedSubject = (selectedOption: any) => {
        if (selectedOption) {
            setSearchSubjectState(selectedOption);

            addSubjectForm.setFieldValue("subjectId", selectedOption.id);
            addSubjectForm.setFieldValue("shortName", selectedOption.subjectShortName);
            addSubjectForm.setFieldValue("subjectType", selectedOption.subjectType);
            addSubjectForm.setFieldValue("coScholasticType", selectedOption.coScholasticType);
            addSubjectForm.setFieldValue("scholasticType", selectedOption.scholasticType);

            if (selectedOption.subjectType === "SCHOLASTIC") {
                setToggleUIState({
                    showCoScholasticType: false,
                    showScholasticType: true,
                });
            } else if (selectedOption.subjectType === "COSCHOLASTIC") {
                setToggleUIState({
                    showCoScholasticType: true,
                    showScholasticType: false,
                });
            }
            addSubjectForm.setFieldTouched("subjectId", false, false);
        }
    };

    return (
        
        <div className="tw-p-5">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <SelectInput
                        name="curriculumId"
                        labelText="Curriculum"
                        labelClass="required"
                        value={addSubjectForm.values.curriculumId}
                        onChange={addSubjectForm.handleChange}
                        isDisabled={props?.subjectId ? true : false}
                        invalid={(addSubjectForm.touched.curriculumId && addSubjectForm.errors.curriculumId) ? true : false}
                        error={(addSubjectForm.touched.curriculumId && addSubjectForm.errors.curriculumId) ? addSubjectForm.errors.curriculumId : ""}
                        menuItems={brchCurriculumResp?.data}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <AutoSearchInputUpdated
                        formgroupClassName="tw-mb-4"
                        name="subjectId"
                        placeHolder="Search..."
                        onChange={handleSubjectSearchChange}
                        valueKey="id"
                        labelHeader="Short Name"
                        labelKey="subjectShortName"
                        subLabelHeader="Subject Name"
                        subLabelKey="subjectName"
                        labelText="Subject"
                        labelClass="required"
                        isDisabled={props?.subjectId ? true : false}
                        options={Array.isArray(instSubjectNameResp?.content) ? instSubjectNameResp?.content : []}
                        selected={searchSubjectState}
                        selectedOptionCallbck={selectedSubject}
                        invalid={addSubjectForm.touched.subjectId && addSubjectForm.errors.subjectId ? true : false}
                        error={addSubjectForm.touched.subjectId && addSubjectForm.errors.subjectId ? addSubjectForm.errors.subjectId : ""}
                    >
                        <i className="ri-search-line search-icon"></i>
                    </AutoSearchInputUpdated>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                        name="shortName"
                        labelText="Short Name"
                        value={addSubjectForm.values.shortName}
                        onChange={addSubjectForm.handleChange}
                        isDisabled={true}
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <SelectInput
                        name="subjectType"
                        labelText="Subject Type"
                        value={addSubjectForm.values.subjectType}
                        onChange={onChangeSubjectTypeHndlr}
                        isDisabled={true}
                        invalid={(addSubjectForm.touched.subjectType && addSubjectForm.errors.subjectType) ? true : false}
                        error={(addSubjectForm.touched.subjectType && addSubjectForm.errors.subjectType) ? addSubjectForm.errors.subjectType : ""}
                        menuItems={subjectTypeOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                {props.subjectId && (
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <TextInput
                            name="numbering"
                            labelText="Subject Order"
                            inputType="number"
                            value={addSubjectForm.values.numbering}
                            onChange={addSubjectForm.handleChange}
                        />
                    </div>
                )}

                {toggleUIState.showCoScholasticType && (
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="coScholasticType"
                            labelText="Coscholastic Type"
                            value={addSubjectForm.values.coScholasticType}
                            onChange={addSubjectForm.handleChange}
                            isDisabled={true}
                            menuItems={Array.isArray(coscholasticData) ? coscholasticData : []}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                )}

                {toggleUIState.showScholasticType && (
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <RadioInputContainer
                            name="scholasticType"
                            labelText="Scholastic Type"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={scoscholasticData}
                            isDisabled={true}
                            value={addSubjectForm.values.scholasticType}
                            onChange={addSubjectForm.handleChange}
                        />
                    </div>
                )}
                {addSubjectForm.values.subjectType === "SCHOLASTIC" &&
                    addSubjectForm.values.scholasticType === "LANGUAGE" && (
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="languageType"
                                labelText="Language"
                                labelClass="required"
                                value={addSubjectForm.values.languageType}
                                onChange={addSubjectForm.handleChange}
                                menuItems={Array.isArray(languageTypeOptions) && (languageTypeOptions) || []}
                                valueKey="id"
                                textKey="name"
                                invalid={(addSubjectForm.touched.languageType && addSubjectForm.errors.languageType) ? true : false}
                                error={(addSubjectForm.touched.languageType && addSubjectForm.errors.languageType) ? addSubjectForm.errors.languageType : ""}
                            />
                        </div>
                    )}
            </div>

            {toggleUIState.showCoScholasticType && (
                <>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-6 tw-mb-3">
                        <div className="tw-col-span-6">
                            <h6 className="tw-text-sm tw-font-semibold">Skill</h6>
                        </div>
                        <div className="tw-col-span-6">
                            <h6 className="tw-text-sm tw-font-semibold">Short Name</h6>
                        </div>
                    </div>

                    <FormikProvider value={addSubjectForm}>
                        <FieldArray name="subjectAreaRequest">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {Array.isArray(addSubjectForm.values.subjectAreaRequest) &&
                                            addSubjectForm.values.subjectAreaRequest.map(
                                                (subjectArea: any, index: number) => {
                                                    if (subjectArea.isDeleted) return null;

                                                    const inputFieldErrors: any = (Array.isArray(addSubjectForm.errors.subjectAreaRequest) && addSubjectForm.errors?.subjectAreaRequest[index]) || {};
                                                    const inputFieldTouched = (Array.isArray(addSubjectForm.touched.subjectAreaRequest) && addSubjectForm.touched?.subjectAreaRequest[index]) || {};
                                                    return (
                                                        <div key={subjectArea.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">

                                                            <div className="tw-col-span-6">
                                                                <TextInput
                                                                    name={`subjectAreaRequest.${index}.skillAreaName`}
                                                                    value={subjectArea.skillAreaName}
                                                                    onChange={addSubjectForm.handleChange}
                                                                     invalid={(inputFieldTouched.skillAreaName && inputFieldErrors.skillAreaName) ? true : false}
                                                                    error={(inputFieldTouched.skillAreaName && inputFieldErrors.skillAreaName) ? inputFieldErrors.skillAreaName : ""}

                                                        
                                                                />
                                                            </div>

                                                            {/* Short Name + Delete */}
                                                            <div className="tw-col-span-6 tw-flex tw-items-center tw-gap-3">
                                                                <div className="tw-flex-1">
                                                                    <TextInput
                                                                        name={`subjectAreaRequest.${index}.areaShortName`}
                                                                        value={subjectArea.areaShortName}
                                                                        onChange={addSubjectForm.handleChange}
                                                                        invalid={(inputFieldTouched.areaShortName && inputFieldErrors.areaShortName) ? true : false}
                                                                        error={(inputFieldTouched.areaShortName && inputFieldErrors.areaShortName) ? inputFieldErrors.areaShortName : ""}
                                                                    />
                                                                </div>

                                                                {index !== 0 && (
                                                                     <Button
                                                                    data-index={index}
                                                                    onClick={removeSkillsHndlr}
                                                                    variant="wrong"
                                                                >
                                                                    <i className="ri-delete-bin-2-fill tw-text-red-600" />
                                                                </Button>
                                                                )}
                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            )}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>

                    <div className="tw-mt-3">
                        <Button
                            onClick={addNewSkillHndlr}
                            type="button"
                            variant="hoverInfo"
                        >
                            Add New
                        </Button>
                    </div>
                </>
            )}

            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={(event: any) => addSubjectForm.handleSubmit(event)}
                    disabled={showApiLoader}
                    variant="primary"
                >
                    {props.subjectId ? "Update" : "Submit"}
                </Button>
            </div>

        </div>

      
    )
}

export default AddEditSubject;