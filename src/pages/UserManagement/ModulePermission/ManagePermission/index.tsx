import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SelectInput, Button } from "../../../../Components/Common";
import Institute from "../../../MasterSetup/Institute";
import { selectData1 } from "../../ManageUser/helper";
import { ManagePermissionFilterhProps } from "../ModulePermissionTypes";
import {
  AcademicsPermissionTableData,
  AcademicYesrPermissionTableData,
  MenuOptions,
} from "./helper";
import classnames from "classnames";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Module from "./Module";
import { branchSettingPermissionTableData } from "./helper";
import { default as ExportSvg } from "../../../../assets/imagesdps/academics/Exports.svg?react";
const initialValues: ManagePermissionFilterhProps = {
  userType: "",
};
const ManagePermission = () => {
  const [managePermissionFilterState, setManagePermissionFilterState] =
    useState<ManagePermissionFilterhProps>(initialValues);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(
    "branchSettings"
  );
  const [data, setData] = useState<any>([]);
  const { instituteValue } = useSelector((state: any) => ({
    instituteValue: state.Layout.instituteValue,
  }));
  const ManagePermissionFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: managePermissionFilterState,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    if (activeMenuId === "branchSettings") {
      // data = branchSettingPermissionTableData;
      setData(branchSettingPermissionTableData);
    } else if (activeMenuId === "academics") {
      setData(AcademicsPermissionTableData);
    } else if (activeMenuId === "academic-years") {
      setData(AcademicYesrPermissionTableData);
    }
  }, [activeMenuId]);
  useEffect(() => {}, [data]);
  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");

    if (menuId === "branchSettings") {
      // data = branchSettingPermissionTableData;
      setData(branchSettingPermissionTableData);
    } else if (menuId === "academics") {
      setData(AcademicsPermissionTableData);
    } else if (menuId === "academic-years") {
      setData(AcademicYesrPermissionTableData);
    }
    setActiveMenuId(menuId);
  }
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      default:
        return Module;
    }
  }
  const updateMydata = useCallback(
    ({ rowId, id, value, array }: any) => {
      let newData =
        data &&
        data.map((d: any) => (d.id === rowId ? { ...d, [id]: value } : d));

      setData(newData);
      // data[index][`${id}`] = value;
    },
    [data]
  );
  const checkAll = ({ id, checkedValue, array }: any) => {
    let data1 = data.map((d: any) =>
      +d.id === +id
        ? {
            ...d,
            create: checkedValue,
            edit: checkedValue,
            delete: checkedValue,
            view: checkedValue,
          }
        : d
    );
    setData(data1);
  };
  const activeComponent = useMemo(() => {
    // let data: any = [];

    //  else if (activeMenuId === "academic-terms") {
    //   setData(branchSettingPermissionTableData);
    // }
    const TabComponent: any = getActiveMenuComponent(activeMenuId);

    return (
      <TabComponent
        instituteName={instituteValue}
        instituteId="54a42c4d-47aa-40b7-bd6b-284702aaebi7"
        data={data}
        updateMydata={updateMydata}
        checkAll={checkAll}
      />
    );
  }, [data, activeMenuId, instituteValue, updateMydata]);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <form
          onSubmit={ManagePermissionFilterForm.handleSubmit}
          className="tw-px-3"
        >
          <div className="tw-card tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-p-3 tw-mb-3 tw-gap-4">
            <div className="tw-w-full md:tw-w-64">
              <SelectInput
                name="class"
                value={ManagePermissionFilterForm.values.userType}
                onChange={ManagePermissionFilterForm.handleChange}
                menuItems={selectData1}
                valueKey="classType"
                textKey="classType"
                inputClassName="tw-bg-gray-50"
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div>
              <Button
                variant="info"
                className="tw-flex tw-items-center tw-gap-2"
                // onClick={toggleHandler}
              >
                <ExportSvg fill="#fff" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="page-content managepermission-setup-wrapper tw-p-0">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3">
              <div className="tw-col-span-12 lg:tw-col-span-3 tw-px-0">
                <div className="tw-card tw-mb-0">
                  <div className="tw-p-0">
                    <ul className="tw-list-none tw-p-0 tw-m-0">
                       <li
                        data-id={""}
                        // style={{ padding: "1.5rem 2.5rem",font-size: "18px"; }}
                        className="menu-header"
                        // onClick={clickMenuHandler}
                        // className={classnames({
                        //   active: item.id === activeMenuId,
                        // })}
                        key={""}
                      >
                        Modules
                      </li>
                      {MenuOptions.map((item) => (
                        <li
                          data-id={item.id}
                          onClick={clickMenuHandler}
                          className={`${classnames({
                            active: item.id === activeMenuId,
                          })} menu-list`}
                          key={item.id}
                        >
                          {item.labelName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* </CardBody> */}
                </div>
                {/* </Card> */}
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-9 tw-pr-0">
                {activeComponent}
              </div>
              {/* </Col> */}
              {/* </Row> */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default React.memo(ManagePermission);
