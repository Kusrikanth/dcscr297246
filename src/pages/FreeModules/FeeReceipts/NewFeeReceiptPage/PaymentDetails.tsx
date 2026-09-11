import React from "react";
import {
    DateInput, SelectInput, TextInput
} from "../../../../Components/Common";
//Utility 
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";


const PaymentDetails = ({ receiptForm, bankList, trustList }: any) => {
    return (
        <>
            {(receiptForm.values.paymentMode === "CASH") &&
                <TextInput
                    name="panCardNumber"
                    formgroupClassName="tw-mb-3"
                    labelText="Pan Card Number"
                    value={receiptForm.values.panCardNumber}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    maxLength={10}
                    placeHolder="Pan Card Number"
                    invalid={(receiptForm.touched.panCardNumber && receiptForm.errors.panCardNumber) ? true : false}
                    error={(receiptForm.touched.panCardNumber && receiptForm.errors.panCardNumber) ? receiptForm.errors.panCardNumber : ""}
                />}
            {(receiptForm.values.paymentMode === "ONLINE" || receiptForm.values.paymentMode === "JODO_QR" || receiptForm.values.paymentMode === "ONLINE_PG") && <>
                <TextInput
                    name="transactionId"
                    formgroupClassName="tw-mb-3"
                    labelText="Transaction ID"
                    value={receiptForm.values.transactionId}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    placeHolder="Transaction ID"
                    invalid={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? true : false}
                    error={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? receiptForm.errors.transactionId : ""}
                />
                <DateInput
                    name="transactionDate"
                    formgroupClassName="tw-mb-3"
                    labelText="Transaction Date"
                    maxDate={Current_Date_YYYYMMDD}
                    value={receiptForm.values.transactionDate}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    inputClassName="text-muted"
                    invalid={(receiptForm.touched.transactionDate && receiptForm.errors.transactionDate) ? true : false}
                    error={(receiptForm.touched.transactionDate && receiptForm.errors.transactionDate) ? receiptForm.errors.transactionDate : ""}

                /></>}

            {(receiptForm.values.paymentMode === "CHEQUE") && <>
                <TextInput
                    name="accountPayeeName"
                    formgroupClassName="tw-mb-3"
                    labelText="In The Name Of"
                    value={receiptForm.values.accountPayeeName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    // menuItems={trustList}
                    // valueKey="trustName"
                    // textKey="trustName"
                    invalid={(receiptForm.touched.accountPayeeName && receiptForm.errors.accountPayeeName) ? true : false}
                    error={(receiptForm.touched.accountPayeeName && receiptForm.errors.accountPayeeName) ? receiptForm.errors.accountPayeeName : ""}
                />
                <SelectInput
                    name="bankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={receiptForm.values.bankName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    menuItems={bankList}
                    valueKey="bankName"
                    textKey="bankName"
                    invalid={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? true : false}
                    error={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? receiptForm.errors.bankName : ""}
                />
                {/* <TextInput
                    name="accountPayeeName"
                    formgroupClassName="tw-mb-3"
                    labelText="In The Name Of"
                    value={receiptForm.values.accountPayeeName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.accountPayeeName && receiptForm.errors.accountPayeeName) ? true : false}
                    error={(receiptForm.touched.accountPayeeName && receiptForm.errors.accountPayeeName) ? receiptForm.errors.accountPayeeName : ""}
                />
                <TextInput
                    name="bankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={receiptForm.values.bankName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    // menuItems={bankList}
                    // valueKey="id"
                    // textKey="bankName"
                    invalid={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? true : false}
                    error={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? receiptForm.errors.bankName : ""}
                /> */}
                <DateInput
                    name="chequeDate"
                    formgroupClassName="tw-mb-3"
                    labelText="Cheque Date"
                    // maxDate={Current_Date_YYYYMMDD}
                    value={receiptForm.values.chequeDate}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.chequeDate && receiptForm.errors.chequeDate) ? true : false}
                    error={(receiptForm.touched.chequeDate && receiptForm.errors.chequeDate) ? receiptForm.errors.chequeDate : ""}
                />
                <TextInput
                    name="chequeNumber"
                    labelText="Cheque Number"
                    formgroupClassName="tw-mb-3"
                    maxLength={6}
                    value={receiptForm.values.chequeNumber}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.chequeNumber && receiptForm.errors.chequeNumber) ? true : false}
                    error={(receiptForm.touched.chequeNumber && receiptForm.errors.chequeNumber) ? receiptForm.errors.chequeNumber : ""}
                />
            </>}

            {(receiptForm.values.paymentMode === "DD") && <>
                <TextInput
                    name="accountPayeeName"
                    formgroupClassName="tw-mb-3"
                    labelText="In The Name Of"
                    value={receiptForm.values.accountPayeeName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.studentId && receiptForm.errors.studentId) ? true : false}
                    error={(receiptForm.touched.studentId && receiptForm.errors.studentId) ? receiptForm.errors.studentId : ""}
                />
                <TextInput
                    name="bankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={receiptForm.values.bankName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    // menuItems={bankList}
                    // valueKey="id"
                    // textKey="bankName"
                    invalid={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? true : false}
                    error={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? receiptForm.errors.bankName : ""}
                />
                <DateInput
                    name="chequeDate"
                    formgroupClassName="tw-mb-3"
                    labelText="DD Date"
                    maxDate={Current_Date_YYYYMMDD}
                    value={receiptForm.values.chequeDate}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.chequeDate && receiptForm.errors.chequeDate) ? true : false}
                    error={(receiptForm.touched.chequeDate && receiptForm.errors.chequeDate) ? receiptForm.errors.chequeDate : ""}
                />
                <TextInput
                    name="chequeNumber"
                    formgroupClassName="tw-mb-3"
                    labelText="DD Number"
                    maxLength={6}
                    value={receiptForm.values.chequeNumber}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.chequeNumber && receiptForm.errors.chequeNumber) ? true : false}
                    error={(receiptForm.touched.chequeNumber && receiptForm.errors.chequeNumber) ? receiptForm.errors.chequeNumber : ""}
                />
            </>}

            {(receiptForm.values.paymentMode === "CARD_PAYMENT") && <>
                <TextInput
                    name="bankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={receiptForm.values.bankName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    // menuItems={bankList}
                    // valueKey="id"
                    // textKey="bankName"
                    invalid={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? true : false}
                    error={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? receiptForm.errors.bankName : ""}
                />
                <TextInput
                    name="transactionId"
                    formgroupClassName="tw-mb-3"
                    labelText="Transaction ID"
                    value={receiptForm.values.transactionId}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    invalid={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? true : false}
                    error={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? receiptForm.errors.transactionId : ""}
                />

            </>}

            {(receiptForm.values.paymentMode === "UPI") && <>
                <TextInput
                    name="bankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={receiptForm.values.bankName}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    // menuItems={bankList}
                    // valueKey="id"
                    // textKey="bankName"
                    invalid={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? true : false}
                    error={(receiptForm.touched.bankName && receiptForm.errors.bankName) ? receiptForm.errors.bankName : ""}
                />
                <TextInput
                    name="transactionId"
                    formgroupClassName="tw-mb-3"
                    labelText="Transaction ID"
                    value={receiptForm.values.transactionId}
                    onChange={receiptForm.handleChange}
                    onBlur={receiptForm.handleBlur}
                    placeHolder="Transaction Number"
                    invalid={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? true : false}
                    error={(receiptForm.touched.transactionId && receiptForm.errors.transactionId) ? receiptForm.errors.transactionId : ""}
                />

            </>}
        </>
    )
}

export default PaymentDetails;