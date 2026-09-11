import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import TableContainer from '../../../../Components/Common/TableContainer';
import { registrationPaymentDetailsAct, setRegistrationPaymentDetailsAct } from '../../../../store/FrontDesk/Interview/interviewactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { generatePaymentDetailsColumns } from './helper';

const PaymentDetailsModal: any = (props: any) => {
    const { modalInfo, toggleModal } = props;
    const [paymentListState, setPaymentListState] = useState<any>([]);
    const dispatch = useDispatch();

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        registrationPaymentDetailsResp } =
        useAppSelector(
            ({ appData, interview, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                registrationPaymentDetailsResp: interview.registrationPaymentDetailsResp,
            }), shallowEqual);

    useEffect(() => {
        if (modalInfo && instituteId) {
            const params = {
                instituteId,
                branchId,
                jodoStudentId: modalInfo?.jodoStudentId
            }
            dispatch(registrationPaymentDetailsAct(generateActionPayload('get_registration_payment', undefined, params)))
        }
        return () => {
            dispatch(setRegistrationPaymentDetailsAct(undefined));
        }
    }, [instituteId, modalInfo]);

    useEffect(() => {
        const { data } = registrationPaymentDetailsResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let paymentInfo: any = [];
            for (let i = 0; i < data.length; i++) {
                const { details } = data[i];
                if (Array.isArray(details) && details.length > 0) {
                    paymentInfo = [...paymentInfo, ...details];
                }
            }
            setPaymentListState(paymentInfo);
        }
    }, [registrationPaymentDetailsResp]);

    const detailsColumns = useMemo(() => generatePaymentDetailsColumns(), [registrationPaymentDetailsResp]);
    return (
        <div className="tw-p-0 tw-pt-2">
            <TableContainer
                columns={detailsColumns}
                data={paymentListState}
                divClass="tw-overflow-x-auto"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={false}
            />
        </div>
    )
}

export default PaymentDetailsModal
