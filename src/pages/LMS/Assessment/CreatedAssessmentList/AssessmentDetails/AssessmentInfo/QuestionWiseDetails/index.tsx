import { useMemo } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon } from "@hugeicons-pro/core-stroke-standard";
import {
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../../../Components/Common";
import { useModal } from "../../../../../../../hooks/modalhook";
import PreviewQuestion from "../../../../CreateAssement/AddQuestion/ViewQuestions/PreviewQuestion";
import BloomsTaxonomyChart from "./DashboardSection/BloomsTaxonomy";
import QuestionDistribution from "./DashboardSection/QuestionDistribution";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../../../assets/imagesdps/common_icon/export_icon.svg";

const QuestionWiseDetails = () => {
  const {
    openModal: viewQuestionDetailsOpenModal,
    closeModal: viewQuestionDetailsCloseModal,
    modalState: viewQuestionDetailsModalStates,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon icon={ViewIcon} size={18} className="me-2" />
        ),
        actionName: "View",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          console.log(id);
          viewQuestionDetailsOpenModal(id);
        },
      },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-5 d-grid">
          <QuestionDistribution></QuestionDistribution>
        </div>
        <div className="col-12 col-lg-7 d-grid">
          <BloomsTaxonomyChart></BloomsTaxonomyChart>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">Queston wise Analysis</h4>
        </div>
        <div className="card-body p-0">
          <div className="row g-3 p-3">
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                  value={""}
                  onChange={() => {}}
                  formgroupClassName="mb-0"
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-xl-2">
              <SelectInput
                name="typeId"
                value={""}
                onChange={() => {}}
                menuItems={[]}
                valueKey=""
                textKey=""
                labelText="Difficulty Level"
                floatingLabel
              ></SelectInput>
            </div>
            <div className="col-12 col-lg-3 col-xl-2">
              <SelectInput
                name="difficultyLevelId"
                value={""}
                onChange={() => {}}
                menuItems={[]}
                valueKey=""
                textKey=""
                labelText="Bloom"
                floatingLabel
              ></SelectInput>
            </div>

            <div className="col-auto ms-auto">
              <div className="d-flex align-items-center">
                <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2"
                  onClick={() => {}}
                >
                  <img src={ExportIcon} className="img-fluid h-100" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive mb-3 fs-12"
            tableClass="table-nowrap"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={0}
            totalRecords={0}
          ></TableContainer>
        </div>
      </div>

      <ModalContainerUpdated
        id="view-question-details-modal-container"
        isOpen={viewQuestionDetailsModalStates.showModal}
        toggle={viewQuestionDetailsCloseModal}
        modalTitle="View Question Details"
        modalSize="lg"
      >
        <PreviewQuestion
          id={viewQuestionDetailsModalStates.modalData}
          isOpen={false}
          toggle={viewQuestionDetailsCloseModal}
          modalTitle="View Question Details"
        ></PreviewQuestion>
      </ModalContainerUpdated>
    </>
  );
};

export default QuestionWiseDetails;
