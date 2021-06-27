import React from "react";
import {Sidebar} from "../Sidebar/Sidebar";
import "./MainLayout.scss";
import {Navbar} from "../Navbar/Navbar";

export class MainLayout extends React.PureComponent {

    render() {
        return (
            <div className="main-layout">
                <Sidebar/>
                <div className="main-layout--container">
                    <div className="main-layout--navbar-container sticky-lg-top">
                        <Navbar/>
                    </div>
                    <div className="container">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}
