import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import { ModalContainerUpdated, Switch } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";
import { getData } from "../../../api/apiactions";
import { generateApiUrl } from "../../../api/apihelper";
import { useAppSelector } from "../../../hooks/storehook";
import { IApplicableClass } from "../../../utility/approvalconfigutility";

interface IClassScopeModalProps {
  isOpen: boolean;
  toggle: () => void;
  participantName: string;
  applicableClasses: Array<IApplicableClass>;
  onSave: (applicableClasses: Array<IApplicableClass>) => void;
}

interface ICurriculumClassGroup {
  curriculumId: string;
  curriculumName: string;
  classes: Array<any>;
}

/**
 * Per-approver class scope: an approver either covers every class (e.g. an
 * accountant or the principal) or only the selected ones (e.g. a vice
 * principal responsible for a couple of classes). Every curriculum's classes
 * are listed together, so one scope can span multiple curriculums.
 * Fetches directly through the API helpers instead of the shared redux slots
 * so loading all curriculums in parallel does not disturb other screens.
 */
const ClassScopeModal: React.FC<IClassScopeModalProps> = ({
  isOpen,
  toggle,
  participantName,
  applicableClasses,
  onSave,
}) => {
  const [allClasses, setAllClasses] = useState(!applicableClasses.length);
  const [selectedClasses, setSelectedClasses] =
    useState<Array<IApplicableClass>>(applicableClasses);
  const [curriculumGroups, setCurriculumGroups] = useState<
    Array<ICurriculumClassGroup>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, academicYearListResp } =
    useAppSelector(
      ({ appData, instAcademics }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
      }),
      shallowEqual
    );

  useEffect(() => {
    let isCancelled = false;

    async function loadCurriculumClasses() {
      setIsLoading(true);
      try {
        let academicYears = academicYearListResp?.data;
        if (!Array.isArray(academicYears) || !academicYears.length) {
          const yearResponse: any = await getData(
            generateApiUrl("get_inst_academic_year", undefined),
            {
              instituteId,
              sortBy: "academicYearName",
              orderBy: "desc",
              pageNo: 0,
              pageSize: 20,
            }
          );
          academicYears = yearResponse?.data?.data;
        }
        const { academicYearId } =
          (academicYears || []).find(
            (year: any) => year?.yearStatus?.toLowerCase() === "current"
          ) || {};
        if (!academicYearId || !branchId) return;

        const curriculumResponse: any = await getData(
          generateApiUrl("get_brch_curriculum", undefined),
          {
            academicYearId,
            branchId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "curriculumName",
            orderBy: "asc",
          }
        );
        const curriculums = curriculumResponse?.data?.data || [];

        const groups: Array<ICurriculumClassGroup> = await Promise.all(
          curriculums.map(async (curriculum: any) => {
            const classResponse: any = await getData(
              generateApiUrl("get_brch_curriculum_class", undefined),
              {
                academicYearId,
                curriculumId: curriculum?.branchCurriculumId,
                branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "classSequence",
                orderBy: "asc",
              }
            );
            return {
              curriculumId: `${curriculum?.branchCurriculumId}`,
              curriculumName: curriculum?.curriculumName || "",
              classes: classResponse?.data?.content || [],
            };
          })
        );

        if (!isCancelled) {
          setCurriculumGroups(groups.filter((group) => group.classes.length));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCurriculumClasses();
    return () => {
      isCancelled = true;
    };
  }, [instituteId, branchId]);

  function isClassSelected(classItem: any, curriculumName: string) {
    return selectedClasses.some(
      (item) =>
        (item.classId && `${item.classId}` === `${classItem?.id}`) ||
        (!item.classId &&
          `${item.className}`.trim().toLowerCase() ===
            `${classItem?.shortName || ""}`.trim().toLowerCase() &&
          (!item.curriculumName || item.curriculumName === curriculumName))
    );
  }

  function toggleClassHndlr(classItem: any, curriculumName: string) {
    setSelectedClasses((prevState) =>
      isClassSelected(classItem, curriculumName)
        ? prevState.filter(
            (item) =>
              !(
                (item.classId && `${item.classId}` === `${classItem?.id}`) ||
                (!item.classId &&
                  `${item.className}`.trim().toLowerCase() ===
                    `${classItem?.shortName || ""}`.trim().toLowerCase())
              )
          )
        : [
            ...prevState,
            {
              classId: `${classItem?.id}`,
              className: classItem?.shortName || classItem?.className || "",
              curriculumName,
            },
          ]
    );
  }

  function removeSelectedClassHndlr(selectedItem: IApplicableClass) {
    setSelectedClasses((prevState) =>
      prevState.filter((item) => item !== selectedItem)
    );
  }

  function saveHndlr() {
    onSave(allClasses ? [] : selectedClasses);
  }

  return (
    <ModalContainerUpdated
      id="ui-class-scope-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="lg"
      modalTitle={`Class scope${participantName ? ` · ${participantName}` : ""}`}
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          Choose whether this approver covers every class or only specific
          classes — across any of the curriculums. Requests from classes
          outside the scope stay view-only for them.
        </p>

        <div className="tw-mb-3">
          <Switch
            attributeId="class-scope-all"
            checked={allClasses}
            onChangeHndlr={(event: React.ChangeEvent<HTMLInputElement>) =>
              setAllClasses(event.target.checked)
            }
            labelClass="tw-ms-2"
            labelName={
              allClasses ? "All classes" : "Only the selected classes"
            }
          />
        </div>

        {!allClasses && (
          <>
            <div className="tw-max-h-80 tw-overflow-y-auto tw-border tw-rounded-md tw-divide-y">
              {isLoading ? (
                <div className="tw-p-4 tw-text-center tw-text-sm tw-text-gray-500">
                  Loading classes…
                </div>
              ) : curriculumGroups.length ? (
                curriculumGroups.map((group) => (
                  <div key={group.curriculumId} className="tw-p-2">
                    <div className="tw-flex tw-items-center tw-gap-2 tw-px-1 tw-mb-1">
                      <span className="tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                        {group.curriculumName}
                      </span>
                      <span className="badge bg-light text-muted">
                        {
                          group.classes.filter((classItem: any) =>
                            isClassSelected(classItem, group.curriculumName)
                          ).length
                        }{" "}
                        selected
                      </span>
                    </div>
                    <div className="tw-grid tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-1">
                      {group.classes.map((classItem: any) => (
                        <label
                          key={classItem?.id}
                          htmlFor={`scope-class-${group.curriculumId}-${classItem?.id}`}
                          className="tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-px-2 tw-py-1 tw-mb-0 tw-cursor-pointer hover:tw-bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            id={`scope-class-${group.curriculumId}-${classItem?.id}`}
                            className="form-check-input"
                            checked={isClassSelected(
                              classItem,
                              group.curriculumName
                            )}
                            onChange={() =>
                              toggleClassHndlr(classItem, group.curriculumName)
                            }
                          />
                          <span>{classItem?.shortName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="tw-p-4 tw-text-center tw-text-sm tw-text-gray-500">
                  No classes found for this branch.
                </div>
              )}
            </div>

            {selectedClasses.length > 0 && (
              <div className="tw-flex tw-flex-wrap tw-gap-1 tw-mt-3">
                {selectedClasses.map((item) => (
                  <span
                    key={`${item.curriculumName || ""}-${item.classId || item.className}`}
                    className="badge bg-info-subtle text-info tw-flex tw-items-center tw-gap-1"
                  >
                    {item.className}
                    {item.curriculumName ? ` · ${item.curriculumName}` : ""}
                    <i
                      className="ri-close-line tw-cursor-pointer"
                      onClick={() => removeSelectedClassHndlr(item)}
                    />
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!allClasses && !selectedClasses.length}
          onClick={saveHndlr}
        >
          Save scope
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default ClassScopeModal;
