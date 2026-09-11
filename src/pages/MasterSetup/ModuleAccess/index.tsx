import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Button, SelectInput, Switch } from "../../../Components/Common";
import { selectData1 } from "./helper";
import { IModuleAccessResp, ModuleFilterProps } from "./moduleAccessTypes";
import { default as Academic } from "../../../assets/imagesdps/transportation/academic.svg?react";
import { default as Academics } from "../../../assets/imagesdps/transportation/academicsSvg.svg?react";
import { default as Directory } from "../../../assets/imagesdps/transportation/DirectorySvg.svg?react";
import { default as NoteBook } from "../../../assets/imagesdps/transportation/NoteBookSvg.svg?react";
import { default as UserManagement } from "../../../assets/imagesdps/transportation/UserManagementSvg.svg?react";
import { default as BasketBall } from "../../../assets/imagesdps/transportation/BasketBallSvg.svg?react";
import { default as Examination } from "../../../assets/imagesdps/transportation/ExaminationSvg.svg?react";
import { default as Library } from "../../../assets/imagesdps/transportation/LibrarySvg.svg?react";
import { default as Expense } from "../../../assets/imagesdps/transportation/ExpenseSvg.svg?react";
import { default as Professor } from "../../../assets/imagesdps/transportation/ProfessorSvg.svg?react";
import { default as SMS } from "../../../assets/imagesdps/transportation/SmsSvg.svg?react";
import { default as Hostel } from "../../../assets/imagesdps/transportation/HostelSvg.svg?react";
import { default as Trasportation } from "../../../assets/imagesdps/transportation/TrasportationSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
// import { getBranchDataAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { getModulesList, updateModule, setModulesListAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const initialValues: ModuleFilterProps = {
//   selectBranch: "",
// };
interface BranchMenuType {
  branchName: string;
  id: string;
}
const ModuleAccess = ({ instituteId }: any) => {
  const intialValues = (modalData?: any) => {
    return {
      branchId: modalData ? modalData.branchId : "",
      moduleList: modalData ? modalData.moduleList ? modalData.moduleList : [] : [],
    }
  }
  const [intialValuesState, setIntialValuesState] = useState<any>(intialValues());
  const ModuleAccessFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: intialValuesState,
    onSubmit: (values, isSubmitting) => {
      const modulesList = values.moduleList.filter((module: any) => module.isMapped && module.isMapped.length !== 0).map((module: any) => +module.moduleId)
      const payload = { branchId: +values.branchId, modulesList }
      dispatch(updateModule(generateActionPayload('update_module', undefined, payload)));
    },
  });
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const { branchListResp, modulesListResp, updateModuleResp } = useAppSelector(
    ({ instAcademics, branch }) => ({
      branchListResp: branch.branchListResp,
      modulesListResp: instAcademics.modulesListResp,
      updateModuleResp: instAcademics.updateModuleResp
    }),
    shallowEqual
  );

  const moduleAccessRespRef = useRef<IModuleAccessResp>({
    prevUpdateModuleAccessRep: updateModuleResp,
  });

  const { data: branchList } = branchListResp || {};

  const getModulesByBranchApiCall = (payload?: any) => {
    dispatch(getModulesList(generateActionPayload('get_modules_list', payload)));
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, { instituteId })));
    return () => { dispatch(setModulesListAct(undefined)); }
  }, []);
  useEffect(() => {
    if (Array.isArray(modulesListResp)) {
      const updateModuleList = modulesListResp.map(item => ({ ...item, isMapped: (item.isMapped || false) }));
      ModuleAccessFilterForm.setFieldValue("moduleList", updateModuleList);
    }
  }, [modulesListResp])
  useEffect(() => {
    const {
      prevUpdateModuleAccessRep
    } = moduleAccessRespRef.current;

    if (
      updateModuleResp &&
      updateModuleResp !== prevUpdateModuleAccessRep
    ) {
      getModulesByBranchApiCall({ branchId: ModuleAccessFilterForm.values.branchId });
      toast.success("Module Access Updated successfully.");
    }
  }, [updateModuleResp])

  const branchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value) {
      ModuleAccessFilterForm.handleChange(event);
      const payload = { branchId: event.target.value }
      getModulesByBranchApiCall({ ...payload });
    } else {
      ModuleAccessFilterForm.setValues((prevState: any) => ({ ...prevState, branchId: value, moduleList: [] }))
    }
  }

  return (
    <>
      <FormikProvider value={ModuleAccessFilterForm}>
        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-mb-6">
          <div className="tw-bg-gray-50 tw-rounded-t-lg tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Module Lists</h4>
          </div>

          <div className="tw-p-6">
            <form onSubmit={ModuleAccessFilterForm.handleSubmit}>
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 md:tw-col-span-4">
                  <SelectInput
                    name="branchId"
                    value={ModuleAccessFilterForm.values.branchId}
                    onChange={branchChangeHandler}
                    menuItems={branchList || []}
                    valueKey="branchId"
                    textKey="branchName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select Branch"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <FieldArray name="moduleList">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }
                  return (<>{ModuleAccessFilterForm && ModuleAccessFilterForm.values.moduleList.map((item: any, index: number) => (
                    <div key={index} className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                      <div
                        className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-100 tw-p-4 tw-flex tw-flex-col tw-items-center tw-text-center"
                      >
                        <div className="tw-flex tw-flex-col tw-items-center">
                          {/* <div className="d-inline-block"> */}
                          {/* {item.icon} */}
                          <Academic width="60px" height="60px" className="tw-rounded-full tw-bg-gray-50 tw-p-2" />
                          {/* </div> */}

                          {/* <div className="d-flex flex-column align-items-end"> */}
                          <label className="tw-font-bold tw-text-gray-700 tw-text-sm tw-pt-3 tw-mb-3" style={{ minHeight: "39px" }}>{item.moduleName}</label>
                          <Switch
                            attributeId={`moduleList[${index}].isMapped`}
                            checked={item.isMapped}
                            onChangeHndlr={ModuleAccessFilterForm.handleChange}
                          // labelName={item.moduleName}
                          // className="form-switch-sm form-check-right"
                          />
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  ))}</>)

                }}
              </FieldArray>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center tw-mt-8 tw-mb-4">
              <Button
                type="button"
                variant="primary"
                onClick={(event: any) => ModuleAccessFilterForm.handleSubmit(event)}
              >
                Update
              </Button>
            </div>
          </div>

          {/* <div className="col-1"></div> */}
        </div>
      </FormikProvider>
      {/* <ToastContainer /> */}
    </>
  );
};

export default ModuleAccess;
