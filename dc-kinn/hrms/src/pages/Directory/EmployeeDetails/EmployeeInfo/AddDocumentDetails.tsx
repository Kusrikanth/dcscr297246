import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Col } from 'reactstrap';
import { BrowseFile, DateInput, RadioInput, SelectInput, TextIconInput, TextInput, UploadFileInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { uploadStudentDocumentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { getInstDocumentTypeAct } from '../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { IsEmployeeOptions } from './helper';
import { IModalProps } from './EmployeeInfoTypes'
import { getEmployeeDocumentListAct, uploadEmployeeDocumentAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { IUploadDocumentRepRef } from '../../StudentDetails/StudentInfo/StudentInfoTypes';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { uploadFileErrorHndlr } from '../../../../utility/commonutility';
import Button from '../../../../Components/Common/Button';
interface AddDocumentDetailsProps {
  documentTypeId: string;
  uploadDocument: any;
}
const AddDocumentDetailsModal = (props: IModalProps) => {
  const initialValues = (editData?: any) => {
    return {
      documentTypeId: editData?.documentTypeId || "",
      uploadDocument: editData ? { name: editData.fileName } : ""
    }
  };
  const [initialData, setInitialData] =
    useState<AddDocumentDetailsProps>(initialValues());

  const [itemSelected, setItemSelected] = useState(false);
  const [error,setError]=useState('');
  const dispatch = useDispatch()
  useEffect(() => {
    if(props.isOpen){
      setInitialData(initialValues(props.editData));
    }
    else{
      addDocumentDetailsForm.resetForm();
      setItemSelected(false);
    }
  }, [props.isOpen])

  const { instDocumentTypeResp, uploadEmployeeDocumentResp,getEmployeeDocumentListResp,showApiLoader } = useAppSelector(
    ({ instituteInfo, directoryEmployee,globalData }) => ({
      instDocumentTypeResp: instituteInfo.instDocumentTypeResp,
      uploadEmployeeDocumentResp: directoryEmployee.uploadEmployeeDocumentResp,
      getEmployeeDocumentListResp: directoryEmployee.getEmployeeDocumentListResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );

  const DocumentUploadRef = useRef<IUploadDocumentRepRef>({
    prevUploadDocumentResp: uploadEmployeeDocumentResp
  });

  useEffect(() => {
    const { prevUploadDocumentResp } =
      DocumentUploadRef.current;

    if (uploadEmployeeDocumentResp &&
      prevUploadDocumentResp !== uploadEmployeeDocumentResp) {
      toast.success(`Document ${props.editData ? "Edited" : "Added"} successfully.`);
      props.toggle(true);
    }
    DocumentUploadRef.current.prevUploadDocumentResp = uploadEmployeeDocumentResp;
  }, [uploadEmployeeDocumentResp]);

  function onChangeFileInputHndlr(event: any) {
    const file = event.target.files[0];
    let error=uploadFileErrorHndlr(file.size,file.type,['application/pdf']);
    setError(error);
    
    if(error===""){
      addDocumentDetailsForm.setFieldValue('uploadDocument', file);
      setItemSelected(true)
    }
  }

  
  const validationSchema=Yup.object().shape({
    documentTypeId: Yup.string().required("Document Type is required."),
    // uploadDocument: Yup.mixed().required("Required"),
  });

  const addDocumentDetailsForm:any = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {

      const formData = new FormData();
      formData.append('employeeId', `${props.employeeId}`);
      formData.append('documentTypeId', values.documentTypeId);
      formData.append('document', values.uploadDocument);
      dispatch(uploadEmployeeDocumentAct(generateActionPayload('upload_employee_document', undefined, formData)))

    },
  });

  useEffect(() => {
    dispatch(getEmployeeDocumentListAct(generateActionPayload('get_employee_document_type')));
  }, [])
  return (

      <div className="tw-flex tw-flex-wrap tw-my-1 tw-p-4 tw--mx-2">
        <div className="tw-w-full tw-px-2">
          <SelectInput
            name="documentTypeId"
            labelText="Document Type"
            value={addDocumentDetailsForm.values.documentTypeId}
            onChange={addDocumentDetailsForm.handleChange}
            onBlur={addDocumentDetailsForm.handleBlur}
            menuItems={getEmployeeDocumentListResp || []}
            valueKey="id"
            textKey="documentName"
            invalid={
              addDocumentDetailsForm.touched.documentTypeId &&
              addDocumentDetailsForm.errors.documentTypeId
                ? true
                : false
            }
            error={
              addDocumentDetailsForm.touched.documentTypeId &&
              addDocumentDetailsForm.errors.documentTypeId
                ? addDocumentDetailsForm.errors.documentTypeId
                : ""
            }
            isDisabled={!!props.editData}
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-w-full tw-px-2">
          <BrowseFile
            name="uploadDocument"
            onChangeFileHndlr={onChangeFileInputHndlr}
            fileName={addDocumentDetailsForm.values.uploadDocument?.name}
            invalid={
              addDocumentDetailsForm.touched.uploadDocument &&
              addDocumentDetailsForm.errors.uploadDocument
                ? true
                : false
            }
            error={
              addDocumentDetailsForm.touched.uploadDocument &&
              addDocumentDetailsForm.errors.uploadDocument
                ? addDocumentDetailsForm.errors.uploadDocument
                : ""
            }
            containerClassName="tw-mb-3"
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
           <div className="tw-w-full tw-flex tw-justify-end tw-gap-2 tw-mt-2 tw-px-2">
           <Button
             type="button"
             variant="secondary"
             onClick={props.toggle}
           >
             Cancel
           </Button>
         
           <Button
             type="button"
             variant='primary'
             onClick={(event:any)=>addDocumentDetailsForm.handleSubmit(event)}
             disabled={showApiLoader || (!itemSelected&&!!props.editData)}
           >
             Submit
           </Button>
         
       </div>
      </div>
   
  )
}

export default AddDocumentDetailsModal
