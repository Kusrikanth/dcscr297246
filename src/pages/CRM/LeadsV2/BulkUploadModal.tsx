import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import {
    BrowseFile,
    Button,
} from "../../../Components/Common";
import { leadMeta } from "./data";

interface BulkUploadModalProps {
    toggle: () => void;
    onUploaded: (recordCount: number) => void;
}

type UploadStep =
    | "file-selection"
    | "validating"
    | "validation-result"
    | "uploading"
    | "upload-complete";

interface ParsedRecord {
    row: number;
    studentName: string;
    phone: string;
    email: string;
    branch: string;
    stage: string;
    errors: string[];
}

const PHONE_PATTERN = /^[6-9][0-9]{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const splitCsvLine = (line: string) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];

        if (character === '"') {
            if (inQuotes && line[index + 1] === '"') {
                current += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (character === "," && !inQuotes) {
            cells.push(current);
            current = "";
        } else {
            current += character;
        }
    }

    cells.push(current);

    return cells.map(cell => cell.trim());
};

const validateRecord = (
    record: Record<string, string>,
    row: number,
): ParsedRecord => {
    const errors: string[] = [];

    const studentName = record["Student Name"] || "";
    const phone = (record["Primary Phone"] || "").replace(
        /\D/g,
        "",
    );
    const email = record["Email"] || "";
    const branch = record["Branch"] || "";
    const stage = record["Stage"] || "";

    if (!studentName) {
        errors.push("Student name is required");
    }

    if (!phone) {
        errors.push("Primary phone is required");
    } else if (!PHONE_PATTERN.test(phone)) {
        errors.push(
            "Phone must be 10 digits starting with 6-9",
        );
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        errors.push("Email is not a valid address");
    }

    if (!record["Academic Year"]) {
        errors.push("Academic year is required");
    }

    if (!branch) {
        errors.push("Branch is required");
    } else if (
        !leadMeta.branches.some(
            item =>
                item.name.toLowerCase() ===
                branch.toLowerCase(),
        )
    ) {
        errors.push(`Branch "${branch}" is not configured`);
    }

    if (!record["Curriculum"]) {
        errors.push("Curriculum is required");
    }

    if (!record["Class"]) {
        errors.push("Class is required");
    }

    if (!stage) {
        errors.push("Stage is required");
    } else if (
        !leadMeta.stages.some(
            item =>
                item.displayName.toLowerCase() ===
                stage.toLowerCase(),
        )
    ) {
        errors.push(`Stage "${stage}" is not configured`);
    }

    if (!record["Sub-stage"]) {
        errors.push("Sub-stage is required");
    }

    return {
        row,
        studentName,
        phone,
        email,
        branch,
        stage,
        errors,
    };
};

