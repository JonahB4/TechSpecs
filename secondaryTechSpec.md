# Bit Life Simulator - Secondary Technical Specification

This document outlines features that were not specifically mentioned in MVP.md, that are most likely not essential to gameplay, but, time permitting, will improve the overall experience.

---

## **1. Expanded Event System**
Enhancements to the `Event` class to add more variety and decision-making complexity.

### **Variables**
- **type**: *enum*  
  Differentiates between event categories:
  - `"random"`: Triggered unpredictably.
  - `"action"`: Related to player-chosen actions.
  - `"milestone"`: Based on significant life stages (e.g., graduation, retirement).

- **effects**: *Dict<String, int>*  
  Specifies stat changes (e.g., `{"happiness": +5, "wealth": -20}`).

- **requiresChoice**: *boolean*  
  Indicates whether the event requires a player decision.

- **options**: *List<String>*  
  List of available decisions if `requiresChoice` is `true`.

### **Methods**
- **triggerEvent**  
  - **Behavior:** Applies event effects or prompts a decision if `requiresChoice` is true.

- **promptChoice**  
  - **Output:** *String*  
    Returns decision options for events requiring input.

- **applyChoiceEffect**  
  - **Input:** *String choice*  
  - **Behavior:** Applies stat changes based on the selected choice.

---

## **2. Expanded Action System**
Additional functionality for the `Action` class to add depth to player-selected actions.

### **Variables**
- **ageRange**: *Range*  
  Specifies ages when an action is available (e.g., `"16-65"` for working a job).

- **requirements**: *Dict<String, int>*  
  Minimum conditions to perform the action (e.g., wealth, reputation).

### **Methods**
- **isAvailable**  
  - **Output:** *boolean*  
    Returns whether the action is available based on age and requirements.

- **getEffectDescription**  
  - **Output:** *String*  
    Returns a detailed description of the action’s potential effects.

---

## **3. Children & Succession System**
Enables the game to continue with the player’s children after death.

### **GameManager Updates**
- **children**: *List<CharacterStats>*  
  Stores stats for the character's children.

- **chooseNextCharacter**  
  - **Behavior:** Allows the player to continue the game as one of their children upon death.

---

## **4. Reputation System**
Adds a new stat to track social standing and its effects on gameplay.

### **CharacterStats Update**
- **reputation**: *int*  
  Represents the character's social reputation.

### **Event Interaction**
- Reputation affects outcomes of certain events (e.g., high reputation might mitigate the negative effects of a scandal).

---

## **5. Pet System**
Introduces the ability for players to adopt, care for, and interact with pets.

### **Pet Class**
#### **Variables**
- **type**: *String*  
  Type of pet (e.g., `"dog"`, `"cat"`).

- **age**: *int*  
  The pet's age in years.

- **health**: *float*  
  The pet's health status.

- **bondLevel**: *int*  
  Represents the relationship strength between the character and the pet.

#### **Methods**
- **interact**  
  - **Behavior:** Boosts bond level and character happiness.

- **agePet**  
  - **Behavior:** Ages the pet and adjusts health over time.

---

## **6. Career System**
Adds in-depth career management and progression.

### **Career Class**
#### **Variables**
- **jobTitle**: *String*  
  Current job title of the character.

- **salary**: *float*  
  Current income from the job.

- **jobSatisfaction**: *int*  
  A measure of how content the character is in their career.

#### **Methods**
- **promote**  
  - **Behavior:** Increases salary and satisfaction based on performance.

- **quitJob**  
  - **Behavior:** Allows the player to leave their current job, affecting wealth and happiness.

- **changeCareer**  
  - **Behavior:** Enables the player to switch careers, resetting job title and satisfaction.

---

## **7. Relationship System**
Tracks and manages social connections with other characters.

### **Relationship Class**
#### **Variables**
- **name**: *String*  
  Name of the individual.

- **relationType**: *String*  
  Type of relationship (e.g., `"friend"`, `"partner"`, `"child"`).

- **relationshipLevel**: *int*  
  Represents the strength of the relationship.

#### **Methods**
- **interact**  
  - **Behavior:** Boosts relationship level and happiness.

- **resolveConflict**  
  - **Behavior:** Reduces conflict, restoring or boosting relationship strength.

---

## **8. Stat Calculation Enhancements**
Enhances the `CharacterStats` class with additional methods.

### **Methods**
- **calculateNetWorth**  
  - **Output:** *float*  
    Computes wealth based on income, assets, and spending.

- **adjustForAge**  
  - **Behavior:** Alters stats to reflect age-related changes, including health decline and decreased productivity.

---

## **Summary**
These additional features and systems expand the gameplay, introducing new dimensions of depth and realism to the simulation. Integrating them into the game ensures a more engaging and dynamic experience for players.
