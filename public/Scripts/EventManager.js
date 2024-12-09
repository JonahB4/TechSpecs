class EventManager {
    static events = {
        childhood: [
            { text: "You learned to walk!", effects: { happiness: 10, intelligence: 5 } },
            { text: "You made your first friend!", effects: { happiness: 15 } },
            { text: "You started school!", effects: { intelligence: 10, happiness: 5 } }
        ],
        teenage: [
            { text: "You got your first crush!", effects: { happiness: 10 } },
            { text: "You joined a school club!", effects: { intelligence: 10, happiness: 5 } },
            { text: "You learned to drive!", effects: { happiness: 15 } }
        ],
        adult: [
            { text: "You got your first job!", effects: { wealth: 1000, happiness: 10 } },
            { text: "You moved into your own place!", effects: { happiness: 20, wealth: -5000 } },
            { text: "You went on vacation!", effects: { happiness: 25, wealth: -2000 } }
        ],
        elderly: [
            { text: "You retired!", effects: { happiness: 15, wealth: -1000 } },
            { text: "You became a grandparent!", effects: { happiness: 30 } },
            { text: "You took up gardening!", effects: { happiness: 10, health: 5 } }
        ]
    };

    static getRandomEvent(age) {
        const eventPool = age < 13 ? this.events.childhood :
                         age < 20 ? this.events.teenage :
                         age < 65 ? this.events.adult :
                                   this.events.elderly;
        
        return eventPool[Math.floor(Math.random() * eventPool.length)];
    }
}