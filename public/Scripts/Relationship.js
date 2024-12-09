class Relationship {
    constructor(config) {
        this.name = config.name;
        this.type = config.type;
        this.level = config.level || 50;
        this.age = config.age || 0;
        this.isFamily = config.isFamily || false;
    }

    static relationshipTypes = {
        FRIEND: 'friend',
        PARTNER: 'partner',
        FAMILY: 'family'
    };

    interact(interaction) {
        const effects = {
            "Hang out": { levelChange: 5, happiness: 5 },
            "Deep conversation": { levelChange: 10, happiness: 8 },
            "Go on vacation": { levelChange: 15, happiness: 15, wealth: -1000 },
            "Have an argument": { levelChange: -20, happiness: -15 }
        };

        const effect = effects[interaction];
        this.level = Math.max(0, Math.min(100, this.level + effect.levelChange));
        
        return {
            message: `You ${interaction.toLowerCase()} with ${this.name}`,
            effects: effect
        };
    }

    yearlyUpdate() {
        // Natural relationship decay if no interaction
        if (!this.isFamily) {
            this.level = Math.max(0, this.level - Utils.randomInt(5, 10));
        }
        this.age++;
        
        return {
            level: this.level,
            age: this.age
        };
    }

    resolveConflict(approach) {
        const approaches = {
            "Apologize": { success: 0.8, levelChange: 15 },
            "Discuss calmly": { success: 0.6, levelChange: 10 },
            "Give space": { success: 0.4, levelChange: 5 }
        };

        const chosen = approaches[approach];
        const success = Math.random() < chosen.success;

        if (success) {
            this.level = Math.min(100, this.level + chosen.levelChange);
            return `You successfully resolved the conflict with ${this.name}`;
        } else {
            this.level = Math.max(0, this.level - chosen.levelChange);
            return `The conflict with ${this.name} remains unresolved`;
        }
    }
}