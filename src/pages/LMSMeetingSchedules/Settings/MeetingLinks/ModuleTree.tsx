import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Collapse } from 'reactstrap';
import { TreeContextProvider } from './helper';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import { UserDetails } from '../../../../Components/Common';
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from '../../../../utility/dateutility';

export function ModuleTree({
  academicYearId,
  branchId,
  curriculumId,
  curriculumName,
  classId,
  className,
  classSequence,
  sections = [],
  showInstituteAdminUI = false,
  defaultOpen = false,
}: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { value, toggle, editModuleHandler } = useContext(TreeContextProvider);

  const totalSections = sections.length;

  useEffect(() => {
    const { ids, action } = value || {};

    if (action === 'COLLAPSE' && ids?.includes(classId)) {
      setIsOpen(false);
    } else if (action === 'EXPAND_ALL') {
      setIsOpen(true);
    } else if (action === 'COLLAPSE_ALL') {
      setIsOpen(false);
    }
  }, [value, classId]);

  function toggleHandler() {
    if (isOpen) {
      toggle?.('COLLAPSE', [classId]);
    }

    setIsOpen((prevState) => !prevState);
  }

  function editClassHandler(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    editModuleHandler?.({
      isRootFeature: true,
      parentFeatureId: null,
      classId,
      featureName: className,
      parentsInfo: [],
      data: {
        academicYearId,
        branchId,
        curriculumId,
        curriculumName,
        classId,
        className,
        classSequence,
        sections,
        sectionCount: totalSections,
      },
    });
  }

  return (
    <div className="meeting-tree-item">
      <div className="meeting-tree-header" onClick={toggleHandler}>
        <div className="meeting-tree-title-wrap">
          <i
            className={classnames(
              'ri-arrow-right-s-line meeting-tree-arrow',
              isOpen ? 'openmenu' : 'closemenu',
            )}
          />

          <span className="meeting-tree-title">{className}</span>

          <span className="meeting-tree-badge">
            {totalSections} {totalSections === 1 ? 'Section' : 'Sections'}
          </span>
        </div>

        {showInstituteAdminUI && (
          <button
            type="button"
            title="Edit Class"
            className="meeting-tree-edit-btn"
            onClick={editClassHandler}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
          </button>
        )}
      </div>

      <Collapse isOpen={isOpen}>
        <div className="meeting-table-wrapper">
          <table className="meeting-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Meeting Link</th>
                <th>Meeting Id</th>
                <th>Meeting Password</th>
                <th>Created By</th>
                <th>Last Update At</th>
              </tr>
            </thead>

            <tbody>
              {sections.length > 0 ? (
                sections.map((section: any) => {

                  const [updatedDate, updatedTime] = section?.updatedAt?.split('T') ?? [];
                  console.log(section?.updatedAt,updatedDate, updatedTime)

                  return <tr key={section.sectionId}>
                    <td>{section.sectionName || '-'}</td>

                    <td>
                      {section.meetingUrl ? (
                        <a
                          href={section.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="meeting-link"
                        >
                          <i className="ri-link"></i>
                          {section.meetingUrl || '-'}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td>
                      <span className="meeting-pass">
                        {section.meetingId || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="meeting-pass">
                        {section.meetingPassword || '-'}
                      </span>
                    </td>

                    <td>
                      <div className="created-by-box">
                        <UserDetails
                          displayName={section.createdByName || '-'}
                          // displayId={section.createdBy || '-'}
                          showAvatar={false}
                        ></UserDetails>
                      </div>
                    </td>
                    <td>
                      <div className="created-by-box">
                        <UserDetails
                            displayName={updatedDate ? getFormattedDateddMMMYYYY(updatedDate) : '-'}
                            displayId={updatedTime ? convertUTCToISTTimeOnly(updatedTime) : '-'}
                            showAvatar={false}
                          ></UserDetails>
                      </div>
                    </td>
                  </tr>
                })
              ) : (
                <tr>
                  <td colSpan={4} className="meeting-empty-text">
                    No sections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Collapse>
    </div>
  );
}
