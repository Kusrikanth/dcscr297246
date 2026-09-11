import React, { useMemo, useState } from "react";
import classnames from "classnames";
import { InputCheckbox } from "../../../Components/Common";
import classNames from "classnames";

export function ModuleTree({ id: featureId, parentFeatureId,
    permissionUpdateHandler, updateFeatureAllPermissionHandler,
    enabledPermissionIds = [],
    level, masterPermissions = [], description, permissionIds = [], subFeatures }: any) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleHandler(e: any) {
        e.stopPropagation();
        setIsOpen(prevState => !prevState);
    }

    const isAllRowsSelected = useMemo(() => {
        if (!enabledPermissionIds.length) {
            return false;
        }
        return enabledPermissionIds.length === permissionIds.length;
    }, [enabledPermissionIds, permissionIds]);

    const parentIds = parentFeatureId ? `${parentFeatureId}|${featureId}` : `${featureId}`;
    return (
        <React.Fragment>
            <div className="custom-row">
                <div className="custom-column tw-bg-white tw-sticky tw-left-0 tw-z-[1]">
                    <InputCheckbox
                        name={featureId}
                        value={isAllRowsSelected}
                        onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                updateFeatureAllPermissionHandler(e, `${parentIds}`)
                            }
                        }
                        isDisabled={!enabledPermissionIds.length}
                        formgroupClassName={classNames(`tw-mb-0`, !enabledPermissionIds.length ? 'tw-cursor-not-allowed' : '')}
                    />
                </div>

                <div className="custom-column tw-bg-white tw-sticky tw-left-[46px] tw-z-[5]">
                    <div onClick={toggleHandler} className="tw-flex tw-items-center" style={{ marginLeft: `${(level - 1) * 30}px` }}>
                        {(Array.isArray(subFeatures) && subFeatures.length > 0) && <i
                            className={classnames("ri-arrow-right-s-line cursor-pointer arrow-icon",
                                isOpen ? 'openmenu' : 'closemenu'
                            )} style={{
                                color: '#405189'
                            }}></i>}
                        <span className="tw-mr-3 featuretext">
                            {/* {isOpen?.toString()}-  */}
                            {description}
                        </span>
                    </div>
                </div>
                {Array.isArray(masterPermissions) && masterPermissions.map(item => {
                    return (
                        <div key={`checkbox-${item.id}-${featureId}`} className="custom-column tw-flex tw-justify-center">
                            <InputCheckbox
                                name={`${item.id}`}
                                value={permissionIds.includes(item.id)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    permissionUpdateHandler(e, `${parentIds}`)
                                }}
                                formgroupClassName={classNames(`tw-mb-0`, !enabledPermissionIds.includes(item.id) ? 'tw-cursor-not-allowed' : '')}
                                isDisabled={!enabledPermissionIds.includes(item.id)}
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
                                parentFeatureId={parentIds}
                                permissionUpdateHandler={permissionUpdateHandler}
                                updateFeatureAllPermissionHandler={updateFeatureAllPermissionHandler}
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
