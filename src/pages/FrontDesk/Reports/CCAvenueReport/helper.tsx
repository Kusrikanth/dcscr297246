import { getDisplayAmountValue } from "../../../../utility/commonutility";

export const statusCardsList = [
    {
        statusName: "Cash",
        accessor: "cash",
        iconClassName: "cash-icon"

    },
    {
        statusName: "Cheque",
        accessor: "cheque",
        iconClassName: "cheque-icon"

    }, {
        statusName: "Online",
        accessor: "online",
        iconClassName: "online-icon"
    }, {
        statusName: "Card Payment",
        accessor: "card_payment",
        iconClassName: "cardpayment-icon"
    }, {
        statusName: "Online PG",
        accessor: "online_pg",
        iconClassName: "onlinepg-icon"
    }, {
        statusName: "UPI",
        accessor: "upi",
        iconClassName: "upi-icon"
    },
]

export function generateColumns() {
    return [
        {
            Header: "Order",
            accessor: "order",
            disableSortBy: true,
            // columnClassName: "text-nowrap",
            // Footer: "Total"
        },
        {
            Header: "Identifier",
            accessor: "identifier",
            disableSortBy: true,
        },
        {
            Header: "Identifier Type",
            accessor: "identifierType",
            disableSortBy: true,
        },
        {
            Header: "Amount",
            accessor: "amount",
            disableSortBy: true,
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
        },
    ];
}