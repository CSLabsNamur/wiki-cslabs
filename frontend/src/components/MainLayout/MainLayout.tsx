import React from "react";
import "./MainLayout.scss";
import { Navbar } from "../Navbar/Navbar";
import { Sidebar } from "../Sidebar/Sidebar";

export class MainLayout extends React.PureComponent {
  render() {
    return (
      <div className="main-layout">
        <Navbar />
        <div className="main-layout__body">
          <Sidebar />
          <div className="main-layout__content">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
