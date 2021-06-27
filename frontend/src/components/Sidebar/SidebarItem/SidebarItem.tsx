import React from "react";
import {Subject} from "../../../entities/Subject";
import {Category} from "../../../entities/Category";
import {MarkdownDocument} from "../../../entities/MarkdownDocument";
import "./SidebarItem.scss";

interface Props {
    item: Subject
}

export class SidebarItem extends React.PureComponent<Props> {

    render() {
        const item = this.props.item;

        if (item instanceof Category) {
            return (
                <li className="dropdown sidebar-item">
                    <span className="dropdown-toggle" role="menu" data-bs-toggle="dropdown" data-bs-auto-close="false">
                        {item.getName()}
                    </span>
                    <ul className="dropdown-menu main-menu">
                        {item.getChildren().map(
                            (child, index) => (<SidebarItem key={index} item={child}/>)
                        )}
                    </ul>
                </li>
            );
        } else if (item instanceof MarkdownDocument) {
            return (
                <li className="sidebar-item">
                    <span>{item.getName()}</span>
                </li>
            );
        }

        throw new Error("This sidebar item is not implemented.");
    }

}
