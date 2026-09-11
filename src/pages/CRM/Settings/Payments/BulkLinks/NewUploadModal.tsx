import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    DateInput,
    SelectInput,
    StatusLabel,
    TextInput,
} from "../../../../../Components/Common";
import { settingsBranches } from "../../helper";
import {
    moneyText,
    parseBulkLinkFile,
    placeholderCount,
    templateBodies,
    whatsappAccountOptions,
    whatsappTemplateOptions,
    type BulkLinkRow,
} from "./helper";

interface NewUploadModalProps {
    toggle: () => void;
    onQueue: (payload: {
        fileName: string;
        branchId: string;
        templateId: string;
        rowCount: number;
        totalAmount: number;
    }) => void;
}

const NewUploadModal = ({ toggle, onQueue }: NewUploadModalProps) => {
    const [branchId, setBranchId] = useState<string>(
        settingsBranches[0]?.id || "",
    );
    const [componentType, setComponentType] = useState<string>("");
    const [expiresOn, setExpiresOn] = useState<string>("");

    const [accountId, setAccountId] = useState<string>("");
    const [templateId, setTemplateId] = useState<string>("");
    const [params, setParams] = useState<Array<string>>([]);
    const [linkParamIndex, setLinkParamIndex] = useState<string>("");

    const [fileName, setFileName] = useState<string>("");
    const [rows, setRows] = useState<Array<BulkLinkRow>>([]);
    const [parseError, setParseError] = useState<string>("");

    const templateBody = templateId ? templateBodies[templateId] || "" : "";
    const paramCount = placeholderCount(templateBody);

    const validRows = useMemo(() => rows.filter(row => !row.error), [rows]);
    const invalidRows = useMemo(() => rows.filter(row => row.error), [rows]);
    const totalAmount = useMemo(
        () =>
            validRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
        [validRows],
    );

    const previewText = useMemo(() => {
        if (!templateBody) {
            return "";
        }

        return templateBody.replace(/\{\{(\d+)\}\}/g, (match, index) => {
            const position = Number(index);

            if (String(position) === linkParamIndex) {
                return "https://pay.jodo.in/…";
            }

            const value = params[position - 1] || match;

            return String(value)
                .replace(/\{name\}/gi, validRows[0]?.name || "Parent")
                .replace(
                    /\{amount\}/gi,
                    Number(validRows[0]?.amount || 0).toLocaleString("en-IN"),
                );
        });
    }, [templateBody, params, linkParamIndex, validRows]);

    const templateChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextTemplateId = event.target.value;
        const count = placeholderCount(
            nextTemplateId ? templateBodies[nextTemplateId] || "" : "",
        );

        setTemplateId(nextTemplateId);
        setParams(Array.from({ length: count }, () => ""));
        setLinkParamIndex(count ? String(count) : "");
    };

    const accountChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setAccountId(event.target.value);
        setTemplateId("");
        setParams([]);
        setLinkParamIndex("");
    };

    const paramChangeHandler = (index: number, value: string) =>
        setParams(current =>
            current.map((item, position) =>
                position === index ? value : item,
            ),
        );

    const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const parsed = parseBulkLinkFile(String(reader.result || ""));

            setRows(parsed.rows);
            setParseError(parsed.error);
            setFileName(file.name);
        };
        reader.onerror = () => toast.error("Could not read that file");
        reader.readAsText(file);
    };

    const downloadSampleHandler = () => {
    };

    const submitHandler = () => {
        if (!branchId) {
            toast.error("Choose the branch collecting this money");
            return;
        }

        if (!validRows.length) {
            toast.error("No usable rows to send");
            return;
        }

        if (templateId && !linkParamIndex) {
            toast.error("Choose which placeholder carries the payment link");
            return;
        }

        onQueue({
            fileName,
            branchId,
            templateId,
            rowCount: validRows.length,
            totalAmount,
        });
        toggle();
    };

    return (
        <div className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    1 · Who is collecting
                </p>

                <div className="row">
                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="branchId"
                            labelText="Branch"
                            defaultSelect="Select branch"
                            value={branchId}
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ) => setBranchId(event.target.value)}
                            menuItems={settingsBranches}
                            valueKey="id"
                            textKey="name"
                        />
                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                            Only branches with Jodo credentials configured are
                            listed.
                        </p>
                    </div>

                    <div className="col-12 col-md-4">
                        <TextInput
                            name="componentType"
                            labelText="Jodo Component"
                            placeHolder="Leave blank for the branch default"
                            maxLength={120}
                            helperText="What these payments settle against in Jodo. Must match a component on the collector."
                            value={componentType}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setComponentType(event.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <DateInput
                            name="expiresOn"
                            labelText="Link Expires"
                            value={expiresOn}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setExpiresOn(event.target.value)}
                        />
                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                            Optional. After this date the link stops accepting
                            payment.
                        </p>
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    2 · The WhatsApp message
                </p>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="accountId"
                            labelText="WhatsApp Account"
                            defaultSelect="No message — raise links only"
                            value={accountId}
                            onChange={accountChangeHandler}
                            menuItems={whatsappAccountOptions}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    {accountId && (
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="templateId"
                                labelText="Template"
                                defaultSelect="Select an approved template"
                                value={templateId}
                                onChange={templateChangeHandler}
                                menuItems={whatsappTemplateOptions}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>
                    )}
                </div>

                {templateId && paramCount > 0 && (
                    <>
                        <div className="row">
                            {params.map((param, index) => (
                                <div
                                    className="col-12 col-md-6"
                                    key={`param-${index}`}
                                >
                                    <TextInput
                                        name={`param-${index}`}
                                        labelText={`Placeholder {{${index + 1}}}`}
                                        placeHolder="Text, or {name} / {amount}"
                                        isDisabled={
                                            linkParamIndex ===
                                            String(index + 1)
                                        }
                                        value={
                                            linkParamIndex ===
                                                String(index + 1)
                                                ? "Payment link"
                                                : param
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            paramChangeHandler(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            ))}

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="linkParamIndex"
                                    labelText="Placeholder That Carries The Link"
                                    labelClass="required"
                                    defaultSelect="Select a placeholder"
                                    value={linkParamIndex}
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>,
                                    ) =>
                                        setLinkParamIndex(event.target.value)
                                    }
                                    menuItems={params.map((item, index) => ({
                                        id: String(index + 1),
                                        name: `Placeholder {{${index + 1}}}`,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>

                        <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                            <code>{"{name}"}</code> becomes the payer&apos;s name
                            and <code>{"{amount}"}</code> what they owe, per
                            recipient.
                        </p>

                        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                            <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-gray-700">
                                Preview
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                {previewText}
                            </p>
                        </div>
                    </>
                )}

                {!accountId && (
                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                        Without a template the links are still raised, and Jodo
                        sends its own WhatsApp and email.
                    </p>
                )}

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    3 · The numbers
                </p>

                <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                    <label className="btn btn-light tw-mb-0 tw-cursor-pointer tw-border tw-border-gray-200">
                        <i className="ri-upload-2-line tw-me-1"></i>
                        {fileName || "Choose CSV file"}
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            className="tw-hidden"
                            onChange={fileChangeHandler}
                        />
                    </label>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={downloadSampleHandler}
                    >
                        <i className="ri-download-2-line"></i>
                        Sample File
                    </Button>
                </div>

                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                    The file needs a mobile number column and an amount column.
                    Name and email are optional — a missing name is taken from the
                    matching lead.
                </p>

                {parseError && (
                    <div className="alert alert-danger tw-mb-2">
                        {parseError}
                    </div>
                )}

                {rows.length > 0 && (
                    <>
                        <div className="tw-mb-2 tw-flex tw-flex-wrap tw-gap-3">
                            <span className="tw-text-sm tw-font-semibold tw-text-emerald-700">
                                {validRows.length} ready · {moneyText(totalAmount)}
                            </span>

                            {invalidRows.length > 0 && (
                                <span className="tw-text-sm tw-font-semibold tw-text-danger">
                                    {invalidRows.length} skipped
                                </span>
                            )}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th>#</th>
                                        <th>Mobile</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {rows.slice(0, 200).map(row => (
                                        <tr key={row.rowNumber}>
                                            <td className="tw-text-xs tw-text-gray-500">
                                                {row.rowNumber}
                                            </td>
                                            <td className="tw-text-sm tw-text-gray-800">
                                                {row.phone}
                                            </td>
                                            <td className="tw-text-sm tw-text-gray-700">
                                                {row.name || (
                                                    <span className="tw-text-gray-400">
                                                        From the lead
                                                    </span>
                                                )}
                                            </td>
                                            <td className="tw-text-sm tw-text-gray-800">
                                                {row.amount || "—"}
                                            </td>
                                            <td>
                                                {row.error ? (
                                                    <span className="tw-text-xs tw-text-danger">
                                                        {row.error}
                                                    </span>
                                                ) : (
                                                    <StatusLabel
                                                        type="active"
                                                        labelName="Ready"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {rows.length > 200 && (
                            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                Showing the first 200 of {rows.length} rows. All of
                                them are uploaded.
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    disabled={!validRows.length}
                    onClick={submitHandler}
                >
                    <i className="ri-send-plane-line"></i>
                    Raise {validRows.length || ""} Links And Send
                </Button>
            </div>
        </div>
    );
};

export default NewUploadModal;
