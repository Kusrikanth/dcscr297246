import { useFormik } from 'formik';
import { default as ApproveSvg } from '../../../assets/imagesdps/academics/confirmation-icon.svg?react';
import { TextIconInput } from '../../../Components/Common';
import * as Yup from 'yup';

const initialValues = {
  reason: '',
};

const DeleteConfirmationModal = (props: any) => {
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
  });

  const cancelConfimFormik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      props.confirmHndlr(values.reason);
    },
  });

  return (
    <>
      <div className="tw-p-3">
        <div className="d-flex flex-column align-items-center mb-3 justify-content-center">
          <div className="tw-flex tw-mb-3 justify-content-center">
            <ApproveSvg fill="#0ab39c" width={'70px'} height="70px" />
          </div>
          <h4>{props.confirmTitle || 'Are you sure?'}</h4>
          <p className="text-muted mb-0">
            Are you sure you want to remove from Not Reporting.
          </p>
          <div className="tw-w-full tw-mt-4 tw-flex tw-justify-center">
            <TextIconInput
              name="reason"
              value={cancelConfimFormik.values.reason}
              onChange={cancelConfimFormik.handleChange}
              invalid={
                cancelConfimFormik.touched.reason &&
                cancelConfimFormik.errors.reason
                  ? true
                  : false
              }
              error={
                cancelConfimFormik.touched.reason &&
                cancelConfimFormik.errors.reason
                  ? cancelConfimFormik.errors.reason
                  : ''
              }
              inputClassName="tw-w-full"
              placeHolder="Reason.."
              formgroupClassName="tw-w-[75%] tw-mb-4"
              maxLength={500}
            >
              <i className="ri-pencil-line tw-text-gray-500"></i>
            </TextIconInput>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center pb-4 tw-mt-4">
          <button
            type="button"
            className="btn w-sm btn-light m-0"
            data-bs-dismiss="modal"
            onClick={props.cancelHndlr}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={'btn w-sm btn-danger'}
            id="delete-record"
            onClick={() => cancelConfimFormik.handleSubmit()}
            disabled={props.isDisble || false}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
