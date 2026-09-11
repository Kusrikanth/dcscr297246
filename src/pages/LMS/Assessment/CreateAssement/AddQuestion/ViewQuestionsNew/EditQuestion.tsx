import React, { useState } from 'react';
import { TextInput } from '../../../../../../Components/Common';

interface EditMarksModalProps {
  question: any;
  onSave: (questionId: string, customMarks: number) => void;
  onClose: () => void;
}

const EditMarksModal: React.FC<EditMarksModalProps> = ({ question, onSave, onClose }) => {

  const calculatedMarks = question?.questionOptions?.reduce((sum: number, option: any) => 
    sum + (option.allocatedMarks ?? 0), 0) || 0;
  
  // const [customMarks, setCustomMarks] = useState(
  //   question?.customMarks !== undefined ? question.customMarks : calculatedMarks
  // );
const [customMarks, setCustomMarks] = useState(() => {
  if (question?.customMarks !== undefined) {
    return question.customMarks;
  }
  
  if (question?.marks) {
    return question.marks;
  }
  
  // Fallback calculation from questionOptions
  if (question?.questionOptions && Array.isArray(question.questionOptions)) {
    return calculatedMarks
  }
  return 0;
});

  const handleSave = () => {
    onSave(question.id, Number(customMarks));
    onClose();
  };

  const handleReset = () => {
    setCustomMarks(calculatedMarks);
  };

  return (
    <div className="p-4">

      <div className="mb-3 col-6">
        <TextInput
          name="customMarks"
          value={customMarks}
          onChange={(e) => setCustomMarks(e.target.value)}
          labelText=" Marks"
          formgroupClassName="mb-0"
          labelClass="fs-12 fw-semibold"
          inputClassName="fs-12"
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn btn-success btn-sm fs-12"
          onClick={handleSave}
        >
          Update
        </button>
        <button 
          type="button" 
          className="btn btn-outline-primary btn-sm fs-12"
          onClick={handleReset}
        >
          Reset
        </button>
        <button 
          type="button" 
          className="btn btn-light btn-sm fs-12"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditMarksModal;