# Anki-Style Learning Mode - Complete Flow Documentation

## Overview

Your application implements a spaced repetition system similar to Anki using the **FSRS (Free Spaced Repetition Scheduler)** algorithm. This document traces the complete flow.

## Card States (Like Anki)

```
State.New (0)        → Never seen before
State.Learning (1)   → Currently learning (shown multiple times in session)
State.Review (2)     → Graduated to review (spaced repetition)
State.Relearning (3) → Failed card, relearning
```

## Quality Ratings (Anki-Compatible)

```
Rating.Again (1) → Completely forgot, restart learning
Rating.Hard (2)  → Difficult to remember, shorter interval
Rating.Good (3)  → Remembered well, standard interval
Rating.Easy (4)  → Very easy, longer interval
```

## Complete Learning Flow

### 1. Session Initialization (`POST /api/v1/study/start`)

```
┌─────────────────────────────────────────────────────┐
│ START SESSION                                       │
├─────────────────────────────────────────────────────┤
│ 1. Check for existing active session                │
│ 2. End it if found                                  │
│ 3. Reset daily counters if new day                  │
│ 4. Create new session in database                   │
│ 5. Calculate remaining card limits:                 │
│    - newCardsRemaining = limit - completed          │
│    - reviewsRemaining = limit - completed           │
│ 6. Fetch cards:                                     │
│    a) New cards (never studied)                     │
│    b) Learning cards (in learning state, due today) │
│    c) Review cards (graduated, due today)           │
│ 7. Initialize Redis queues:                         │
│    - new:{sessionId}      → New cards               │
│    - learning:{sessionId} → Learning cards          │
│    - review:{sessionId}   → Review cards            │
│ 8. Store stats in Redis                             │
│ 9. Return sessionId                                 │
└─────────────────────────────────────────────────────┘
```

**Backend Implementation:**
```csharp
// StudySessionService.cs - StartSessionAsync()
var session = new StudySession {
    Id = Guid.NewGuid(),
    UserId = userId,
    DeckId = deckId,
    StartTime = DateTime.UtcNow
};

// Fetch cards with proper limits
var newCards = await GetNewCards(deckId, newCardsRemaining);
var (learningCards, reviewCards, learningDueTimes) = 
    await FetchLearningAndReviewCards(userId, deckId, reviewsRemaining);

// Initialize Redis queues
await InitializeQueuesAsync(sessionId, newCards, learningCards, reviewCards);
```

### 2. Get Next Card (`GET /api/v1/card/next/{sessionId}`)

```
┌─────────────────────────────────────────────────────┐
│ GET NEXT CARD - Priority Order (Like Anki)         │
├─────────────────────────────────────────────────────┤
│ Priority 1: LEARNING queue                          │
│  → Cards in learning state, due soon               │
│  → Need multiple reviews before graduation         │
│                                                      │
│ Priority 2: NEW queue                               │
│  → Brand new cards never seen                       │
│  → Limited by daily new card limit                  │
│                                                      │
│ Priority 3: REVIEW queue                            │
│  → Graduated cards due for review                   │
│  → Spaced repetition interval                       │
│                                                      │
│ If all queues empty: Return null (session complete) │
└─────────────────────────────────────────────────────┘
```

**Backend Implementation:**
```csharp
// StudySessionService.cs - GetNextCardAsync()

// 1. Check learning queue first (highest priority)
var learningCardJson = await _redisDb.ListRightPopAsync($"learning:{sessionId}");
if (learningCardJson exists && card is due today) {
    return card;
}

// 2. Check new queue second
var newCardJson = await _redisDb.ListRightPopAsync($"new:{sessionId}");
if (newCardJson exists && within daily limit) {
    return card;
}

// 3. Check review queue last
var reviewCardJson = await _redisDb.ListRightPopAsync($"review:{sessionId}");
if (reviewCardJson exists and due today) {
    return card;
}

// 4. No more cards - end session
session.EndTime = DateTime.UtcNow;
return null;
```

