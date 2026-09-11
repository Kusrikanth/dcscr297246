import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons-pro/core-stroke-standard';
import { MathPreview, Switch } from '../../../../../../Components/Common';
import { useFormik } from 'formik';
import { useAppSelector } from '../../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const initialValues = {
  solutionDetails: false,
};



export interface Question {
  id: number;
  questionText: string;
  questionDescription: string;
  status: 'Correct' | 'Incorrect';
  chosenOptionId: number | number[]; 
  correctOptionId: number[];  
  solution: string;   
  options: any[];
}

const transformQuestionData = (apiResponse): Question | null => {
  if (!apiResponse) return null;

  const correctOptions = apiResponse?.questionOptions
    ?.filter(option => option.isCorrectAnswer)
    ?.map(option => option.optionId);

  const optionLabels = ['a', 'b', 'c', 'd', 'e', 'f'];
  const transformedOptions = apiResponse.questionOptions?.map((option, index) => ({
    id: option.optionId,
    optionTextId: optionLabels[index] || `option${index + 1}`,
    text: option.optionText,
  }));

  const transformedQuestionData: Question = {
    id: apiResponse.questionId,
    questionText: apiResponse.questionTitle,
    questionDescription: apiResponse.questionDescription || '',
    status: 'Correct',
    chosenOptionId: [], 
    correctOptionId: correctOptions,
    solution: apiResponse.textSolution || '',
    options: transformedOptions,
  };

  return transformedQuestionData;
};


interface FetchQuestionsModelProps {
  id: any;
  isOpen: boolean;
  toggle: () => void;
  modalTitle: string;
}

const PreviewQuestion: React.FC<FetchQuestionsModelProps> = ({
  id,
  isOpen,
  toggle,
  modalTitle,
}) => {
  const createEmployeeForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => {},
  });

  const { getQuestionBankByIdResp } = useAppSelector(
    ({ lmsAssessment }) => ({
      getQuestionBankByIdResp: lmsAssessment.getQuestionBankByIdResp,
    }),
    shallowEqual
  );

  const q = transformQuestionData(getQuestionBankByIdResp);

  if (!q) {
    return (
      <div className="p-3">
        <div>Loading question data...</div>
      </div>
    );
  }


  return (
    <div className="p-3">
      <h5 className="mb-3 fs-12">{q.questionDescription ? <MathPreview json={JSON.parse(q.questionDescription)}/> : ''}</h5>

      <div className="mb-3 row w-100 mx-auto d-flex gy-2 fs-12">
        {q.options?.map((option) => {
          const isCorrect = q.correctOptionId.includes(option.id);
          return (
            <div
              key={option.id}
              className={`col-12 tw-rounded-lg p-2 fs-12 d-flex align-items-center mb-2 ${
                isCorrect
                  ? 'tw-bg-[rgba(10,179,156,0.15)] border-success border-1'
                  : 'border-2'
              }`}
              style={
                isCorrect
                  ? { boxShadow: '0 6px 6px rgba(10, 179, 156, 0.25)' }
                  : undefined
              }
            >
              <span
                className={`tw-rounded-full tw-me-2 tw-p-1 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ${
                  isCorrect ? 'bg-success text-white' : 'border'
                }`}
              >
                {option.optionTextId.toUpperCase()}
              </span>
              <span><MathPreview json={JSON?.parse(option.text ? option.text : {})} /></span>
              {isCorrect && (
                <span className="tw-w-6 tw-h-6 tw-rounded-full tw-ms-auto tw-me-3 tw-flex tw-items-center tw-justify-center bg-success text-white">
                  <HugeiconsIcon icon={Tick01Icon} size={14} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="row align-items-center">
        <div className="col-auto d-grid">
          <span className="fs-12">Show Solution Details</span>
        </div>
        <div className="col-auto d-flex justify-content-center">
          <Switch
            attributeId="solutionDetails"
            checked={createEmployeeForm.values.solutionDetails}
            onChangeHndlr={createEmployeeForm.handleChange}
            className="form-switch-sm mb-0"
          />
        </div>
      </div>

      {createEmployeeForm.values?.solutionDetails && q?.solution && (
        <div
          className="border rounded p-2 px-3 mt-2 fs-12"
          style={{ backgroundColor: 'rgb(255 162 0 / 10%)' }}
        >
          <div className="fw-bold">Solution:</div>
          <div>
            {/* {typeof q.solution === 'string' ? (
              q.solution
            ) : (
              q.solution ? <MathPreview json={JSON?.parse(q?.solution)} />: ''
            )} */}
            <MathPreview json={JSON?.parse(q?.solution)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewQuestion;