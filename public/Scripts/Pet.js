class Pet {
    constructor(config) {
        this.name = config.name;
        this.type = config.type;
        this.age = 0;
        this.health = 100;
        this.bondLevel = 50;
        this.happiness = 50;
    }

    static petTypes = {
        DOG: {
            type: 'dog',
            lifespan: 13,
            cost: 500,
            maintenanceCost: 100
        },
        CAT: {
            type: 'cat',
            lifespan: 15,
            cost: 400,
            maintenanceCost: 80
        },
        BIRD: {
            type: 'bird',
            lifespan: 10,
            cost: 200,
            maintenanceCost: 50
        }
    };

    interact(action) {
        const actions = {
            "Play": { bond: 10, happiness: 15, health: -5 },
            "Feed": { bond: 5, happiness: 10, health: 10 },
            "Vet visit": { bond: -5, happiness: -10, health: 30 }
        };

        const effect = actions[action];
        this.bondLevel = Math.min(100, this.bondLevel + effect.bond);
        this.happiness = Math.min(100, this.happiness + effect.happiness);
        this.health = Math.min(100, this.health + effect.health);

        return {message: `You ${action.toLowerCase()} with ${this.name}`, effects: effect};
    }

    agePet() {
        this.age++;
        const ageEffect = this.age / Pet.petTypes[this.type.toUpperCase()].lifespan;
        
        // Health decreases more rapidly in old age
        this.health = Math.max(0, this.health - (ageEffect * 10));
        
        // Happiness and bond naturally decay
        this.happiness = Math.max(0, this.happiness - Utils.randomInt(5, 10));
        this.bondLevel = Math.max(0, this.bondLevel - Utils.randomInt(3, 7));

        return {
            age: this.age,
            health: this.health,
            happiness: this.happiness,
            bondLevel: this.bondLevel
        };
    }
}