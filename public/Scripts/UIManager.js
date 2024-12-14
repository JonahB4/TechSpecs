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
    
            // Store all the necessary elements
            const statsPanel = gameContainer.querySelector('.stats-panel');
            const deathModal = gameContainer.querySelector('#death-modal');
            const eventPanel = gameContainer.querySelector('#event-panel');
            const gameLog = gameContainer.querySelector('#game-log');
            
            // Find all control buttons and create a new game-controls container
            const newGameControls = document.createElement('div');
            newGameControls.className = 'game-controls';
            
            // Add the Start New Life button
            const startButton = document.createElement('button');
            startButton.id = 'start-game-btn';
            startButton.textContent = 'Start New Life';
            newGameControls.appendChild(startButton);
            
            // Add the Age Up button
            const ageUpButton = document.createElement('button');
            ageUpButton.id = 'progress-turn-btn';
            ageUpButton.textContent = 'Age Up';
            newGameControls.appendChild(ageUpButton);
    
            // Clear the game container
            gameContainer.innerHTML = '';
    
            // Rebuild the structure in the desired order
            // 1. Stats Panel
            if (statsPanel) gameContainer.appendChild(statsPanel);
    
            // 2. Game Controls - now containing both buttons
            gameContainer.appendChild(newGameControls);
    
            // 3. Main Content
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';
    
            // 4. Event Panel with Game Log
            const newEventPanel = document.createElement('div');
            newEventPanel.id = 'event-panel';
            newEventPanel.className = 'event-panel';
            if (gameLog) newEventPanel.appendChild(gameLog);
            mainContent.appendChild(newEventPanel);
    
            // Add main content to container
            gameContainer.appendChild(mainContent);
    
            // 5. Death Modal
            if (deathModal) gameContainer.appendChild(deathModal);
    
            // Re-setup event listeners since we created new buttons
            this.setupEventListeners();
            this.setupActionButtons();
        } catch (error) {
            console.error('Error in reorganizeLayout:', error);
        }
    }c


    setupActionButtons() {
        try {
            const topSection = document.querySelector('.top-section');
            if (!topSection) return;

            const actionContainer = document.createElement('div');
            actionContainer.id = 'action-container';
            actionContainer.className = 'action-container';
            
            Object.entries(ActionManager.actions).forEach(([actionName, action]) => {
                const button = document.createElement('button');
                button.textContent = this.formatActionName(actionName);
                button.className = 'action-button';
                button.dataset.actionName = actionName;
                
                if (this.GameManager.characterStats.age < action.minAge || 
                    this.GameManager.characterStats.age > action.maxAge) {
                    button.style.display = 'none';
                }
                
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

            const gameLog = document.getElementById('game-log');
            if (gameLog && gameLog.parentElement) {
                gameLog.parentElement.insertBefore(actionContainer, gameLog);
            }
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
                });
                
                this.startButton = newStartBtn;
                this.progressButton = newProgressBtn;
            }
        } catch (error) {
            console.error('Error in setupEventListeners:', error);
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
        const relationshipsDiv = this.getOrCreateSection('relationships-section', 'Relationships');
        relationshipsDiv.innerHTML = '';

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
                    <button>Talk</button>
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

            relationshipsDiv.appendChild(relationshipElement);
        });
    }

    updatePetsDisplay() {
        const petsDiv = this.getOrCreateSection('pets-section', 'Pets');
        petsDiv.innerHTML = '';

        this.GameManager.petManager.getAllPets().forEach(pet => {
            const petElement = document.createElement('div');
            petElement.className = 'pet-item';
            petElement.innerHTML = `
                <div class="pet-info">
                    <span>${pet.name} (${pet.type})</span>
                    <div class="stats-grid">
                        <div class="stat">
                            <span>Health: ${pet.health}%</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${pet.health}%"></div>
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
                    <button onclick="GameManager.interactWithPet('${pet.name}', 'Play')">Play</button>
                    <button onclick="GameManager.interactWithPet('${pet.name}', 'Feed')">Feed</button>
                    <button onclick="GameManager.interactWithPet('${pet.name}', 'Vet visit')">Vet Visit</button>
                </div>
            `;
            petsDiv.appendChild(petElement);
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