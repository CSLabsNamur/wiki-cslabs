import React from "react";
import MEditor from '@uiw/react-markdown-editor';
import "./MarkdownEditor.scss";

export class MarkdownEditor extends React.Component {

    render() {
        return (
          <MEditor value={"**Test**"} height={500}/>
        );
    }

}
