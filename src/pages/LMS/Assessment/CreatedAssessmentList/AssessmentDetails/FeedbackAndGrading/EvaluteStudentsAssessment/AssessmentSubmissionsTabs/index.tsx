import { useState, useEffect } from "react";
import {
  ModalContainerUpdated,
  TextInput,
  UserDetails,
} from "../../../../../../../../Components/Common";
import { useModal } from "../../../../../../../../hooks/modalhook";
import FiltersModal from "./FiltersModal";
import { default as RejectSvg } from "../../../../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const stylesList = {
  review: {
    border: "tw-border-2 tw-border-[#a8c1f7]",
    bgColor: "tw-bg-[#EFF6FF]",
    textColor: "tw-text-[#2563EB]",
  },
  pending: {
    border: "tw-border-2 tw-border-gray-400",
    bgColor: "tw-bg-[#EFF6FF]",
    textColor: "tw-text-[#4B5563]",
  },
  graded: {
    border: "tw-border-[1px] tw-border-green-400",
    bgColor: "tw-bg-[#EFF6FF]",
    textColor: "tw-text-[#24A760]",
  },
  not_submitted: {
    border: "tw-border-2 tw-border-red-400",
    bgColor: "tw-bg-[#EFF6FF]",
    textColor: "tw-text-[#A61B1B]",
  },
};

const StudentCard = ({ student, onClick,selectedStudentId}) => {
    let displayValue: string | null = null;
    let statusKey: keyof typeof stylesList = "pending";

    if (
      student.totalAttempted != null &&
      student.totalQuestionCount != null
    ) {
      displayValue = `${student.totalAttempted}/${student.totalQuestionCount}`;
      statusKey = "graded";
    } else if (student.attemptStatus === "ABSENT") {
      displayValue = "ABSENT";
      statusKey = "not_submitted";
    } else {
      displayValue = "Pending";
      statusKey = "pending";
    }

    const isSelected = selectedStudentId === student.id;

    return (
      <div className={`tw-p-2 tw-flex tw-justify-between tw-items-center tw-rounded-lg tw-cursor-pointer hover:tw-bg-gray-50 tw-me-2
      ${isSelected ? "tw-bg-gray-50" : ""}
      ${isSelected ? "tw-border" : "tw-border"} `}
        onClick={onClick}
      >
        <UserDetails
            displayName={student.studentName}
            displayId={student.studentCode}
            displayNameClass="fs-12"
            mainDivClass="tw-flex-grow-1 tw-w-[75%]"
            size="xs"
          />
          <div className="tw-text-xs tw-font-semibold">
            <span className={stylesList[statusKey]?.textColor}>
              {displayValue}
            </span>
          </div>
      </div>
    );
  };

const AssessmentSubmissionsTabs = ({ students, onStudentSelect }) => {
  const [searchString, setSearchString] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  const {
    openModal: filtersOpenModal,
    closeModal: filtersCloseModal,
    modalState: filtersModalState,
  } = useModal();

  const handleStudentSelect = (student) => {
    setSelectedStudentId(student.id);
    onStudentSelect(student.id, student);
  };

  const arrangeStudents = (students: any[]) => {
    const attempted = students.filter(
      (s) => s.totalAttempted != null && s.totalQuestionCount != null
    );
    const pending = students.filter(
      (s) =>
        (s.totalAttempted == null || s.totalQuestionCount == null) &&
        s.attemptStatus !== "ABSENT"
    );

    return [...attempted, ...pending];
  };

  const filteredStudents = arrangeStudents(students)
    .filter(
      (s) =>
        (s.studentName?.toLowerCase().includes(searchString.toLowerCase()) ||
          s.studentCode?.toLowerCase().includes(searchString.toLowerCase())) &&
        s.attemptStatus !== "ABSENT"
    );

  useEffect(() => {
    if (!hasAutoSelected && filteredStudents.length > 0) {
      const firstAttempted = filteredStudents.find(
        (s) => s.totalAttempted != null && s.totalQuestionCount != null
      );
      if (firstAttempted) {
        setSelectedStudentId(firstAttempted.id);
        onStudentSelect(firstAttempted.id, firstAttempted);
        setHasAutoSelected(true);
      }
    }
  }, [filteredStudents, hasAutoSelected, onStudentSelect]);

  return (
    <>
      <div className="tw-p-3 h-100 tw-w-full">
        <div className="tw-mb-4 tw-border-b tw-pb-4">
          <div className="tw-flex tw-gap-3">
            <div className="search-box !tw-flex-1">
              <TextInput
                name="searchString"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-0"
              />
              <i className="ri-search-line search-icon"></i>
            </div>
            {/* <button
              className="tw-w-8 tw-h-auto tw-border tw-rounded tw-flex tw-items-center tw-justify-center"
              onClick={() => filtersOpenModal()}
            >
              <HugeiconsIcon icon={Sorting01Icon} size={18} className="" />
            </button> */}
          </div>
        </div>
        <div className="tw-overflow-y-auto custom-scrollbar tw-h-[898px] tw-w-full">
          {filteredStudents.length > 0 ? (
            <div className="tw-flex tw-flex-col tw-gap-y-3 tw-box-border tw-w-full tw-max-w-full">
              {filteredStudents.map((student) => (
                <StudentCard
                  student={student}
                  key={student.studentId}
                  onClick={() => handleStudentSelect(student)}
                  selectedStudentId = {selectedStudentId}
                />
              ))}
            </div>
          ) : (
            <div className="tw-text-center tw-text-gray-500 tw-py-6">
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
                <RejectSvg className="tw-w-6 tw-h-6 tw-text-red-500" />
                <span>
                  No Students submitted the Assessment
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalContainerUpdated
        id="filters-modal-container"
        isOpen={filtersModalState.showModal}
        toggle={filtersCloseModal}
        modalTitle={"Filters"}
        modalSize="md"
      >
        <FiltersModal toggle={filtersCloseModal}></FiltersModal>
      </ModalContainerUpdated>
    </>
  );
};

export default AssessmentSubmissionsTabs;