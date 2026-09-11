import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    CustomSelect,
} from "../../../Components/Common";
import { type LeadRecord } from "./helper";

const counsellorOptions = [
    {
        id: "1",
        name: "ARJUN - NACHARAM",
    },
    {
        id: "2",
        name: "TARUN - NACHARAM",
    },
    {
        id: "3",
        name: "RAHUL KUMAR - NADERGUL",
    },
];

const initialValues = {
    counsellorId: "",
};

const validationSchema = Yup.object().shape({
    counsellorId: Yup.string()
        .required("Counsellor is required"),
});

const renderCounsellorOption = (item?: {
    id: string;
    name: string;
}) => item?.name || "";

const ReferModal = ({
    toggle,
}: {
    toggle: () => void;
    data?: LeadRecord;
}) => {
    const formik = useFormik({
        enableReinitialize: true,

        initialValues,

        validationSchema,

        onSubmit: () => {
            toggle();
        },
    });

    const counsellorChangeHandler = (
        selectedOptionId: string,
    ) => {
        formik.setFieldValue(
            "counsellorId",
            selectedOptionId,
        );
        formik.setFieldTouched(
            "counsellorId",
            true,
            false,
        );
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            <div className="row">
                <div className="col-12">
                    <CustomSelect
                        name="counsellorId"
                        labelText="Counsellor"
                        idKey="id"
                        searchKey="name"
                        defaultSelect="Search by counsellor or branch..."
                        value={formik.values.counsellorId}
                        options={counsellorOptions}
                        renderValue={renderCounsellorOption}
                        renderOptions={renderCounsellorOption}
                        onChange={counsellorChangeHandler}
                        invalid={
                            !!(
                                formik.touched
                                    .counsellorId &&
                                formik.errors
                                    .counsellorId
                            )
                        }
                        error={
                            formik.touched
                                .counsellorId &&
                                formik.errors
                                    .counsellorId
                                ? formik.errors
                                    .counsellorId
                                : ""
                        }
                        labelClass="required"
                    />
                </div>
            </div>

            <div className="tw-mt-5 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={
                        !formik.values
                            .counsellorId
                    }
                >
                    Refer lead
                </Button>
            </div>
        </form>
    );
};

export default ReferModal;
