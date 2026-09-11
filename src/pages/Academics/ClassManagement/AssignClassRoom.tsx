
import { Row, Col, Input, Button, Label } from "reactstrap";

const AssignClassRoom = () => {

    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-4">

            <div className="tw-mb-3">
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div>
                        <h6 className="tw-mb-0 tw-text-sm tw-font-semibold">
                            Class Section
                        </h6>
                    </div>
                    <div>
                        <h6 className="tw-mb-0 tw-text-sm tw-font-semibold">
                            Room No.
                        </h6>
                    </div>
                </div>
            </div>

            <div>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-3">
                    <div>
                        <Input
                            type="text"
                            value="VI-A"
                            readOnly
                            id="branchName"
                            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-bg-gray-100 tw-text-sm"
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            id="branchName"
                            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AssignClassRoom;
