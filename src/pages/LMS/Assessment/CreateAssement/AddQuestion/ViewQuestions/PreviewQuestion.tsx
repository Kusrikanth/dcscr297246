import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons-pro/core-stroke-standard';
import { Switch } from '../../../../../../Components/Common';
import { useFormik } from 'formik';
const initialValues = {
  solutionDetails: false,
}
export interface Option {
  id: number;
  optionTextId: string;
  text: string;
}

export interface Question {
  id: number;
  questionText: string;
  status: 'Correct' | 'Incorrect';
  chosenOptionId: number;
  correctOptionId: number;
  options: Option[];
}

const questionData: Question & { solution: string } = {
  id: 1,
  questionText: 'What is the HCF of 36 and 60?',
  status: 'Incorrect',
  chosenOptionId: 3,
  correctOptionId: 2,
  solution: 'HCF of 36 and 60 is 12',
  options: [
    { id: 1, optionTextId: 'a', text: '6' },
    { id: 2, optionTextId: 'b', text: '12' },
    { id: 3, optionTextId: 'c', text: '18' },
    { id: 4, optionTextId: 'd', text: '24' },
  ],
};

interface FetchQuestionsModelProps {
  id: any;
  isOpen: boolean;
  toggle: () => void;
  modalTitle: string;
   question?: Question & { solution?: string };
}


const PreviewQuestion: React.FC<FetchQuestionsModelProps> = ({
  question,
  isOpen,
  toggle,
  modalTitle,
}) => {
  const q = question || questionData;

  const createEmployeeForm = useFormik({
  enableReinitialize: true,
  initialValues: {
    solutionDetails: false,
    chosenOptionId: q.chosenOptionId,
  },
  onSubmit: () => {},
});

const handleOptionClick = (id: number) => {
  createEmployeeForm.setFieldValue("chosenOptionId", id);
};

  return (
    <div className="p-3">
      <h5 className="mb-3 fs-12">{q.questionText}</h5>
      <div className="mb-3 row w-100 mx-auto d-flex gy-2 fs-12">
        {q.options.map((option: any) => {
  const isCorrect = option.id === q.correctOptionId;
  const isSelected = option.id === createEmployeeForm.values.chosenOptionId;

  return (
    <div
      key={option.id}
      onClick={() => handleOptionClick(option.id)}
      className={`col-12 tw-rounded-lg p-2 fs-12 d-flex align-items-center mb-2 cursor-pointer ${
        isCorrect && isSelected
          ? 'tw-bg-[rgba(10,179,156,0.15)] border-success border-1'
          : isSelected
          ? 'tw-bg-[rgba(10, 179, 156, 0.05)] border-info border-1'
          : 'border-2'
      }`}
      style={
        isCorrect && isSelected
          ? { boxShadow: '0 6px 6px rgba(10, 179, 156, 0.25)' }
          : undefined
      }
    >
      <span
        className={`tw-rounded-full tw-me-2 tw-p-1 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ${
          isCorrect && isSelected
            ? 'bg-success text-white'
            : isSelected
            ? 'bg-info text-white'
            : 'border'
        }`}
      >
        {option.optionTextId.toUpperCase()}
      </span>
      <span>{option.text}</span>

      {isCorrect && isSelected && (
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

      {createEmployeeForm.values.solutionDetails && q.solution && (
        <div
          className="border rounded p-2 px-3 mt-2 fs-12"
          style={{ backgroundColor: 'rgb(255 162 0 / 10%)' }}
        >
          <div className="fw-bold">Solution:</div>
          <div>{q.solution}</div>
        </div>
      )}
    </div>
  );
};


export default PreviewQuestion;
