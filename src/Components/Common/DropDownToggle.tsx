import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import classnames from 'classnames';
 
interface IDropDownToggle {
    id: string;
    btnName?: string;
    menuOptions: Array<any>;
    dropDownClassName?: string;
    direction?: any;
    btnVariant?: string;
    toggleClassName?: string;
}
 
export const DropDownToggle = (props: IDropDownToggle) => {
    return (
        <>
            <UncontrolledDropdown direction={props.direction || "down"} className={classnames(`${props.dropDownClassName}`)}>
                <DropdownToggle tag="a" id={props.id} role="button" className={classnames(props.toggleClassName)}>
                    <button className={classnames("btn",props.btnVariant || "btn-success", "tw-flex tw-items-center", props.dropDownClassName )} >{props.btnName || "Add New"} <i className="ri-arrow-drop-down-line tw-text-base tw-ms-2"></i></button>
                </DropdownToggle>
                <DropdownMenu>
                    {props.menuOptions.map((item, index) => (
                        <DropdownItem
                            data-id={item.rowId}
                            onClick={item.onClickHndlr}
                            key={`${item.id}-${index}`}
                        >
                            <div className="tw-flex tw-items-center">
                                {item.actionIcon} {item.actionName}
                            </div>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </UncontrolledDropdown>
        </>
    )
}