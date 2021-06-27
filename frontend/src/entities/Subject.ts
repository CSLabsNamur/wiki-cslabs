
export abstract class Subject {
    protected readonly name;
    protected readonly parent?: Subject;

    protected constructor(name: string, parent?: Subject) {
        this.name = name;
        this.parent = parent;
    }

    public getName(): string {
        return this.name;
    }

    public getParent(): Subject | undefined {
        return this.parent;
    }

    public getChildren(): Subject[] {
        throw new Error("Forbidden operation.");
    }

    public getContent(): string {
        throw new Error("Forbidden operation.");
    }
}