### 3. Review Card (`POST /api/v1/card/review/{cardId}`)

```
┌─────────────────────────────────────────────────────┐
│ REVIEW CARD - FSRS Algorithm                       │
├─────────────────────────────────────────────────────┤
│ 1. Validate quality rating (1-4)                    │
│ 2. Check daily limits                               │
│ 3. Verify card is due today                         │
│ 4. Get or create card progress                      │
│ 5. Call gRPC FSRS service:                          │
│    → Input: Current card state + quality            │
│    → Algorithm: Calculate next interval             │
│    → Output: Updated card state                     │
│ 6. Update card state in database:                   │
│    - Due date (next review)                         │
│    - Stability (memory strength)                    │
│    - Difficulty (card difficulty)                   │
│    - Reps (number of reviews)                       │
│    - State (New/Learning/Review/Relearning)         │
│ 7. Update session stats                             │
│ 8. Re-queue card if due today:                      │
│    - If still Learning → learning queue             │
│    - If graduated to Review → review queue          │
│ 9. Increment daily counters                         │
│10. Return updated card                              │
└─────────────────────────────────────────────────────┘
```

**Backend Implementation:**
```csharp
// CardService.cs - SubmitReviewAsync()

// Create progress for new cards
if (isNewCard) {
    progress = new UserCardProgress(userId, cardId);
    progress.State = State.Learning;
}

// Call FSRS algorithm via gRPC
var reviewRequest = new ReviewRequest {
    Card = MapToProto(progress),
    Quality = request.Quality
};
var reviewResponse = await _vocabServiceClient.ReviewCardAsync(reviewRequest);

// Update progress with FSRS results
progress.Due = reviewResponse.Card.Due;
progress.Stability = reviewResponse.Card.Stability;
progress.Difficulty = reviewResponse.Card.Difficulty;
progress.State = reviewResponse.Card.State;

// Re-queue if due today
if (progress.Due < tomorrow) {
    if (progress.State == State.Learning) {
        await _redisDb.ListLeftPushAsync($"learning:{sessionId}", card);
    } else if (progress.State == State.Review) {
        await _redisDb.ListLeftPushAsync($"review:{sessionId}", card);
    }
}
```

### 4. Session Stats (`GET /api/v1/study/{sessionId}/stats`)

```
┌─────────────────────────────────────────────────────┐
│ SESSION STATS - Real-time Progress                 │
├─────────────────────────────────────────────────────┤
│ Returns:                                            │
│ - newCount: Cards never seen                        │
│ - learningCount: Cards in learning phase            │
│ - reviewCount: Cards due for review                 │
│                                                      │
│ Cached in Redis for performance                     │
│ Updated after each review                           │
└─────────────────────────────────────────────────────┘
```

## FSRS Algorithm (Like Anki 2.1+)

### Key Concepts

**1. Stability** - How well you know the card
- Higher = longer intervals
- Increases with successful reviews
- Decreases on failures

**2. Difficulty** - How hard the card is
- Based on your performance history
- Affects future interval calculations
- Range: 0 (easy) to 10 (hard)

**3. States & Transitions**

```
NEW
 ↓ (first review)
LEARNING ←→ RELEARNING
 ↓ (graduated)      ↑
REVIEW ─────────────┘
 (if failed)
```

### Learning Phase (Like Anki)

**New Card First Review:**
```
Rating.Again → Learning (10 min)
Rating.Hard  → Learning (10 min)
Rating.Good  → Learning (1 day)
Rating.Easy  → Review (4 days) [graduate immediately]
```

**Learning Card Reviews:**
```
Rating.Again → Back to step 1
Rating.Hard  → Same step, shorter interval
Rating.Good  → Next step or graduate
Rating.Easy  → Graduate to Review
```

**Graduation:**
- Card moves from Learning → Review
- Enters spaced repetition schedule
- Intervals: 1d → 3d → 7d → 14d → 30d → etc.

### Review Phase (Spaced Repetition)

