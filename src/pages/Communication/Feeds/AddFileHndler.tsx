import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { MultipleFileUpload } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { updateFeedsFileAct } from '../../../store/communication/communicationactions';
import Button from '../../../Components/Common/Button';

interface FileDto {
    originalFileName: string;
}
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
    
    const [document, setDocument] = useState([]);
    const dispatch = useDispatch();
    const {
        getFeedsByIdResp
    } =
        useAppSelector(({communication}) => ({
            getFeedsByIdResp: communication.getFeedsByIdResp
        }), shallowEqual);


    const addFeedFileForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { document } = values || {};

            const initialFiles = getFeedsByIdResp?.files || [];
            const deletedFileIds: number[] = initialFiles.filter((file: { id: number }) => !document.some((doc: { id: number }) => doc.id === file.id)).map((file: { id: number }) => file.id);
            
            const formData = new FormData();
            if(document.length > 0 ){
                document.map((file: any) => {
                    if(!file.id){
                    formData.append("fileList", file)
                }
                })
            }
            formData.append("requestValue", JSON.stringify({ systemFileIds: deletedFileIds }));
            dispatch(updateFeedsFileAct(generateActionPayload("update_feeds_files", { id: props?.data?.id } , formData)));
        },
    });
    useEffect(() => {
        if (getFeedsByIdResp) {
            const {files} = getFeedsByIdResp;
            let file = files?.map((i:FileDto)=>({...i,name:i?.originalFileName}))
            setDocument(file);
            addFeedFileForm.setValues((prev) => ({ ...prev,document: file }));
        }  
    }, [getFeedsByIdResp]);
    const handleFileChange = (files: any) => {
        addFeedFileForm.setValues((prev) => ({ ...prev, document: files }))
    }
    return (
        <>
            <form onSubmit={addFeedFileForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-p-4">
                    <div className="tw-col-span-1">
                        <MultipleFileUpload
                            name="document"
                            prevFiles={document}
                            onChange={handleFileChange}
                            containerClass="tw-col-span-1"
                            maxSizeInMb={2}
                            helperText="Note : Max File Size is 2MB"
                            invalid={(addFeedFileForm.touched.document && addFeedFileForm.errors.document) ? true : false}
                            error={(addFeedFileForm.touched.document && addFeedFileForm.errors.document) ? addFeedFileForm.errors.document : ""}
                        />
                    </div>

                    <div className="tw-ml-auto tw-mt-3">
                        <Button
                            type="submit"
                            disabled={props.showApiLoader}
                        >
                            Update File
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}
export default AddFileHndler