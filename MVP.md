# Life Simulator Game Development Plan

## Day 1: Basic Setup & Core Structures

**Objective**: Set up the initial project structure, game manager, and character stats framework.

### Tasks
1. **Set Up Project Directory and Files**
   - Create the basic file structure for the frontend (HTML, CSS, JavaScript).
   - Set up a simple UI layout using Bootstrap or Tailwind CSS (depending on preference).
   - Create empty `.js` files for the core game logic.

2. **Define Basic GameManager Class**
   - Initialize the `GameManager` class with core variables (`currentAge`, `isGameOver`, `characterStats`).
   - Implement the `startGame()` method to initialize the game state (starting age, default character stats, and life events).
   - Create basic functions for `progressTurn()` and `endGame()` (code later, leave empty for now).

3. **Define CharacterStats Class**
   - Create the `CharacterStats` class with variables (`happiness`, `health`, `wealth`, `relationships`, etc.).
   - Implement the `displayStats()` method to print the character's stats.
   - Add the `updateStats()` method for modifying stats based on events.

4. **Basic UI Rendering**
   - Set up a basic UI to show the current age, happiness, health, and wealth stats.

### Deliverables
- Basic file structure and initial game skeleton.
- A working `startGame()` that initializes the game state.
- Basic `CharacterStats` class with initial stats display.

---

## Day 2: Implementing Turn Progression & Age Management

**Objective**: Develop the `progressTurn()` method and age-related features in the game.

### Tasks
1. **Implement `progressTurn()` Method**
   - Increase the character's age by 1 year and trigger random life events.
   - Update stats (e.g., decrement health and happiness as the character ages).

2. **Add `adjustForAge()` Method in CharacterStats**
   - Modify this method to adjust health, happiness, and intelligence based on the character's age (e.g., health declines after age 50).

3. **Create Random Life Events**
   - Implement a basic `triggerRandomLifeEvent()` method to generate random events that affect the character's stats.
   - Example events: “get a new job,” “lose a friend,” or “fall ill.”

4. **Check Death Probability**
   - Add a simple death check that increases after age 70 based on `deathChance`.
   - Use `checkDeath()` to end the game if the character dies and prompt the player to continue as a child (if applicable).

5. **UI Update for Age Progression**
   - Ensure that the UI updates when the character ages, showing the new age and adjusted stats.

### Deliverables
- A working `progressTurn()` that increments age and triggers random events.
- Basic `checkDeath()` and `adjustForAge()` methods.
- Basic life events system with random events affecting the character.

---

## Day 3: Implementing Player Actions & Event Handling

**Objective**: Add player actions, interactive events, and the ability to make decisions based on life events.

### Tasks
1. **Define Action Class**
   - Create an `Action` class to represent player-selected actions, such as "go to the gym," "study," or "buy a pet."
   - Implement the `isAvailable()` method to determine if an action is available based on the player's age or other requirements (e.g., wealth, relationships).
   - Implement `executeAction()` to apply the effects of the chosen action on the character’s stats.

2. **Event Class for Player Decisions**
   - Implement the `Event` class to handle different types of events (e.g., random events, milestone events).
   - Add the `promptChoice()` and `applyChoiceEffect()` methods to allow players to make decisions (e.g., “take a risk” or “play it safe”).

3. **Integrate Actions and Events in the GameManager**
   - Modify the `chooseActions()` method to allow the player to select actions each turn.
   - Add a mechanism to trigger random events and prompt the player to make a choice during the turn.

4. **UI for Actions & Events**
   - Display available actions and options in the UI, along with buttons or choices for player interaction.

### Deliverables
- A working `Action` and `Event` system.
- A decision-making process integrated with the `GameManager`.
- A UI for displaying player actions and event choices.

---

## Day 4: Implementing Career, Relationships, and Pets

**Objective**: Add career progression, relationship management, and pet ownership.

### Tasks
1. **Career System**
   - Create the `Career` class, including properties like `jobTitle`, `salary`, and `jobSatisfaction`.
   - Implement methods like `promote()`, `quitJob()`, and `changeCareer()` to allow the player to change jobs or progress in their career.

2. **Relationship System**
   - Develop the `Relationship` class to track key relationships (e.g., friends, family).
   - Implement methods like `interact()` to strengthen relationships, and `resolveConflict()` to manage disputes (which could negatively affect happiness).

3. **Pets System**
   - Create the `Pet` class, allowing the player to adopt pets, interact with them, and track their bond level.
   - Add `interact()` and `agePet()` methods to simulate pet aging and companionship.

4. **Integrate Career, Relationships, and Pets with GameManager**
   - Allow the player to interact with these features during their turn, impacting stats like happiness, wealth, and health.
   - Add UI elements for the player to interact with their career, relationships, and pets.

### Deliverables
- A working Career system with progression options.
- A Relationship and Pet system with basic interactions.
- Integrated career, relationships, and pets into the main gameplay loop.

---

## Day 5: Save/Load Game, Final Tweaks & Polish

**Objective**: Implement game-saving functionality and make final adjustments to improve user experience.

### Tasks
1. **Implement Save/Load Functionality**
   - Use `localStorage` (or IndexedDB for more complex storage) to save the game state, allowing players to resume their progress later.
   - Implement the `saveGame()` method in the `GameManager` to save the current game state (`age`, `stats`, `events`, etc.).
   - Implement the `loadGame()` method to load a previously saved game state.

2. **Final UI Improvements**
   - Polish the UI, adding a clean layout for displaying stats, actions, events, career, relationships, and pets.
   - Add visual feedback for player decisions (e.g., pop-ups for events, action results).

3. **Final Bug Fixing & Polishing**
   - Fix any remaining bugs or inconsistencies in the game logic.
   - Make sure the game is smooth and user-friendly, with clear instructions and feedback.

4. **End Game Flow**
   - Finalize the `endGame()` method to summarize the player's life and achievements when the game ends.

### Deliverables
- Save/Load game functionality working.
- Polished UI with clear feedback for actions and decisions.
- A (hopefully) fully functioning game with integrated features (career, relationships, pets) and smooth end-game flow.
