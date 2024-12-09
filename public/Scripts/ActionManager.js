class ActionManager {
    static actions = {
        study: new Action({
            name: 'studied hard',
            type: 'education',
            minAge: 6,
            maxAge: 30,
            effects: { intelligence: 10, happiness: -5, wealth: -500 },
            description: 'Your intelligence increased but you feel tired.'
        }),
        exercise: new Action({
            name: 'exercised',
            type: 'health',
            minAge: 5,
            effects: { health: 15, happiness: 5, wealth: -100 },
            description: 'You feel healthier and more energetic!'
        }),
        work: new Action({
            name: 'worked overtime',
            type: 'career',
            minAge: 16,
            requirements: { health: 30 },
            effects: { wealth: 2000, happiness: -10, health: -5 },
            description: 'You earned extra money but feel exhausted.'
        }),
        party: new Action({
            name: 'went to a party',
            type: 'social',
            minAge: 13,
            effects: { happiness: 20, health: -5, wealth: -200 },
            description: 'You had a great time socializing!'
        }),
        meditate: new Action({
            name: 'meditated',
            type: 'wellness',
            minAge: 10,
            effects: { happiness: 15, health: 5 },
            description: 'You feel more peaceful and centered.'
        })
    };

    static getAvailableActions(characterStats) {
        return Object.values(this.actions)
            .filter(action => action.isAvailable(characterStats));
    }
}
