import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextArea, TextInput } from "../../../../../Components/Common";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight03Icon, Delete02StrokeStandard, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { PassFailToggle } from "./Toggle";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { saveGradesDistributionAct, updateGradesDistributionAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";

const initialValues = {
    gradesSettingDTOs: [
        {
            id: generateUniqueNumber(),
            grade: "",
            fromPerc: "",
            toPerc: "",
            result: "",
            remarks: "",
        },
    ],
}

const validationSchema = Yup.object().shape({
    gradesSettingDTOs: Yup.array().of(
        Yup.object().shape({
            grade: Yup.string().nullable().required('Grade is required'),
            fromPerc: Yup.string().nullable().required('From % is required'),
            toPerc: Yup.string().nullable().required('To % is required'),
            result: Yup.string().nullable().required('Result is required'),
        })
    )
});

const AddGradeDistributionModal = (props: any) => {
    const formikArrayHelpers = useRef<any>(null);

    const dispatch = useAppDispatch();
    const addSlabHandler = () => {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                id: generateUniqueNumber(),
                grade: "",
                fromPerc: "",
                toPerc: "",
                result: "",
                remarks: "",
            });
        }
    };

    const { currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        getGradeDistrubutionByIdResp,
    } = useAppSelector(
        ({
            appData, lmsAssessment,
        }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getGradeDistrubutionByIdResp: lmsAssessment.getGradeDistrubutionByIdResp,
        }),
        shallowEqual
    );

    const settingsFormik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (props.id) {
                const grade = values.gradesSettingDTOs[0];
                const payload = {
                    fromPerc: parseFloat(values.gradesSettingDTOs[0].fromPerc) || 0,
                    toPerc: parseFloat(values.gradesSettingDTOs[0].toPerc) || 0,
                    grade: values.gradesSettingDTOs[0].grade,
                    result: values.gradesSettingDTOs[0].result?.toUpperCase() || "PASS",
                    remarks: Array.isArray(grade.remarks)
                        ? grade.remarks.join(", ")
                        : grade.remarks || "",
                };

                dispatch(
                    updateGradesDistributionAct(
                        generateActionPayload(
                            "update_grades_distribution",
                            { id: props.id }, payload,
                        )
                    )
                );
            } else {
                const payload = values.gradesSettingDTOs.map((item: any) => ({
                    fromPerc: parseFloat(item.fromPerc) || 0,
                    toPerc: parseFloat(item.toPerc) || 0,
                    grade: item.grade,
                    result: values.gradesSettingDTOs[0].result?.toUpperCase() || "PASS",
                    remarks: item.remarks,
                }));

                dispatch(
                    saveGradesDistributionAct(
                        generateActionPayload(
                            "save_grades_distribution", undefined,
                            payload
                        )
                    )
                );
            }
        },
    });

    useEffect(() => {
        if (props.id && getGradeDistrubutionByIdResp) {
            const formatted = Array.isArray(getGradeDistrubutionByIdResp)
                ? getGradeDistrubutionByIdResp
                : [getGradeDistrubutionByIdResp];

            settingsFormik.setValues({
                gradesSettingDTOs: formatted.map((item: any) => ({
                    id: generateUniqueNumber(),
                    grade: item.grade ?? "",
                    fromPerc: item.fromPerc?.toString() ?? "",
                    toPerc: item.toPerc?.toString() ?? "",
                    remarks: item.remarks?.toString() ?? "",
                    result: item.result
                        ? item.result.charAt(0).toUpperCase() + item.result.slice(1).toLowerCase()
                        : null,
                })),
            });

        } else {
            settingsFormik.resetForm({ values: initialValues });
        }
    }, [getGradeDistrubutionByIdResp]);

    return (
        <>
            <div className="row" style={{ padding: "1.25rem" }}>
                <div className='row d-flex justify-content-center'>
                    <div className="mb-2">
                        <div className="row align-items-center py-2 px-3">
                            <div className="col-2">
                                <h6 className="form-label required">Title</h6>
                            </div>
                            <div className="col-4">
                                <h6 className="form-label required">Between Marks</h6>
                            </div>
                            <div className="col-3">
                                <h6 className="form-label required">Remarks</h6>
                            </div>
                            <div className="col-2">
                                <h6 className="form-label required">Pass/Fail</h6>
                            </div>
                            <div className="col-1 text-end">
                                {settingsFormik.values.gradesSettingDTOs.length < 6 && (
                                    <button
                                        onClick={addSlabHandler}
                                        type="button"
                                        className="btn btn-outline-primary btn-sm fs-14"
                                    >
                                        <HugeiconsIcon icon={PlusSignIcon} size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <FormikProvider value={settingsFormik}>
                        <FieldArray name="gradesSettingDTOs">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {settingsFormik.values.gradesSettingDTOs.map(
                                            (item: any, index: number) => {
                                                const inputFieldErrors: any =
                                                    (settingsFormik.errors.gradesSettingDTOs &&
                                                        settingsFormik.errors.gradesSettingDTOs[index]) ||
                                                    {};
                                                const inputFieldTouched: any =
                                                    (settingsFormik.touched.gradesSettingDTOs &&
                                                        settingsFormik.touched.gradesSettingDTOs[index]) ||
                                                    {};

                                                return (
                                                    <div key={item.id} className="row align-items-center mb-2">
                                                        {/* Grade */}
                                                        <div className="col-2">
                                                            <TextInput
                                                                name={`gradesSettingDTOs[${index}].grade`}
                                                                value={item.grade}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0"
                                                                invalid={
                                                                    inputFieldTouched.grade && inputFieldErrors.grade
                                                                        ? true
                                                                        : false
                                                                }
                                                                error={
                                                                    inputFieldTouched.grade && inputFieldErrors.grade
                                                                        ? inputFieldErrors.grade
                                                                        : ""
                                                                }
                                                            />
                                                        </div>

                                                        {/* From → To % */}
                                                        <div className="col-4 d-flex align-items-center">
                                                            <TextInput
                                                                name={`gradesSettingDTOs[${index}].fromPerc`}
                                                                value={item.fromPerc}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0 me-2"
                                                                invalid={
                                                                    inputFieldTouched.fromPerc && inputFieldErrors.fromPerc
                                                                        ? true
                                                                        : false
                                                                }
                                                                error={
                                                                    inputFieldTouched.fromPerc && inputFieldErrors.fromPerc
                                                                        ? inputFieldErrors.fromPerc
                                                                        : ""
                                                                }
                                                            />
                                                            <HugeiconsIcon
                                                                icon={ArrowRight03Icon}
                                                                className="text-muted me-2"
                                                                size={16}
                                                            />
                                                            <TextInput
                                                                name={`gradesSettingDTOs[${index}].toPerc`}
                                                                value={item.toPerc}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0"
                                                                invalid={
                                                                    inputFieldTouched.toPerc && inputFieldErrors.toPerc
                                                                        ? true
                                                                        : false
                                                                }
                                                                error={
                                                                    inputFieldTouched.toPerc && inputFieldErrors.toPerc
                                                                        ? inputFieldErrors.toPerc
                                                                        : ""
                                                                }
                                                            />
                                                        </div>

                                                        {/* Pass / Fail Toggle */}
                                                        <div className="col-3 px-1">
                                                             <TextArea
                                                                name={`gradesSettingDTOs[${index}].remarks`}
                                                                value={item.remarks}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0"
                                                            />
                                                        </div>
                                                        <div className="col-2 px-1">
                                                            <PassFailToggle
                                                                value={item.result}
                                                                onChange={(val: any) =>
                                                                    settingsFormik.setFieldValue(
                                                                        `gradesSettingDTOs[${index}].result`,
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        {/* Delete button (not on first row) */}
                                                        {index !== 0 && (
                                                            <div className="col-1 px-1 justify-content-end d-flex">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        formikArrayHelpers.current?.remove(index)
                                                                    }
                                                                    className="btn btn-sm btn-icon btn-rounded btn-hover-danger btn-light"
                                                                >
                                                                    <HugeiconsIcon
                                                                        icon={Delete02StrokeStandard}
                                                                        className="text-danger"
                                                                        size={12}
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>

                </div>
                <div className="hstack gap-2 justify-content-end pb-0 mt-3">
                    <button
                        type="button"
                        className={"btn btn-light"}
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-success px-4"
                        type="submit"
                        onClick={(event: any) => settingsFormik.handleSubmit(event)}
                    >
                        Save
                    </button>
                </div>
            </div>


        </>
    )
}

export default AddGradeDistributionModal