
import React from 'react';
import {MainLayout} from "../components/MainLayout/MainLayout";
import {MarkdownRender} from "../components/MardownRender/MarkdownRender";

export class Home extends React.PureComponent {

    render() {
        return (
            <MainLayout>
                <MarkdownRender/>
            </MainLayout>
        )
    }

}
