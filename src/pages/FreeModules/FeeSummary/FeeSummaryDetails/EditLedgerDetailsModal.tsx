import { useFormik } from "formik";
import * as Yup from "yup";
import { DateInput, SelectInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import { getParticularFormatDate } from "../../../../utility/dateutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { JODO_PAYMENT_METHOD_OPTIONS } from "./helper";

interface IEditLedgerDetailsValues {
    lastDate: string;
    jodoPaymentMethod: string;
}

interface IEditLedgerDetailsModal {
    ledgerDetail: any;
    isDisabled?: boolean;
    toggle: () => void;
    submitHndlr: (values: IEditLedgerDetailsValues) => void;
}

const EditLedgerDetailsModal = ({ ledgerDetail, isDisabled, toggle, submitHndlr }: IEditLedgerDetailsModal) => {
    const currentLastDate = ledgerDetail?.lastDate
        ? getParticularFormatDate(ledgerDetail.lastDate, "yyyy-MM-dd")
        : "";

    const editLedgerForm = useFormik<IEditLedgerDetailsValues>({
        initialValues: {
            lastDate: currentLastDate && currentLastDate !== "-" ? currentLastDate : "",
            jodoPaymentMethod: ledgerDetail?.jodoPaymentMethod || "",
        },
        validationSchema: Yup.object({
            lastDate: Yup.string().required("Please select the last date."),
        }),
        onSubmit: (values) => {
            submitHndlr(values);
        },
    });

    return (
        <div className="p-3">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
                <div className="tw-col-span-6">
                    <div className="text-muted">Fee Details</div>
                    <div className="fw-medium">{ledgerDetail?.feeDetails || "-"}</div>
                </div>
                <div className="tw-col-span-6">
                    <div className="text-muted">Amount To Pay (₹)</div>
                    <div className="fw-medium">{getDisplayAmountValue(ledgerDetail?.netAmount)}</div>
                </div>
                <div className="tw-col-span-6">
                    <DateInput
                        name="lastDate"
                        labelText="Last Date"
                        labelClass="required"
                        value={editLedgerForm.values.lastDate}
                        onChange={editLedgerForm.handleChange}
                        onBlur={editLedgerForm.handleBlur}
                        formgroupClassName="tw-mb-0"
                        invalid={!!(editLedgerForm.touched.lastDate && editLedgerForm.errors.lastDate)}
                        error={editLedgerForm.touched.lastDate && editLedgerForm.errors.lastDate
                            ? editLedgerForm.errors.lastDate
                            : ""}
                    />
                </div>
                <div className="tw-col-span-6">
                    <SelectInput
                        name="jodoPaymentMethod"
                        labelText="Jodo Payment Method"
                        value={editLedgerForm.values.jodoPaymentMethod}
                        onChange={editLedgerForm.handleChange}
                        onBlur={editLedgerForm.handleBlur}
                        menuItems={JODO_PAYMENT_METHOD_OPTIONS}
                        valueKey="value"
                        textKey="label"
                        defaultSelect="Not Opted"
                        formgroupClassName="tw-mb-0"
                    />
                </div>
            </div>
            <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                <Button type="button" variant="secondary" onClick={toggle}>Cancel</Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="!tw-px-4"
                    disabled={isDisabled}
                    onClick={editLedgerForm.submitForm}
                >
                    Update
                </Button>
            </div>
        </div>
    );
};

export default EditLedgerDetailsModal;
