class RelationshipManager {
    constructor() {
        this.relationships = new Map();
    }

    addRelationship(config) {
        const relationship = new Relationship(config);
        this.relationships.set(relationship.name, relationship);
        return relationship;
    }

    removeRelationship(name) {
        return this.relationships.delete(name);
    }

    getRelationship(name) {
        return this.relationships.get(name);
    }

    getAllRelationships() {
        return Array.from(this.relationships.values());
    }

    yearlyUpdate() {
        this.relationships.forEach(relationship => relationship.yearlyUpdate());
    }
}