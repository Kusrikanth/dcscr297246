import React, { useEffect, useState, useRef, useMemo } from "react";
import { shallowEqual } from "react-redux";
import {
    SelectInput, DateInput
} from "../../../Components/Common";
import { useFormik } from "formik";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { addFeeFineAct, updateFeeFineAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
//Helper
import { feeTypes, admissionTypeOptions } from "./helper";
//Utility
import { getAmountValueWithDecimal } from "../../../utility/commonutility";


import { setFeeNameByTypeAct } from "../../../store/fee/feereport/feereportslice";
import { getFeeNameByTypeAct } from "../../../store/fee/feereport/feereportactions";
import Button from "../../../Components/Common/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon, InformationCircleIcon } from "@hugeicons-pro/core-stroke-standard";

type FineType = "FIXED" | "PERCENTAGE";
type FineSlab = { id: number; min: string; max: string; fine: string };

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(Number.isFinite(value) ? value : 0);
const toNumber = (value: string) => value === "" ? NaN : Number(value);

const getSlabErrors = (slabs: FineSlab[]) => slabs.map((slab, index) => {
    const errors: Partial<Record<"min" | "max" | "fine", string>> = {};
    const min = toNumber(slab.min);
    const max = toNumber(slab.max);
    const fine = toNumber(slab.fine);
    if (slab.min === "") errors.min = "Minimum amount is required.";
    else if (!Number.isFinite(min)) errors.min = "Enter a valid amount.";
    else if (min < 0) errors.min = "Amount cannot be negative.";
    if (slab.fine === "") errors.fine = "Fine per day is required.";
    else if (!Number.isFinite(fine)) errors.fine = "Enter a valid fine amount.";
    else if (fine < 0) errors.fine = "Fine cannot be negative.";
    if (slab.max !== "" && !Number.isFinite(max)) errors.max = "Enter a valid amount.";
    else if (slab.max !== "" && max < 0) errors.max = "Amount cannot be negative.";
    else if (slab.max !== "" && max < min) errors.max = "Maximum must be greater than or equal to minimum.";

    if (index < slabs.length - 1 && slab.max === "") {
        errors.max = "Only the final slab can have no limit.";
    }
    const overlaps = slabs.some((other, otherIndex) => {
        if (otherIndex === index || other.min === "" || slab.min === "") return false;
        const otherMin = toNumber(other.min);
        const otherMax = other.max === "" ? Infinity : toNumber(other.max);
        const slabMax = slab.max === "" ? Infinity : max;
        return min <= otherMax && otherMin <= slabMax;
    });
    if (overlaps) errors.min = "This range overlaps another slab.";
    return errors;
});


function getAddEditFeeName(editData?: any) {
    return {
        academicYearId: editData?.academicYearId || "",
        feeType: editData?.feeType || "",
        feeName: editData?.feeName || "",
        // gracePeriod: editData?.gracePeriod || "",
        dueDate: editData?.dueDate || "",
        admissionTypesForFines: editData?.admissionTypesForFines || "",
        finePerDay: getAmountValueWithDecimal(editData?.finePerDay),
    }
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year required."),
    feeType: Yup.string().required("Fee type required."),
    feeName: Yup.string().required("Fine name required."),
    admissionTypesForFines: Yup.string().required("Type required."),
    // gracePeriod: Yup.number().typeError("Enter a valid number").required("Grace period required."),

    finePerDay: Yup.string().test("finePerDayValidation", "Fine amount should be greater than zero.",
        (value: any, schema: any) => {
            if (!Number(value)) {
                return false;
            }
            return true;
        }),
});

