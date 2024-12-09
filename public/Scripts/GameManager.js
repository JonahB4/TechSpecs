// Updated GameManager.js
class GameManager {
    constructor() {
        this.characterStats = new CharacterStats();
        this.uiManager = new UIManager(this);
        this.relationshipManager = new RelationshipManager();
        this.petManager = new PetManager();
        this.career = null;
        this.isGameOver = false;
        this.availableActions = 3;
        this.pendingEvent = null;
    }

    startGame() {
        this.characterStats = new CharacterStats();
        this.relationshipManager = new RelationshipManager();
        this.petManager = new PetManager();
        this.career = null;
        this.isGameOver = false;
        this.characterStats.updateDisplay();
        
        // Add starting family relationships
        this.relationshipManager.addRelationship({
            name: "Mom",
            type: Relationship.relationshipTypes.FAMILY,
            level: 75,
            isFamily: true
        });
        this.relationshipManager.addRelationship({
            name: "Dad",
            type: Relationship.relationshipTypes.FAMILY,
            level: 75,
            isFamily: true
        });

        this.uiManager.updateGameLog('Game started! You are now 0 years old.');
        this.uiManager.toggleButtons(false);
        this.uiManager.updateRelationshipsDisplay();
    }

    progressTurn() {
        if (this.isGameOver) return;

        this.characterStats.age++;
        this.characterStats.adjustForAge();
        
        // Update career
        if (this.career) {
            const careerUpdate = this.career.yearlyUpdate();
            this.characterStats.wealth += this.career.salary;
            this.characterStats.happiness += (careerUpdate.satisfaction - 50) / 10;
        }

        // Update relationships
        this.relationshipManager.yearlyUpdate();
        
        // Update pets
        this.petManager.yearlyUpdate();
        
        // Reset actions for new turn
        this.availableActions = 3;
        
        // Generate random event
        const event = EventManager.getRandomEvent(this.characterStats.age);
        if (event.choices) {
            this.pendingEvent = event;
            this.uiManager.showEventChoices(event);
        } else {
            this.characterStats.applyEventEffects(event.effects);
            this.uiManager.updateGameLog(event.text);
        }
        
        this.uiManager.updateRelationshipsDisplay();
        this.uiManager.updatePetsDisplay();
        this.uiManager.updateCareerDisplay();
        
        this.checkDeath();
    }
    performAction(actionName) {
        const action = ActionManager.actions[actionName];
        if (!action) {
            console.error(`Action ${actionName} not found.`);
            return;
        }
    
        const availableActions = ActionManager.getAvailableActions(this.characterStats);
        if (!availableActions.some(a => a.name === actionName)) {
            console.error(`Action ${actionName} is not currently available. Check action requirements.`);
            return;
        }
    
        // Apply the action's effects
        this.characterStats.applyEventEffects(action.effects);
        this.uiManager.updateGameLog(`Performed action: ${actionName}`);
    
        // Decrement available actions
        this.availableActions--;
    
        // Update the UI
        this.uiManager.updateActionButtons();
        this.uiManager.updateRelationshipsDisplay();
        this.uiManager.updatePetsDisplay();
        this.uiManager.updateCareerDisplay();
    }
    

    // Career methods
    applyForJob(careerKey) {
        const careerConfig = Career.availableCareers[careerKey];
        if (!careerConfig) return false;

        if (this.characterStats.age < careerConfig.requirements.age || 
            this.characterStats.intelligence < careerConfig.requirements.intelligence) {
            return false;
        }

        this.career = new Career(careerConfig);
        return true;
    }

    quitJob() {
        if (!this.career) return false;
        const result = this.career.quitJob();
        this.characterStats.wealth += result.severance;
        this.career = null;
        return result;
    }

    // Relationship methods
    addRelationship(config) {
        return this.relationshipManager.addRelationship(config);
    }

    interactWithRelationship(name, interaction) {
        const relationship = this.relationshipManager.getRelationship(name);
        if (!relationship) return false;

        const result = relationship.interact(interaction);
        this.characterStats.applyEventEffects({
            happiness: result.effects.happiness,
            wealth: result.effects.wealth || 0
        });
        
        return result;
    }

    // Pet methods
    adoptPet(config) {
        const petType = Pet.petTypes[config.type.toUpperCase()];
        if (!petType || this.characterStats.wealth < petType.cost) {
            return false;
        }

        this.characterStats.wealth -= petType.cost;
        return this.petManager.addPet(config);
    }

    interactWithPet(name, action) {
        const pet = this.petManager.getPet(name);
        if (!pet) return false;

        const result = pet.interact(action);
        this.characterStats.happiness += 5;
        return result;
    }
    checkDeath() {
        const deathChance = Math.max(0, this.characterStats.age - 70) * 0.01; // 1% chance per year after age 70
        const isDead = Math.random() < deathChance;
    
        if (isDead) {
            this.isGameOver = true;
            this.uiManager.updateGameLog('You have passed away.');
            this.uiManager.showDeathModal();
        }
    }
    

}