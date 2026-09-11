import { useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { BrowseFile, Switch, TextArea } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';

type UploadImageResponse = {
  id?: number | string;
  originalName?: string;
  fileType?: string;
  s3Url?: string;
};

type StudentIndividualProjectFormValues = {
  isIndividualProject: boolean;
  projectDescription: string;
  uploadImage: File | UploadImageResponse | string | null;
  uploadImageFileName: string;
};

const MAX_UPLOAD_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

function normalizeUploadImageFileType(fileType?: string) {
  const normalizedFileType =
    fileType?.trim().toLowerCase().replace(/^\./, '') || '';

  if (!normalizedFileType) return '';
  if (normalizedFileType === 'jpg' || normalizedFileType === 'jpeg') {
    return 'image/jpeg';
  }
  if (normalizedFileType === 'png') {
    return 'image/png';
  }

  return fileType?.trim().toLowerCase() || '';
}

function getUploadImageFileTypeFromName(value?: string) {
  const normalizedValue = value?.toLowerCase().split('?')[0] || '';

  if (normalizedValue.endsWith('.jpg')) return 'image/jpeg';
  if (normalizedValue.endsWith('.jpeg')) return 'image/jpeg';
  if (normalizedValue.endsWith('.png')) return 'image/png';
  if (normalizedValue.endsWith('.pdf')) return 'application/pdf';

  return '';
}

function getUploadImageFileType(
  value: StudentIndividualProjectFormValues['uploadImage'],
) {
  if (!value) return '';

  if (typeof File !== 'undefined' && value instanceof File) {
    return value.type;
  }

  if (typeof value === 'object' && 'fileType' in value) {
    const normalizedFileType = normalizeUploadImageFileType(value.fileType);

    if (normalizedFileType) return normalizedFileType;
  }

  if (typeof value === 'object') {
    const uploadImageResponse = value as UploadImageResponse;
    const fileTypeFromName = getUploadImageFileTypeFromName(
      uploadImageResponse.originalName || uploadImageResponse.s3Url,
    );

    if (fileTypeFromName) return fileTypeFromName;
  }

  if (typeof value === 'string') {
    return getUploadImageFileTypeFromName(value);
  }

  return '';
}

function isAcceptedUploadImageType(
  value: StudentIndividualProjectFormValues['uploadImage'],
) {
  const fileType = getUploadImageFileType(value);

  return !fileType || ACCEPTED_IMAGE_TYPES.includes(fileType);
}

function getUploadImageFileName(student?: any) {
  if (!student) return '';

  if (student.uploadImageFileName) return student.uploadImageFileName;
  if (typeof File !== 'undefined' && student.uploadImage instanceof File) {
    return student.uploadImage.name;
  }
  if (
    student.uploadImage &&
    typeof student.uploadImage === 'object' &&
    'originalName' in student.uploadImage
  ) {
    return student.uploadImage.originalName || '';
  }
  if (
    student.uploadImageUrl &&
    typeof student.uploadImageUrl === 'object' &&
    'originalName' in student.uploadImageUrl
  ) {
    return student.uploadImageUrl.originalName || '';
  }

  return (
    student.uploadImageName ||
    (typeof student.uploadImageUrl === 'string' ? student.uploadImageUrl : '')
  );
}

function getStudentIndividualProjectInfo(student?: any) {
  return {
    isIndividualProject: student?.isIndividualProject ?? false,
    projectDescription: student?.projectDescription ?? '',
    uploadImage: student?.uploadImage ?? student?.uploadImageUrl ?? null,
    uploadImageFileName: getUploadImageFileName(student),
  };
}

const validationSchema = Yup.object().shape({
  isIndividualProject: Yup.boolean(),
  projectDescription: Yup.string().when('isIndividualProject', {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .required('Project description is required')
        .max(50, 'Project description should not exceed 50 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),
  uploadImage: Yup.mixed().when('isIndividualProject', {
    is: true,
    then: (schema) =>
      schema
        .test('required-image', 'Project image is required', function (value) {
          const { uploadImageFileName } = this.parent;

          return Boolean(value) || Boolean(uploadImageFileName);
        })
        .test(
          'file-size',
          'Project image should not exceed 5 MB',
          function (value) {
            if (typeof File === 'undefined' || !(value instanceof File)) {
              return true;
            }

            return value.size <= MAX_UPLOAD_IMAGE_SIZE;
          },
        )
        .test(
          'file-type',
          'Project image should be JPG, JPEG, or PNG',
          (value) =>
            isAcceptedUploadImageType(
              value as StudentIndividualProjectFormValues['uploadImage'],
            ),
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const StudentIndividualProjectModal = ({
  isOpen,
  toggle,
  student,
  showApiLoader,
  onSubmitHandler,
}: any) => {
  const formik = useFormik<StudentIndividualProjectFormValues>({
    initialValues: getStudentIndividualProjectInfo(student),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmitHandler?.({
        studentId: student?.studentId,
        isIndividualProject: values.isIndividualProject,
        projectDescription: values.isIndividualProject
          ? values.projectDescription
          : '',
        uploadImage: values.isIndividualProject ? values.uploadImage : null,
        uploadImageFileName: values.isIndividualProject
          ? values.uploadImageFileName
          : '',
      });
      toggle?.();
    },
  });
  const { resetForm } = formik;

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function onChangeFileInputHndlr(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const errorMessage = 'Project image should be JPG, JPEG, or PNG';

      event.target.value = '';
      formik.setFieldTouched('uploadImage', true, false);
      formik.setFieldValue('uploadImage', null, false);
      formik.setFieldValue('uploadImageFileName', '', false);
      formik.setFieldError('uploadImage', errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
      const errorMessage = 'Project image should not exceed 5 MB';

      event.target.value = '';
      formik.setFieldTouched('uploadImage', true, false);
      formik.setFieldValue('uploadImage', null, false);
      formik.setFieldValue('uploadImageFileName', '', false);
      formik.setFieldError('uploadImage', errorMessage);
      toast.error(errorMessage);
      return;
    }

    formik.setFieldError('uploadImage', '');
    formik.setValues((prevState) => ({
      ...prevState,
      uploadImage: file,
      uploadImageFileName: file.name,
    }));
  }

  async function submitFormHndlr(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = await formik.validateForm();

    formik.setTouched(
      {
        projectDescription: true,
        uploadImage: true,
      },
      false,
    );

    if (typeof errors.uploadImage === 'string') {
      toast.error(errors.uploadImage);
    }

    if (Object.keys(errors).length > 0) return;

    formik.handleSubmit(event);
  }

  return (
    <form onSubmit={submitFormHndlr}>
      <div className="tw-p-4 tw-pb-0">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-1 tw-pb-3">
          <div className="tw-col-span-12">
            <Switch
              attributeId="isIndividualProject"
              labelName="Is Individual Project"
              checked={formik.values.isIndividualProject}
              onChangeHndlr={formik.handleChange}
            />
          </div>
          <div className="tw-col-span-12">
            <TextArea
              name="projectDescription"
              labelText="Project Description"
              formgroupClassName="tw-mb-0"
              value={formik.values.projectDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isDisabled={!formik.values.isIndividualProject}
              invalid={
                !!(
                  formik.touched.projectDescription &&
                  formik.errors.projectDescription
                )
              }
              error={
                formik.touched.projectDescription &&
                formik.errors.projectDescription
                  ? formik.errors.projectDescription
                  : ''
              }
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-7">
            <BrowseFile
              containerClassName="tw-mb-0"
              labelText="Upload Image"
              labelClass={formik.values.isIndividualProject ? 'required' : ''}
              name="uploadImage"
              fileName={formik.values.uploadImageFileName}
              onChangeFileHndlr={onChangeFileInputHndlr}
              isDisabled={!formik.values.isIndividualProject}
              invalid={
                !!(formik.touched.uploadImage && formik.errors.uploadImage)
              }
              error={
                formik.touched.uploadImage && formik.errors.uploadImage
                  ? formik.errors.uploadImage
                  : ''
              }
            />
          </div>
        </div>
      </div>
      <div className="tw-px-4 tw-pt-3 tw-pb-5">
        <div className="tw-flex tw-justify-end tw-gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={toggle}
            disabled={showApiLoader || false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={showApiLoader || false}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StudentIndividualProjectModal;
