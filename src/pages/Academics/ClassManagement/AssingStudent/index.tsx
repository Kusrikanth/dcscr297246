
import { useState, useMemo } from "react";
import classnames from "classnames";
import { Row, Col, Input, Button, Label } from "reactstrap";
import { UserDetails } from "../../../../Components/Common";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
//Helper
import { generateColumns, studentData } from "./helper";


import AvatarImage from "../../../../assets/images/users/avatar-1.jpg";
interface IUsers {
    userId: string,
    userName: string,
    isAdded: boolean
}

const AssignStudent = () => {
    const [userListState, setUserListState] = useState<Array<IUsers>>([{
        userId: "DCIP000001",
        userName: "Donald Risher",
        isAdded: false,
    }, {
        userId: "DCIP000001",
        userName: "Donald Risher",
        isAdded: true,
    }]);

    const studentColumn = useMemo(() => generateColumns(), []);
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-0">

            <div className="tw-mb-1 tw-px-3 tw-py-3">
                <div className="tw-relative search-box">
                    <Input
                        type="text"
                        className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                        placeholder="Search Student..."
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                </div>
            </div>

            <div>
                <TableContainer
                    columns={studentColumn || []}
                    data={studentData}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                />
            </div>

        </div>
    )
}

export default AssignStudent;
