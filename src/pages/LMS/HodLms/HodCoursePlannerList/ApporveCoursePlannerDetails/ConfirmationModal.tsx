import { TextInput } from '../../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import * as Yup from "yup";
import { sendBuildReviewAct } from '../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction';


const initialValues = {
    comment: null,
}

const validationSchema = Yup.object().shape({
    comment: Yup.string().required('comment is required').nullable(),
})
const ConfirmationModal = (props: any) => {
    const dispatch = useAppDispatch()

    const {
        showApiLoader } =
        useAppSelector(({ globalData }) => ({
            showApiLoader: globalData.showApiLoader,

        }), shallowEqual);


    const updatePriorityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            dispatch(sendBuildReviewAct(generateActionPayload("send_build_review", { subjectCurriculumId: props.subjectCurriculumId, isConfirmed: true, comment: values.comment }, undefined)));
        },
    });

    return (
        <div className='card-body'>

            <div className='row mb-4'>
                <div className='col-12'>
                    <TextInput
                        name="comment"
                        value={updatePriorityForm.values.comment}
                        onChange={updatePriorityForm.handleChange}
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        labelText='Comment'
                    />
                </div>
            </div>
            <div className="hstack gap-2 justify-content-end ">

                <button
                    type="button"
                    className={"btn btn-light"}
                    onClick={props.toggle}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className={`btn btn-success
                         `}
                    onClick={(event: any) => updatePriorityForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </button>

            </div>
        </div>
    )
}

export default ConfirmationModal