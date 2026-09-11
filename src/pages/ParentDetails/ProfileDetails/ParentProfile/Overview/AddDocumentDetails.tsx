import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BrowseFile, SelectInput } from '../../../../../Components/Common'
import { useAppSelector } from '../../../../../hooks/storehook';
import { classWiseDocumentListAct, getStudentByIdAct, uploadStudentDocumentAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import * as Yup from 'yup';
import Button from '../../../../../Components/Common/Button';

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
const AddDocumentDetailsModal = (props: any) => {
  const [initialData, setInitialData] =
    useState<AddDocumentDetailsProps>(initialValues());
  const [error, setError] = useState('');
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
    dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
  }
  useEffect(() => {
    if (props.isOpen) {
      const payload = {
        classId: getStudentByIdResp.studentAcademicDetails.classId
      }
      dispatch(classWiseDocumentListAct(generateActionPayload('classwise_document_list', undefined, payload)));
      setInitialData(initialValues(props.editData));
    }
    else {
      addDocumentDetailsForm.resetForm();
      setItemSelected(false);
    }
    getStudentDetailsAPI()
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
      toast.success(`Document ${props.editData ? "Edited" : "Added"} successfully.`);
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
    const error = uploadFileErrorHndlr(file.size, file.type, acceptedDocumentFileTypes);
    setError(error);
    if (error === "") {
      setItemSelected(true)
      addDocumentDetailsForm.setFieldValue('uploadDocument', file);
    }
  }
  return (

    <div className="tw-p-4 tw-my-1">
      <div className="tw-w-full">
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

      <div className="tw-w-full">
        <BrowseFile
          name="uploadDocument"
          onChangeFileHndlr={onChangeFileInputHndlr}
          fileName={addDocumentDetailsForm.values.uploadDocument.name}
          error={error}
          invalid={error !== ""}
          containerClassName="tw-mb-3"
        />
      </div>
      <div className="tw-flex tw-justify-end tw-gap-3">
        <Button type="button" variant="secondary" onClick={props.toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="button"
          className="tw-px-2 tw-py-1"
          onClick={(event: any) => addDocumentDetailsForm.handleSubmit(event)}
          disabled={showApiLoader || !itemSelected}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AddDocumentDetailsModal
