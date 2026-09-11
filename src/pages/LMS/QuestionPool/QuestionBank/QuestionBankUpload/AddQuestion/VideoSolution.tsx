import { useFormik } from "formik";
import { MultipleFileUpload, TextArea } from "../../../../../../Components/Common";
import { useState } from "react";

const initialValues = {
    document: [],
}

const VideoSolution = (props: any) => {
    const [document, setDocument] = useState([]);
    const updatePriorityForm = useFormik({
        initialValues,
        onSubmit: (values) => {

        },
    });

    const handleFileChange = (files: any) => {
        setDocument(files);
        updatePriorityForm.setFieldValue('document', files);
    }
    return (
        <>
            <div className=''>
                <div className='row'>
                    <div className='col-12 form-text fs-12 text-muted'>
                        Add Attached files here.
                    </div>
                    <div className='col-12 mt-2'>
                        <MultipleFileUpload
                            name="document"
                            prevFiles={document}
                            onChange={handleFileChange}
                            containerClass="col-12"
                            maxSizeInMb={2}
                            helperText="Note : Max File Size is 2MB"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoSolution