import {Subject} from "./Subject";

export class MarkdownDocument extends Subject {

    constructor(name = "Document", parent?: Subject) {
        super(name, parent);
    }

}
