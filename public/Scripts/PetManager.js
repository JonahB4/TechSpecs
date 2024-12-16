class PetManager {
    constructor() {
        this.pets = new Map();
    }

    addPet(config) {
        if (this.getAlivePetsCount() >= 3) {
            throw new Error("You can't have more than 3 living pets!");
        }

        config.type = config.type.toLowerCase();
        const pet = new Pet(config);
        this.pets.set(pet.name, pet);
        return pet;
    }

    getAlivePetsCount() {
        return Array.from(this.pets.values()).filter(pet => !pet.deceased).length;
    }

    getAllPets() {
        return Array.from(this.pets.values());
    }

    getPet(name) {
        return this.pets.get(name);
    }

    putDownPet(name) {
        const pet = this.getPet(name);
        if (!pet || pet.deceased) return null;
        
        return pet.die('euthanasia');
    }

    giveUpForAdoption(name) {
        const pet = this.getPet(name);
        if (!pet || pet.deceased) return null;
        
        const petInfo = {
            name: pet.name,
            type: pet.type,
            age: pet.age
        };
        
        this.pets.delete(name);
        return petInfo;
    }

    yearlyUpdate() {
        const deathEvents = [];
        this.pets.forEach(pet => {
            const updateResult = pet.agePet();
            if (updateResult && updateResult.died) {
                deathEvents.push({
                    name: pet.name,
                    cause: updateResult.causeOfDeath,
                    age: updateResult.age
                });
            }
        });
        return deathEvents;
    }
}