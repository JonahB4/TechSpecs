class Action {
    constructor(config) {
        this.name = config.name;
        this.type = config.type;
        this.minAge = config.minAge || 0;
        this.maxAge = config.maxAge || Infinity;
        this.requirements = config.requirements || {};
        this.effects = config.effects;
        this.description = config.description;
    }

    isAvailable(characterStats) {
        // Check age requirements
        if (characterStats.age < this.minAge || characterStats.age > this.maxAge) {
            return false;
        }

        // Check stat requirements
        for (const [stat, minValue] of Object.entries(this.requirements)) {
            if (characterStats[stat] < minValue) {
                return false;
            }
        }

        return true;
    }

    executeAction(characterStats) {
        if (!this.isAvailable(characterStats)) {
            throw new Error('Action is not available');
        }
        characterStats.applyEventEffects(this.effects);
        return `You ${this.name}. ${this.description}`;
    }
}