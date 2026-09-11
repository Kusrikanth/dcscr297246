import React, { useContext, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, InformationCircleIcon, CircleArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import { BulkUploadStepperContext } from "../index";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { downloadFileData, generateColumns } from "./helper";
import { useAppDispatch } from "../../../../../../../hooks/storehook";
import { downloadStaticHealthFormAct } from "../../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";

const DownloadExcelFile = ({ toggle }) => {
    const stepperContext = useContext(BulkUploadStepperContext);
    const bulkContext = useContext(BulkUploadStepperContext);
    const dispatch = useAppDispatch();

    const handleDownloadTemplate = () => {
        const payload = {
            formType: "LMS_DIGITAL_CURRICULUM_UPLOAD",
        };
        dispatch(
            downloadStaticHealthFormAct(
                generateActionPayload("download_static_health_form", undefined, payload)
            )
        );
    };

    const handleNext = () => {
        stepperContext?.goToNextStep?.();
    };

    const handleCancel = () => {
        bulkContext?.closeModal?.();
    };

    const tableColumns = useMemo(() => generateColumns(), []);

    return (
        <>
            <div className="tw-px-10 tw-py-4">
                <div className="tw-grid tw-grid-cols-1 tw-gap-8">
                    <div className="lg:tw-col-span-2">
                        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-1">
                            Download Smart Template v5
                        </h3>
                        <p className="tw-text-gray-600 tw-mb-6">
                            The Smart Template v5 is an Excel file with built-in checks and examples.
                            Names are required; orders are optional.
                        </p>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-6 tw-gap-8">
                    <div className="lg:tw-col-span-3">
                        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2">
                            Filling guidelines
                        </h3>
                        <ol
                            className="tw-text-gray-700 tw-space-y-2 tw-mb-6 tw-pl-6"
                            style={{ listStyleType: "decimal" }}
                        >
                            <li>Enter Unit Name, Chapter Name and Topic Name for each topic row.</li>
                            <li>Enter Unit Order, Chapter Order and Topic Order as numbers (1, 2, 3...).</li>
                            <li>If you don't know exact order, you may leave any Order blank — the system auto-fills it.</li>
                            <li>Do not merge cells or insert new columns.</li>
                            <li>Do not create your own Unit / Chapter / Topic Codes.</li>
                        </ol>
                        <div className="tw-bg-[#FFF8E6] tw-border tw-border-[#F3E6C5] tw-rounded-lg tw-p-4">
                            <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2">
                                Common mistakes to avoid
                            </h3>
                            <ul className="tw-space-y-2 tw-pl-3">
                                <li className="tw-flex tw-gap-2 tw-text-gray-700">
                                    <HugeiconsIcon icon={InformationCircleIcon} size={16} className="tw-mt-0.5" />
                                    Leaving Topic Name empty while filling orders.
                                </li>
                                <li className="tw-flex tw-gap-2 tw-text-gray-700">
                                    <HugeiconsIcon icon={InformationCircleIcon} size={16} className="tw-mt-0.5" />
                                    Using text like "First" or "One" in Order columns.
                                </li>
                                <li className="tw-flex tw-gap-2 tw-text-gray-700">
                                    <HugeiconsIcon icon={InformationCircleIcon} size={16} className="tw-mt-0.5" />
                                    Renaming or deleting any header.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:tw-col-span-3 tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-p-5 tw-h-fit">
                        <div className="tw-flex">
                            <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-1">
                                Smart Template v5 (.xlsx)
                            </h3>
                            <div className="tw-flex tw-items-center tw-mb-2 ms-auto">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="tw-border tw-border-primary tw-text-primary tw-w-50 tw-flex tw-items-center tw-justify-center tw-text-sm tw-py-2 tw-px-3 tw-rounded-lg tw-transition tw-duration-200 tw-ease-in-out hover:tw-bg-[oklch(45.17%_0.086_271.61)] hover:tw-text-white">
                                    <HugeiconsIcon icon={Download01Icon} size={20} className="tw-text-primary hover:tw-text-white tw-mr-2" />
                                    Download File
                                </button>
                            </div>
                        </div>
                        <p className="tw-text-gray-600 tw-mb-4">
                            Production-ready template with validation, hints and examples.
                        </p>
                        <TableContainer
                            columns={tableColumns || []}
                            data={downloadFileData || []}
                            tableClass="mb-0"
                            divClass="table-responsive mb-2"
                            theadClass="table-light text-muted align-middle"
                            showCheckbox={false}
                            showPagination={false}
                        />
                        <p className="tw-text-gray-600 tw-text-sm tw-mb-0">
                            Red cells in Excel = missing required fields. Yellow cells = optional orders you may leave blank.
                        </p>
                    </div>
                </div>
                <div className="tw-flex tw-justify-between tw-items-center tw-pt-6 tw-mt-6 tw-border-t tw-border-gray-200">
                    <button
                        onClick={handleCancel}
                        className="tw-bg-white tw-border tw-border-gray-300 tw-text-gray-700 tw-px-6 tw-py-2 tw-rounded-md hover:tw-bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleNext}
                        // disabled={!selectedFile}
                        className="tw-bg-teal-600 hover:tw-bg-teal-700 disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed tw-text-white tw-px-6 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2 tw-transition-colors"
                    >
                        Next
                        <HugeiconsIcon icon={CircleArrowRight01Icon} size={16} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default DownloadExcelFile;
