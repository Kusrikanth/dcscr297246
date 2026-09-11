import React, { useMemo, useState } from 'react'
import { InputCheckbox, MathPreview, StatusLabel } from '../../../../../../Components/Common';

interface QuestionCardListProps {
  questions: any[];
  onAddQuestion: (questionId: string) => void;
  onPreviewQuestion: (question: any) => void;
  searchString?: string;
  selectedQuestions?: string[];
}

const QuestionCardList: React.FC<QuestionCardListProps> = ({
  questions,
  onAddQuestion,
  onPreviewQuestion,
  searchString,
  selectedQuestions = []
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    if (!searchString) return questions;
    const term = searchString.toLowerCase();

    return questions.filter((q) => {
      const description = q.questionDescription
        ? JSON.stringify(q.questionDescription).toLowerCase()
        : "";
      const title = q.questionTitle?.toLowerCase() || "";
      return description.includes(term) || title.includes(term);
    });
  }, [questions, searchString]);

  return (
    <div className="question-card-list-container">
      {filteredQuestions?.length > 0 ? (
        <div className="questions-wrapper">
          {filteredQuestions.map((q, index) => {
            const isHovered = hoveredId === q.id;
            const isSelected = selectedQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                className={`
                  question-card
                  ${q.isDisabled ? 'question-card--disabled' : 'question-card--enabled'}
                  // ${isHovered && !q.isDisabled ? 'question-card--hovered' : ''}
                  ${isSelected ? 'question-card--selected' : ''}
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                onMouseEnter={() => !q.isDisabled && setHoveredId(q.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="question-card__content">
                  <div className="question-card__main">
                    <div className="question-card__metadata">
                      <span className={`question-type-badge ${isSelected ? 'question-type-badge--selected' : ''}`}>
                        {q.questionTypeShortName}
                      </span>
                      <div className={`difficulty-badge ${isHovered ? 'difficulty-badge--hovered' : ''}`}>
                        <StatusLabel
                          type={q.difficultyLevelName}
                          labelName={q.difficultyLevelName}
                        />
                      </div>
                    </div>
                    <div className={`question-card__description ${isHovered ? 'question-card__description--hovered' : ''}`}>
                      <p className="question-text">
                        <MathPreview json={JSON?.parse(q.questionDescription ? q.questionDescription : '{}')} />
                      </p>
                      <div
                        className={`question-card__actions ps-2 ${isHovered ? 'question-card__actions--visible' : ''}`}
                      >
                        <div className="question-options mt-2 d-flex flex-wrap">
                          {Array.isArray(q.questionOptions) && q.questionOptions.length > 0 ? (
                            q.questionOptions.map((opt: any, idx: number) => (
                              <div
                                key={opt.optionId}
                                className="d-flex align-items-start gap-2 mb-2 me-4 option-item"
                                style={{ maxWidth: "45%" }}
                              >
                                <span className="fw-bold">{String.fromCharCode(65 + idx)})</span>
                                <MathPreview
                                  json={
                                    typeof opt.optionText === "string"
                                      ? JSON.parse(opt.optionText)
                                      : opt.optionText
                                  }
                                />
                              </div>
                            ))
                          ) : (
                            <span className="text-muted">No options available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`question-card__checkbox d-grid justify-content-center ${isHovered ? 'question-card__checkbox--hovered' : ''}`}>
                    <InputCheckbox
                      name={`question-${q.id}`}
                      value={isSelected}
                      onChange={() => onAddQuestion(q.id)}
                      formgroupClassName="mb-2 d-grid justify-content-center"
                    /><button
                      onClick={() => onPreviewQuestion(q)}
                      className="action-btn action-btn--secondary fs-12"
                    >
                      Preview
                    </button>
                  </div>
                </div>
                {!q.isDisabled && (
                  <div
                    className={`question-card__actions px-2 pb-2 ${isHovered ? 'question-card__actions--visible' : ''}`}
                  >
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => onAddQuestion(q.id)}
                        className={`action-btn action-btn--primary ${isSelected ? 'action-btn--selected' : ''}`}
                      >
                        {isSelected ? 'Remove from selected' : 'Add to selected'}
                      </button>

                      <button
                        onClick={() => onPreviewQuestion(q)}
                        className="action-btn action-btn--secondary"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__content">
            <div className="empty-state__icon">
              <span>?</span>
            </div>
            <h3 className="empty-state__title">
              {searchString ? 'No matching questions found' : 'No questions found'}
            </h3>
            <p className="empty-state__description">
              {searchString
                ? 'Try adjusting your search terms or clear the search to see all questions'
                : 'Apply filters above to find questions from the question bank'}
            </p>
            <button
              type="button"
              className="empty-state__button"
              style={{ color: '#20c997' }}
            >
              Browse all questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCardList;