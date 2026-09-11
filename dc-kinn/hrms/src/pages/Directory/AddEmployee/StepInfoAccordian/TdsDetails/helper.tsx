import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails } from "../../../../../Components/Common";
import classnames from "classnames";
//Common Component
import {
    TextInput
} from "../../../../../Components/Common";

export function generateColumns() {
    return ([

        {
            Header: "S.No",
            accessor: "Sno",
        },
        {
            Header: "Investments U/s 80C,80CCC,80CCD capped at Rs 1.50 Lac",
            accessor: "investment",
        },
        {
            Header: "TDS Item Amount",
            accessor: "tdsItemAmount",
            filterable: false,
            Cell: ({ value }: any) => {
                return (
                    <TextInput
                        name="amount"
                        formgroupClassName="tw-mb-0"
                    />
                );
            },
        },

    ])
}