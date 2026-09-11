import React, { Suspense, useState } from 'react';
import { Button } from '../../../Components/Common';
import { NewStepsContainer } from '../../../Components/Common/NewStepsContainer';
import NotifcationDetails from './NotifcationDetails';
import UserDetails from './UserDetails';

const AddManageAllNotifcationsModal = (props: any) => {
    const [manageNofifcationState, setmanageNofifcationState] = useState({});
    const [activeStepId, setActiveStepId] = useState("1");

    function getActiveMenuComponent(menuId: string | null) {
        switch (menuId) {
            case "1":
                return NotifcationDetails;
            case "2":
                return UserDetails;
            default:
                return NotifcationDetails;
        }
    }

    const steps = [
        {
            id: 1,
            title: "Notifcation Details",
            iconImage: <i className="ri-notification-3-fill"></i>
        },
        {
            id: 2,
            title: "User Details",
            iconImage: <i className="ri-user-3-fill"></i>,
        },
    ];

    const stepHandler = () => {
        if (+activeStepId < steps.length) {
            setActiveStepId((prev) => `${+prev + 1}`);
        }
    };

    const previousStepHndler = () => {
        if (+activeStepId > 1) {
            setActiveStepId((prev) => `${+prev - 1}`);
        }
    };

    return (
        <>
            <form>
                <div style={{ padding: "1.25rem" }} className='communication'>
                    <div className='!tw-flex !tw-flex-wrap'>
                        <div className='!tw-w-full'>
                            <NewStepsContainer
                                activeStepId={activeStepId}
                                updateStepHndlr={stepHandler}
                                getActiveMenuComponent={(menuId: string) =>
                                    getActiveMenuComponent(menuId)
                                }
                                stepsList={steps}
                                toggle={props.toggle}
                                state={manageNofifcationState}
                                containerClass="!tw-inline-block !tw-w-full"
                            />
                        </div>
                    </div>
                    {activeStepId === "1" && (
                        <div className="!tw-flex !tw-justify-end">
                            <Button
                                variant="secondary"
                                onClick={props.toggle}
                                type='button'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={stepHandler}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                    {activeStepId === "2" && (
                        <div className="!tw-flex !tw-justify-end">
                            <Button
                                variant="previous"
                                onClick={previousStepHndler}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="primary"
                                type='button'
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </>
    )
}

export default AddManageAllNotifcationsModal;
