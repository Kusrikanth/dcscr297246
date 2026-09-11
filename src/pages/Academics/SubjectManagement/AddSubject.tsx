
import { useState } from "react";
import classnames from "classnames";
import { Row, Col, Input, Button, Label } from "reactstrap";
import { UserDetails } from "../../../Components/Common";
import AvatarImage from "../../../assets/images/users/avatar-1.jpg";
interface IUsers {
    subjectId: string,
    subjectName: string,
    isAdded: boolean
}

const subjectList = [{
    subjectId: "SUB001",
    subjectName: "English",
    isAdded: false,
}, {
    subjectId: "SUB002",
    subjectName: "Hindi",
    isAdded: true,
}, {
    subjectId: "SUB003",
    subjectName: "Mathematics Theory",
    isAdded: true,
}, {
    subjectId: "SUB004",
    subjectName: "Biology Theory",
    isAdded: true,
}, {
    subjectId: "SUB005",
    subjectName: "Chemistry Theory",
    isAdded: true,
}, {
    subjectId: "SUB006",
    subjectName: "Computer Theory",
    isAdded: true,
}, {
    subjectId: "SUB007",
    subjectName: "Accountancy Theory",
    isAdded: true,
}];
const AddSubject = () => {
    const [subjectListState, setSubjectListState] = useState<Array<IUsers>>(subjectList);
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-0">

            <div className="tw-mb-1 tw-px-3 tw-py-3">
                <div className="tw-relative search-box">
                    <Input
                        type="text"
                        className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                        placeholder="Search Subject..."
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                </div>
            </div>

            <div className="tw-border-b tw-mb-2">
                <h6 className="tw-mb-0 tw-ml-3 tw-py-2 tw-text-sm tw-font-semibold">
                    Assign Subject:
                </h6>
            </div>

            <div className="tw-mb-2 tw-ml-3">
                <div className="tw-flex tw-items-center tw-gap-2">
                    <Input
                        type="checkbox"
                        id="formCheck11"
                        defaultChecked
                        className="tw-h-4 tw-w-4 tw-text-blue-600 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500"
                    />
                    <Label
                        htmlFor="formCheck11"
                        className="tw-text-sm tw-text-gray-700"
                    >
                        All Subjects
                    </Label>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-y-2 tw-ml-3">
                {subjectListState.map(item => (
                    <div key={item.subjectId}>
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <Input
                                type="checkbox"
                                id={item.subjectId}
                                defaultChecked
                                className="tw-h-4 tw-w-4 tw-text-blue-600 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500"
                            />
                            <Label
                                htmlFor={item.subjectId}
                                className="tw-text-sm tw-text-gray-700"
                            >
                                {item.subjectName}
                            </Label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddSubject;
