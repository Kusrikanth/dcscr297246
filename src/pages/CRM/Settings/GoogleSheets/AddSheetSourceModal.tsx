import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, SelectInput } from "../../../../Components/Common";
import { formatDateTime, settingsBranches } from "../helper";
import {
    availableSpreadsheets,
    googleIntegrations,
    type SheetSource,
} from "./helper";

interface AddSheetSourceModalProps {
    existingSources: Array<SheetSource>;
    toggle: () => void;
    onSave: (source: SheetSource) => void;
}

const validationSchema = Yup.object().shape({
    integrationId: Yup.string().required("Select a Google Sheets connection"),

    sheetId: Yup.string().required("Select a spreadsheet"),

    branchId: Yup.string().required("Select the destination branch"),
});

const AddSheetSourceModal = ({
    existingSources,
    toggle,
    onSave,
}: AddSheetSourceModalProps) => {
    const authorizedIntegrations = googleIntegrations.filter(
        integration => integration.isAuthorized,
    );

    const formik = useFormik({
        initialValues: {
            integrationId: authorizedIntegrations[0]?.id || "",
            sheetId: "",
            branchId: "",
        },

        validationSchema,

        onSubmit: values => {
            const spreadsheet = availableSpreadsheets.find(
                sheet => sheet.id === values.sheetId,
            );
            const integration = googleIntegrations.find(
                item => item.id === values.integrationId,
            );

            onSave({
                id: `source-${Date.now()}`,
                integrationId: values.integrationId,
                integrationName: integration?.name || "",
                sheetId: values.sheetId,
                sheetName: spreadsheet?.name || "",
                branchId: values.branchId,
                status: "mapping_required",
                lastSyncAt: "",
                rowsImported: 0,
            });

            toggle();
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const spreadsheetOptions = availableSpreadsheets.map(sheet => {
        const isTaken = existingSources.some(
            source =>
                source.sheetId === sheet.id &&
                source.branchId === formik.values.branchId,
        );

        return {
            id: sheet.id,
            name: `${sheet.name}${isTaken ? " · already connected" : ""} · updated ${formatDateTime(sheet.modifiedAt)}`,
            isTaken,
        };
    });

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            {!authorizedIntegrations.length ? (
                <div className="alert alert-warning tw-mb-0">
                    No authorized Google Sheets connection. Authorize one under
                    Integrations before adding a sheet.
                </div>
            ) : (
                <>
                    <SelectInput
                        name="integrationId"
                        labelText="Google Sheets Connection"
                        labelClass="required"
                        defaultSelect="Select a connection"
                        value={formik.values.integrationId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={authorizedIntegrations.map(integration => ({
                            id: integration.id,
                            name: `${integration.name} · ${integration.accountEmail}`,
                        }))}
                        valueKey="id"
                        textKey="name"
                        invalid={errorFor("integrationId") ? true : false}
                        error={errorFor("integrationId")}
                    />

                    <SelectInput
                        name="branchId"
                        labelText="Import Leads Into Branch"
                        labelClass="required"
                        defaultSelect="Select branch"
                        value={formik.values.branchId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={settingsBranches}
                        valueKey="id"
                        textKey="name"
                        invalid={errorFor("branchId") ? true : false}
                        error={errorFor("branchId")}
                    />

                    <SelectInput
                        name="sheetId"
                        labelText="Spreadsheet"
                        labelClass="required"
                        defaultSelect="Select a spreadsheet"
                        value={formik.values.sheetId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={spreadsheetOptions.filter(
                            option => !option.isTaken,
                        )}
                        valueKey="id"
                        textKey="name"
                        invalid={errorFor("sheetId") ? true : false}
                        error={errorFor("sheetId")}
                    />

                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Adding a sheet does not import anything yet — map its columns
                        to the CRM fields to activate continuous import.
                    </p>
                </>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!authorizedIntegrations.length}
                >
                    Add Source
                </Button>
            </div>
        </form>
    );
};

export default AddSheetSourceModal;
