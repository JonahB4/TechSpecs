class Event {
    constructor(config) {
        this.text = config.text;
        this.effects = config.effects;
        this.choices = config.choices || null;
    }

    getChoices() {
        return this.choices;
    }

    applyChoice(choice, characterStats) {
        if (!this.choices || !this.choices[choice]) {
            throw new Error('Invalid choice');
        }
        const choiceResult = this.choices[choice];
        characterStats.applyEventEffects(choiceResult.effects);
        return choiceResult.text;
    }
}