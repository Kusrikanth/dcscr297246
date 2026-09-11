
import {
    TextInput,
} from "../../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required")
});

const ProtectConcessionModal: React.FC<any> = (props) => {
    const initialValues = {
        password: ""
    }

    const protectConcessionForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (values.password !== "Dps@2024_concession") {
                toast.error("Enter valid password")
            } else {
                props.toggle()
                props.submitHndlr();
            }
        },
    });


    return (
        <>

            <div className="tw-p-4">

                <div className="tw-grid tw-grid-cols-1 tw-gap-4">

                    <div>
                       <TextInput
                        name="password"
                        labelText="Enter Password"
                        inputType="password"
                        autoComplete="new-password"
                        value={protectConcessionForm.values.password}
                        onChange={protectConcessionForm.handleChange}
                        invalid={(protectConcessionForm.touched.password && protectConcessionForm.errors.password) ? true : false}
                        error={(protectConcessionForm.touched.password && protectConcessionForm.errors.password) ? protectConcessionForm.errors.password : ""}
                    />
                    </div>

                    <div className="tw-flex tw-gap-2 tw-justify-end">

                        <Button
                            type="button"
                            onClick={props.toggle}
                            variant='secondary'
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={(event: any) =>
                                protectConcessionForm.handleSubmit(event)
                            }
                            disabled={props.showApiLoader}
                            variant='primary'
                        >
                            Generate
                        </Button>

                    </div>

                </div>

            </div>

        </>
    );
};

export default ProtectConcessionModal;
