import React from "react";

export default function OtherDetails(props: any) {
    return (
        <div id={props.divId} className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-px-6 tw-py-4 tw-border-b">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Other Details</h4>
            </div>
            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                            <div className="tw-col-span-4">
                                <label className="tw-text-gray-600">Any Health Issues</label>
                            </div>
                            <div className="tw-col-span-8">
                                n/a
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                            <div className="tw-col-span-4">
                                <label className="tw-text-gray-600">Transport</label>
                            </div>
                            <div className="tw-col-span-8">
                                School Transportation
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                            <div className="tw-col-span-4">
                                <label className="tw-text-gray-600">Specify</label>
                            </div>
                            <div className="tw-col-span-8">
                                n/a
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                            <div className="tw-col-span-4">
                                <label className="tw-text-gray-600">Route</label>
                            </div>
                            <div className="tw-col-span-8">
                                n/a
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}