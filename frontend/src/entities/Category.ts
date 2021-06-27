import {Subject} from "./Subject";

export class Category extends Subject {

    private children: Subject[] = [];

    constructor(name = "Category", parent?: Subject) {
        super(name, parent);
    }

    public getChildren(): Subject[] {
        return this.children;
    }

}
