class CharacterStats {
    constructor() {
        this.age = 0;
        this.happiness = 50;
        this.health = 100;
        this.intelligence = 50;
        this.wealth = 0;
    }

    updateDisplay() {
        // Update age
        document.getElementById('age-display').textContent = `Age: ${this.age}`;
        
        // Update stats with progress bars
        this.updateStatWithProgress('happiness', this.happiness);
        this.updateStatWithProgress('health', this.health);
        this.updateStatWithProgress('intelligence', this.intelligence);
        
        // Update wealth (no progress bar)
        document.getElementById('wealth-stat').textContent = 
            `Wealth: ${Utils.formatMoney(this.wealth)}`;
    }

    updateStatWithProgress(statName, value) {
        const statElement = document.getElementById(`${statName}-stat`);
        const progressBar = statElement.querySelector('.progress');
        
        progressBar.style.width = `${value}%`;
        statElement.lastElementChild.textContent = `${value}%`;
        
        // Update progress bar color
        const color = value < 25 ? '#dc3545' : 
                     value < 50 ? '#ffc107' : '#4CAF50';
        progressBar.style.backgroundColor = color;
    }

    adjustForAge() {
        // Health decline after 50
        if (this.age > 50) {
            this.health = Math.max(this.health - 2, 0);
        }
        
        // Random fluctuations
        this.health = Math.max(0, Math.min(100, this.health + Utils.randomInt(-5, 5)));
        this.happiness = Math.max(0, Math.min(100, this.happiness + Utils.randomInt(-10, 10)));
        
        // Intelligence improvements until 25
        if (this.age < 25) {
            this.intelligence = Math.min(100, this.intelligence + Utils.randomInt(0, 2));
        }
        
        this.updateDisplay();
    }

    applyEventEffects(effects) {
        for (const [stat, value] of Object.entries(effects)) {
            if (stat === 'wealth') {
                this.wealth += value;
            } else {
                this[stat] = Math.max(0, Math.min(100, this[stat] + value));
            }
        }
        this.updateDisplay();
    }
}