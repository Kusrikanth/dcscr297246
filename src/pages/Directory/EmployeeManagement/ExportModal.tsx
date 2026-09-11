
import {
    TextInput,
} from "../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required")
});

const ExportModal: React.FC<any> = (props) => {
    const initialValues={
        password:""
    }

    const exportModalForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if(values.password!=="admin@123"){
                toast.error("Enter valid password")
            }else{
                props.submitHndlr(values.password);
            }
        },
    });


    return (<>
        <div className="tw-grid tw-gap-2 tw-p-5">

            <div className="tw-col-span-12">
                <TextInput
                    name="password"
                    labelText="Password"
                    value={exportModalForm.values.password}
                    onChange={exportModalForm.handleChange}
                    invalid={(exportModalForm.touched.password && exportModalForm.errors.password) ? true : false}
                    error={(exportModalForm.touched.password && exportModalForm.errors.password) ? exportModalForm.errors.password : ""}
                />
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => exportModalForm.handleSubmit(event)}
                    disabled={props.showApiLoader}
                >
                    Generate
                </Button>
            </div>

        </div>
   
        </>
    );
};

export default ExportModal;
