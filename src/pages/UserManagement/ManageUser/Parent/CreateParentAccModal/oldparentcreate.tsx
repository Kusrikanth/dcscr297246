import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
    ModalContainer,
    SelectInput,
    TextInput,
    UserDetails,
    InputCheckbox,
    Button,
    Switch,
    RadioInputContainer,
    TextIconInput,
    NewPhoneInput
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { selectData1, selectData2 } from "../../helper";
import {
    CreateParentAccModalProps,
    CreateParentFilterhProps,
} from "../../ManageUserTypes";
import { CreateStudentData } from "../../helper";
import { CreateParentData, generateColumns, ParentList } from "./helper";

const initialValues: CreateParentFilterhProps = {
    search: "",
    userType: "",
    curriculumId: "",
    academicYear: "",
    classId: ""
};

const CreateParentAccModal = (props: CreateParentAccModalProps) => {
    const [createParentFilterState, setCreateParentFilterState] =
        useState<CreateParentFilterhProps>(initialValues);

    const [isCheck, setIsCheck] = useState<Array<number>>([]);

    const CreateParentFilterForm = useFormik({
        enableReinitialize: true,
        initialValues: createParentFilterState,
        onSubmit: (values) => { },
    });

    const roleColumns = useMemo(() => generateColumns(), []);

    const handleClick = (e: any) => {

        const { id, checked } = e.target;

        let arr = [...isCheck];

        if (!checked) {
            arr = arr.filter((item) => item !== +id);
            // setIsCheck(isCheck.filter((item) => +item !== +id));
        } else {
            arr = [...arr, +id];
        }
        setIsCheck(arr);

        // if (arr.length == inputBoxes.length) {
        //   setIsCheckAll(true);
        // } else {
        //   setIsCheckAll(false);
        // }
    };

    return (
        <>
            <ModalContainer
                id="detec-promo-appro-modal"
                modalTitle={props.modalTitle}
                isOpen={props.isOpen}
                toggle={props.toggle}
                submitHndlr={CreateParentFilterForm.handleSubmit}
                cancelHndlr={props.toggle}
                cancelTitle={"Cancel"}
                submitTitle={"Submit"}
                modalSize={"lg"}
                modalBodyClass="p-4"
            >
                <div>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-x-4 tw-mb-3">
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <div>
                                <SelectInput
                                    name="userType"
                                    labelText="User Type"
                                    value={CreateParentFilterForm.values.userType}
                                    onChange={CreateParentFilterForm.handleChange}
                                    onBlur={CreateParentFilterForm.handleBlur}
                                    valueKey="genderId"
                                    textKey="genderName"
                                    menuItems={[]}
                                // isDisabled={!edit}
                                // labelClass={"text-muted"}
                                // inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                                // invalid={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? true
                                //         : false
                                // }
                                // error={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? CreateParentFilterForm.errors.genderId
                                //         : ""
                                // }
                                />
                            </div>
                            <div className="tw-mt-3">
                                <SelectInput
                                    name="curriculumId"
                                    labelText="Curriculum"
                                    value={CreateParentFilterForm.values.curriculumId}
                                    onChange={CreateParentFilterForm.handleChange}
                                    onBlur={CreateParentFilterForm.handleBlur}
                                    valueKey="genderId"
                                    textKey="genderName"
                                    menuItems={[]}
                                // isDisabled={!edit}
                                // labelClass={"text-muted"}
                                // inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                                // invalid={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? true
                                //         : false
                                // }
                                // error={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? CreateParentFilterForm.errors.genderId
                                //         : ""
                                // }
                                />
                            </div>
                            <div className="tw-mt-3">
                                <SelectInput
                                    name="classId"
                                    labelText="Class"
                                    value={CreateParentFilterForm.values.classId}
                                    onChange={CreateParentFilterForm.handleChange}
                                    onBlur={CreateParentFilterForm.handleBlur}
                                    valueKey="genderId"
                                    textKey="genderName"
                                    menuItems={[]}
                                // isDisabled={!edit}
                                // labelClass={"text-muted"}
                                // inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                                // invalid={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? true
                                //         : false
                                // }
                                // error={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? CreateParentFilterForm.errors.genderId
                                //         : ""
                                // }
                                />
                            </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <div>
                                <SelectInput
                                    name="academicYear"
                                    labelText="Academic Year"
                                    value={CreateParentFilterForm.values.academicYear}
                                    onChange={CreateParentFilterForm.handleChange}
                                    onBlur={CreateParentFilterForm.handleBlur}
                                    valueKey="genderId"
                                    textKey="genderName"
                                    menuItems={[]}
                                // isDisabled={!edit}
                                // labelClass={"text-muted"}
                                // inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                                // invalid={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? true
                                //         : false
                                // }
                                // error={
                                //     CreateParentFilterForm.touched.genderId &&
                                //         CreateParentFilterForm.errors.genderId
                                //         ? CreateParentFilterForm.errors.genderId
                                //         : ""
                                // }
                                />
                                {/* <TextIconInput
                  name="user"
                  labelText="User"
                  value={CreateParentFilterForm.values.user}
                  onChange={CreateParentFilterForm.handleChange}
                  iconPositionClassName={"right"}
                isReadOnly={!!props.branchId}
                inputClassName={`${edit ? 'border-dark' : 'border-0 border-bottom rounded-0 bg-transparent'}`}
                labelClass="text-muted fs-14 mb-0"
                invalid={(CreateParentFilterForm.touched.emailId && CreateParentFilterForm.errors.emailId) ? true : false}
                error={(CreateParentFilterForm.touched.emailId && CreateParentFilterForm.errors.emailId) ? CreateParentFilterForm.errors.emailId : ""}
                isDisabled={true}
                >
                  <i className="ri-search-line search-icon"></i>
                </TextIconInput> */}
                            </div>
                            <div className="tw-mt-3">
                                <label className="tw-block tw-mb-1 tw-font-medium">Select Students</label>
                                <div style={{ border: "1px solid #CED4DA", borderRadius: "5px", padding: "10px" }}>
                                    <div className="tw-relative">
                                        <TextInput
                                            name="search"
                                            value={CreateParentFilterForm.values.search}
                                            onChange={CreateParentFilterForm.handleChange}
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                    </div>
                                    <div className="tw-my-3 tw-flex tw-gap-2">
                                        <span className="tw-font-medium">Select :</span>
                                        <span className="tw-cursor-pointer tw-text-primary hover:tw-underline">All</span>
                                        <span className="tw-cursor-pointer tw-text-primary hover:tw-underline">None</span>
                                    </div>
                                    <div style={{ height: "200px", maxHeight: "200px", overflowX: "hidden", overflowY: "auto" }}>
                                        {ParentList && ParentList.map((parent) => {
                                            return (
                                                <div key={parent.id} className="tw-flex tw-items-center tw-mb-2 tw-border-b tw-border-[#EFF2F7] tw-pb-2">
                                                    <input
                                                        className="form-check-input tw-me-3"
                                                        type="checkbox"
                                                        value=""
                                                        id="checkall"
                                                        name="allSubject"
                                                        checked={isCheck.includes(+parent.id)}
                                                        onClick={handleClick}
                                                    />
                                                    <UserDetails
                                                        imageUrl={parent.imgUrl}
                                                        displayName={parent.ParentName}
                                                        displayId={parent.dep_id}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "30px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>User Info</p>
            <div className="row">
              <div className="col-xs-12 col-md-12 col-lg-6 form-group">

                <TextIconInput
                  name="emailId"
                  labelText="E-mail"
                  value={CreateParentFilterForm.values.emailId}
                  onChange={CreateParentFilterForm.handleChange}
                  isReadOnly={!!props.branchId}
                  // inputClassName={`${edit ? 'border-dark' : 'border-0 border-bottom rounded-0 bg-transparent'}`}
                  // labelClass="text-muted fs-14 mb-0"
                  invalid={(CreateParentFilterForm.touched.emailId && CreateParentFilterForm.errors.emailId) ? true : false}
                  error={(CreateParentFilterForm.touched.emailId && CreateParentFilterForm.errors.emailId) ? CreateParentFilterForm.errors.emailId : ""}
                  isDisabled={true}
                >
                  <i className="ri-mail-unread-line"></i>
                </TextIconInput>
              </div>

              <div className="col-xs-12 col-md-12 col-lg-6">
                <NewPhoneInput
                  name="phoneNo"
                  labelText="Phone No."
                  value={CreateParentFilterForm.values.phoneNo}
                  onChange={CreateParentFilterForm.handleChange}
                  invalid={(CreateParentFilterForm.touched.phoneNo && CreateParentFilterForm.errors.phoneNo) ? true : false}
                  error={(CreateParentFilterForm.touched.phoneNo && CreateParentFilterForm.errors.phoneNo) ? CreateParentFilterForm.errors.phoneNo : ""}
                  isDisabled={true}
                />
              </div>

            </div>
          </div> */}


                    {/* <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Assign Role</p>
            <div className="row">
              <div className="col-xs-12 col-md-12 col-lg-6 form-group">
                <SelectInput
                  name="roleType"
                  labelText="Role Type"
                  value={CreateParentFilterForm.values.roleType}
                  onChange={CreateParentFilterForm.handleChange}
                  onBlur={CreateParentFilterForm.handleBlur}
                  valueKey="genderId"
                  textKey="genderName"
                  menuItems={[]}
                // isDisabled={!edit}
                // labelClass={"text-muted"}
                // inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                // invalid={
                //     CreateParentFilterForm.touched.genderId &&
                //         CreateParentFilterForm.errors.genderId
                //         ? true
                //         : false
                // }
                // error={
                //     CreateParentFilterForm.touched.genderId &&
                //         CreateParentFilterForm.errors.genderId
                //         ? CreateParentFilterForm.errors.genderId
                //         : ""
                // }
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-6">
                <RadioInputContainer
                  name="status"
                  labelText="Status"
                  inputContainerClassName="mt-2"
                  radioOptions={[{ id: "true", name: "Active" }, { id: "false", name: "Inactive" }]}
                  value={CreateParentFilterForm.values.status}
                  onChange={CreateParentFilterForm.handleChange}
                  // isDisabled={!edit}
                  // labelClassName="text-muted"
                  invalid={
                    CreateParentFilterForm.touched.status &&
                      CreateParentFilterForm.errors.status
                      ? true
                      : false
                  }
                  error={
                    CreateParentFilterForm.touched.status &&
                      CreateParentFilterForm.errors.status
                      ? CreateParentFilterForm.errors.status
                      : ""
                  }
                />
              </div>
            </div>
          </div> */}


                    {/* <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
            <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Manage Access</p>
            <div className="row">
              <div className="col-xs-12 col-md-12 col-lg-6 form-group">
                <TextInput
                  name="userName"
                  labelText="User Name"
                  value={CreateParentFilterForm.values.userName}
                  onChange={CreateParentFilterForm.handleChange}
                  // isReadOnly={true}
                  // isDisabled={true}
                  inputClassName={'bg-transparent'}
                // labelClass="text-muted"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-6 form-group">
                <TextInput
                  name="password"
                  labelText="Password"
                  value={CreateParentFilterForm.values.password}
                  onChange={CreateParentFilterForm.handleChange}
                  // isReadOnly={true}
                  // isDisabled={true}
                  inputClassName={'bg-transparent'}
                // labelClass="text-muted"
                />
              </div>
            </div>
            <div className="row">
              <div className={"col-sm-auto ms-auto"}>
                <Button className="ms-auto" style={{ backgroundColor: "#F4F7FE", color: "#777777", border: "0px" }}
                  onClick={() => { }}>
                  <i className="ri-add-fill me-1 align-bottom"></i> Generate Password</Button>
              </div>
            </div>
          </div> */}


                </div>

                <div className="tw-col-span-12 lg:tw-col-span-4">
                    {/* <SelectInput
              name="section"
              value={CreateParentFilterForm.values.section}
              onChange={CreateParentFilterForm.handleChange}
              menuItems={selectData2}
              valueKey="sectionType"
              textKey="sectionType"
              inputClassName="bg-light"
              formgroupClassName="mb-0"
            /> */}
                </div>
                {/* </div> */}

                {/* <div className="row">
            <div>
                <Switch
                    attributeId={"email"}
                    labelName={"Email Login Details to this user"}
                    className="form-switch-sm form-check-left w-70"
                />
            </div>
            </div> */}
            </ModalContainer>
        </>
    );
};

export default CreateParentAccModal;
