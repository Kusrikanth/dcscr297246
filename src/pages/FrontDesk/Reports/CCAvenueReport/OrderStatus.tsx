export default function OrderStatus({ reportData }: any) {
    const tutionInstallementFee = reportData?.unpaidStudentCountSummary?.["Total Orders"]?.[0] || {},
        termIFee = reportData?.unpaidStudentCountSummary?.["Total success orders"]?.[0] || {},
        termIIFee = reportData?.unpaidStudentCountSummary?.["Total Recon Match"]?.[0] || {},
        termIIIFee = reportData?.unpaidStudentCountSummary?.["Total Recon Mismatch"]?.[0] || {},
        totalUnpaidStudent = reportData?.totalUnpaidStudents;

    return (
        <>
            <div className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-mb-4">
                <div className="tw-border-b tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0">
                        Order Status
                    </h4>
                </div>
                <div className="tw-p-4">
                    <div className="termwisepaid-chartcontainer tw-px-[10px]">
                        <div className="donutchart-container tw-flex tw-items-center tw-overflow-hidden unpaidorange-bar">
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <p className="tw-mb-2 tw-leading-tight tw-font-medium tw-text-gray-500 tw-truncate">
                                    Total Orders
                                </p>
                                <h3 className="tw-leading-none tw-mb-0 tw-font-normal tw-text-[#495057]"
                                >{tutionInstallementFee?.studentCount || 0}</h3>
                            </div>
                        </div>
                        <div className="donutchart-container tw-flex tw-items-center tw-overflow-hidden unpaidgreen-bar">
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <span className="tw-text-[#9599AD] tw-mb-2 tw-leading-tight">
                                    Total success orders
                                </span>
                                <h3 className="tw-leading-none tw-mb-0 tw-font-normal tw-text-[#495057]">{termIFee?.studentCount || 0}</h3>
                            </div>
                        </div>
                        <div className="donutchart-container tw-flex tw-items-center tw-overflow-hidden unpaidblue-bar">
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <span className="tw-text-[#9599AD] tw-mb-2 tw-leading-tight">
                                    Total Recon Match
                                </span>
                                <h3 className="tw-leading-none tw-mb-0 tw-font-normal tw-text-[#495057]">{termIIFee?.studentCount || 0}</h3>
                            </div>
                        </div>
                        <div className="donutchart-container tw-flex tw-items-center tw-overflow-hidden unpaidyellow-bar">
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <span className="tw-text-[#9599AD] tw-mb-2 tw-leading-tight">
                                    Total Recon Mismatch
                                </span>
                                <h3 className="tw-leading-none tw-mb-0 tw-font-normal tw-text-[#495057]">{termIIIFee?.studentCount || 0}</h3>
                            </div>
                        </div>
                        <div className="donutchart-container tw-flex tw-items-center tw-overflow-hidden unpaidpurple-bar">
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <p className="tw-mb-2 tw-leading-tight tw-font-medium tw-text-gray-500 tw-truncate">
                                    Total Failed Order
                                </p>
                                <h3 className="tw-leading-none tw-mb-0 tw-font-normal tw-text-[#495057]"
                                >{totalUnpaidStudent || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}