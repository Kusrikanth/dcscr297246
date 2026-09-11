
import { useState } from "react";
import classnames from "classnames";
import { Row, Col, Input, Label } from "reactstrap";
import { UserDetails } from "../../../Components/Common";
import AvatarImage from "../../../assets/images/users/avatar-1.jpg";
import Button from "../../../Components/Common/Button";
interface IUsers {
    userId: string,
    userName: string,
    isAdded: boolean
}

const AssignTeacher = () => {
    const [userListState, setUserListState] = useState<Array<IUsers>>([{
        userId: "DCIP000001",
        userName: "Donald Risher",
        isAdded: false,
    }, {
        userId: "DCIP000001",
        userName: "Donald Risher",
        isAdded: true,
    }]);
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-0">
            <div className="tw-mb-1 tw-px-3 tw-py-3">
                <div className="search-box">
                    <Input
                        type="text"
                        className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                        placeholder="Search Teacher..."
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                </div>
            </div>

            <div className="tw-border-b">
                <h6 className="tw-mb-0 tw-ml-3 tw-py-2 tw-text-sm tw-font-semibold">
                    Assign Teacher:
                </h6>
            </div>

            <div style={{height:"200px",overflow:"scroll"}}>
                {userListState.map(item => (
                    <div
                        key={item.userId}
                        className="tw-border-b tw-px-3 tw-py-2 tw-flex tw-items-center tw-justify-between"
                    >
                        <UserDetails
                            displayId={item.userId}
                            displayName={item.userName}
                            imageUrl={AvatarImage}
                        />

                        <Button
                            type="submit"
                            variant={item.isAdded ? "warning" : "primary"}
                        >
                            {item.isAdded ? "Remove" : "Add"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssignTeacher;
