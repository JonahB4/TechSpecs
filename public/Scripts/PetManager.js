class PetManager {
    constructor() {
        this.pets = new Map();
    }

    getAllPets() {
        return Array.from(this.pets.values());
    }

    addPet(config) {
        if (this.pets.size >= 3) {
            throw new Error("You can't have more than 3 pets!");
        }
        const pet = new Pet(config);
        this.pets.set(pet.name, pet);
        return pet;
    }

    removePet(name) {
        return this.pets.delete(name);
    }

    getPet(name) {
        return this.pets.get(name);
    }

    getAllPets() {
        return Array.from(this.pets.values());
    }

    yearlyUpdate() {
        this.pets.forEach(pet => pet.agePet());
    }
}