const BulkUploadModal = ({
    toggle,
    onUploaded,
}: BulkUploadModalProps) => {
    const [step, setStep] = useState<UploadStep>(
        "file-selection",
    );
    const [file, setFile] = useState<File | undefined>();
    const [records, setRecords] = useState<ParsedRecord[]>([]);
    const [parseErrors, setParseErrors] = useState<string[]>(
        [],
    );
    const [hasValidated, setHasValidated] =
        useState<boolean>(false);

    const summary = useMemo(() => {
        const seen = new Set<string>();
        let duplicates = 0;

        records.forEach(record => {
            if (!record.phone) {
                return;
            }

            if (seen.has(record.phone)) {
                duplicates += 1;
            } else {
                seen.add(record.phone);
            }
        });

        const failed = records.filter(
            record => record.errors.length,
        );

        return {
            total: records.length,
            valid:
                records.length - failed.length - duplicates,
            failed: failed.length,
            duplicates,
            failedList: failed,
            isSuccess:
                records.length > 0 &&
                failed.length === 0 &&
                duplicates === 0,
        };
    }, [records]);

    const parseFile = async (selectedFile: File) => {
        const text = await selectedFile.text();
        const lines = text
            .split(/\r?\n/)
            .filter(line => line.trim().length);

        if (lines.length < 2) {
            setParseErrors([
                "The file has no data rows below the header.",
            ]);
            setRecords([]);
            return;
        }

        const headers = splitCsvLine(lines[0]).map(header =>
            header.replace(/\s*\*\s*$/, "").trim(),
        );

        const parsed = lines.slice(1).map((line, index) => {
            const cells = splitCsvLine(line);
            const record = Object.fromEntries(
                headers.map((header, cellIndex) => [
                    header,
                    cells[cellIndex] || "",
                ]),
            );

            return validateRecord(record, index + 2);
        });

        setParseErrors([]);
        setRecords(parsed);
    };

    const fileChangeHandler = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setHasValidated(false);
        setStep("file-selection");
        setFile(selectedFile);

        if (
            !selectedFile.name.toLowerCase().endsWith(".csv")
        ) {
            setParseErrors([
                "Only CSV files can be uploaded. Download the template below to start from the right columns.",
            ]);
            setRecords([]);
            return;
        }

        await parseFile(selectedFile);
    };

    const downloadTemplateHandler = () => {
    };

    const downloadErrorReportHandler = () => {
    };

    const validateHandler = () => {
        setStep("validating");

        window.setTimeout(() => {
            setHasValidated(true);
            setStep("validation-result");
        }, 600);
    };

    const uploadHandler = () => {
        setStep("uploading");

        window.setTimeout(() => {
            setStep("upload-complete");
            onUploaded(summary.valid);
        }, 800);
    };

    if (step === "validating" || step === "uploading") {
        return (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3 tw-p-10">
                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                    {step === "validating"
                        ? "Validating your records…"
                        : "Uploading your records…"}
                </p>
            </div>
        );
    }

    if (step === "upload-complete") {
        return (
            <div className="tw-p-6 tw-text-center">
                <i className="ri-checkbox-circle-line tw-text-5xl tw-text-emerald-500"></i>
                <h5 className="tw-mt-3 tw-text-base tw-font-semibold tw-text-gray-900">
                    Upload successful
                </h5>
                <p className="tw-mb-4 tw-text-sm tw-text-gray-500">
                    {summary.valid} lead
                    {summary.valid === 1 ? "" : "s"} received and
                    queued for processing.
                </p>
                <Button
                    type="button"
                    variant="primary"
                    onClick={toggle}
                >
                    Done
                </Button>
            </div>
        );
    }

    return (
        <div className="tw-bg-white">
            <div className="tw-p-4">
                <label className="form-label required">
                    Upload file (CSV)
                </label>

                <BrowseFile
                    name="bulkUploadFile"
                    labelText="Upload file (CSV)"
                    fileName={file?.name}
                    onChangeFileHndlr={fileChangeHandler}
                    containerClassName="tw-mb-3"
                    hideLabel
                />

                {parseErrors.length > 0 && (
                    <div className="alert alert-danger tw-mb-3">
                        {parseErrors.map(error => (
                            <div key={error}>{error}</div>
                        ))}
                    </div>
                )}

                {records.length > 0 && !hasValidated && (
                    <p className="tw-mb-3 tw-text-sm tw-text-gray-600">
                        Records to validate:{" "}
                        <strong>{records.length}</strong>
                    </p>
                )}

                {hasValidated && (
                    <>
                        <div
                            className={`alert ${summary.isSuccess ? "alert-success" : "alert-danger"} tw-mb-3`}
                        >
                            {summary.isSuccess
                                ? `Validation successful — ${summary.valid} record${summary.valid === 1 ? "" : "s"} ready to import`
                                : "Validation failed — fix the rows below and validate again"}
                        </div>

                        <div className="row tw-mb-3 tw-gap-y-3">
                            {[
                                {
                                    label: "Total records",
                                    value: summary.total,
                                    className: "tw-text-gray-900",
                                },
                                {
                                    label: "Valid records",
                                    value: summary.valid,
                                    className: "tw-text-emerald-600",
                                },
                                {
                                    label: "Failed",
                                    value: summary.failed,
                                    className: "tw-text-red-600",
                                },
                                {
                                    label: "Duplicates",
                                    value: summary.duplicates,
                                    className: "tw-text-amber-600",
                                },
                            ].map(card => (
                                <div
                                    key={card.label}
                                    className="col-6 col-lg-3"
                                >
                                    <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3 tw-text-center">
                                        <p
                                            className={`tw-mb-0 tw-text-xl tw-font-semibold ${card.className}`}
                                        >
                                            {card.value}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {card.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {summary.failedList.length > 0 && (
                            <div className="tw-max-h-64 tw-overflow-auto tw-rounded tw-border tw-border-gray-200">
                                <table className="table table-sm tw-mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Row</th>
                                            <th>Student name</th>
                                            <th>Phone</th>
                                            <th>Validation error</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.failedList.map(
                                            record => (
                                                <tr
                                                    key={record.row}
                                                >
                                                    <td>
                                                        {record.row}
                                                    </td>
                                                    <td>
                                                        {record.studentName ||
                                                            "—"}
                                                    </td>
                                                    <td>
                                                        {record.phone ||
                                                            "—"}
                                                    </td>
                                                    <td>
                                                        {record.errors.map(
                                                            error => (
                                                                <div
                                                                    key={
                                                                        error
                                                                    }
                                                                    className="tw-text-xs tw-text-red-600"
                                                                >
                                                                    •{" "}
                                                                    {
                                                                        error
                                                                    }
                                                                </div>
                                                            ),
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {!hasValidated && (
                    <Button
                        type="button"
                        variant="linkBtn"
                        onClick={downloadTemplateHandler}
                    >
                        <i className="ri-download-2-line"></i>
                        Download template
                    </Button>
                )}
            </div>

            <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
                {hasValidated && summary.failed > 0 && (
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={downloadErrorReportHandler}
                    >
                        <i className="ri-download-2-line"></i>
                        Download error report
                    </Button>
                )}

                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>

                {hasValidated && summary.isSuccess ? (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={uploadHandler}
                    >
                        Upload records
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="primary"
                        disabled={!records.length}
                        onClick={validateHandler}
                    >
                        {hasValidated
                            ? "Validate again"
                            : "Validate file"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BulkUploadModal;
