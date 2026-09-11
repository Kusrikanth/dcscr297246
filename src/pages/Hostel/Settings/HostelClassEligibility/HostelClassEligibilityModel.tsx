import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { SelectInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {  generateColumnsModel, } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelFacilityEligibilityAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
};

const HostelClassEligibilityModel: React.FC<any> = (props) => {

  const [ hostelClassList , setHostelClassList ] = useState<Array<any>>([])
  const dispatch = useAppDispatch();

  const {
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelFacilityEligibilityResp,
  }: any = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelFacilityEligibilityResp: hostelSettings.getHostelFacilityEligibilityResp,
    }),
    shallowEqual
  );
  
  const hostelClassEligibilityModalForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {
      const payload = hostelClassList?.map((i:any)=>({
        classId : i?.classId,
        hostelAvailability : i?.hostelAvailability,
      }))

      if(payload?.length > 0){
        dispatch(editHostelFacilityEligibilityAct(generateActionPayload("edit_hostel_eligibility", undefined, payload)));
      }
     },
  });

  useEffect(() => {
    if(props.modalData){
      const {  curriculumId } = props.modalData || {}
      setHostelClassList([props.modalData])
      hostelClassEligibilityModalForm.setValues((prev:any)=>({...prev , curriculumId }))
    }
  }, [props.modalData])
  

  const filterHandler = (event: any) => {
    const { name, value } = event.target
    hostelClassEligibilityModalForm.setFieldValue(name, value)
  }

  const onChangeInputHndlr = (classId : any , value : any)=>{
    const findData = getHostelFacilityEligibilityResp?.data?.find((item: any) => +item.classId === +classId);
    setHostelClassList([{...findData , hostelAvailability : value}])
  }

  const { data: curriculumTypes } = brchCurriculumResp || {}

  const columns = useMemo(() => generateColumnsModel(), []);

  return (
    <>
      <form>
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-px-3 tw-py-3">
          <div className="tw-col-span-12 lg:tw-col-span-3">
            <SelectInput
              name="curriculumId"
              value={hostelClassEligibilityModalForm.values.curriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              isDisabled={true}
              formgroupClassName="tw-mb-0"
              defaultSelect="Curriculum"
            />
          </div>
        </div>

        <div className="tw-overflow-x-auto tw-mb-3">
          <TableContainer
            columns={columns || []}
            data={hostelClassList || []}
            onChangeInputHndlr={onChangeInputHndlr}
            tableClass="tw-mb-0"
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          />
        </div>

        <div className="tw-flex tw-justify-end tw-mx-4 tw-my-3">
          <div className="tw-flex tw-gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={(event: any) =>
                hostelClassEligibilityModalForm.handleSubmit(event)
              }
              disabled={showApiLoader}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelClassEligibilityModel;
