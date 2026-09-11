export default function StatusCard({ reportData }: any) {
    const tutionInstallementFee = reportData?.unpaidStudentCountSummary?.["Tution/Caution/Installment 1 Fee"]?.[0] || {},
        termIFee = reportData?.unpaidStudentCountSummary?.["Term-1"]?.[0] || {},
        termIIFee = reportData?.unpaidStudentCountSummary?.["Term-2"]?.[0] || {},
        termIIIFee = reportData?.unpaidStudentCountSummary?.["Term-3"]?.[0] || {},
        totalUnpaidStudent = reportData?.totalUnpaidStudents;

    return (
        <>
            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">

                <div className="tw-border-b tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">
                        Unpaid Students Count
                    </h4>
                </div>

                <div className="tw-p-4">
                    <div className="termwisepaid-chartcontainer tw-px-2">

                        <div className="donutchart-container unpaidorange-bar tw-flex tw-items-center tw-overflow-hidden tw-mb-3">
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <p className="tw-mb-1 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate">
                                    Tuition / Caution / Installment 1 Fee
                                </p>
                                <h3 className="tw-text-2xl tw-text-gray-700 tw-font-normal">
                                    {tutionInstallementFee?.studentCount || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="donutchart-container unpaidgreen-bar tw-flex tw-items-center tw-overflow-hidden tw-mb-3">
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <span className="tw-mb-1 tw-text-sm tw-text-gray-400">
                                    Term I Unpaid
                                </span>
                                <h3 className="tw-text-2xl tw-text-gray-700 tw-font-normal">
                                    {termIFee?.studentCount || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="donutchart-container unpaidblue-bar tw-flex tw-items-center tw-overflow-hidden tw-mb-3">
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <span className="tw-mb-1 tw-text-sm tw-text-gray-400">
                                    Term II Unpaid
                                </span>
                                <h3 className="tw-text-2xl tw-text-gray-700 tw-font-normal">
                                    {termIIFee?.studentCount || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="donutchart-container unpaidyellow-bar tw-flex tw-items-center tw-overflow-hidden tw-mb-3">
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <span className="tw-mb-1 tw-text-sm tw-text-gray-400">
                                    Term III Unpaid
                                </span>
                                <h3 className="tw-text-2xl tw-text-gray-700 tw-font-normal">
                                    {termIIIFee?.studentCount || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="donutchart-container unpaidpurple-bar tw-flex tw-items-center tw-overflow-hidden">
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <p className="tw-mb-1 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate">
                                    Total Unpaid
                                </p>
                                <h3 className="tw-text-2xl tw-text-gray-700 tw-font-normal">
                                    {totalUnpaidStudent || 0}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

 // <div className="row g-3 mb-3">
        //     <div className="col-3">
        //         <div className="card mb-0">
        //             <div className="card-body">
        //                 <div className="d-flex">
                            // <div className="d-flex flex-column flex-grow-1 overflow-hidden me-1">
                            //     <p className="mb-2 lh-sm fw-medium text-muted mb-0 text-truncate">
                            //         TUTION / CAUTION / INSTALLMENT 1 FEE
                            //     </p>
                            //     <h3 className="lh-1 mb-0" style={{ color: '#495057', fontWeight: 'normal' }}>{tutionInstallementFee?.studentCount || 0}</h3>
                            // </div>
        //                     <div className="d-flex justify-content-center align-items-center flex-shrink-0" style={{
        //                         height: '40px', width: '40px', backgroundColor: '#4051892D',
        //                         borderRadius: '6px'
        //                     }}>
        //                         <i className="ri-user-line text-primary fs-20px"></i>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-3">
        //         <div className="card mb-0">
        //             <div className="card-body">
        //                 <div className="d-flex">
                            // <div className="d-flex flex-column flex-grow-1">
                            //     <span style={{ color: '#9599AD' }} className="mb-2 lh-sm">
                            //         TERM I UNPAID
                            //     </span>
                            //     <h3 className="lh-1 mb-0" style={{ color: '#495057', fontWeight: 'normal' }}>{termIFee?.studentCount || 0}</h3>
                            // </div>
        //                     <div className="d-flex justify-content-center align-items-center flex-shrink-0" style={{
        //                         height: '40px', width: '40px', backgroundColor: '#4051892D',
        //                         borderRadius: '6px'
        //                     }}>
        //                         <i className="ri-user-line text-primary fs-20px"></i>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-3">
        //         <div className="card mb-0">
        //             <div className="card-body">
        //                 <div className="d-flex">
        //                     <div className="d-flex flex-column flex-grow-1">
                                // <span style={{ color: '#9599AD' }} className="mb-2 lh-sm">
                                //     TERM II UNPAID
                                // </span>
                                // <h3 className="lh-1 mb-0" style={{ color: '#495057', fontWeight: 'normal' }}>{termIIFee?.studentCount || 0}</h3>
        //                     </div>
        //                     <div className="d-flex justify-content-center align-items-center flex-shrink-0" style={{
        //                         height: '40px', width: '40px', backgroundColor: '#4051892D',
        //                         borderRadius: '6px'
        //                     }}>
        //                         <i className="ri-user-line text-primary fs-20px"></i>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-3">
        //         <div className="card mb-0">
        //             <div className="card-body">
        //                 <div className="d-flex">
        //                     <div className="d-flex flex-column flex-grow-1">
                                // <span style={{ color: '#9599AD' }} className="mb-2 lh-sm">
                                //     TERM II UNPAID
                                // </span>
                                // <h3 className="lh-1 mb-0" style={{ color: '#495057', fontWeight: 'normal' }}>{termIIIFee?.studentCount || 0}</h3>
        //                     </div>
        //                     <div className="d-flex justify-content-center align-items-center flex-shrink-0" style={{
        //                         height: '40px', width: '40px', backgroundColor: '#4051892D',
        //                         borderRadius: '6px'
        //                     }}>
        //                         <i className="ri-user-line text-primary fs-20px"></i>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>