const initialState = getAddEditFeeName();
const AddFeeFineModal: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const isEditMode = !!props.feeFineId;
    const [fineType, setFineType] = useState<FineType>("FIXED");
    const [slabs, setSlabs] = useState<FineSlab[]>([
        { id: 1, min: "0", max: "50000", fine: "50" },
        { id: 2, min: "50001", max: "", fine: "100" },
    ]);
    const [annualRate, setAnnualRate] = useState("18");
    const [outstandingDue, setOutstandingDue] = useState("60000");
    const [overdueDays, setOverdueDays] = useState("10");
    const [configurationTouched, setConfigurationTouched] = useState(false);

    const { academicYearListResp, feeNameByTypeResp,
        addFeeFineResp, showApiLoader, updateFeeFineResp } = useAppSelector(({ instAcademics, globalData, feeReport, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            feeNameByTypeResp: feeReport.feeNameByTypeResp,
            addFeeFineResp: masterFeeSettings.addFeeFineResp,
            updateFeeFineResp: masterFeeSettings.updateFeeFineResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const feeFineModalRef = useRef({
        prevAddFeeFineResp: addFeeFineResp,
        prevUpdateFeeFineResp: updateFeeFineResp
    });

    useEffect(() => {
        const { prevAddFeeFineResp, prevUpdateFeeFineResp } = feeFineModalRef.current;
        if (addFeeFineResp && prevAddFeeFineResp !== addFeeFineResp) {
            props.toggle(true);
            toast.success("Fee fine added successfully.");
        } else if (updateFeeFineResp && prevUpdateFeeFineResp !== updateFeeFineResp) {
            props.toggle(true);
            toast.success("Fee fine updated successfully.");
        }
        feeFineModalRef.current.prevAddFeeFineResp = addFeeFineResp;
        feeFineModalRef.current.prevUpdateFeeFineResp = updateFeeFineResp;
    }, [addFeeFineResp, updateFeeFineResp]);

    useEffect(() => {
        if (isEditMode) return;
        if (academicYearListResp) {
            const yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
            feeFineModalForm.setFieldValue("academicYearId", yearId || '');
        }
    }, [isEditMode, academicYearListResp]);

    useEffect(() => {
        if (props.editFeeFineDetails && academicYearListResp) {
            const feeFineData = getAddEditFeeName(props.editFeeFineDetails);
            const { feeType, academicYearId } = props.editFeeFineDetails;
            getFeenameApiCall(feeType, academicYearId);
            feeFineModalForm.resetForm({
                values: feeFineData
            })
        }
    }, [props.editFeeFineDetails, academicYearListResp]);

    const feeFineModalForm = useFormik({
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            setConfigurationTouched(true);
            const hasSlabErrors = getSlabErrors(slabs).some(error => Object.keys(error).length > 0);
            const rate = toNumber(annualRate);
            if ((fineType === "FIXED" && hasSlabErrors) ||
                (fineType === "PERCENTAGE" && (annualRate === "" || rate < 0))) {
                return;
            }
            const payload: any = { ...values };
            delete payload.academicYearId;
            if (props.feeFineId) {
                const params = { feeFineId: props.feeFineId };
                dispatch(updateFeeFineAct(generateActionPayload("update_fee_fine", params, payload)));
            } else {
                const payload = { ...values },
                    params = {
                        instituteId: props.instituteId,
                        branchId: props.branchId,
                        academicYearId: values.academicYearId
                    }
                dispatch(addFeeFineAct(generateActionPayload("add_fee_fine", params, payload)));
            }
        },
    });

    useEffect(() => {
        // Preserve the existing endpoint contract until the new configuration API is available.
        if (fineType === "FIXED" && slabs[0]?.fine) {
            feeFineModalForm.setFieldValue("finePerDay", getAmountValueWithDecimal(slabs[0].fine), false);
        }
    }, [fineType, slabs[0]?.fine]);

    function getFeenameApiCall(feeType: string, academicYearId: string) {
        dispatch(getFeeNameByTypeAct(generateActionPayload("get_feename_byfeetype", undefined, {
            branchId: props.branchId,
            feeType, academicYearId
        })));
    }

    function onChangeFeeTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            feeName: ''
        }));
        dispatch(setFeeNameByTypeAct(undefined));
        if (value && feeFineModalForm.values.academicYearId) {
            getFeenameApiCall(value, feeFineModalForm.values.academicYearId);
        }
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            feeName: ''
        }));
        dispatch(setFeeNameByTypeAct(undefined));
        if (value && feeFineModalForm.values.feeType) {
            getFeenameApiCall(feeFineModalForm.values.feeType, value);
        }
    }

    const feeNameOptions = useMemo(() => {
        if (Array.isArray(feeNameByTypeResp)) {
            return feeNameByTypeResp.map(item => ({ name: item }));
        }
        return [];
    }, [feeNameByTypeResp]);

    const slabErrors = useMemo(() => getSlabErrors(slabs), [slabs]);
    const due = Math.max(0, toNumber(outstandingDue) || 0);
    const days = Math.max(0, Math.floor(toNumber(overdueDays) || 0));
    const applicableSlab = fineType === "FIXED" ? slabs.find(slab => {
        const min = toNumber(slab.min);
        const max = slab.max === "" ? Infinity : toNumber(slab.max);
        return Number.isFinite(min) && due >= min && due <= max;
    }) : undefined;
    const dailyFine = fineType === "FIXED"
        ? Math.max(0, toNumber(applicableSlab?.fine || "0") || 0)
        : Math.round(due * Math.max(0, toNumber(annualRate) || 0) / 100 / 365);
    const totalFine = dailyFine * days;

    const updateSlab = (id: number, field: "min" | "max" | "fine", value: string) => {
        setConfigurationTouched(true);
        setSlabs(current => current.map(slab => slab.id === id ? { ...slab, [field]: value } : slab));
    };

    const addSlab = () => {
        const last = slabs[slabs.length - 1];
        const nextMin = last?.max !== "" && Number.isFinite(Number(last?.max)) ? String(Number(last.max) + 1) : "";
        setSlabs(current => [...current, { id: Date.now(), min: nextMin, max: "", fine: "" }]);
        setConfigurationTouched(true);
    };

    const removeSlab = (id: number) => {
        setSlabs(current => current.filter(slab => slab.id !== id));
        setConfigurationTouched(true);
    };

    const numberChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value === "" || /^\d*\.?\d*$/.test(event.target.value)) setter(event.target.value);
        };


    return (
        <form onSubmit={feeFineModalForm.handleSubmit}>
            <div className="tw-pb-0 tw-p-4 fine-configuration-modal">
                <div className="tw-flex tw-flex-col">

                    <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                labelClass={isEditMode ? "" : "required"}
                                value={feeFineModalForm.values.academicYearId}
                                onChange={onChangeAcademicYearHndlr}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                isDisabled={isEditMode}
                                invalid={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? true : false}
                                error={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? feeFineModalForm.errors.academicYearId : ""}
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="feeType"
                                labelClass="required"
                                value={feeFineModalForm.values.feeType}
                                onChange={onChangeFeeTypeHndlr}
                                menuItems={feeTypes}
                                valueKey="id"
                                textKey="name"
                                labelText="Fee Type"
                                invalid={(feeFineModalForm.touched.feeType && feeFineModalForm.errors.feeType) ? true : false}
                                error={(feeFineModalForm.touched.feeType && feeFineModalForm.errors.feeType) ? feeFineModalForm.errors.feeType : ""}

                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="feeName"
                                labelClass="required"
                                value={feeFineModalForm.values.feeName}
                                onChange={feeFineModalForm.handleChange}
                                menuItems={feeNameOptions}
                                valueKey="name"
                                textKey="name"
                                labelText="Fee Name"
                                invalid={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? true : false}
                                error={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? feeFineModalForm.errors.feeName : ""}
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <DateInput
                                name="dueDate"
                                value={feeFineModalForm.values?.dueDate}
                                onChange={feeFineModalForm.handleChange}
                                labelText="Due Date"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="admissionTypesForFines"
                                labelClass="required"
                                value={feeFineModalForm.values.admissionTypesForFines}
                                onChange={feeFineModalForm.handleChange}
                                menuItems={admissionTypeOptions}
                                valueKey="id"
                                textKey="name"
                                labelText="Admission Type"
                                invalid={(feeFineModalForm.touched.admissionTypesForFines && feeFineModalForm.errors.admissionTypesForFines) ? true : false}
                                error={(feeFineModalForm.touched.admissionTypesForFines && feeFineModalForm.errors.admissionTypesForFines) ? feeFineModalForm.errors.admissionTypesForFines : ""}
                            />
                        </div>

                    </div>

                    <section className="fine-config-section" aria-labelledby="fine-type-heading">
                        <div className="fine-section-heading">
                            <div>
                                <h3 id="fine-type-heading">Fine Type <span aria-hidden="true">*</span></h3>
                                <p>Choose how the daily fine should be calculated.</p>
                            </div>
                        </div>
                        <div className="fine-type-selector" role="radiogroup" aria-labelledby="fine-type-heading">
                            {([{"value":"FIXED","label":"Fixed Amount","description":"Set daily fines using due-amount slabs."},{"value":"PERCENTAGE","label":"Annual Percentage","description":"Calculate a daily fine from an annual rate."}] as const).map(option => (
                                <label className={`fine-type-option ${fineType === option.value ? "is-selected" : ""}`} key={option.value}>
                                    <input type="radio" name="fineType" value={option.value} checked={fineType === option.value}
                                        onChange={() => { setFineType(option.value); setConfigurationTouched(false); }} />
                                    <span><strong>{option.label}</strong><small>{option.description}</small></span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {fineType === "FIXED" ? (
                        <section className="fine-config-section" aria-labelledby="slab-heading">
                            <div className="fine-section-heading">
                                <div><h3 id="slab-heading">Fine slabs</h3><p>Define the daily fine for each outstanding fee range.</p></div>
                                <Button type="button" variant="hoverInfo" size="sm" onClick={addSlab}>
                                    <HugeiconsIcon icon={Add01Icon} size={16} /> Add slab
                                </Button>
                            </div>
                            {slabs.length === 0 ? (
                                <div className="fine-empty-state">No slabs configured. Add a slab to define a fixed daily fine.</div>
                            ) : (
                                <div className="fine-slab-list" role="group" aria-label="Fixed amount fine slabs">
                                    <div className="fine-slab-header" aria-hidden="true"><span>Fee Due From</span><span>Fee Due To</span><span>Fine Per Day</span><span>Action</span></div>
                                    {slabs.map((slab, index) => (
                                        <div className="fine-slab-row" key={slab.id}>
                                            <div className="fine-number-field">
                                                <label htmlFor={`slab-min-${slab.id}`}>Fee Due From</label>
                                                <span>₹</span><input id={`slab-min-${slab.id}`} inputMode="decimal" value={slab.min}
                                                    onChange={event => updateSlab(slab.id, "min", event.target.value)} aria-invalid={!!slabErrors[index]?.min} />
                                                {configurationTouched && slabErrors[index]?.min && <small role="alert">{slabErrors[index].min}</small>}
                                            </div>
                                            <div className="fine-number-field">
                                                <label htmlFor={`slab-max-${slab.id}`}>Fee Due To</label>
                                                <span>₹</span><input id={`slab-max-${slab.id}`} inputMode="decimal" value={slab.max}
                                                    placeholder={index === slabs.length - 1 ? "No limit" : "Enter amount"}
                                                    onChange={event => updateSlab(slab.id, "max", event.target.value)} aria-invalid={!!slabErrors[index]?.max} />
                                                {configurationTouched && slabErrors[index]?.max && <small role="alert">{slabErrors[index].max}</small>}
                                            </div>
                                            <div className="fine-number-field">
                                                <label htmlFor={`slab-fine-${slab.id}`}>Fine Per Day</label>
                                                <span>₹</span><input id={`slab-fine-${slab.id}`} inputMode="decimal" value={slab.fine}
                                                    onChange={event => updateSlab(slab.id, "fine", event.target.value)} aria-invalid={!!slabErrors[index]?.fine} />
                                                {configurationTouched && slabErrors[index]?.fine && <small role="alert">{slabErrors[index].fine}</small>}
                                            </div>
                                            <button type="button" className="fine-remove-button" onClick={() => removeSlab(slab.id)}
                                                aria-label={`Remove slab ${index + 1}`} title="Remove slab">
                                                <HugeiconsIcon icon={Delete02Icon} size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="fine-rule-summary" aria-live="polite">
                                <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                                <div><strong>Fine summary</strong>
                                    {slabs.length > 0 && !slabErrors.some(error => Object.keys(error).length) ? slabs.map((slab) => (
                                        <p key={slab.id}>{slab.max === ""
                                            ? `If fee due is ${Number(slab.min) > 0 ? `more than ${formatCurrency(Math.max(0, Number(slab.min) - 1))}` : "any amount"}, the fine is ${formatCurrency(Number(slab.fine))} per day.`
                                            : Number(slab.min) === 0
                                                ? `If fee due is less than or equal to ${formatCurrency(Number(slab.max))}, the fine is ${formatCurrency(Number(slab.fine))} per day.`
                                                : `If fee due is between ${formatCurrency(Number(slab.min))} and ${formatCurrency(Number(slab.max))}, the fine is ${formatCurrency(Number(slab.fine))} per day.`}</p>
                                    )) : <p>Complete valid, non-overlapping ranges to see the fine rules.</p>}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="fine-config-section" aria-labelledby="annual-heading">
                            <div className="fine-section-heading"><div><h3 id="annual-heading">Annual percentage fine</h3><p>Set an annual rate that will be converted to a daily fine.</p></div></div>
                            <div className="fine-annual-grid">
                                <div className="fine-number-field fine-rate-field">
                                    <label className="required" htmlFor="annualFineRate">Annual Fine Rate (%)</label>
                                    <input id="annualFineRate" inputMode="decimal" value={annualRate} onChange={numberChange(setAnnualRate)}
                                        onBlur={() => setConfigurationTouched(true)} aria-invalid={configurationTouched && (annualRate === "" || Number(annualRate) < 0)} />
                                    {configurationTouched && annualRate === "" && <small role="alert">Annual fine rate is required.</small>}
                                    {configurationTouched && Number(annualRate) < 0 && <small role="alert">Rate cannot be negative.</small>}
                                    <p className="fine-helper-text">The entered percentage is treated as an annual rate and converted into a daily fine using 365 days.</p>
                                </div>
                                <div className="fine-formula-card">
                                    <span>Calculation formula</span><strong>Fine Per Day = Outstanding Due × Annual Percentage ÷ 100 ÷ 365</strong>
                                    <p>{formatCurrency(due)} × {annualRate || 0}% ÷ 365 = ₹{(due * (Number(annualRate) || 0) / 100 / 365).toFixed(1)}</p>
                                    <p>Rounded Fine Per Day = <strong>{formatCurrency(dailyFine)}</strong></p>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="fine-config-section fine-preview-section" aria-labelledby="preview-heading">
                        <div className="fine-section-heading"><div><h3 id="preview-heading">Fine Calculation Preview</h3><p>Test the configuration. These values are for preview only.</p></div></div>
                        <div className="fine-preview-inputs">
                            <div className="fine-number-field"><label htmlFor="outstandingDue">Outstanding Fee Due</label><span>₹</span>
                                <input id="outstandingDue" inputMode="decimal" value={outstandingDue} onChange={numberChange(setOutstandingDue)} aria-describedby="outstanding-help" />
                                <small id="outstanding-help" className="fine-field-hint">Enter the current unpaid fee amount.</small>
                            </div>
                            <div className="fine-number-field"><label htmlFor="overdueDays">Number of Overdue Days</label>
                                <input id="overdueDays" inputMode="numeric" value={overdueDays} onChange={numberChange(setOverdueDays)} />
                            </div>
                            <div className="fine-preview-readonly"><span>Fine Type</span><strong>{fineType === "FIXED" ? "Fixed Amount" : "Annual Percentage"}</strong></div>
                            {fineType === "PERCENTAGE" && <div className="fine-preview-readonly"><span>Annual Percentage</span><strong>{annualRate || 0}%</strong></div>}
                        </div>
                        <div className="fine-preview-result" aria-live="polite">
                            <div><span>{fineType === "FIXED" ? "Applicable slab" : "Annual rate"}</span>
                                <strong>{fineType === "FIXED" ? (applicableSlab ? `${formatCurrency(Number(applicableSlab.min))} – ${applicableSlab.max === "" ? "No limit" : formatCurrency(Number(applicableSlab.max))}` : "No matching slab") : `${annualRate || 0}% per year`}</strong></div>
                            <div><span>Fine per day</span><strong>{formatCurrency(dailyFine)}</strong></div>
                            <div><span>Overdue days</span><strong>{days}</strong></div>
                            <div className="fine-preview-total"><span>Total estimated fine</span><strong>{formatCurrency(totalFine)}</strong></div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="tw-border-t tw-shadow-inner">
                <div className="tw-flex tw-gap-2 tw-justify-end tw-p-4">
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
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddFeeFineModal;
