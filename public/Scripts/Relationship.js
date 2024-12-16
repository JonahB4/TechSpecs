class Relationship {
    constructor(config) {
        this.name = config.name;
        this.type = config.type;
        this.level = config.level || 50;
        this.age = config.age || 0;
        this.isFamily = config.isFamily || false;
        this.isMarried = config.isMarried || false;
        this.gender = config.gender; // 'male' or 'female'
        this.children = [];
    }

    static relationshipTypes = {
        FRIEND: 'friend',
        PARTNER: 'partner',
        FAMILY: 'family',
        CHILD: 'child'
    };

    static partnerInteractions = {
        "Go on date": { levelChange: 10, happiness: 10, wealth: -100 },
        "Make love": { levelChange: 15, happiness: 15 },
        "Propose": { levelChange: 20, happiness: 20, wealth: -5000, requiresLevel: 80 },
        "Break up": { levelChange: -100, happiness: -30 }
    };

    static friendInteractions = {
        "Hang out": { levelChange: 5, happiness: 5 },
        "Deep conversation": { levelChange: 10, happiness: 8 },
        "Go on vacation": { levelChange: 15, happiness: 15, wealth: -1000 },
        "Have an argument": { levelChange: -20, happiness: -15 }
    };

    static familyInteractions = {
        "Spend time together": { levelChange: 5, happiness: 5 },
        "Have dinner": { levelChange: 8, happiness: 8, wealth: -50 },
        "Share stories": { levelChange: 10, happiness: 10 },
        "Have an argument": { levelChange: -15, happiness: -10 }
    };

    interact(interaction) {
        let effects;
        
        switch(this.type) {
            case 'partner':
                effects = Relationship.partnerInteractions[interaction];
                break;
            case 'friend':
                effects = Relationship.friendInteractions[interaction];
                break;
            case 'family':
            case 'child':
                effects = Relationship.familyInteractions[interaction];
                break;
        }

        if (!effects) return { success: false, message: "Invalid interaction" };

        if (effects.requiresLevel && this.level < effects.requiresLevel) {
            return { 
                success: false, 
                message: `Relationship level too low for ${interaction}. Need level ${effects.requiresLevel}`
            };
        }

        // Special handling for intimate interactions
        if (interaction === "Make love") {
            if (this.level < 75) {
                return {
                    success: false,
                    message: `${this.name}'s happiness is too low for intimate interactions. Need level 75+`,
                    effects: { happiness: 0 }
                };
            }

            const pregnancyChance = Math.random() < 0.1; // 10% chance
            if (pregnancyChance && !this.isMarried) {
                effects.happiness -= 20; // Stress from unexpected pregnancy
            }
            return {
                success: true,
                message: `You made love with ${this.name}`,
                effects: effects,
                pregnancy: pregnancyChance
            };
        }

        // Special handling for breakup
        if (interaction === "Break up") {
            return {
                success: true,
                message: `You broke up with ${this.name}.`,
                effects: effects,
                breakup: true
            };
        }

        // Special handling for proposal
        if (interaction === "Propose") {
            this.isMarried = true;
            return {
                success: true,
                message: `${this.name} said yes! You are now married.`,
                effects: effects
            };
        }

        this.level = Math.max(0, Math.min(100, this.level + effects.levelChange));
        
        return {
            success: true,
            message: `You ${interaction.toLowerCase()} with ${this.name}`,
            effects: effects
        };
    }


    addChild(name, gender) {
        const child = {
            name: name,
            gender: gender,
            age: 0
        };
        this.children.push(child);
        return child;
    }
}


