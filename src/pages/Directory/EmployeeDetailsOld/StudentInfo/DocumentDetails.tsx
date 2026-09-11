import React from "react";

export default function DocumentDetails() {
    return (
        <div className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-px-6 tw-py-4 tw-border-b">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Document Details
                </h4>
            </div>

            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 tw-gap-3">

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    Bonafide Certificate
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    DOB Certificate
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    Report Card of Term ( Current Year )
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    Final Report Card ( Last Year )
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    Aadhar Card / Passport
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                            <div className="tw-col-span-5">
                                <label className="tw-text-gray-600">
                                    Residence Address Copy
                                </label>
                            </div>
                            <div className="tw-col-span-7">
                                <i className="ri-download-line tw-text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}