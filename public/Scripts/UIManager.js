class UIManager {
    constructor(GameManager) {
        this.GameManager = GameManager;
        // Wait for DOM to be fully loaded before setup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            this.setupEventListeners();
            this.setupActionButtons();
            this.reorganizeLayout();
        } catch (error) {
            console.error('Error initializing UI:', error);
        }
    }

    reorganizeLayout() {
        try {
            // Get the game container first
            const gameContainer = document.querySelector('.game-container');
            if (!gameContainer) {
                console.error('Game container not found');
                return;
            }

            // Store the stats panel and death modal
            const statsPanel = gameContainer.querySelector('.stats-panel');
            const deathModal = gameContainer.querySelector('#death-modal');

            // Create main content container
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';

            // Create top section for game log
            const topSection = document.createElement('div');
            topSection.className = 'top-section';

            // Get existing elements
            const gameControls = gameContainer.querySelector('.game-controls');
            const eventPanel = gameContainer.querySelector('#event-panel');
            const gameLog = gameContainer.querySelector('#game-log');

            if (!gameControls || !eventPanel || !gameLog) {
                console.error('Required elements not found');
                return;
            }

            // Clear the event panel title if it exists
            const eventPanelTitle = eventPanel.querySelector('h2');
            if (eventPanelTitle) {
                eventPanelTitle.remove();
            }

            // Move elements to top section
            topSection.appendChild(gameLog.cloneNode(true));
            topSection.appendChild(gameControls.cloneNode(true));

            // Create bottom content
            const bottomContent = document.createElement('div');
            bottomContent.className = 'bottom-content';

            // Clear the game container
            gameContainer.innerHTML = '';

            // Rebuild the structure
            if (statsPanel) gameContainer.appendChild(statsPanel);
            mainContent.appendChild(topSection);
            mainContent.appendChild(bottomContent);
            gameContainer.appendChild(mainContent);
            if (deathModal) gameContainer.appendChild(deathModal);

            // Re-setup event listeners since we cloned nodes
            this.setupEventListeners();
            this.setupActionButtons();
        } catch (error) {
            console.error('Error in reorganizeLayout:', error);
        }
    }

    setupActionButtons() {
        try {
            const bottomContent = document.querySelector('.bottom-content');
            if (!bottomContent) {
                console.error('Bottom content section not found');
                return;
            }
    
            // Clear existing action container if it exists
            let actionContainer = document.getElementById('action-container');
            if (actionContainer) {
                actionContainer.remove();
            }
    
            actionContainer = document.createElement('div');
            actionContainer.id = 'action-container';
            actionContainer.className = 'action-container';
    
            Object.entries(ActionManager.actions).forEach(([actionName, action]) => {
                const button = document.createElement('button');
                button.textContent = this.formatActionName(actionName);
                button.className = 'action-button';
                button.dataset.actionName = actionName;
    
                // Hide buttons if character's age is out of range
                if (this.GameManager.characterStats.age < action.minAge || 
                    this.GameManager.characterStats.age > action.maxAge) {
                    button.style.display = 'none';
                }
    
                // Add click listener for the action
                button.addEventListener('click', () => {
                    if (!action.isAvailable(this.GameManager.characterStats)) {
                        console.error('Action not available');
                        return;
                    }
                    try {
                        const result = action.executeAction(this.GameManager.characterStats);
                        this.updateGameLog(result);
                        this.GameManager.availableActions--;
                        if (this.GameManager.availableActions <= 0) {
                            this.updateActionVisibility(false);
                        }
                    } catch (e) {
                        console.error(e.message);
                    }
                });
    
                actionContainer.appendChild(button);
            });
    
            // Append the action container to the bottom content
            bottomContent.appendChild(actionContainer);
        } catch (error) {
            console.error('Error in setupActionButtons:', error);
        }
    }
    

    formatActionName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
    }

    setupEventListeners() {
        try {
            const startBtn = document.getElementById('start-game-btn');
            const progressBtn = document.getElementById('progress-turn-btn');
            const adoptPetBtn = document.getElementById('adopt-pet-btn');
            
            if (startBtn && progressBtn) {
                // Remove existing listeners if any
                const newStartBtn = startBtn.cloneNode(true);
                const newProgressBtn = progressBtn.cloneNode(true);
                
                startBtn.parentNode.replaceChild(newStartBtn, startBtn);
                progressBtn.parentNode.replaceChild(newProgressBtn, progressBtn);
                
                newStartBtn.addEventListener('click', () => this.GameManager.startGame());
                newProgressBtn.addEventListener('click', () => {
                    this.GameManager.progressTurn();
                    this.updateActionVisibility(true);
                    this.updateActionButtons();
                    this.updatePetsDisplay(); // Add this line to update pets on turn progression
                });
                
                this.startButton = newStartBtn;
                this.progressButton = newProgressBtn;
            }
    
            // Add event listener for adopt pet button
            if (adoptPetBtn) {
                adoptPetBtn.addEventListener('click', () => this.openPetAdoptionModal());
            }
        } catch (error) {
            console.error('Error in setupEventListeners:', error);
        }
    }
    
    updatePetsDisplay() {
        const bottomContent = document.querySelector('.bottom-content');
        if (!bottomContent) return;
    
        let petsDiv = document.getElementById('pets-section');
        if (!petsDiv) {
            petsDiv = document.createElement('div');
            petsDiv.id = 'pets-section';
            petsDiv.className = 'section pets-section';
        }
        petsDiv.innerHTML = ''; // Clear existing content
    
        const title = document.createElement('h2');
        title.textContent = 'Pets';
        petsDiv.appendChild(title);
    
        if (this.GameManager.petManager.getAlivePetsCount() < 3) {
            const adoptPetButton = document.createElement('button');
            adoptPetButton.textContent = 'Adopt Pet';
            adoptPetButton.className = 'adopt-pet-button';
            adoptPetButton.addEventListener('click', () => this.openPetAdoptionModal());
            petsDiv.appendChild(adoptPetButton);
        }
    
        const pets = this.GameManager.petManager.getAllPets();
        pets.forEach(pet => {
            const petElement = document.createElement('div');
            petElement.className = `pet-item ${pet.deceased ? 'deceased' : ''}`;
            
            const petTypeConfig = Pet.petTypes[pet.type.toUpperCase()];
            const emoji = petTypeConfig ? petTypeConfig.emoji : '🐾';
    
            if (pet.deceased) {
                petElement.innerHTML = `
                    <div class="pet-info">
                        <span>${emoji} ${pet.name} (${pet.type}) - Deceased</span>
                        <p>Lived to age ${pet.age}</p>
                        <p>Cause: ${pet.causeOfDeath}</p>
                    </div>
                `;
            } else {
                petElement.innerHTML = `
                    <div class="pet-info">
                        <span>${emoji} ${pet.name} (${pet.type}) - Age: ${pet.age}</span>
                        <div class="stats-grid">
                            <div class="stat">
                                <span>Health: ${pet.health}%</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${pet.health}%"></div>
                                </div>
                            </div>
                            <div class="stat">
                                <span>Happiness: ${pet.happiness}%</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${pet.happiness}%"></div>
                                </div>
                            </div>
                            <div class="stat">
                                <span>Bond: ${pet.bondLevel}%</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${pet.bondLevel}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pet-actions">
                        <button class="pet-action-btn play">Play</button>
                        <button class="pet-action-btn feed">Feed</button>
                        <button class="pet-action-btn vet">Vet Visit</button>
                        <button class="pet-action-btn give-up">Give Up for Adoption</button>
                        <button class="pet-action-btn put-down">Put Down</button>
                    </div>
                `;
    
                // Add event listeners
                const actions = petElement.querySelectorAll('.pet-action-btn');
                actions.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('give-up')) {
                            if (confirm(`Are you sure you want to give ${pet.name} up for adoption?`)) {
                                this.GameManager.petManager.giveUpForAdoption(pet.name);
                                this.GameManager.characterStats.happiness -= 20;
                                this.updateGameLog(`You gave ${pet.name} up for adoption. It was a difficult decision.`);
                            }
                        } else if (btn.classList.contains('put-down')) {
                            if (confirm(`Are you sure you want to put ${pet.name} down? This cannot be undone.`)) {
                                this.GameManager.petManager.putDownPet(pet.name);
                                this.GameManager.characterStats.happiness -= 30;
                                this.updateGameLog(`${pet.name} was put to sleep peacefully.`);
                            }
                        } else {
                            const action = btn.textContent;
                            this.GameManager.interactWithPet(pet.name, action);
                        }
                        this.updatePetsDisplay();
                    });
                });
            }
    
            petsDiv.appendChild(petElement);
        });
    
        bottomContent.appendChild(petsDiv);
    }
    
    openPetAdoptionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
    
        const petOptions = Object.entries(Pet.petTypes).map(([key, pet]) => 
            `<option value="${key}">${pet.emoji} ${pet.type} ($${pet.cost})</option>`
        ).join('');
    
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Adopt a Pet</h2>
                <select id="pet-type" style="margin: 10px 0; width: 200px;">
                    ${petOptions}
                </select>
                <input type="text" id="pet-name" placeholder="Enter pet name" style="margin: 10px 0; width: 200px;">
                <div style="margin-top: 15px;">
                    <button id="confirm-adopt">Adopt</button>
                    <button id="cancel-adopt">Cancel</button>
                </div>
            </div>
        `;
    
        document.body.appendChild(modal);
    
        // Add event listeners
        modal.querySelector('#confirm-adopt').addEventListener('click', () => {
            const petType = modal.querySelector('#pet-type').value;
            const petName = modal.querySelector('#pet-name').value.trim();
    
            if (!petName) {
                alert('Please enter a name for your pet');
                return;
            }
    
            const success = this.GameManager.adoptPet({
                name: petName,
                type: petType
            });
    
            if (success) {
                this.updateGameLog(`You adopted a ${petType.toLowerCase()} named ${petName}!`);
                this.updatePetsDisplay();
                document.body.removeChild(modal);
            } else {
                alert('Unable to adopt pet. Please check your requirements.');
            }
        });
    
        modal.querySelector('#cancel-adopt').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    updateEducationAndCareerDisplay() {
        const bottomContent = document.querySelector('.bottom-content');
        if (!bottomContent) return;
    
        // Check if character is of college age (18-22) or looking for career (22+)
        const age = this.GameManager.characterStats.age;
        const hasGraduated = this.GameManager.education.graduated;
    
        // Remove existing education/career section if it exists
        const existingSection = document.getElementById('education-career-section');
        if (existingSection) {
            existingSection.remove();
        }
    
        // Only show for appropriate ages
        if (age >= 18) {
            const section = document.createElement('div');
            section.id = 'education-career-section';
            section.className = 'section education-career-section';
    
            if (!this.GameManager.education.currentMajor && !hasGraduated && age < 30) {
                // Show education options
                section.innerHTML = `
                    <h2>Education Options</h2>
                    <div class="education-options">
                        ${Object.entries(Education.majors).map(([key, major]) => `
                            <div class="education-option">
                                <h3>${major.name}</h3>
                                <p>Cost: $${major.cost}</p>
                                <p>Duration: ${major.duration} years</p>
                                <p>Intelligence Required: ${major.intelligence_requirement}</p>
                                <button onclick="gameManager.startCollege('${key}')"
                                        ${this.GameManager.characterStats.intelligence < major.intelligence_requirement ? 'disabled' : ''}>
                                    Enroll
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (hasGraduated && !this.GameManager.career) {
                // Show career options based on major
                const major = this.GameManager.education.currentMajor;
                const availableCareers = Object.entries(Career.availableCareers)
                    .filter(([_, career]) => !career.requirements.major || career.requirements.major === major);
    
                section.innerHTML = `
                    <h2>Career Options</h2>
                    <div class="career-options">
                        ${availableCareers.map(([key, career]) => `
                            <div class="career-option">
                                <h3>${career.jobTitle}</h3>
                                <p>Company: ${career.company}</p>
                                <p>Starting Salary: $${career.salary}</p>
                                <button onclick="gameManager.applyForJob('${key}')"
                                        ${this.GameManager.characterStats.intelligence < career.requirements.intelligence ? 'disabled' : ''}>
                                    Apply
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
    
            bottomContent.appendChild(section);
        }
    }

    updateGameLog(message) {
        const gameLog = document.getElementById('game-log');
        if (gameLog) {
            const entry = document.createElement('p');
            entry.textContent = message;
            gameLog.appendChild(entry);
            gameLog.scrollTop = gameLog.scrollHeight;
        }
    }

    toggleButtons(startEnabled) {
        if (this.startButton && this.progressButton) {
            this.startButton.disabled = !startEnabled;
            this.progressButton.disabled = startEnabled;
            this.updateActionButtons();
        }
    }

    updateActionButtons() {
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            const actionName = button.dataset.actionName;
            const action = ActionManager.actions[actionName];
            
            if (action) {
                const ageValid = this.GameManager.characterStats.age >= action.minAge && 
                               this.GameManager.characterStats.age <= action.maxAge;
                
                button.style.display = ageValid ? 'block' : 'none';
                
                if (ageValid) {
                    const isAvailable = action.isAvailable(this.GameManager.characterStats) && 
                                      this.GameManager.availableActions > 0;
                    button.style.opacity = isAvailable ? '1' : '0.5';
                    button.style.pointerEvents = isAvailable ? 'auto' : 'none';
                }
            }
        });
    }

    updateActionVisibility(visible) {
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            const actionName = button.dataset.actionName;
            const action = ActionManager.actions[actionName];
            
            if (action && this.GameManager.characterStats.age >= action.minAge && 
                this.GameManager.characterStats.age <= action.maxAge) {
                button.style.opacity = visible ? '1' : '0.5';
                button.style.pointerEvents = visible ? 'auto' : 'none';
            }
        });
    }


    showDeathModal() {
        const modal = document.getElementById('death-modal');
        modal.style.display = 'flex';
    }

    updateRelationshipsDisplay() {
        // First, get the bottom content section
        const bottomContent = document.querySelector('.bottom-content');
        if (!bottomContent) {
            console.error('Bottom content section not found');
            return;
        }
    
        // Check if relationships section already exists
        let relationshipsDiv = document.getElementById('relationships-section');
        if (!relationshipsDiv) {
            relationshipsDiv = document.createElement('div');
            relationshipsDiv.id = 'relationships-section';
            relationshipsDiv.className = 'section relationships-section';
            
            // Create a title for the section
            const title = document.createElement('h2');
            title.textContent = 'Relationships';
            relationshipsDiv.appendChild(title);
            
            // Append to bottom content
            bottomContent.appendChild(relationshipsDiv);
        } else {
            // Clear existing content
            relationshipsDiv.innerHTML = '<h2>Relationships</h2>';
        }
    
        this.GameManager.relationshipManager.getAllRelationships().forEach(relationship => {
            const relationshipElement = document.createElement('div');
            relationshipElement.className = 'relationship-item';
            relationshipElement.innerHTML = `
                <div class="relationship-info">
                    <span>${relationship.name} (${relationship.type})</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${relationship.level}%"></div>
                    </div>
                    <span>${relationship.level}%</span>
                </div>
                <div class="relationship-actions">
                    <button>Hang out</button>
                    <button>Deep conversation</button>
                    <button>Go on vacation</button>
                    <button>Have an argument</button>
                </div>
            `;
    
            // Add event listeners properly
            const buttons = relationshipElement.querySelectorAll('button');
            buttons[0].addEventListener('click', () => {
                this.GameManager.interactWithRelationship(relationship.name, 'Hang out');
            });
            buttons[1].addEventListener('click', () => {
                this.GameManager.interactWithRelationship(relationship.name, 'Deep conversation');
            });
            buttons[2].addEventListener('click', () => {
                this.GameManager.interactWithRelationship(relationship.name, 'Go on vacation');
            });
            buttons[3].addEventListener('click', () => {
                this.GameManager.interactWithRelationship(relationship.name, 'Have an argument');
            });
    
            relationshipsDiv.appendChild(relationshipElement);
        });
    }
    

    

    updateCareerDisplay() {
        const careerSection = this.getOrCreateSection('career-section', 'Career');
        careerSection.innerHTML = '';
    
        const career = this.GameManager.career;
    
        if (career) {
            careerSection.innerHTML = `
                <div class="career-info">
                    <span>Job Title: ${career.jobTitle}</span>
                    <span>Company: ${career.company}</span>
                    <span>Salary: ${Utils.formatMoney(career.salary)}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${career.satisfaction}%"></div>
                    </div>
                    <span>Satisfaction: ${career.satisfaction}%</span>
                </div>
                <div class="career-actions">
                    <button onclick="GameManager.quitJob()">Quit Job</button>
                </div>
            `;
        } else {
            careerSection.innerHTML = '<p>No current job. Apply for a career to start earning!</p>';
        }
    }

    getOrCreateSection(sectionId, sectionTitle) {
        let section = document.getElementById(sectionId);
        if (!section) {
            section = document.createElement('div');
            section.id = sectionId;
            section.className = 'section';
            section.innerHTML = `<h2>${sectionTitle}</h2>`;
            const gameLog = document.getElementById('game-log');
            gameLog.parentElement.insertBefore(section, gameLog);
        }
        return section;
    }
}