import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { InputCheckbox } from "../../../Components/Common";

export function ModuleTree({ id: featureId, parentFeatureId,
    permissionUpdateHandler,
    level, masterPermissions = [], description, subFeatures }: any) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleHandler(e: any) {
        e.stopPropagation();
        setIsOpen(prevState => !prevState);
    }

    const parentIds = `${parentFeatureId}|${featureId}`;
    return (
        <React.Fragment>
            <div className="custom-row !tw-cursor-pointer">
                <div className="custom-column">
                    <InputCheckbox
                        name={"english"}
                        value={false}
                        onChange={() => { }}
                        formgroupClassName="tw-mb-0"
                    />
                </div>
                
                <div className="custom-column">
                    <div onClick={toggleHandler} className="!tw-flex !tw-items-center" style={{ marginLeft: `${(level - 1) * 30}px` }}>
                        {(Array.isArray(subFeatures) && subFeatures.length > 0) && <i
                            className={classnames("ri-arrow-right-s-line !tw-cursor-pointer arrow-icon",
                                isOpen ? 'openmenu' : 'closemenu'
                            )} style={{
                                color: '#405189'
                            }}></i>}
                        <span className="!tw-me-3 featuretext">
                            {isOpen?.toString()}- {description}
                        </span>
                    </div>
                </div>
                {Array.isArray(masterPermissions) && masterPermissions.map(item => {
                    return (
                        <div key={`checkbox-${item.id}-${featureId}`} className="custom-column !tw-flex !tw-content-center">
                            <InputCheckbox
                                name={"english"}
                                value={false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { permissionUpdateHandler(e, `${parentIds}-${item.id}`) }}
                                formgroupClassName="!tw-mb-0"
                            />
                        </div>
                    )
                })}
                {isOpen && <>
                    {
                        subFeatures.map((item: any) => (
                            <ModuleTree
                                key={item.id}
                                level={level + 1}
                                parentFeatureId={featureId}
                                permissionUpdateHandler={permissionUpdateHandler}
                                masterPermissions={masterPermissions}
                                {...item}
                            />
                        ))
                    }
                </>}
            </div>


        </React.Fragment>
    )
}


{/* <Collapse isOpen={true}>
                <div className="custom-row">
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                    <div className="custom-column d-flex justify-content-center">
                        T
                    </div>
                </div>
            </Collapse> */}