**Interval Calculation:**
```
Again: Reset to Learning
Hard:  Interval * 0.5
Good:  Interval * Stability factor
Easy:  Interval * Stability factor * 1.3
```

## Frontend Flow

### 1. Page Load
```typescript
// learn/page.tsx

useEffect(() => {
  // 1. Resolve deckId from params
  // 2. Fetch user settings
  // 3. Check if deck has due cards
  // 4. Display "Start Learning" button
}, [deckId]);
```

### 2. Start Session
```typescript
const startSession = async () => {
  // 1. POST /study/start
  const { sessionId } = await fetchApi("/study/start", {
    body: { deckId }
  });
  
  // 2. Fetch session stats
  const stats = await fetchApi(`/study/${sessionId}/stats`);
  
  // 3. Get first card
  const card = await fetchApi(`/card/next/${sessionId}`);
  
  // 4. Display card
  setCurrentCard(card);
};
```

### 3. Review Loop
```typescript
const handleReview = async (quality: 1|2|3|4) => {
  // 1. Submit review
  await fetchApi(`/card/review/${cardId}`, {
    method: "POST",
    body: { quality }
  });
  
  // 2. Update stats
  const stats = await fetchApi(`/study/${sessionId}/stats`);
  
  // 3. Get next card
  const nextCard = await fetchApi(`/card/next/${sessionId}`);
  
  if (nextCard) {
    // 4. Show next card
    setCurrentCard(nextCard);
  } else {
    // 5. Session complete
    setHasCompletedCards(true);
  }
};
```

### 4. Session Complete
```typescript
// When no more cards:
// 1. Display completion message
// 2. Show session summary
// 3. Provide "Back to Deck" button
```

## Redis Queue Management

### Data Structures

```
new:{sessionId}       → List of new cards (FIFO)
learning:{sessionId}  → List of learning cards (FIFO)
review:{sessionId}    → List of review cards (FIFO)
stats:{sessionId}     → Cached session statistics
```

### Queue Operations

**Pop (Get Next):**
```csharp
// LIFO (last in, first out) for most recent cards
var card = await _redisDb.ListRightPopAsync($"learning:{sessionId}");
```

**Push (Re-queue):**
```csharp
// FIFO (first in, first out) for older cards
await _redisDb.ListLeftPushAsync($"learning:{sessionId}", cardJson);
```

**Why This Order?**
- Right Pop + Left Push = Cards cycle through queue
- Recent reviews come back first if due soon
- Mimics Anki's learning queue behavior

## Comparison with Anki

| Feature | Anki | Your App | Status |
|---------|------|----------|--------|
| FSRS Algorithm | ✅ v5.0 | ✅ FSRS | ✅ Match |
| Card States | ✅ 4 states | ✅ 4 states | ✅ Match |
| Quality Ratings | ✅ 1-4 | ✅ 1-4 | ✅ Match |
| Learning Queue Priority | ✅ Highest | ✅ Highest | ✅ Match |
| New Cards Second | ✅ Yes | ✅ Yes | ✅ Match |
| Review Cards Last | ✅ Yes | ✅ Yes | ✅ Match |
| Daily Limits | ✅ Yes | ✅ Yes | ✅ Match |
| Rollover Hour | ✅ Yes | ✅ Yes | ✅ Match |
| Session Stats | ✅ Yes | ✅ Yes | ✅ Match |
| Graduation | ✅ Auto | ✅ Auto | ✅ Match |

## Key Differences from Basic Anki

### Advantages

1. **Microservice Architecture**
   - FSRS in separate gRPC service
   - Scalable and maintainable

2. **Redis-Based Queues**
   - Fast session management
   - Handles concurrent users

3. **Daily Limits**
   - Prevents burnout
   - Configurable per user

4. **Multi-Deck Support**
   - Single session per deck
   - Better organization

### Architecture Benefits

```
Frontend (Next.js)
    ↓ HTTP/REST
Backend API (ASP.NET)
    ↓ gRPC
FSRS Service (Inclusive)
    ↓
Returns: Updated Card State
```

## Testing Checklist

### ✅ Card Flow
- [ ] New card shows first time
- [ ] Quality 1 (Again) keeps in learning
- [ ] Quality 3 (Good) graduates after steps
- [ ] Quality 4 (Easy) graduates immediately
- [ ] Learning cards show before new cards
- [ ] Review cards show last
- [ ] Daily limits enforced

### ✅ Session Management
- [ ] Session starts correctly
- [ ] Stats update after each review
- [ ] Progress bar shows correctly
- [ ] Session ends when no cards left
- [ ] Summary modal displays

### ✅ Edge Cases
- [ ] No due cards message
- [ ] Daily limit reached message
- [ ] Empty deck handling
- [ ] Session timeout
- [ ] Network error handling

## Frontend State Machine

```
┌──────────────┐
│   LOADING    │ (Check due cards)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  NO SESSION  │ (Show "Start Learning" button)
└──────┬───────┘
       │ (User clicks Start)
       ▼
┌──────────────┐
│SESSION ACTIVE│ (Show cards, handle reviews)
│              │
│  ┌────────┐  │
│  │ Card 1 │  │ → Review → Next Card
│  └────────┘  │
│  ┌────────┐  │
│  │ Card 2 │  │ → Review → Next Card
│  └────────┘  │
│     ...      │
└──────┬───────┘
       │ (No more cards)
       ▼
┌──────────────┐
│  COMPLETED   │ (Show summary)
└──────────────┘
```

## Debug Commands

### Check Redis Queues
```bash
# Connect to Redis
redis-cli

# Check queue lengths
LLEN new:{sessionId}
LLEN learning:{sessionId}
LLEN review:{sessionId}

# View queue contents
LRANGE new:{sessionId} 0 -1
LRANGE learning:{sessionId} 0 -1
LRANGE review:{sessionId} 0 -1

# Check stats
GET stats:{sessionId}
```

### API Testing
```bash
# Start session
curl -X POST http://localhost:5150/api/v1/study/start \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"deckId": "{guid}"}'

# Get next card
curl http://localhost:5150/api/v1/card/next/{sessionId} \
  -H "Authorization: Bearer {token}"

# Submit review
curl -X POST http://localhost:5150/api/v1/card/review/{cardId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"quality": 3}'

# Get stats
curl http://localhost:5150/api/v1/study/{sessionId}/stats \
  -H "Authorization: Bearer {token}"
```

## FSRS Parameters

Located in gRPC service configuration:

```
RequestRetention: 0.9      → Target 90% retention
MaximumInterval: 36500     → Max ~100 years
W: [17 weight parameters]  → FSRS algorithm weights
```

## Performance Optimization

### Caching Strategy
- **Redis**: Session queues (24h TTL)
- **Redis**: Stats (24h TTL)
- **Database**: Card progress (permanent)

### Why This Works
1. Session data temporary → Redis
2. Progress permanent → PostgreSQL
3. Fast queue operations
4. Scalable to millions of users

## Troubleshooting

### Issue: Cards not showing
**Check:**
1. Are there cards in deck?
2. Daily limit reached?
3. Cards due today?
4. Redis queues initialized?

### Issue: Card repeating immediately
**Check:**
1. Card still in learning state?
2. Due time in the past?
3. Quality rating recorded?
4. Stats updated?

### Issue: Session not ending
**Check:**
1. All queues empty?
2. Session.EndTime set?
3. Frontend polling for next card?

## Next Steps

1. **Test Complete Flow** - Use browser dev tools
2. **Verify FSRS** - Check interval calculations
3. **Monitor Redis** - Ensure queues working
4. **Check Logs** - Backend logging detailed

## Resources

- [FSRS Algorithm](https://github.com/open-spaced-repetition/fsrs.js)
- [Anki Manual](https://docs.ankiweb.net/studying.html)
- [Spaced Repetition](https://en.wikipedia.org/wiki/Spaced_repetition)

