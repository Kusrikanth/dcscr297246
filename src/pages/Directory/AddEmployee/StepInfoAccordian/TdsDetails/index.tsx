import React, { useState, useMemo } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";


//Helper
import { generateColumns } from "./helper";
import Button from "../../../../../Components/Common/Button";


const validationSchema = Yup.object().shape({

});

function getEmployeeDetail(studentDetails?: any): any {
    return ({
        id: ""
    })
}



export const TdsDetails: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getEmployeeDetail());
    const bankDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: studentInfoState,
        validationSchema,
        onSubmit: (values) => {
        },
    });


    function submitHndlr() {
    }

    const tdsColumns = useMemo(() => generateColumns(), []);
    return (
        <form id="student-info-form" onSubmit={(e) => e.preventDefault()} className="tw-w-full">
            <div className="tw-space-y-6">
                <div>
                    <h5 className="tw-text-base tw-font-semibold tw-border-b-2 tw-border-blue-500 tw-inline-block tw-pb-1">
                        TDS Details
                    </h5>
                </div>
                <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-4">
                    <label className="tw-text-sm tw-font-medium tw-whitespace-nowrap">
                        Financial Year
                    </label>
                    <div className="tw-w-full md:tw-w-64">
                        <SelectInput
                        name="taxCategory"
                        // labelText="Tax Category"
                        value={bankDetailsForm.values.taxCategory}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.taxCategory && bankDetailsForm.errors.taxCategory) ? true : false}
                        error={(bankDetailsForm.touched.taxCategory && bankDetailsForm.errors.taxCategory) ? bankDetailsForm.errors.taxCategory : ""}
                        menuItems={[{ id: "2022-23", name: "2022-23" }]}
                        valueKey="id"
                        formgroupClassName="tw-mb-0"
                        // defaultValue="Gender"
                        textKey="name"
                    />
                    </div>
                </div>
                <div className="tw-w-full tw-overflow-x-auto">
                    <TableContainer
                        columns={tdsColumns}
                        data={[]}
                        divClass="tw-min-w-full"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm"
                    />
                </div>

                <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-2">
                    <Button
                        type="submit"
                        variant="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={submitHndlr}
                        variant="primary"
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </form>
    )
}