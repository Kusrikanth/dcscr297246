import { MultipleFileUpload } from '../../../../Components/Common';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { updateFilesAct } from '../../../../store/communication/communicationactions';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    document: [],
}

const validationSchema = Yup.object().shape({
    document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
        if (!value || value.length === 0) {
            return false;
        }
        return true;
    }).nullable(),
})

const AddFileHndler = (props:any) => {

    const dispatch = useDispatch();

    const addConcernFileForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { document } = values || {};
            const formData = new FormData();
            if(document.length > 0 ){
                document.map((file) => {
                    formData.append("fileList", file);
                })
            }
            formData.append("requestValue", JSON.stringify({ systemFileIds: [] }));
            dispatch(updateFilesAct(generateActionPayload("update_files", { id: props?.id } , formData)));
        },
    });

    const handleFileChange = (files: any) => {
        addConcernFileForm.setValues((prev) => ({ ...prev, document: files }))
    }

    return (
        <>
            <form onSubmit={addConcernFileForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-p-4">
                    <div className="tw-col-span-12">
                        <MultipleFileUpload
                            name="document"
                            prevFiles={addConcernFileForm.values.document}
                            onChange={handleFileChange}
                            containerClass="tw-col-span-12"
                            maxSizeInMb={2}
                            helperText="Note : Max File Size is 2MB"
                            error={addConcernFileForm.touched.document && addConcernFileForm.errors.document ? addConcernFileForm.errors.document : "" }
                        />
                    </div>

                    <div className="tw-col-span-12 tw-ml-auto tw-mt-3">
                        <Button
                            type="submit"
                            disabled={props.showApiLoader}
                            variant='primary'
                        >
                            Add File
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddFileHndler