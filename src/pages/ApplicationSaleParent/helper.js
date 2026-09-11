export function createPaymentPayload(saleFormInfo, otherInfo) {
    return (
        {
            branchId: otherInfo?.branchId,
            academicYearId: otherInfo?.academicYearId,
            curriculumId: otherInfo?.curriculumId,
            classId: saleFormInfo?.admissionClassId,
            name: saleFormInfo?.fullName,
            phone: saleFormInfo?.contactNumber,
            email: saleFormInfo?.emailId,
            applicationSaleId: otherInfo?.applicationSaleId,
            gateWayType: otherInfo?.gateWayType,
            paymentType: "APPLICATION_SALE",
            details: [
                {
                    component_type: "Payable Amount",
                    amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : otherInfo?.amount
                }
            ],
            callback_url: `${import.meta.env.VITE_APPLICATION_URL}/applicationsuccess/${otherInfo?.applicationSaleId}`
        }
    )
}