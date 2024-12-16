// Updated GameManager.js
class GameManager {
    constructor() {
        this.characterStats = new CharacterStats();
        this.uiManager = new UIManager(this);
        this.relationshipManager = new RelationshipManager();
        this.petManager = new PetManager();
        this.education = new Education();
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
        
        const birthdayMoney = this.characterStats.age * 100;
        this.characterStats.wealth += birthdayMoney;
        console.log(`Happy Birthday! You received $${birthdayMoney} for turning ${this.characterStats.age}`);
        this.uiManager.updateGameLog(`Happy Birthday! You received $${birthdayMoney} for turning ${this.characterStats.age}`);

        // Education progress
        if (this.education.currentMajor && !this.education.graduated) {
            const graduated = this.education.studyYear();
            if (graduated) {
                this.uiManager.updateGameLog(`Congratulations! You graduated with a degree in ${this.education.currentMajor}!`);
                this.characterStats.intelligence += 15;
            }
        }

        this.characterStats.adjustForAge();
        
        // Update career and apply happiness effects
        if (this.career) {
            const careerUpdate = this.career.yearlyUpdate();
            this.characterStats.wealth += this.career.salary;
            
            // Apply career happiness effect
            const careerHappinessEffect = (this.career.happiness - 50) / 10;
            this.characterStats.happiness += careerHappinessEffect;
            
            this.uiManager.updateGameLog(`You earned ${Utils.formatMoney(this.career.salary)} from your job as ${this.career.jobTitle}`);
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
        // In GameManager.js, add this line in the progressTurn method after updating the UI
        this.uiManager.updateEducationAndCareerDisplay();
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
    startCollege(major) {
        if (!Education.majors[major]) return false;
        
        const majorInfo = Education.majors[major];
        
        if (this.characterStats.intelligence < majorInfo.intelligence_requirement) {
            this.uiManager.updateGameLog(`Your intelligence is too low to study ${majorInfo.name}`);
            return false;
        }
        
        if (this.characterStats.wealth < majorInfo.cost) {
            this.uiManager.updateGameLog(`You cannot afford to study ${majorInfo.name}`);
            return false;
        }
        
        this.characterStats.wealth -= majorInfo.cost;
        this.education.startMajor(major);
        this.uiManager.updateGameLog(`You started studying ${majorInfo.name}`);
        return true;
    }

    applyForJob(careerKey) {
        const careerConfig = Career.availableCareers[careerKey];
        if (!careerConfig) return false;

        // Check basic requirements
        if (this.characterStats.age < careerConfig.requirements.age || 
            this.characterStats.intelligence < careerConfig.requirements.intelligence) {
            return false;
        }

        // Check education requirements
        if (careerConfig.requirements.major && 
            (!this.education.graduated || this.education.currentMajor !== careerConfig.requirements.major)) {
            return false;
        }

        this.career = new Career(careerConfig);
        this.uiManager.updateGameLog(`You got a job as ${careerConfig.jobTitle} at ${careerConfig.company}!`);
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
        console.log('Attempting to adopt pet:', config);
        
        const petType = Pet.petTypes[config.type.toUpperCase()];
        if (!petType) {
            console.error('Invalid pet type:', config.type);
            return false;
        }

        if (this.characterStats.wealth < petType.cost) {
            console.error('Not enough money to adopt pet');
            return false;
        }

        try {
            const newPet = this.petManager.addPet(config);
            if (newPet) {
                this.characterStats.wealth -= petType.cost;
                this.characterStats.happiness += 10; // Happiness boost from new pet
                this.uiManager.updateGameLog(`You adopted a ${config.type} named ${config.name}!`);
                this.uiManager.updatePetsDisplay(); // Ensure UI is updated
                return true;
            }
        } catch (error) {
            console.error('Error adopting pet:', error);
            return false;
        }
        return false;
    }


    interactWithPet(petName, action) {
        const pet = this.petManager.getPet(petName);
        if (pet) {
            const result = pet.interact(action);
            this.uiManager.updateGameLog(result.message);
            this.uiManager.updatePetsDisplay();
        }
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