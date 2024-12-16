class RelationshipManager {
    constructor() {
        this.relationships = new Map();
        this.maxFriends = 3;
        this.maxChildren = 3;
        this.minFriendAge = 6;
        this.minPartnerAge = 16;
        this.raceEmojis = ['👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿'];
    }

    getRelationship(name) {
        return this.relationships.get(name);
    }

    getPartner() {
        return Array.from(this.relationships.values()).find(rel => 
            rel.type === Relationship.relationshipTypes.PARTNER
        );
    }

    getFriends() {
        return Array.from(this.relationships.values()).filter(rel => 
            rel.type === Relationship.relationshipTypes.FRIEND
        );
    }

    getChildren() {
        return Array.from(this.relationships.values()).filter(rel => 
            rel.type === Relationship.relationshipTypes.CHILD
        );
    }

    canFindFriend(playerAge) {
        return playerAge >= this.minFriendAge && this.getFriends().length < this.maxFriends;
    }

    canFindPartner(playerAge) {
        return playerAge >= this.minPartnerAge && !this.getPartner();
    }

    canHaveChild() {
        return this.getChildren().length < this.maxChildren && this.getPartner()?.isMarried;
    }

    addRelationship(config) {
        if (config.type === Relationship.relationshipTypes.PARTNER && this.getPartner()) {
            console.error('Cannot have more than one partner');
            return null;
        }

        if (config.type === Relationship.relationshipTypes.FRIEND && 
            this.getFriends().length >= this.maxFriends) {
            console.error('Cannot have more than three friends');
            return null;
        }

        if (config.type === Relationship.relationshipTypes.CHILD && 
            this.getChildren().length >= this.maxChildren) {
            console.error('Cannot have more than three children');
            return null;
        }

        const relationship = new Relationship(config);
        relationship.emoji = this.raceEmojis[Math.floor(Math.random() * this.raceEmojis.length)];
        this.relationships.set(relationship.name, relationship);
        return relationship;
    }

    findPartner(playerAge) {
        if (!this.canFindPartner(playerAge)) {
            return null;
        }

        const genders = ['male', 'female'];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const names = gender === 'male' ? 
            ['James', 'Michael', 'David', 'John', 'Robert'] :
            ['Emma', 'Sophie', 'Sarah', 'Lisa', 'Anna'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const randomAge = playerAge + Utils.randomInt(-5, 5); // Partner around same age
        
        return this.addRelationship({
            name: name,
            type: Relationship.relationshipTypes.PARTNER,
            level: 50,
            gender: gender,
            age: randomAge
        });
    }

    findFriend(playerAge) {
        if (!this.canFindFriend(playerAge)) {
            return null;
        }

        const genders = ['male', 'female'];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const names = gender === 'male' ? 
            ['Alex', 'Chris', 'Sam', 'Tom', 'Ryan'] :
            ['Kate', 'Amy', 'Rachel', 'Emily', 'Jessica'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const randomAge = playerAge + Utils.randomInt(-3, 3); // Friend around same age
        
        return this.addRelationship({
            name: name,
            type: Relationship.relationshipTypes.FRIEND,
            level: 30,
            gender: gender,
            age: randomAge
        });
    }

    removeRelationship(name) {
        return this.relationships.delete(name);
    }

    addChild(parentName, childName, gender) {
        if (!this.canHaveChild()) {
            return null;
        }

        const parent = this.getRelationship(parentName);
        if (parent && parent.type === 'partner' && parent.isMarried) {
            const child = this.addRelationship({
                name: childName,
                type: Relationship.relationshipTypes.CHILD,
                level: 100,
                isFamily: true,
                gender: gender,
                age: 0
            });
            parent.addChild(childName, gender);
            return child;
        }
        return null;
    }

    getAllRelationships() {
        return Array.from(this.relationships.values());
    }

    calculatePartnerDeathChance(age) {
        if (age < 30) return 0.001; // 0.1%
        if (age < 50) return 0.005; // 0.5%
        if (age < 70) return 0.01;  // 1%
        if (age < 80) return 0.03;  // 3%
        if (age < 90) return 0.08;  // 8%
        return 0.15;                // 15%
    }

    yearlyUpdate(playerAge) {
        const relationshipsToRemove = [];
        const events = [];

        this.relationships.forEach(relationship => {
            // Update age for all relationships
            relationship.age++;
            
            if (!relationship.isFamily && !relationship.isMarried) {
                // Natural relationship decay
                relationship.level = Math.max(0, relationship.level - Utils.randomInt(5, 10));

                // Check for friendship loss
                if (relationship.type === Relationship.relationshipTypes.FRIEND && 
                    relationship.level < 25) {
                    const loseFriendChance = Math.random();
                    if (loseFriendChance < 0.4) {
                        relationshipsToRemove.push(relationship.name);
                        events.push(`You lost touch with ${relationship.name}.`);
                    }
                }
            }

            // Check for partner death
            if (relationship.type === Relationship.relationshipTypes.PARTNER) {
                const deathChance = this.calculatePartnerDeathChance(relationship.age);
                if (Math.random() < deathChance) {
                    relationshipsToRemove.push(relationship.name);
                    events.push(`Your partner ${relationship.name} has passed away due to natural causes.`);
                }
            }
        });

        // Remove lost relationships
        relationshipsToRemove.forEach(name => {
            this.removeRelationship(name);
        });

        return events;
    }
}