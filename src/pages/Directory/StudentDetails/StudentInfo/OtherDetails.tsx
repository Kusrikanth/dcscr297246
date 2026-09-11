import React from "react";

export default function OtherDetails() {
    return (
        <div className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-border-b tw-px-4 tw-py-2">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Other Details</h4>
            </div>
            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-2 tw-gap-y-2 tw-gap-x-4">
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Any Health Issues</div>
                        <div className="tw-col-span-2">n/a</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Transport</div>
                        <div className="tw-col-span-2">School Transportation</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Specify</div>
                        <div className="tw-col-span-2">n/a</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Route</div>
                        <div className="tw-col-span-2">n/a</div>
                    </div>
                </div>
            </div>
        </div>
    )
}