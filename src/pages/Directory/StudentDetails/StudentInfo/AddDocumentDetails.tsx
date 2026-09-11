import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BrowseFile, SelectInput } from '../../../../Components/Common'
import Button from '../../../../Components/Common/Button';
import { useAppSelector } from '../../../../hooks/storehook';
import { classWiseDocumentListAct, getStudentByIdAct, uploadStudentDocumentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { getInstDocumentTypeAct } from '../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import * as Yup from 'yup';
import { IModalProps } from './StudentInfoTypes'

interface AddDocumentDetailsProps {
  documentType: string;
  uploadDocument: any;
}
const initialValues = (editData?: any) => {
  return {
    documentType: editData ? editData.documentTypeId : "",
    uploadDocument: editData ? { name: editData.systemFile.originalFileName } : ""
  }
};
const AddDocumentDetailsModal = (props: IModalProps) => {
  const [initialData, setInitialData] =
    useState<AddDocumentDetailsProps>(initialValues());
  const [error,setError]=useState('');
  const [itemSelected, setItemSelected] = useState(false);
  const dispatch = useDispatch()

  const { classWiseDocumentListResp, uploadStudentDocumentResp, getStudentByIdResp, showApiLoader } = useAppSelector(
    ({ directoryStudent, globalData }) => ({
      classWiseDocumentListResp: directoryStudent.classWiseDocumentListResp,
      uploadStudentDocumentResp: directoryStudent.uploadStudentDocumentResp,
      getStudentByIdResp: directoryStudent.getStudentByIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );
  const validationSchema = Yup.object().shape({
    documentType: Yup.string().required("Document Type is required."),
  });
  const getStudentDetailsAPI = () => {
    // const params={academicYearId:props.academicYearId}
    dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
  }
  useEffect(() => {
    if (props.isOpen) {
      const payload = {
        classId: getStudentByIdResp.studentAcademicDetails.classId
      }
      dispatch(classWiseDocumentListAct(generateActionPayload('classwise_document_list', undefined, payload)));
      // if(props.editData){
      setInitialData(initialValues(props.editData));
      // }
    }
    else {
      addDocumentDetailsForm.resetForm();
      setItemSelected(false);
    }
    getStudentDetailsAPI()
    // props.isOpen && 
    // !props.isOpen&&
    // props.isOpen && props.editData && setInitialData(initialValues(props.editData))
  }, [props.isOpen])

  const addDocumentDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {

      const formData = new FormData();
      formData.append('studentId', props.studentId);
      formData.append('documentTypeId', values.documentType);
      formData.append('file', values.uploadDocument);

      // let payload={
      //   uploadDocument:178,
      //   documentTypeId:1,
      //   document:values.uploadDocument
      // }
      dispatch(uploadStudentDocumentAct(generateActionPayload('upload_student_document', undefined, formData)))

    },
  });

  const DocumentUploadRef = useRef<any>({
    prevUploadStudentDocumentResp: uploadStudentDocumentResp
  });

  useEffect(() => {
    const { prevUploadStudentDocumentResp } =
      DocumentUploadRef.current;

    if (uploadStudentDocumentResp &&
      prevUploadStudentDocumentResp !== uploadStudentDocumentResp) {
        toast.success(`Document ${props.editData?"Edited":"Added"} successfully.`);
        props.toggle(true);
    }
    DocumentUploadRef.current.prevUploadStudentDocumentResp = uploadStudentDocumentResp;
  }, [uploadStudentDocumentResp]);
  
  const acceptedImageFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  const acceptedDocumentFileTypes = ["application/pdf", ...acceptedImageFileTypes];

  function uploadFileErrorHndlr(fileSize: number, fileType?: string, allowedTypes: string[] = acceptedImageFileTypes): string {
    if (!fileType || !allowedTypes.includes(fileType)) {
      return `Upload file should be of format ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }

    if (!isNaN(fileSize) && fileSize > 4 * 1024 * 1024) {
      return `Upload file should be less than 4MB, You are uploading ${(fileSize / (1024 * 1024)).toFixed(2)}MB file.`;
    }

    return "";
  }

  function onChangeFileInputHndlr(event: any) {
    const file = event.target.files[0];
    const error=uploadFileErrorHndlr(file.size, file.type, acceptedDocumentFileTypes);
    setError(error);
    if(error===""){
      setItemSelected(true)
      addDocumentDetailsForm.setFieldValue('uploadDocument', file);
    }
  }
  return (
    <div className="tw-p-6">
      <div className="tw-grid tw-grid-cols-1 tw-gap-6">
        <div>
          <SelectInput
            name="documentType"
            labelText="Document Type"
            value={addDocumentDetailsForm.values.documentType}
            onChange={addDocumentDetailsForm.handleChange}
            onBlur={addDocumentDetailsForm.handleBlur}
            menuItems={classWiseDocumentListResp || []}
            isDisabled={props.editData}
            valueKey="id"
            textKey="documentName"
            invalid={
              addDocumentDetailsForm.touched.documentType &&
              addDocumentDetailsForm.errors.documentType
                  ? true
                  : false
          }
          error={
            addDocumentDetailsForm.touched.documentType &&
            addDocumentDetailsForm.errors.documentType
                  ? addDocumentDetailsForm.errors.documentType
                  : ""
          }
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div>
          {/* <UploadFileInput
              name="uploadDocument"
              labelText="Upload Document"
              // value={addDocumentDetailsForm.values.uploadDocument}
              //  addDocumentDetailsForm.handleChange(e)
               addDocumentDetailsForm.setFieldValue("uploadDocument",e.currentTarget.files[0])
              }}
            /> */}
          <BrowseFile
            name="uploadDocument"
            onChangeFileHndlr={onChangeFileInputHndlr}
            fileName={addDocumentDetailsForm.values.uploadDocument.name}
            error={error}
            invalid={error !== ""}
            containerClassName="tw-mb-0"
          />
        </div>
        {/* <div className='col-md-6'>
            <TextInput
                name='fileName'
                labelText='File Name'
                value={addDocumentDetailsForm.values.fileName}
                onChange={addDocumentDetailsForm.handleChange}
            />
          </div>
          <Col md={6}>
          <TextInput
                name='documentName'
                labelText='Document Name'
                value={addDocumentDetailsForm.values.documentName}
                onChange={addDocumentDetailsForm.handleChange}
            />
          </Col>

          <Col md={6}>
          <TextInput
                name='size'
                labelText='Size'
                value={addDocumentDetailsForm.values.size}
                onChange={addDocumentDetailsForm.handleChange}
            />
            
          </Col>
          <Col md={6}>
          <TextInput
                name='type'
                labelText='Type'
                value={addDocumentDetailsForm.values.type}
                onChange={addDocumentDetailsForm.handleChange}
            />
            
          </Col>
          <Col md={6}>
            <DateInput
                name="dateAdded"
                value={addDocumentDetailsForm.values.dateAdded}
                onChange={addDocumentDetailsForm.handleChange}
                formgroupClassName="mb-0"
                labelText="Date Added"
                />
          </Col>

          <Col md={6}>
            <TextInput
                name='addedby'
                labelText='Added by'
                value={addDocumentDetailsForm.values.addedby}
                onChange={addDocumentDetailsForm.handleChange}
            />
          </Col> */}
        <div className="tw-flex tw-justify-end tw-items-center tw-gap-3 tw-mt-2">
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
            onClick={(event: any) => addDocumentDetailsForm.handleSubmit(event)}
            disabled={showApiLoader || !itemSelected}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddDocumentDetailsModal
