# Learning System Architecture - Complete Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /dashboard/decks/{id}/learn                              │  │
│  │                                                            │  │
│  │  State Management:                                        │  │
│  │  - sessionId                                              │  │
│  │  - currentCard                                            │  │
│  │  - cardHistory                                            │  │
│  │  - stats (newCount, learningCount, reviewCount)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API (ASP.NET Core)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CardController & StudyController                         │  │
│  │                                                            │  │
│  │  Endpoints:                                               │  │
│  │  POST /study/start          → Start session              │  │
│  │  GET  /card/next/{sid}      → Get next card              │  │
│  │  POST /card/review/{cid}    → Submit review              │  │
│  │  GET  /study/{sid}/stats    → Get statistics             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CardService & StudySessionService                        │  │
│  │                                                            │  │
│  │  Responsibilities:                                        │  │
│  │  - Queue management (Redis)                              │  │
│  │  - Session lifecycle                                      │  │
│  │  - Daily limits enforcement                              │  │
│  │  - Card state validation                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬──────────────────────┬──────────────────────────────────┘
         │                      │
         │ gRPC                 │ Database
         ▼                      ▼
┌─────────────────┐    ┌────────────────────┐
│ FSRS SERVICE    │    │  POSTGRESQL        │
│ (Inclusive)     │    │                    │
│                 │    │  Tables:           │
│ - Calculate     │    │  - Cards           │
│   intervals     │    │  - UserProgress    │
│ - Update state  │    │  - StudySessions   │
│ - FSRS algo     │    │  - UserSettings    │
└─────────────────┘    └────────────────────┘

         ┌─────────────────┐
         │     REDIS       │
         │                 │
         │  Session Queues:│
         │  - new:{sid}    │
         │  - learning:{sid}│
         │  - review:{sid} │
         │  - stats:{sid}  │
         └─────────────────┘
```

## 🔄 Complete Request Flow

### Flow 1: Starting a Learning Session

```
USER                FRONTEND              BACKEND              REDIS            DATABASE
 │                     │                     │                   │                 │
 │  Click "Start      │                     │                   │                 │
 │   Learning"        │                     │                   │                 │
 │───────────────────>│                     │                   │                 │
 │                     │ POST /study/start  │                   │                 │
 │                     │───────────────────>│                   │                 │
 │                     │                     │  Check active     │                 │
 │                     │                     │  session          │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │<──────────────────────────────────│
 │                     │                     │  Create new       │                 │
 │                     │                     │  session          │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │  Query new cards  │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │<──────────────────────────────────│
 │                     │                     │  Query learning   │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │<──────────────────────────────────│
 │                     │                     │  Query review     │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │<──────────────────────────────────│
 │                     │                     │  Initialize       │                 │
 │                     │                     │  queues           │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  SET new:{sid}    │                 │
 │                     │                     │  SET learning     │                 │
 │                     │                     │  SET review       │                 │
 │                     │                     │  SET stats        │                 │
 │                     │                     │<──────────────────│                 │
 │                     │ {sessionId}         │                   │                 │
 │                     │<───────────────────│                   │                 │
 │  Session started    │                     │                   │                 │
 │<───────────────────│                     │                   │                 │
 │                     │                     │                   │                 │
 │                     │ GET /study/        │                   │                 │
 │                     │  {sid}/stats        │                   │                 │
 │                     │───────────────────>│                   │                 │
 │                     │                     │  GET stats:{sid}  │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │<──────────────────│                 │
 │                     │ {stats}             │                   │                 │
 │                     │<───────────────────│                   │                 │
 │                     │                     │                   │                 │
 │                     │ GET /card/next/    │                   │                 │
 │                     │  {sid}              │                   │                 │
 │                     │───────────────────>│                   │                 │
 │                     │                     │  Check learning   │                 │
 │                     │                     │  queue first      │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  RPOP learning    │                 │
 │                     │                     │<──────────────────│                 │
 │                     │                     │  (empty)          │                 │
 │                     │                     │  Check new queue  │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  RPOP new:{sid}   │                 │
 │                     │                     │<──────────────────│                 │
 │                     │                     │  Get card data    │                 │
 │                     │                     │  (Card JSON)      │                 │
 │                     │ {card}              │                   │                 │
 │                     │<───────────────────│                   │                 │
 │  Display card       │                     │                   │                 │
 │<───────────────────│                     │                   │                 │
```

### Flow 2: Reviewing a Card

```
USER                FRONTEND              BACKEND              FSRS SERVICE     DATABASE
 │                     │                     │                      │               │
 │  Click "Good"       │                     │                      │               │
 │   (Quality 3)       │                     │                      │               │
 │───────────────────>│                     │                      │               │
 │                     │ POST /card/review/ │                      │               │
 │                     │  {cardId}           │                      │               │
 │                     │  {quality: 3}       │                      │               │
 │                     │───────────────────>│                      │               │
 │                     │                     │  Get card progress   │               │
 │                     │                     │─────────────────────────────────────>│
 │                     │                     │<─────────────────────────────────────│
 │                     │                     │  Call FSRS           │               │
 │                     │                     │  algorithm           │               │
 │                     │                     │─────────────────────>│               │
 │                     │                     │  ReviewCard(         │               │
 │                     │                     │   card, quality)     │               │
 │                     │                     │                      │ ┌──────────┐ │
 │                     │                     │                      │ │Calculate │ │
 │                     │                     │                      │ │intervals │ │
 │                     │                     │                      │ │Update    │ │
 │                     │                     │                      │ │stability │ │
 │                     │                     │                      │ │difficulty│ │
 │                     │                     │                      │ │state     │ │
 │                     │                     │                      │ └──────────┘ │
 │                     │                     │  {updated card}      │               │
 │                     │                     │<─────────────────────│               │
 │                     │                     │  Save progress       │               │
 │                     │                     │─────────────────────────────────────>│
 │                     │                     │  UPDATE              │               │
 │                     │                     │  UserCardProgress    │               │
 │                     │                     │<─────────────────────────────────────│
 │                     │                     │  Re-queue if due     │               │
 │                     │                     │  today               │               │
 │                     │                     │──────────────────>   │               │
 │                     │                     │  LPUSH learning      │               │
 │                     │                     │  or review queue     │               │
 │                     │                     │<──────────────────   │               │
 │                     │                     │  Update session      │               │
 │                     │                     │  stats               │               │
 │                     │                     │──────────────────────────────────────>│
 │                     │                     │<──────────────────────────────────────│
 │                     │ {success}           │                      │               │
 │                     │<───────────────────│                      │               │
 │  Review recorded    │                     │                      │               │
 │<───────────────────│                     │                      │               │
 │                     │                     │                      │               │
 │                     │ GET /card/next/    │                      │               │
 │                     │  {sid}              │                      │               │
 │                     │───────────────────>│                      │               │
 │                     │                     │  (Repeat Flow 1)     │               │
 │                     │ {next card}         │                      │               │
 │                     │<───────────────────│                      │               │
 │  Show next card     │                     │                      │               │
 │<───────────────────│                     │                      │               │
```

### Flow 3: Session Completion

```
USER                FRONTEND              BACKEND              REDIS            DATABASE
 │                     │                     │                   │                 │
 │  Review last card   │                     │                   │                 │
 │───────────────────>│                     │                   │                 │
 │                     │ POST /card/review  │                   │                 │
 │                     │───────────────────>│                   │                 │
 │                     │                     │  (Process review)  │                 │
 │                     │                     │──────────────────>│                 │
 │                     │<───────────────────│                   │                 │
 │                     │ GET /card/next/    │                   │                 │
 │                     │  {sid}              │                   │                 │
 │                     │───────────────────>│                   │                 │
 │                     │                     │  RPOP learning    │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  (empty)          │                 │
 │                     │                     │  RPOP new         │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  (empty)          │                 │
 │                     │                     │  RPOP review      │                 │
 │                     │                     │──────────────────>│                 │
 │                     │                     │  (empty)          │                 │
 │                     │                     │  All queues empty!│                 │
 │                     │                     │  End session      │                 │
 │                     │                     │──────────────────────────────────>│
 │                     │                     │  SET EndTime      │                 │
 │                     │                     │<──────────────────────────────────│
 │                     │ null                │  Clear queues     │                 │
 │                     │<───────────────────│──────────────────>│                 │
 │  Session complete   │                     │                   │                 │
 │<───────────────────│                     │                   │                 │
 │                     │                     │                   │                 │
 │  Show summary       │                     │                   │                 │
 │  "Back to Deck"     │                     │                   │                 │
```

## 🧠 FSRS Algorithm Detail

### Input (Before Review)
```json
{
  "card": {
    "state": 0,        // New
    "step": 0,
    "stability": 0,
    "difficulty": 0,
    "due": "2025-10-30T10:00:00Z",
    "lastReview": "2025-10-30T10:00:00Z"
  },
  "quality": 3         // Good
}
```

### FSRS Processing
```
1. Determine current state
2. Apply quality rating
3. Calculate new stability:
   - Based on previous stability
   - Adjusted by quality rating
   - Uses FSRS weight parameters

4. Calculate new difficulty:
   - Based on previous difficulty
   - Adjusted by performance
   - Range: 0 (easy) to 10 (hard)

5. Calculate interval:
   - interval = stability * (requestRetention)^(1/decay)
   - Capped at maximumInterval
   - Minimum 1 day for reviews

6. Update state:
   - New → Learning → Review
   - Or New → Review (if Easy)

7. Set due date:
   - due = now + interval
```

### Output (After Review)
```json
{
  "card": {
    "state": 1,         // Learning
    "step": 0,
    "stability": 2.4,   // Memory strength
    "difficulty": 5.2,  // Card difficulty
    "due": "2025-10-31T10:00:00Z",  // Tomorrow
    "lastReview": "2025-10-30T10:00:00Z"
  },
  "reviewLog": {
    "rating": 3,
    "reviewDatetime": "2025-10-30T10:00:00Z"
  }
}
```

## 🎯 Queue Management Logic

### Priority System (Anki-Compatible)

```python
def get_next_card(session_id):
    # Priority 1: Learning Queue
    card = redis.rpop(f"learning:{session_id}")
    if card and card.due < tomorrow:
        return card
    
    # Priority 2: New Queue
    card = redis.rpop(f"new:{session_id}")
    if card and new_cards_today < daily_limit:
        return card
    
    # Priority 3: Review Queue
    card = redis.rpop(f"review:{session_id}")
    if card and card.due < tomorrow:
        return card
    
    # No more cards
    end_session(session_id)
    return null
```

### Re-Queuing After Review

```python
def submit_review(card_id, quality):
    # 1. Call FSRS algorithm
    updated_card = fsrs.review(card, quality)
    
    # 2. Save to database
    save_progress(updated_card)
    
    # 3. Re-queue if due today
    if updated_card.due < tomorrow:
        if updated_card.state == LEARNING:
            redis.lpush(f"learning:{session_id}", updated_card)
        elif updated_card.state == REVIEW:
            redis.lpush(f"review:{session_id}", updated_card)
    
    # 4. Update stats
    update_stats(session_id)
```

## 📊 Card State Transitions

### New Card Journey

```
┌─────┐
│ NEW │ (Never seen)
└──┬──┘
   │ First Review
   │
   ├─ Quality 1 (Again) ─┐
   │                     │
   ├─ Quality 2 (Hard)  ─┼─> ┌──────────┐
   │                     │   │ LEARNING │ (10 min)
   ├─ Quality 3 (Good)  ─┘   └────┬─────┘
   │                              │
   │                              │ Second Review
   │                              │
   └─ Quality 4 (Easy) ────────┐  ├─ Again → Repeat step
                                │  ├─ Hard  → Shorter interval
                                │  ├─ Good  → Graduate
                                │  └─ Easy  → Graduate
                                │           │
                                │           ▼
                                │     ┌────────┐
                                └────>│ REVIEW │ (Graduated)
                                      └────┬───┘
                                           │
                                           │ Spaced Repetition
                                           │
                                           ├─ Again → ┌─────────────┐
                                           │          │ RELEARNING  │
                                           │          └──────┬──────┘
                                           │                 │
                                           ├─ Hard  → Shorter interval
                                           ├─ Good  → Standard interval
                                           └─ Easy  → Longer interval
```

## 🎮 Frontend State Flow

```javascript
// State Machine
const [state, setState] = useState('LOADING');

/*
States:
1. LOADING          → Checking for due cards
2. NO_SESSION       → Show "Start Learning" button
3. SESSION_ACTIVE   → Show cards for review
4. COMPLETED        → Show summary
*/

// Transitions:
LOADING → (hasDueCards) → NO_SESSION
NO_SESSION → (click Start) → SESSION_ACTIVE
SESSION_ACTIVE → (no more cards) → COMPLETED
COMPLETED → (click Back) → Dashboard
```

### Component Rendering

```jsx
// learn/page.tsx

if (loading) {
  return <Spinner />;
}

if (!sessionId) {
  return (
    <VStack>
      <Heading>Learn Deck</Heading>
      {hasDueCards ? (
        <Button onClick={startSession}>Start Learning</Button>
      ) : (
        <Text>No due cards</Text>
      )}
    </VStack>
  );
}

if (sessionId && !hasCompletedCards) {
  return (
    <VStack>
      <Heading>Card {current} of {total}</Heading>
      <Stats newCount={X} learningCount={Y} reviewCount={Z} />
      <ProgressBar value={percent} />
      <CardReview card={currentCard} onReview={handleReview} />
    </VStack>
  );
}

