import React, { useState } from "react";
import classNames from "classnames";
import { UserDetails } from "../Components/Common";
import { toast } from "react-toastify";
import { getDisplayDateForTableFormat } from "../utility/dateutility";

export default function SelectChildModal({ childList, selectedChildId, toggleModal, updateChildHandler }: any) {
    const [childIdState, setChildIdState] = useState(selectedChildId);

    function onChangeStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const childId = event.currentTarget.getAttribute("data-id");
        const { notReportingStatus, fromDate, admissionEmailId } = childList.find((item: any) => item.childId?.toString() === childId);
        if (notReportingStatus === "YES") {
            toast.error(`Student has been marked not reporting since ${getDisplayDateForTableFormat(fromDate) || '-'}. 
            Please connect to admission team ${admissionEmailId || '-'}.`);
            return;
        }
        setChildIdState(childId);
    }

    function updateHandler() {
        updateChildHandler(childIdState);
    }
    return (
        <React.Fragment>
            <div className="modal-body pt-2 pb-0 selectchild-modal">
                <div className="d-flex flex-column">
                    {
                        Array.isArray(childList) && childList.map(item => {
                            return (
                                <div key={item?.childId} className={
                                    classNames("childrow d-flex align-items-center justify-content-between mb-2 p-2",
                                        {
                                            "active": item.childId?.toString() === childIdState?.toString()
                                        })
                                }>
                                    <UserDetails
                                        displayName={item?.childName}
                                        displayNameClass="cursor-default"
                                        displayId={item?.childCode}
                                        imageUrl={item?.childImageURL ? `data:image/jpeg;base64, ${item?.childImageURL}` : ""}
                                        defaultImgType="student"
                                    />
                                    <div

                                        className={classNames("form-check me-2 form-radio-primary")}>
                                        <input className="form-check-input" type="radio"
                                            checked={item?.childId?.toString() === childIdState?.toString()}
                                            name="select-child"
                                            id={`child-${item?.childId}`}
                                            data-id={item?.childId}
                                            // value={item.id}
                                            onChange={onChangeStudentHndlr}
                                        // checked={item.id === props.value}
                                        // disabled={props.isDisabled || false}
                                        />

                                    </div>
                                </div>
                            )
                        })
                    }


                    {/* <div className="d-flex align-items-center justify-content-between mb-2">
              <UserDetails
                displayName="Testing"
                displayId="12344"
                defaultImgType="student"
              />
              <div
                className={classNames("form-check me-2 form-radio-primary")}>
                <input className="form-check-input" type="radio"
                // name={props.name}
                // id={`${props.name}-${item.id}`}
                // value={item.id}
                // onChange={props.onChange}
                // checked={item.id === props.value}
                // disabled={props.isDisabled || false}
                />

              </div>
            </div> */}
                </div>

            </div>
            <div className="modal-footer pb-2 pt-0">
                <button className="btn btn-light me-1" onClick={toggleModal}>Close</button>
                <button className="btn btn-success" onClick={updateHandler}>Update</button>
            </div>
        </React.Fragment>
    )
}