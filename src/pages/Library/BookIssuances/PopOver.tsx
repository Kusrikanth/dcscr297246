
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { getDdMmYyyyFormat } from '../../../utility/dateutility';
import { getDisplayAmountValue } from '../../../utility/commonutility';

const PopOver = (props: any) => {

    const { data } = props || {}

    return (<>
        <div>
            <Popover
                flip
                target={`testing-${props.index}`}
                toggle={props.toggle}
                isOpen={props.popOver}
                placement="bottom"
            >
                <PopoverBody className="!tw-p-0">
                    <div className="">
                        <div className="tw-flex tw-justify-between tw-items-center tw-bg-gray-100 tw-px-3 tw-py-2 tw-font-semibold">
                            <span>Issue Status :</span>
                            <span>{data?.issueStatus}</span>
                        </div>
                        <div className="tw-flex tw-flex-col tw-gap-3 tw-px-3 tw-py-2">

                            <div className="tw-flex tw-justify-between">
                                <span>Issuance Date :</span>
                                <span>{data?.issuanceDate ? getDdMmYyyyFormat(data?.issuanceDate) : "-"}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Return Date :</span>
                                <span>{data?.returnDate ? getDdMmYyyyFormat(data?.returnDate) : "-"}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Returned Date :</span>
                                <span>{data?.returnedDate ? getDdMmYyyyFormat(data?.returnedDate) : "-"}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Renewal Date :</span>
                                <span>{data?.renewalDate ? getDdMmYyyyFormat(data?.renewalDate) : "-"}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Book Condition :</span>
                                <span>{data?.bookCondition || "-"}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Fine :</span>
                                <span>₹ {getDisplayAmountValue(data?.fineAmount)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between">
                                <span>Total Amount :</span>
                                <span>₹ {getDisplayAmountValue(data?.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </PopoverBody>
            </Popover>

        </div>
    </>
    )
}

export default PopOver
