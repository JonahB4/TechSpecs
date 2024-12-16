class Pet {
    constructor(config) {
        this.name = config.name;
        this.type = config.type.toLowerCase();
        this.age = 0;
        this.health = 100;
        this.bondLevel = 50;
        this.happiness = 50;
        this.deceased = false;
        this.causeOfDeath = null;
    }

    static petTypes = {
        DOG: {
            type: 'dog',
            emoji: '🐕',
            lifespan: 13,
            cost: 500,
            maintenanceCost: 100
        },
        CAT: {
            type: 'cat',
            emoji: '🐱',
            lifespan: 15,
            cost: 400,
            maintenanceCost: 80
        },
        BIRD: {
            type: 'bird',
            emoji: '🦜',
            lifespan: 10,
            cost: 200,
            maintenanceCost: 50
        },
        RABBIT: {
            type: 'rabbit',
            emoji: '🐰',
            lifespan: 8,
            cost: 300,
            maintenanceCost: 60
        },
        GUINEA_PIG: {
            type: 'guinea_pig',
            emoji: '🐹',
            lifespan: 6,
            cost: 250,
            maintenanceCost: 40
        },
        MOUSE: {
            type: 'mouse',
            emoji: '🐭',
            lifespan: 2,
            cost: 100,
            maintenanceCost: 20
        },
        FISH: {
            type: 'fish',
            emoji: '🐠',
            lifespan: 3,
            cost: 150,
            maintenanceCost: 30
        },
        HAMSTER: {
            type: 'hamster',
            emoji: '🐹',
            lifespan: 2,
            cost: 150,
            maintenanceCost: 25
        }
    };

    interact(action) {
        if (this.deceased) {
            return { message: `${this.name} has passed away and can't interact anymore.`, effects: {} };
        }

        const actions = {
            "Play": { bond: 10, happiness: 15, health: -5 },
            "Feed": { bond: 5, happiness: 10, health: 10 },
            "Vet Visit": { bond: -5, happiness: -10, health: 30 }
        };

        const effect = actions[action];
        this.bondLevel = Math.min(100, this.bondLevel + effect.bond);
        this.happiness = Math.min(100, this.happiness + effect.happiness);
        this.health = Math.min(100, this.health + effect.health);

        return { message: `You ${action.toLowerCase()} with ${this.name}`, effects: effect };
    }

    agePet() {
        if (this.deceased) return null;
        
        this.age++;
        const petTypeConfig = Pet.petTypes[this.type.toUpperCase()];
        const ageEffect = this.age / petTypeConfig.lifespan;
        
        // Health decreases more rapidly in old age
        this.health = Math.max(0, this.health - (ageEffect * 10));
        
        // Happiness and bond naturally decay
        this.happiness = Math.max(0, this.happiness - Utils.randomInt(5, 10));
        this.bondLevel = Math.max(0, this.bondLevel - Utils.randomInt(3, 7));

        // Check for natural death
        const deathChance = Math.max(0, (this.age - (petTypeConfig.lifespan * 0.8)) / petTypeConfig.lifespan);
        if (Math.random() < deathChance || this.health <= 0) {
            this.die('natural causes');
            return {
                died: true,
                causeOfDeath: 'natural causes',
                age: this.age
            };
        }

        return {
            age: this.age,
            health: this.health,
            happiness: this.happiness,
            bondLevel: this.bondLevel
        };
    }

    die(cause) {
        this.deceased = true;
        this.causeOfDeath = cause;
        this.health = 0;
        this.happiness = 0;
        this.bondLevel = 0;
        return {
            name: this.name,
            type: this.type,
            age: this.age,
            causeOfDeath: cause
        };
    }
}
