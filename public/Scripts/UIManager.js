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
                    <button id="quit-job-button">Quit Job</button>
                </div>
            `;
    
            // Add event listener to quit job button
            const quitJobButton = careerSection.querySelector('#quit-job-button');
            quitJobButton.addEventListener('click', () => {
                const result = this.GameManager.quitJob();
                if (result) {
                    this.updateGameLog(result.message);
                    this.updateCareerDisplay();
                }
            });
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
    updateEducationAndCareerOptions() {
        const age = this.GameManager.characterStats.age;
        if (age >= 18 && !this.GameManager.education.currentMajor && !this.GameManager.education.graduated) {
            this.showEducationModal();
        } else if (this.GameManager.education.graduated && !this.GameManager.career) {
            this.showCareerModal();
        }
    }

    showEducationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const educationOptions = Object.entries(Education.majors)
            .map(([key, major]) => {
                const isAffordable = this.GameManager.characterStats.wealth >= major.cost;
                const isIntelligentEnough = this.GameManager.characterStats.intelligence >= major.intelligence_requirement;
                const disabled = !isAffordable || !isIntelligentEnough;
                
                return `
                    <div class="education-option ${disabled ? 'disabled' : ''}" data-major="${key}">
                        <h3>${major.name}</h3>
                        <p>Cost: $${major.cost}</p>
                        <p>Duration: ${major.duration} years</p>
                        <p>Intelligence Required: ${major.intelligence_requirement}</p>
                        <p>Possible Careers: ${major.careers.join(', ')}</p>
                        ${disabled ? 
                            `<p class="warning">
                                ${!isAffordable ? 'Not enough money' : 'Intelligence too low'}
                            </p>` : ''}
                    </div>
                `;
            }).join('');

        modal.innerHTML = `
            <div class="modal-content education-modal">
                <h2>Choose Your Major</h2>
                <div class="education-options">
                    ${educationOptions}
                </div>
                <button id="close-education-modal">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelectorAll('.education-option').forEach(option => {
            if (!option.classList.contains('disabled')) {
                option.addEventListener('click', () => {
                    const major = option.dataset.major;
                    const success = this.GameManager.startCollege(major);
                    if (success) {
                        this.updateGameLog(`Started studying ${Education.majors[major].name}`);
                        document.body.removeChild(modal);
                    }
                });
            }
        });

        modal.querySelector('#close-education-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    showCareerModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const currentMajor = this.GameManager.education.currentMajor;
        const careerOptions = Object.entries(Career.availableCareers)
            .filter(([_, career]) => {
                // Show careers that match the major or don't require a specific major
                return !career.requirements.major || career.requirements.major === currentMajor;
            })
            .map(([key, career]) => {
                const meetsAgeReq = this.GameManager.characterStats.age >= career.requirements.age;
                const meetsIntelligenceReq = this.GameManager.characterStats.intelligence >= career.requirements.intelligence;
                const disabled = !meetsAgeReq || !meetsIntelligenceReq;

                return `
                    <div class="career-option ${disabled ? 'disabled' : ''}" data-career="${key}">
                        <h3>${career.jobTitle}</h3>
                        <p>Company: ${career.company}</p>
                        <p>Starting Salary: $${career.salary}</p>
                        <p>Requirements:</p>
                        <ul>
                            <li>Age: ${career.requirements.age}+</li>
                            <li>Intelligence: ${career.requirements.intelligence}+</li>
                            ${career.requirements.major ? 
                                `<li>Major: ${career.requirements.major}</li>` : ''}
                        </ul>
                        ${disabled ? 
                            `<p class="warning">
                                ${!meetsAgeReq ? 'Too young' : 'Intelligence too low'}
                            </p>` : ''}
                    </div>
                `;
            }).join('');

        modal.innerHTML = `
            <div class="modal-content career-modal">
                <h2>Choose Your Career</h2>
                <div class="career-options">
                    ${careerOptions}
                </div>
                <button id="close-career-modal">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelectorAll('.career-option').forEach(option => {
            if (!option.classList.contains('disabled')) {
                option.addEventListener('click', () => {
                    const career = option.dataset.career;
                    const success = this.GameManager.applyForJob(career);
                    if (success) {
                        this.updateGameLog(`Got a job as ${Career.availableCareers[career].jobTitle}`);
                        document.body.removeChild(modal);
                        this.updateCareerDisplay();
                    }
                });
            }
        });

        modal.querySelector('#close-career-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    updateRelationshipsDisplay() {
        const bottomContent = document.querySelector('.bottom-content');
        if (!bottomContent) return;
    
        let relationshipsDiv = document.getElementById('relationships-section');
        if (!relationshipsDiv) {
            relationshipsDiv = document.createElement('div');
            relationshipsDiv.id = 'relationships-section';
            relationshipsDiv.className = 'section relationships-section';
        }
        relationshipsDiv.innerHTML = '<h2>Relationships</h2>';
    
        // Add buttons to find new relationships
        const actionButtons = document.createElement('div');
        actionButtons.className = 'relationship-actions';
        
        // Only show friend button if player meets age requirement
        const canFindFriend = this.GameManager.relationshipManager.canFindFriend(this.GameManager.characterStats.age);
        const canFindPartner = this.GameManager.relationshipManager.canFindPartner(this.GameManager.characterStats.age);
        
        actionButtons.innerHTML = `
            ${canFindFriend ? '<button id="find-friend">Find Friend</button>' : ''}
            ${canFindPartner ? '<button id="find-partner">Find Partner</button>' : ''}
        `;
        relationshipsDiv.appendChild(actionButtons);
    
        // Add event listeners for relationship buttons
        if (canFindFriend) {
            actionButtons.querySelector('#find-friend').addEventListener('click', () => {
                const friend = this.GameManager.relationshipManager.findFriend(this.GameManager.characterStats.age);
                if (friend) {
                    this.updateGameLog(`You met a new friend named ${friend.name}! ${friend.emoji}`);
                } else {
                    this.updateGameLog("You can't make any more friends right now.");
                }
                this.updateRelationshipsDisplay();
            });
        }
    
        if (canFindPartner) {
            actionButtons.querySelector('#find-partner').addEventListener('click', () => {
                const partner = this.GameManager.relationshipManager.findPartner(this.GameManager.characterStats.age);
                if (partner) {
                    this.updateGameLog(`You met ${partner.name} and started dating! ${partner.emoji}`);
                } else {
                    this.updateGameLog("You can't find a partner right now.");
                }
                this.updateRelationshipsDisplay();
            });
        }
    
        // Display all relationships
        this.GameManager.relationshipManager.getAllRelationships().forEach(relationship => {
            const relationshipElement = document.createElement('div');
            relationshipElement.className = 'relationship-item';
    
            // Create different interaction buttons based on relationship type
            let interactionButtons = '';
            switch(relationship.type) {
                case 'partner':
                    interactionButtons = `
                        <button>Go on date</button>
                        ${relationship.level >= 75 ? '<button>Make love</button>' : ''}
                        ${relationship.level >= 80 && !relationship.isMarried ? '<button>Propose</button>' : ''}
                        <button>Have an argument</button>
                        ${!relationship.isMarried ? '<button>Break up</button>' : ''}
                    `;
                    break;
                case 'friend':
                    interactionButtons = `
                        <button>Hang out</button>
                        <button>Deep conversation</button>
                        <button>Go on vacation</button>
                        <button>Have an argument</button>
                    `;
                    break;
                case 'family':
                case 'child':
                    interactionButtons = `
                        <button>Spend time together</button>
                        <button>Have dinner</button>
                        <button>Share stories</button>
                        <button>Have an argument</button>
                    `;
                    break;
            }
    
            relationshipElement.innerHTML = `
                <div class="relationship-info">
                    <span>${relationship.name} ${relationship.emoji} (${relationship.type}${relationship.isMarried ? ' - Married' : ''}) - Age: ${relationship.age}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${relationship.level}%"></div>
                    </div>
                    <span>${relationship.level}%</span>
                </div>
                <div class="relationship-actions">
                    ${interactionButtons}
                </div>
            `;
    
            // Add event listeners for interaction buttons
            const buttons = relationshipElement.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const interaction = button.textContent;
                    const result = this.GameManager.interactWithRelationship(relationship.name, interaction);
                    
                    if (result.success) {
                        if (result.pregnancy) {
                            this.showNameChildModal(relationship.name);
                        }
                        
                        if (result.breakup) {
                            this.GameManager.relationshipManager.removeRelationship(relationship.name);
                        }
                        
                        this.updateGameLog(result.message);
                        this.updateRelationshipsDisplay();
                    } else {
                        this.updateGameLog(result.message);
                    }
                });
            });
    
            // Display children if any
            if (relationship.children && relationship.children.length > 0) {
                const childrenDiv = document.createElement('div');
                childrenDiv.className = 'children-info';
                childrenDiv.innerHTML = `
                    <h4>Children:</h4>
                    ${relationship.children.map(child => {
                        const childRel = this.GameManager.relationshipManager.getRelationship(child.name);
                        return `<p>${child.name} ${childRel ? childRel.emoji : ''} (Age: ${childRel ? childRel.age : child.age})</p>`;
                    }).join('')}
                `;
                relationshipElement.appendChild(childrenDiv);
            }
    
            relationshipsDiv.appendChild(relationshipElement);
        });
    
        bottomContent.appendChild(relationshipsDiv);
    }
    
    showNameChildModal(parentName) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
    
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Congratulations!</h2>
                <p>You're having a baby! Choose a name:</p>
                <input type="text" id="child-name" placeholder="Enter child's name">
                <div class="gender-selection">
                    <label><input type="radio" name="gender" value="male" checked> Boy</label>
                    <label><input type="radio" name="gender" value="female"> Girl</label>
                </div>
                <button id="confirm-name">Confirm</button>
            </div>
        `;
    
        document.body.appendChild(modal);
    
        modal.querySelector('#confirm-name').addEventListener('click', () => {
            const childName = modal.querySelector('#child-name').value.trim();
            const gender = modal.querySelector('input[name="gender"]:checked').value;
            
            if (childName) {
                const child = this.GameManager.relationshipManager.addChild(parentName, childName, gender);
                this.updateGameLog(`Congratulations! ${childName} was born!`);
                this.updateRelationshipsDisplay();
                document.body.removeChild(modal);
            } else {
                alert('Please enter a name for your child');
            }
        });
    }

}