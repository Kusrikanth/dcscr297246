import {
  Bookmark03Icon,
  CircleArrowLeft01Icon,
  CircleArrowRight01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import CurriculumSetup from "./CurriculumSetup";
import {
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewUnitModal from "./AddEditNewUnitModal";

const topics = [
  {
    id: 1,
    unitTitle: "Number System",
    color: "tw-bg-green-500",
    chapters: ["Introduction to Integers", "Number Line & Operations"],
  },
  {
    id: 2,
    unitTitle: "Algebra",
    color: "tw-bg-red-500",
    chapters: [],
  },
  {
    id: 3,
    unitTitle: "Coordinate Geometry",
    color: "tw-bg-yellow-500",
    chapters: [],
  },
  {
    id: 4,
    unitTitle: "Geometry",
    color: "tw-bg-yellow-500",
    chapters: [],
  },
  {
    id: 5,
    unitTitle: "Trigonometry",
    color: "tw-bg-yellow-500",
    chapters: [],
  },
];

const CurriculumDetails = () => {
  const [unitsList, setUnitsList] = useState(topics);
  const [selectedUnit, setSelectedUnit] = useState(unitsList[0]);

  const {
    openModal: addEditNewUnitOpenModal,
    closeModal: addEditNewUnitCloseModal,
    modalState: addEditNewUnitModalState,
  } = useModal();

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-4">
          <div className="card !tw-rounded-lg border tw-overflow-hidden">
            <div className="card-header">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="card-title mb-0">Units</h4>
                <button
                  className="btn btn-success"
                  onClick={addEditNewUnitOpenModal}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    size={18}
                    className="me-2"
                  />
                  Add Units
                </button>
              </div>
            </div>

            <div className="card-body">
              <UncontrolledAccordion
                defaultOpen={[`unit-${unitsList[0].id}`]}
                className="tw-border tw-rounded-md"
              >
                {unitsList.map((unit) => (
                  <AccordionItem key={unit.id}>
                    {/* Unit header */}
                    <AccordionHeader
                      targetId={`unit-${unit.id}`}
                      className="tw-flex tw-items-center tw-justify-between tw-w-full tw-px-0 !tw-mb-0 tw-py-0 tw-text-left"
                      onClick={() => handleUnitClick(unit)}
                    >
                      <div className="tw-flex tw-items-center tw-gap-2 tw-flex-1">
                        <span
                          className={`tw-w-3 tw-h-3 tw-rounded-full ${unit.color}`}
                        />
                        <span className="tw-text-truncate">
                          {unit.id}.{unit.unitTitle}
                        </span>
                      </div>
                    </AccordionHeader>

                    {/* Chapters list */}
                    <AccordionBody accordionId={`unit-${unit.id}`}>
                      {unit.chapters.length > 0 ? (
                        <ul className="tw-list-disc tw-list-inside tw-text-gray-700 tw-ps-2 tw-mb-0">
                          {unit.chapters.map((chapter, index) => (
                            <li key={index}>{chapter}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="tw-text-gray-500">No chapters yet</p>
                      )}
                    </AccordionBody>
                  </AccordionItem>
                ))}
              </UncontrolledAccordion>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="col-12 col-lg-8">
          <CurriculumSetup selectedUnit={selectedUnit} />
        </div>
      </div>

      <div className="row mt-4 w-100 mx-auto">
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success me-2"
            //   onClick={handlePrevious}
            //   disabled={stepId === "generalInformation"}
          >
            <HugeiconsIcon
              icon={CircleArrowLeft01Icon}
              size={20}
              color="currentColor"
              className="!tw-mr-1"
            />
            Previous Step
          </button>
          <div>
            <button type="button" className="btn btn-outline-primary me-2">
              <HugeiconsIcon
                icon={Bookmark03Icon}
                size={20}
                color="currentColor"
                className="!tw-mr-1"
              />
              Save as draft
            </button>
            <button
              type="button"
              className="btn btn-success"
              // onClick={handleNext}
            >
              Next Step{" "}
              <HugeiconsIcon
                icon={CircleArrowRight01Icon}
                size={20}
                color="currentColor"
                className="!tw-ml-1"
              />
            </button>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-new-unit"
        isOpen={addEditNewUnitModalState.showModal}
        toggle={addEditNewUnitCloseModal}
        modalSize="md"
        modalTitle="Add New Unit"
      >
        <AddEditNewUnitModal toggle={addEditNewUnitCloseModal} />
      </ModalContainerUpdated>
    </>
  );
};

export default CurriculumDetails;