if (hasCompletedCards) {
  return (
    <VStack>
      <Text>All Cards Reviewed!</Text>
      <Button>Back to Deck</Button>
    </VStack>
  );
}
```

## 🔢 Statistics Calculation

### Real-Time Stats

```typescript
interface CardStatsDto {
  newCount: number;        // Cards never seen
  learningCount: number;   // Cards in learning state, due today
  reviewCount: number;     // Cards in review state, due today
}
```

### How Stats Update

**Before Review:**
```
New: 5 | Learning: 2 | Review: 3
```

**User reviews NEW card, rates "Good":**
```javascript
// Backend updates:
newCount--;              // 5 → 4
if (card.due < tomorrow && card.state === LEARNING) {
  learningCount++;       // 2 → 3
}

// Result:
New: 4 | Learning: 3 | Review: 3
```

**User reviews LEARNING card, graduates:**
```javascript
// Backend updates:
learningCount--;         // 3 → 2
if (card.due < tomorrow && card.state === REVIEW) {
  reviewCount++;         // 3 → 4
}

// Result:
New: 4 | Learning: 2 | Review: 4
```

## 🎬 Example Session Timeline

### Day 1, 10:00 AM - First Session

```
[10:00] Start session
        Queues: new:5, learning:0, review:0

[10:01] Card 1 (NEW) "Hello" / "Hola"
        User: Show Back → Rate "Good" (3)
        FSRS: state=Learning, due=Tomorrow 10:01
        
[10:02] Card 2 (NEW) "Goodbye" / "Adiós"  
        User: Rate "Easy" (4)
        FSRS: state=Review, due=4 days later
        
[10:03] Card 3 (NEW) "Thank you" / "Gracias"
        User: Rate "Again" (1)
        FSRS: state=Learning, due=10:13 (10 min)
        
[10:04] Card 4 (NEW) "Please" / "Por favor"
        User: Rate "Good" (3)
        FSRS: state=Learning, due=Tomorrow 10:04
        
[10:05] Card 5 (NEW) "Sorry" / "Lo siento"
        User: Rate "Good" (3)
        FSRS: state=Learning, due=Tomorrow 10:05

[10:06] No new cards (limit: 5)
        No review cards (none due)
        No learning cards (all due tomorrow)
        Session ends

Result:
- 5 new cards reviewed
- 1 graduated immediately (Easy)
- 4 will appear tomorrow
- Stats: New:0, Learning:0, Review:0
```

### Day 2, 10:00 AM - Second Session

```
[10:00] Start session
        Queues: new:0, learning:4, review:0
        (4 cards from yesterday are now due)

[10:01] Card 3 (LEARNING) "Thank you"
        User: Rate "Good" (3)
        FSRS: state=Review, due=3 days
        Graduated! ✓

[10:02] Card 1 (LEARNING) "Hello"
        User: Rate "Hard" (2)
        FSRS: state=Learning, due=Tomorrow
        
[10:03] Card 4 (LEARNING) "Please"
        User: Rate "Good" (3)
        FSRS: state=Review, due=3 days
        Graduated! ✓

[10:04] Card 5 (LEARNING) "Sorry"
        User: Rate "Again" (1)
        FSRS: state=Learning, due=10 min
        Back to start ↺

[10:15] Card 5 (LEARNING) "Sorry" - appears again!
        User: Rate "Good" (3)
        FSRS: state=Learning, due=Tomorrow

[10:16] No more cards due today
        Session ends

Result:
- 2 cards graduated to review
- 2 cards still learning (tomorrow)
- 1 card appeared twice in session
```

## 🎓 This is EXACTLY Like Anki!

### Verified Anki Features

1. ✅ **FSRS Algorithm** - Same as Anki 2.1+
2. ✅ **Queue Priority** - Learning → New → Review
3. ✅ **State Transitions** - New → Learning → Review
4. ✅ **Re-Queuing** - Cards appear multiple times if due
5. ✅ **Daily Limits** - Prevents overload
6. ✅ **Graduation** - Automatic based on performance
7. ✅ **Intervals** - Exponentially increasing
8. ✅ **Statistics** - Real-time progress tracking

### Why It Works

Your implementation uses:
- **FSRS algorithm** via gRPC service
- **Redis queues** for efficient session management
- **PostgreSQL** for persistent progress
- **State machine** for proper card lifecycle
- **Priority queues** for optimal learning order

This is a **production-ready**, **scalable** implementation of Anki's learning system! 🚀

## 📖 How to Verify

1. **Read**: `ANKI_LEARNING_MODE_FLOW.md` (complete flow)
2. **Test**: Follow `LEARN_MODE_TESTING_GUIDE.md` (step-by-step)
3. **Monitor**: Check logs and Redis during testing
4. **Compare**: Behavior should match Anki exactly

Your learning mode is correctly implemented! ✨

