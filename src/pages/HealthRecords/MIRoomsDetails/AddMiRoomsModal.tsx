import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { AutoSearchInputUpdated, TextInput } from '../../../Components/Common'
import { generateActionPayload } from '../../../utility/reduxutility'
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions'
import { useAppSelector } from '../../../hooks/storehook'
import { shallowEqual, useDispatch } from 'react-redux'
import * as Yup from 'yup';
import { editMiRoomListAct, saveMiRoomListAct } from '../../../store/healthrecords/healthrecordsaction'
import Button from '../../../Components/Common/Button'

const initialValues = {
  roomName: "",
  inchargeId: "",
}

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required("MI Room Name is required.").nullable(),
  inchargeId: Yup.string().required("MI Incharge is required.").nullable(),
});

const AddMiRoomsModal = (props: any) => {

  const dispatch = useDispatch();
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getEmployeesByFilterResp,
    getMiRoomListByIdResp,
  }: any = useAppSelector(
    ({ globalData, healthRecords, branchAcademics, appData, directoryEmployee }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getMiRoomListByIdResp: healthRecords.getMiRoomListByIdResp,
    }),
    shallowEqual
  );

  const addMiRoomsRef = useRef<any>({
    prevGetMiRoomListByIdResp : getMiRoomListByIdResp,
  })

  useEffect(() => {
    const { prevGetMiRoomListByIdResp } = addMiRoomsRef.current || {};

    if(getMiRoomListByIdResp && prevGetMiRoomListByIdResp !== getMiRoomListByIdResp){
      if(props?.id){
        const { inchargeCode , inchargeId , inchargeName , roomName } = getMiRoomListByIdResp || {}
        addMiRoomsForm.setValues((prev:any)=>({...prev , inchargeId , roomName}))
  
        setSearchEmployeeState({ id: inchargeId, employeeCode: inchargeCode, employeeName: inchargeName });
      }
    }

    addMiRoomsRef.current.prevGetMiRoomListByIdResp = getMiRoomListByIdResp;
    
  }, [getMiRoomListByIdResp])
  

  const addMiRoomsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if(props?.id){
        dispatch(editMiRoomListAct(generateActionPayload("edit_mi_room_list", { id : props?.id} , { ...values })));
      }else{
        dispatch(saveMiRoomListAct(generateActionPayload("save_mi_room_list", undefined, { branchId , ...values })));
      }
    }
  })

  function onInputSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
    }
  }

  function selectSingleEmployeeHndlr(selectedEmployee: any) {
    setSearchEmployeeState(selectedEmployee);
    if (selectedEmployee) {
      const { id } = selectedEmployee;
      addMiRoomsForm.setValues((prevState: any) => ({ ...prevState, inchargeId: id }));
    } else {
      addMiRoomsForm.setValues((prevState: any) => ({ ...prevState, inchargeId: null }));
    }
  }

  return (
    <>
      <form onSubmit={addMiRoomsForm.handleSubmit} >
        <div className="card-body">
          <div className="tw-grid tw-gap-3 tw-grid-cols-12">

            {/* MI Room Name */}
            <div className="tw-col-span-12">
              <TextInput
                name="roomName"
                labelText="MI Room Name"
                labelClass='required'
                value={addMiRoomsForm.values.roomName}
                onChange={addMiRoomsForm.handleChange}
                invalid={(addMiRoomsForm.touched.roomName && addMiRoomsForm.errors.roomName) ? true : false}
                error={(addMiRoomsForm.touched.roomName && addMiRoomsForm.errors.roomName) ? addMiRoomsForm.errors.roomName : ""}
              />
            </div>

            {/* MI Incharge */}
            <div className="tw-col-span-12">
              <AutoSearchInputUpdated
                formgroupClassName="tw-search-box"
                name="inchargeId"
                placeHolder="Search..."
                labelClass="tw-font-semibold"
                onChange={onInputSearchChange}
                valueKey="id"
                labelKey="employeeCode"
                subLabelKey="employeeName"
                labelHeader="Employee Code"
                subLabelHeader="Employee Name"
                labelText="MI Incharge"
                options={getEmployeesByFilterResp}
                selected={searchEmployeeState}
                invalid={(addMiRoomsForm.touched.inchargeId && addMiRoomsForm.errors.inchargeId) ? true : false}
                error={(addMiRoomsForm.touched.inchargeId && addMiRoomsForm.errors.inchargeId) ? addMiRoomsForm.errors.inchargeId : ""}
                selectedOptionCallbck={selectSingleEmployeeHndlr}
              >
                <i className="ri-search-line search-icon" />
              </AutoSearchInputUpdated>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-border-t tw-border-gray-200 tw-pt-3">
            <Button
              type="button"
              variant='secondary'
              onClick={props.toggle}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant='primary'
              disabled={showApiLoader}
            >
              Submit
            </Button>
          </div>
        </div>

      </form>
    </>
  )
}

export default AddMiRoomsModal