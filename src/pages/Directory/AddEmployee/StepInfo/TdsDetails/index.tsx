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
        <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12">
                    <h5 className="tw-mb-3 tw-inline-block tw-border-b-2 tw-border-blue-500">
                        TDS Details
                    </h5>
                </div>

                <div className="tw-col-span-12 tw-mb-3 tw-flex tw-items-center">
                    <label className="tw-mr-4 tw-mb-0 tw-whitespace-nowrap">
                        Financial Year
                    </label>
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
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-12 tw-mt-4">
                    <TableContainer
                        columns={tdsColumns}
                        data={[]}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    />
                </div>

                <div className="tw-col-span-12 tw-text-right tw-mt-2">
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