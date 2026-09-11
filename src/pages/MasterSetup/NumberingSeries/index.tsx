import React, { useEffect, useMemo, useState } from "react";

import { SelectInput, TextInput } from "../../../Components/Common";
import NumberInput from "../../../Components/Common/NumberInput";

//Common Component
// import TableContainer from "../../../Components/Common/TableContainer";
import { VehicalsTypesFormProps } from "./helper";
import AccordionCardItem from "../../../Components/Common/AccordionCardItem";
import AccordionCardHeader from "../../../Components/Common/AccordionCardHeader";
import AccordionCardBody from "../../../Components/Common/AccordionCardBody";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  // getBranchDataAct,
  getNumberingSeriesListByBranchIdAct,
} from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IDataType, IFilterBranchState } from "./numberingSeriesTypes";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
// import { UncontrolledAccordion } from "reactstrap";
import UncontrolledAccordionCard from "../../../Components/Common/UncontrolledAccordionCard";

//Modal Component
// import AddEditForm from "./AddEditForm";

// interface ICurriculumtModal {
//   showModal: boolean;
// }
const NumberingSeries: React.FC<any> = ({ instituteId,branchId }) => {
  const dispatch = useAppDispatch();
  let initialValues: VehicalsTypesFormProps = {
    search: "",
    branchType: branchId,
  };

  const [numberingSeriesFilterState, setNumberingSeriesFilterState] =
    useState<VehicalsTypesFormProps>(initialValues);

  const NumberingSeriesFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: numberingSeriesFilterState,
    onSubmit: (values) => { },
  });

  const [open, setOpen] = useState<Array<string>>([]);
  const [data, setData] = useState<any>({
    UserId: [],
    ReceiptID: [],
    FormID: [],
    RequestID: []
  })
  const toggleHandler = (accordionItem: any) => {
    if (open.includes(accordionItem)) {
      let a = open.filter((o) => o !== accordionItem);
      setOpen(a);
    } else {
      setOpen([...open, accordionItem]);
    }
  };

  const [academicDropDown, setAcademicDropDown] = useState<
    Array<{ branchName: string; id: string }> | undefined
  >([]);

  const [filterState, setFilterState] = useState<IFilterBranchState>({
    branchId: undefined,
  });

  const { numberingSeriesListByBranchId, branchListResp } = useAppSelector(
    ({ instituteInfo, branch }) => ({
      branchListResp: branch.branchListResp,
      numberingSeriesListByBranchId:
        instituteInfo.numberingSeriesListByBranchId,
    }),
    shallowEqual
  );

  useEffect(() => {
    let arr =
      branchListResp &&
      branchListResp?.data?.map((item: any) => {
        return {
          branchName: `${item?.branchName}`,
          id: item?.branchId,
        };
      });
    setAcademicDropDown(arr);
  }, [branchListResp]);

  useEffect(() => {
    // dispatch(getBranchDataAct(generateActionPayload("get_branch_data")));
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
      instituteId: instituteId
    })));
    getBranchesApiCall({ branchId: initialValues.branchType });
  }, []);

  function getBranchesApiCall(otherProps: { branchId: string }) {

    dispatch(
      getNumberingSeriesListByBranchIdAct(
        generateActionPayload("get_numbering_series_list_by_branchId", {
          branchId: otherProps?.branchId,
        })
      )
    );
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    // const { value } = event.target;

    setFilterState((prevState) => ({ ...prevState, branchId: value }));
    getBranchesApiCall({ branchId: value });
  }

  useEffect(() => {
    let ReceiptID: Array<IDataType> = [], FormID: Array<IDataType> = [], UserId: Array<IDataType> = [], RequestID: Array<IDataType> = [];
    numberingSeriesListByBranchId &&
      numberingSeriesListByBranchId.map((series: any) => {
        let data = {
          header: series.prefixTypeIdName,
          prefix: series.prefix,
          number: series.digitLength,
          pattern: `${series.prefix}`,
        };
        switch (data.header.toLowerCase()) {
          case "employee id":
            UserId.push(data);
            break;
          case "student id":
            UserId.push(data);
            break;
          case "receipt at bank":
            RequestID.push(data);
            break;
          case "receipt at school":
            RequestID.push(data);
            break;
          case "enquiry form":
            FormID.push(data);
            break;
          case "application form":
            FormID.push(data);
            break;
          case "registration form":
            FormID.push(data);
            break;
          case "new request":
            ReceiptID.push(data);
            break;
          case "change request":
            ReceiptID.push(data);
            break;
        }
      });

    setData({
      RequestID: RequestID,
      FormID: FormID,
      ReceiptID: ReceiptID,
      UserId: UserId
    })

  }, [numberingSeriesListByBranchId]);

  return (
    <div className="number_series_wrapper">
      <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-overflow-hidden">
        <div className="tw-px-6 tw-py-4 tw-border-b ">
          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0 tw-flex-grow">
            Numbering Series
          </h4>
        </div>
        <div className="tw-p-0">
          <div className="tw-py-3 tw-px-3">
            <form onClick={(e) => e.preventDefault()}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 xl:tw-col-span-4">
                  <SelectInput
                    name="branchType"
                    menuItems={academicDropDown ? academicDropDown : []}
                    valueKey="id"
                    textKey="branchName"
                    value={NumberingSeriesFilterForm.values.branchType}
                    onChange={(event: any) => {
                      onChangeFilterHndlr(event);
                      NumberingSeriesFilterForm.handleChange(event);
                    }}
                    formgroupClassName="tw-mb-0"
                    labelText="Branch"
                    floatingLabel
                  />

                  {/* <div className="search-box">
                <TextInput
                  name="search"
                  value={NumberingSeriesFilterForm.values.search}
                  onChange={NumberingSeriesFilterForm.handleChange}
                  inputClassName="tw-bg-gray-100"
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search..."
                />
                <i className="ri-search-line search-icon"></i>
              </div> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <UncontrolledAccordionCard
        defaultOpen={[
          '1',
          '2',
          '3',
          '4'
        ]}
      >
        <AccordionCardItem>
          <AccordionCardHeader targetId="1" title="User ID" />
          {data.UserId.length > 0 && (
            <AccordionCardBody accordionId="1">
              {data && data.UserId.map((user: IDataType, index: number) => {
                return (
                  <div key={index} className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-5">
                    <div className="tw-col-span-12 sm:tw-col-span-2 lg:tw-col-span-2 xl:tw-col-span-2 tw-pt-4">
                      <p className="tw-m-0 tw-font-normal">{user.header}</p>
                    </div>

                    <div className="tw-col-span-12 sm:tw-col-span-7 lg:tw-col-span-8 xl:tw-col-span-9">
                      <div className="tw-grid tw-grid-cols-12 tw-items-end number_series_input_wrap tw-gap-3">
                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Pattern Ex. : ABCDXXXXX
                          </label>

                          <div className="tw-flex tw-flex-nowrap">
                            <span
                              className="tw-inline-flex tw-items-center tw-px-3 tw-bg-gray-100 tw-border tw-border-r-0 tw-border-gray-300 tw-rounded-l tw-text-sm tw-text-gray-700"
                              id="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                            >
                              Prefix
                            </span>
                            <input
                              type="text"
                              className="tw-flex-1 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-r focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                              value={user.prefix}
                            />
                          </div>
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <NumberInput
                            numberInputClass="number_input_class"
                            value={user.number}
                          />
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Patterns Look Like
                          </label>
                          <TextInput
                            name=""
                            value={user.pattern}
                            isReadOnly={true}
                            onChange
                            formgroupClassName="tw-mb-0"
                            inputClassName="tw-bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="tw-col-span-12 sm:tw-col-span-5 lg:tw-col-span-4 xl:tw-col-span-3 tw-mt-auto">
                  <div className="tw-flex number_series_edit_save_wrap tw-gap-3">
                    <button className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded hover:tw-bg-green-700 tw-transition-colors">Save</button>
                    <button className="tw-px-4 tw-py-2 edit-button">Edit</button>
                  </div>
                </div> */}
                  </div>
                );
              })}
            </AccordionCardBody>
          )}
        </AccordionCardItem>

        <AccordionCardItem>
          <AccordionCardHeader targetId="2" title="Receipt ID" />

          {data.ReceiptID.length > 0 && (
            <AccordionCardBody accordionId="2">
              {data && data.ReceiptID.map((receipt: IDataType, index: number) => {
                return (
                  <div key={index} className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-5">
                    <div className="tw-col-span-12 sm:tw-col-span-2 lg:tw-col-span-2 xl:tw-col-span-2 tw-pt-4">
                      <h6 className="tw-m-0 tw-font-normal">{receipt.header}</h6>
                    </div>

                    <div className="tw-col-span-12 sm:tw-col-span-7 lg:tw-col-span-8 xl:tw-col-span-9">
                      <div className="tw-grid tw-grid-cols-12 tw-items-end number_series_input_wrap tw-gap-3">
                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Pattern Ex. : ABCDXXXXX
                          </label>

                          <div className="tw-flex tw-flex-nowrap">
                            <span
                              className="tw-inline-flex tw-items-center tw-px-3 tw-bg-gray-100 tw-border tw-border-r-0 tw-border-gray-300 tw-rounded-l tw-text-sm tw-text-gray-700"
                              id="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                            >
                              Prefix
                            </span>
                            <input
                              type="text"
                              className="tw-flex-1 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-r focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                              value={receipt.prefix}
                            />
                          </div>
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <NumberInput
                            numberInputClass="number_input_class"
                            value={receipt.number}
                          />
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Patterns Look Like
                          </label>
                          <TextInput
                            name="jj"
                            value={receipt.pattern}
                            isReadOnly={true}
                            onChange
                            formgroupClassName="tw-mb-0"
                            inputClassName="tw-bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="tw-col-span-12 sm:tw-col-span-5 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-flex number_series_edit_save_wrap tw-gap-3">
                    <button className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded hover:tw-bg-green-700 tw-transition-colors">Save</button>
                    <button className="tw-px-4 tw-py-2 edit-button">Edit</button>
                  </div>
                </div> */}
                  </div>
                );
              })}
            </AccordionCardBody>
          )}
        </AccordionCardItem>

        <AccordionCardItem>
          <AccordionCardHeader targetId="3" title="Form ID" />

          {data.FormID.length > 0 && (
            <AccordionCardBody accordionId="3">
              {data && data.FormID.map((form: IDataType, index: number) => {
                return (
                  <div key={index} className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-5">
                    <div className="tw-col-span-12 sm:tw-col-span-2 lg:tw-col-span-2 xl:tw-col-span-2 tw-pt-4">
                      <h6 className="tw-m-0 tw-font-normal">{form.header}</h6>
                    </div>

                    <div className="tw-col-span-12 sm:tw-col-span-7 lg:tw-col-span-8 xl:tw-col-span-9">
                      <div className="tw-grid tw-grid-cols-12 tw-items-end number_series_input_wrap tw-gap-3">
                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Pattern Ex. : ABCDXXXXX
                          </label>

                          <div className="tw-flex tw-flex-nowrap">
                            <span
                              className="tw-inline-flex tw-items-center tw-px-3 tw-bg-gray-100 tw-border tw-border-r-0 tw-border-gray-300 tw-rounded-l tw-text-sm tw-text-gray-700"
                              id="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                            >
                              Prefix
                            </span>
                            <input
                              type="text"
                              className="tw-flex-1 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-r focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                              value={form.prefix}
                            />
                          </div>
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <NumberInput
                            numberInputClass="number_input_class"
                            value={form.number}
                          />
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Patterns Look Like
                          </label>
                          <TextInput
                            name="jj"
                            value={form.pattern}
                            isReadOnly={true}
                            onChange
                            formgroupClassName="tw-mb-0"
                            inputClassName="tw-bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="tw-col-span-12 sm:tw-col-span-5 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-flex number_series_edit_save_wrap tw-gap-3">
                    <button className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded hover:tw-bg-green-700 tw-transition-colors">Save</button>
                    <button className="tw-px-4 tw-py-2 edit-button">Edit</button>
                  </div>
                </div> */}
                  </div>
                );
              })}
            </AccordionCardBody>
          )}
        </AccordionCardItem>

        <AccordionCardItem>
          <AccordionCardHeader targetId="4" title="Request ID" />

          {data.RequestID.length > 0 && (
            <AccordionCardBody accordionId="4">
              {data && data.RequestID.map((request: IDataType, index: number) => {
                return (
                  <div key={index} className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-5">
                    <div className="tw-col-span-12 sm:tw-col-span-2 lg:tw-col-span-2 xl:tw-col-span-2 tw-pt-4">
                      <h6 className="tw-m-0 tw-font-normal">{request.header}</h6>
                    </div>

                    <div className="tw-col-span-12 sm:tw-col-span-7 lg:tw-col-span-8 xl:tw-col-span-9">
                      <div className="tw-grid tw-grid-cols-12 tw-items-end number_series_input_wrap tw-gap-3">
                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Pattern Ex. : ABCDXXXXX
                          </label>

                          <div className="tw-flex tw-flex-nowrap">
                            <span
                              className="tw-inline-flex tw-items-center tw-px-3 tw-bg-gray-100 tw-border tw-border-r-0 tw-border-gray-300 tw-rounded-l tw-text-sm tw-text-gray-700"
                              id="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                            >
                              Prefix
                            </span>
                            <input
                              type="text"
                              className="tw-flex-1 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-r focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              style={{ height: "38px" }}
                              value={request.prefix}
                            />
                          </div>
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <NumberInput
                            numberInputClass="number_input_class"
                            value={request.number}
                          />
                        </div>

                        <div className="tw-col-span-12 xl:tw-col-span-4">
                          <label className="label_wrap tw-text-gray-600 tw-text-xs">
                            Patterns Look Like
                          </label>
                          <TextInput
                            name="jj"
                            value={request.pattern}
                            isReadOnly={true}
                            formgroupClassName="tw-mb-0"
                            inputClassName="tw-bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="tw-col-span-12 sm:tw-col-span-5 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-flex number_series_edit_save_wrap tw-gap-3">
                    <button className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded hover:tw-bg-green-700 tw-transition-colors">Save</button>
                    <button className="tw-px-4 tw-py-2 edit-button">Edit</button>
                  </div>
                </div> */}
                  </div>
                );
              })}
            </AccordionCardBody>
          )}
        </AccordionCardItem>

      </UncontrolledAccordionCard>

    </div>
  );
};

export default NumberingSeries;
