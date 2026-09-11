import React, { useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import classnames from "classnames";
import { Col, Row } from "reactstrap";
import { generateBreadcrumb } from "../../utility/commonutility";

interface IBreadCrumbProps {
  title?: string;
  pageTitle: string;
  extraClass?: string;
  pageTitleUrl?: string;
  pageTitleName?:string;
  linkState?: any
}

const BreadCrumb = ({ title, pageTitle, extraClass, pageTitleUrl, linkState,pageTitleName }: IBreadCrumbProps) => {
  const redirectUrl = pageTitleUrl || "#";
  const location = useLocation();
  const history = useHistory();

  const breadCrumbList = useMemo(() => {
    if (location) {
      const { pathname } = location;
      return generateBreadcrumb(pathname);
    }
  }, [location]);

  return (
    <React.Fragment>
      <div className="!tw-grid !tw-grid-cols-12">
        <div className="!tw-col-span-12">
          <div
            className={`page-title-box sm:!tw-flex !tw-items-center !tw-justify-between ${extraClass ? extraClass : ""
              }`}
          >
            {/* <h4 className="mb-sm-0">{title}</h4> */}

            <div className="page-title-left">
              <ol className="breadcrumb !tw-m-0">
                <li className="breadcrumb-item lms-fs">
                  {pageTitle}
                </li>
                {
                  Array.isArray(breadCrumbList) &&
                  breadCrumbList.map((item: any, index: number) => (
                    <li key={`key-${index}`} className={classnames("breadcrumb-item !tw-capitalize lms-fs", {
                      "active": (index === (breadCrumbList.length - 1))
                    })}>
                      {(index !== (breadCrumbList.length - 1)) ? <Link
                        to={`/${item?.linkUrl}`}>{item?.name}</Link> : pageTitleName || item?.name}
                    </li>
                  ))
                }
                {/* <li className=" active">{title}</li> */}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BreadCrumb;


interface IBreadCrumbUpdatedProps {
  breadCrumbOptions?: [];
  extraClass?: string;
  disableNavigation?: boolean;
}

export const BreadCrumbUpdated = ({ breadCrumbOptions, extraClass, disableNavigation, ...otherProps }: IBreadCrumbUpdatedProps) => {
  const location = useLocation();
  // useEffect(() => {
  //   const { pathname } = location;
  //   if (pathname) {
  //   }
  // }, [location]);
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div
            className={`page-title-box d-sm-flex align-items-center justify-content-between ${extraClass ? extraClass : ""
              }`}
          >
            {/* <h4 className="mb-sm-0">{title}</h4> */}

            <div className="page-title-left">
              <ol className="breadcrumb m-0">
                {Array.isArray(breadCrumbOptions) && breadCrumbOptions.map((item: any, index) => {
                  const isActive = index === breadCrumbOptions.length - 1;

                  return (
                    <li key={`breadcumb-${item.id}`} className={classnames("breadcrumb-item", { active: isActive })}>
                      {isActive ? (
                        item.breadcrumbLabel
                      ) : (
                        <>
                            {disableNavigation ? (
                              <span>{item.breadcrumbLabel}</span>
                            ) : (
                              <Link to={item.redirectUrl}>
                                {item.breadcrumbLabel}
                              </Link>
                            )}
                          </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment >
  );
};
