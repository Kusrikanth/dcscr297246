import { Link } from 'react-router-dom';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings05Icon,
  Configuration01Icon,
  Folder01Icon,
} from '@hugeicons-pro/core-stroke-standard';

const settingsList = [
  {
    id: 'categories',
    title: 'Categories',
    icon: Folder01Icon,
    info: 'Manage green report card categories',
    route: '/green-report-card-settings/manage-category',
  },
  {
    id: 'gradeConfiguration',
    title: 'Grade Configuration',
    icon: Configuration01Icon,
    info: 'Configure grades for green report card',
    route: '/green-report-card-settings/grade-configuration',
  },
];

const GreenReportCardSettings = () => {
  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Green Report Card" />

          <div className="tw-card">
            <div className="tw-card-header">
              <h4 className="card-title mb-0 flex-grow-1">
                Green Report Card Settings
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

export default GreenReportCardSettings;
