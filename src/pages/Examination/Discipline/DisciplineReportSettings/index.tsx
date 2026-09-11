import { Link } from 'react-router-dom';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings05Icon,
  BookBookmark01Icon,
  Configuration01Icon,
} from '@hugeicons-pro/core-stroke-standard';

const settingsList = [
  {
    id: 'domains',
    title: 'Domains',
    icon: BookBookmark01Icon,
    info: 'Manage Discipline Report card Domains',
    route: '/discipline-report-card-settings/domains',
  },
  {
    id: 'subDomains',
    title: 'Sub Domains',
    icon: BookBookmark01Icon,
    info: 'Manage Discipline Report card Sub Domains',
    route: '/discipline-report-card-settings/sub-domains',
  },
  {
    id: 'gradeConfiguration',
    title: 'Grade Configuration',
    icon: Configuration01Icon,
    info: 'Configure grades for green report card',
    route: '/discipline-report-card-settings/grade-configuration',
  },
  {
    id: 'internalSubjectGrades',
    title: 'Internal Subject Grades',
    icon: Configuration01Icon,
    info: 'Internal Subject Grades',
    route: '/discipline-report-card-settings/internal-subject-grades',
  },
];

const DisciplineReportSettings = () => {
  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Discipline Report Card" />

          <div className="tw-card">
            <div className="tw-card-header">
              <h4 className="card-title mb-0 flex-grow-1">
                Discipline Report Card Settings
              </h4>
            </div>

            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                {settingsList.map((item) => (
                  <div
                    key={item.id}
                    className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4"
                  >
                    <Link to={item.route} className="text-decoration-none">
                      <div className="tw-card tw-cursor-pointer hover:tw-shadow-md tw-duration-200">
                        <div className="tw-card-body tw-flex tw-gap-3 tw-items-start">
                          <div className="tw-bg-gray-100 tw-w-10 tw-h-10 tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-text-gray-800">
                            <HugeiconsIcon
                              icon={item.icon || Settings05Icon}
                              size={20}
                              color="currentColor"
                            />
                          </div>

                          <div>
                            <h5 className="tw-text-base tw-font-semibold tw-mb-0 tw-text-gray-800">
                              {item.title}
                            </h5>

                            {item.info && (
                              <p className="tw-text-sm tw-text-gray-500 tw-mb-0">
                                {item.info}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisciplineReportSettings;
