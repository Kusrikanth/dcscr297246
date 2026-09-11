import { useFormik } from "formik";
import {
  SelectInput,
  TextArea,
  TextInput,
} from "../../../../Components/Common";
import { useEffect, useState } from "react";
import { sourceList } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { saveIPRestrictionAct, updateIPRestrictionAct } from "../../../../store/usermanagement/usermanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  userName: "",
  ipAddress: "",
  loginSource: "",
  remarks: "",
}

const validationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  ipAddress: Yup.string().required("IP address is required"),
  loginSource: Yup.string().required("Login source is required").nullable(),
  remarks: Yup.string().required("Reason are required"),
});

const AddRestriction = (props: any) => {  
  const [filterState, setFilterState] = useState(initialValues);
  const dispatch = useAppDispatch();
  const {
    getIPRestrictionResp,
  } = useAppSelector(
    ({ userManagement }) => ({
      getIPRestrictionResp: userManagement.getIPRestrictionResp,
    }),
    shallowEqual
  );
  const ipRestriction = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    validationSchema: validationSchema,
    onSubmit: (values) => { 
      const payload = {
        ipAddress:values.ipAddress,
        remarks: values.remarks
      }
      if(props.modalData) {
        dispatch(updateIPRestrictionAct(generateActionPayload('update_ip_restriction', { id: props.modalData }, payload)))
      }
      else{
        dispatch(saveIPRestrictionAct(generateActionPayload('save_ip_restriction', undefined, {
          ...payload,
          userName: values.userName,
          loginSource: values.loginSource,
        })))
      }
    },
  })

  useEffect(() => {
    if (props.modalData) {
      const  blockId  = props.modalData
      const modalData = getIPRestrictionResp?.data?.find(
        (item: any) => +item.id == +blockId
      );

      ipRestriction.setValues((prev) => ({
        ...prev,
        userName: modalData?.userName,
        ipAddress: modalData?.ipAddress,
        loginSource: modalData?.source,
        remarks: modalData?.remarks
      }));
    }
  }, [ getIPRestrictionResp ]);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        ipRestriction.setValues((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <>
      <form onSubmit={ipRestriction.handleSubmit}>
        <div className="tw-p-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
              <TextInput
                name="userName"
                labelText="User Name"
                value={ipRestriction.values.userName}
                onChange={onChangeFilterHndlr}
                placeHolder="Enter a user name"
                formgroupClassName="tw-mb-0"
                isDisabled={props.modalData ? true : false}
                isReadOnly={props.modalData ? true : false}
                invalid={(ipRestriction.touched.userName && ipRestriction.errors.userName) ? true : false}
                error={(ipRestriction.touched.userName && ipRestriction.errors.userName) ? ipRestriction.errors.userName : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <TextInput
                name="ipAddress"
                labelText="IP Address"
                value={ipRestriction.values.ipAddress}
                onChange={onChangeFilterHndlr}
                placeHolder="Enter an IP address"
                formgroupClassName="tw-mb-0"
                invalid={(ipRestriction.touched.ipAddress && ipRestriction.errors.ipAddress) ? true : false}
                error={(ipRestriction.touched.ipAddress && ipRestriction.errors.ipAddress) ? ipRestriction.errors.ipAddress : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <SelectInput
                name="loginSource"
                labelText="Login Source"
                value={ipRestriction.values.loginSource}
                onChange={onChangeFilterHndlr}
                menuItems={sourceList}
                valueKey="id"
                textKey="name"
                formgroupClassName="tw-mb-0"
                isDisabled={props.modalData ? true : false}
                isReadOnly={props.modalData ? true : false}
                invalid={(ipRestriction.touched.loginSource && ipRestriction.errors.loginSource) ? true : false}
                error={(ipRestriction.touched.loginSource && ipRestriction.errors.loginSource) ? ipRestriction.errors.loginSource : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <TextArea
                name="remarks"
                value={ipRestriction.values.remarks}
                onChange={onChangeFilterHndlr}
                formgroupClassName="tw-mb-0"
                placeHolder="Enter a reason"
                labelText="Reason"
                inputClassName="tw-bg-gray-50"
                invalid={(ipRestriction.touched.remarks && ipRestriction.errors.remarks) ? true : false}
                error={(ipRestriction.touched.remarks && ipRestriction.errors.remarks) ? ipRestriction.errors.remarks : ""}
              />
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {props.modalData ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddRestriction;
