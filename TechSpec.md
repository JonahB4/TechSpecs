# Bit Life Simulator - Technical Specification

## Link to Figma Sheet
[BitLife Simulation Figma Sheet](https://www.figma.com/board/ux830q1zYMQlJXrDImceM6/BitLife-Simulation-Figma-Sheet?node-id=0-1)


## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (or TypeScript)
- **Framework Options:** Phaser for interactive 2D scenes, or Vanilla JavaScript for simpler interface needs.
- **UI Library:** Bootstrap or Tailwind CSS for responsive layout (if needed).
- **Backend:** Node.js (optional for server-based saving of player progress or multiplayer features)
- **Database:** Firebase or IndexedDB for local storage of player life data.

---

## Architecture

### 1. GameManager
Manages the core flow of each turn, tracks player stats, and handles yearly actions and age progression.

#### Variables
- `currentAge`: *int* - Current age of the character.
- `isGameOver`: *boolean* - Indicates if the game has ended.
- `characterStats`: *CharacterStats* - Instance of CharacterStats (nested) to store and update character life stats.
- `lifeEvents`: *List<Event>* - History of events that have occurred.
- `randomEventQueue`: *List<Event>* - Queue for unexpected life events triggered at random.
- `choicesPerTurn`: *int* - Number of actions the player can take per turn.

#### Methods
- **startGame**
  - **Behavior:** Initializes a new game with a character at age 0, default stats, and an empty life event history.

- **progressTurn**
  - **Behavior:** Increases age by one year, triggers random events, allows player actions, and checks game-ending conditions.

- **applyEvent**
  - **Input:** *Event event*
  - **Behavior:** Applies the consequences of an event to character stats.

- **chooseActions**
  - **Input:** *List<Action>* - List of actions chosen by the player.
  - **Behavior:** Executes chosen actions, updating stats and adding results to the life events log.

- **endGame**
  - **Behavior:** Summarizes life events and achievements upon reaching a certain age or condition, marking `isGameOver` as true.

- **saveGame**
  - **Behavior:** Saves current game state to local storage or database for later continuation.

---

### 2. CharacterStats
Tracks and updates all character-related stats, handles changes based on age, and displays a summary of stats.

#### Variables
- `happiness`: *float* - Tracks the character’s happiness level.
- `health`: *float* - Current health status.
- `intelligence`: *float* - Intelligence level, affected by education.
- `wealth`: *float* - Total wealth, affected by career and financial decisions.
- `relationships`: *Dict<String, int>* - Relationship strength with key family and friends.
- `reputation`: *int* - Social reputation, affected by community actions.

#### Methods
- **updateStats**
  - **Input:** *Event event*
  - **Behavior:** Modifies stats based on the effect of a given event.

- **displayStats**
  - **Behavior:** Outputs a summary of all current stats to the main interface.

- **adjustForAge**
  - **Input:** *int newAge*
  - **Behavior:** Adjusts specific stats to reflect typical age-related changes, like health decline in older age.

- **calculateNetWorth**
  - **Output:** *float* - Returns an updated value for wealth based on income, spending, and assets.

---

### 3. Event
Handles the different types of events (random, age-based, action-based) that affect the player’s stats and choices.

#### Variables
- `type`: *enum* - Type of event (e.g., "random", "action", "milestone").
- `description`: *String* - Description of the event.
- `effects`: *Dict<String, int>* - Effects on CharacterStats (e.g., `{"happiness": +5, "wealth": -20}`).
- `requiresChoice`: *boolean* - If true, player needs to make a decision for this event.
- `options`: *List<String>* - Options for events requiring player choice.

#### Methods
- **triggerEvent**
  - **Behavior:** Applies effects to CharacterStats based on the type and description of the event.

- **promptChoice**
  - **Output:** *String* - Returns a list of options for the player if the event requires a decision.

- **applyChoiceEffect**
  - **Input:** *String choice*
  - **Behavior:** Applies a different set of effects based on the choice made by the player.

---

### 4. Action
Represents player-selected actions in each turn and provides a variety of age-appropriate choices.

#### Variables
- `actionType`: *enum* - Type of action (e.g., "Social", "Career", "Risky").
- `ageRange`: *Range* - Specifies ages when this action is available.
- `requirements`: *Dict<String, int>* - Minimum requirements to perform the action (e.g., certain wealth or reputation level).
- `effects`: *Dict<String, int>* - Effects on CharacterStats if the action is chosen.

#### Methods
- **executeAction**
  - **Behavior:** Executes the action, applying its effects to the player’s stats.

- **isAvailable**
  - **Output:** *boolean* - Checks if the action is available to the player based on age and requirements.

- **getEffectDescription**
  - **Output:** *String* - Returns a description of the effects of the action.
