import React from "react";
import "./Sidebar.scss";
import {Category} from "../../entities/Category";
import {MarkdownDocument} from "../../entities/MarkdownDocument";
import {SidebarItem} from "./SidebarItem/SidebarItem";
import {Subject} from "../../entities/Subject";

interface State {
    hierarchy: Subject[];
}

export class Sidebar extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        const root = new Category('root');

        const javascript = new Category('javascript', root);
        const asyncDoc = new MarkdownDocument('asynchrone', javascript);
        const modernDoc = new MarkdownDocument('modern syntax', javascript);
        const frameworks = new Category('frameworks', javascript);
        const expressDoc = new MarkdownDocument('express', frameworks);
        const fastifyDoc = new MarkdownDocument('fastify', frameworks);
        frameworks.getChildren().push(expressDoc, fastifyDoc);
        javascript.getChildren().push(asyncDoc, frameworks, modernDoc);

        const design = new Category('design', root);
        const figmaDoc = new MarkdownDocument('figma', design);
        const mobileFirstDoc = new MarkdownDocument('mobile first design', design);
        design.getChildren().push(figmaDoc, mobileFirstDoc);

        root.getChildren().push(javascript, design);

        this.state = {
            hierarchy: root.getChildren()
        };
    }

    render() {
        return <div id="sidebar">
            <nav className="navbar navbar-default" role="navigation">
                <div className="navbar-header">
                    <span>CSLabs</span>
                </div>
                <ul className="nav navbar-nav">
                    {this.state.hierarchy.map((item, index) => <SidebarItem key={index} item={item}/>)}
                </ul>
            </nav>
        </div>;
    }
}
