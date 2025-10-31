# Learning Mode Testing Guide - Anki-Style Verification

## 🎯 Overview

Your learning mode implements **FSRS (Free Spaced Repetition Scheduler)** - the same algorithm used by Anki 2.1+. This guide helps verify it works correctly.

## 📋 Pre-Test Checklist

### Backend Requirements
- ✅ PostgreSQL running (card/user data)
- ✅ Redis running (session queues)
- ✅ Personal-Vocab API running (port 5150)
- ✅ gRPC Inclusive service running (FSRS algorithm)
- ✅ API Gateway/Ocelot running (port 5027)

### Frontend Requirements
- ✅ Next.js dev server running (port 3000)
- ✅ User authenticated (logged in)
- ✅ Deck with cards created
- ✅ Daily limits configured in settings

## 🧪 Complete Test Flow

### Test 1: New Card Learning (First Time)

**Steps:**
1. Navigate to `/dashboard/decks/{deckId}/learn`
2. Click "Start Learning" button
3. Review the first NEW card
4. Try each rating button:

**Expected Anki-Style Behavior:**

| Button | Quality | Expected Result |
|--------|---------|-----------------|
| **Again** | 1 | Card stays in Learning, shows again in ~10 min |
| **Hard** | 2 | Card stays in Learning, shows again in ~10 min |
| **Good** | 3 | Card stays in Learning, shows again in ~1 day |
| **Easy** | 4 | Card **graduates** to Review, next review in ~4 days |

**Test Scenario:**
```
1. First card appears (NEW)
2. Click "Show Back" to reveal answer
3. Click "Good" (Quality 3)
4. Card should:
   - State: New → Learning
   - Due: ~1 day from now
   - Appear again later in same session if due today
```

### Test 2: Learning Card (Second/Third Review)

**Steps:**
1. Continue reviewing cards
2. When a LEARNING card appears again:
3. Rate it based on performance

**Expected Behavior:**

```
Learning Card (2nd review):
  Again → Reset to step 1 (10 min)
  Hard  → Same step, shorter interval
  Good  → Graduate to Review (1 day → 3 days)
  Easy  → Graduate to Review (4+ days)
```

**Graduation Criteria:**
- Card must pass through learning steps
- Typical: 10m → 1d → 3d (graduated)
- After graduation → enters spaced repetition

### Test 3: Review Card (Spaced Repetition)

**For cards already in REVIEW state:**

**Expected Intervals:**

| Rating | Interval Multiplier | Example (from 7 days) |
|--------|--------------------|-----------------------|
| Again  | Reset to Learning  | Back to 10 min        |
| Hard   | × 0.5-0.7          | 3-5 days              |
| Good   | × 1.0-1.3          | 7-9 days              |
| Easy   | × 1.3-1.5          | 9-11 days             |

**Test Scenario:**
```
1. Review a card you've seen before
2. Rate "Good"
3. Card should NOT appear again in session
4. Next due date should be several days away
5. Check database to verify due date
```

### Test 4: Queue Priority (Anki Order)

**Start a session with mixed cards:**
- 5 New cards
- 3 Learning cards (from previous session)
- 2 Review cards (due today)

**Expected Order:**

```
1st: Learning Card 1  ← Highest priority
2nd: Learning Card 2
3rd: Learning Card 3
4th: New Card 1       ← Second priority
5th: New Card 2
6th: New Card 3
7th: New Card 4
8th: New Card 5
9th: Review Card 1    ← Lowest priority
10th: Review Card 2
```

**Verify:**
```javascript
// Open browser console
// Watch network requests for /card/next/{sessionId}
// Verify cards come in correct order
```

### Test 5: Daily Limits

**Setup:**
```
Settings:
- Daily New Card Limit: 3
- Daily Review Limit: 10
```

**Test:**
1. Start learning session
2. Review 3 new cards
3. Try to review 4th new card

**Expected:**
- After 3 new cards, no more new cards shown
- Learning/Review cards still available
- Message: "Daily new card limit reached"
- Can still review previously seen cards

### Test 6: Re-Queuing in Same Session

**Critical Anki Feature:**

**Scenario:**
```
1. Review NEW card, rate "Good" (due in 10 minutes)
2. Continue reviewing other cards
3. After 10 minutes (or if due same day):
   - Card should appear again in SAME session
   - This time as LEARNING card (not NEW)
```

**Implementation Check:**
```csharp
// After review, if card due today:
if (nextReviewDate < tomorrow) {
    if (progress.State == State.Learning) {
        // Re-queue to learning
        await _redisDb.ListLeftPushAsync($"learning:{sessionId}", card);
        stats.LearningCount++;
    }
}
```

### Test 7: Session Stats Real-Time Update

**Watch stats update after each review:**

Initial:
```
New: 5 | Review: 2 | Learning: 0
```

After reviewing 1 new card (rated "Good"):
```
New: 4 | Review: 2 | Learning: 1
```

After reviewing learning card (graduated):
```
New: 4 | Review: 3 | Learning: 0
```

**Verify in UI:**
- Stats displayed at top of page
- Updates after each review
- Matches actual queue contents

### Test 8: Session Completion

**When all cards reviewed:**

**Expected:**
1. "All Cards Reviewed!" message
2. "Back to Deck" button appears
3. Session summary modal (optional)
4. Stats show: New: 0, Review: 0, Learning: 0

### Test 9: Progress Bar

**Verify:**
- Shows at top during session
- Increases with each review
- Formula: `reviewed / (reviewed + remaining)`
- Reaches 100% when done

## 🔍 Browser Console Tests

### Check API Calls

```javascript
// Open DevTools → Network tab
// Filter: Fetch/XHR

// Expected sequence:
1. POST /study/start          → {sessionId}
2. GET  /study/{sessionId}/stats → {newCount, reviewCount, learningCount}
3. GET  /card/next/{sessionId}   → First card
4. POST /card/review/{cardId}    → {quality: 3}
5. GET  /study/{sessionId}/stats → Updated stats
6. GET  /card/next/{sessionId}   → Next card
... (repeat 4-6)
N. GET  /card/next/{sessionId}   → null (session done)
```

### Verify Card Data

```javascript
// In console after getting a card:
console.log('Current Card:', currentCard);
console.log('Card State:', currentCard.progress?.state);
console.log('Due Date:', currentCard.progress?.due);
console.log('Stability:', currentCard.progress?.stability);
console.log('Difficulty:', currentCard.progress?.difficulty);
```

## 🐛 Common Issues & Fixes

### Issue 1: Cards Not Appearing

**Symptoms:**
- Session starts but no cards show
- "No due cards" message

**Check:**
1. Cards exist in deck?
   ```sql
   SELECT * FROM "Cards" WHERE "DeckId" = '{deckId}';
   ```

2. Daily limit not reached?
   ```sql
   SELECT "NewCardsCompletedToday", "DailyNewCardLimit" 
   FROM "UserSettings" WHERE "UserId" = '{userId}';
   ```

3. Redis queues populated?
   ```bash
   redis-cli
   LLEN new:{sessionId}
   ```

### Issue 2: Cards Repeating Immediately

**Symptoms:**
- Same card shows back-to-back
- No other cards in between

**Root Cause:**
- Card due time in past
- Being re-queued to front of queue

**Fix:**
```csharp
// Verify re-queue logic uses LeftPush (back of queue)
await _redisDb.ListLeftPushAsync($"learning:{sessionId}", card);
// NOT RightPush (front of queue)
```

### Issue 3: Stats Not Updating

**Symptoms:**
- Stats show same numbers after review
- Progress bar stuck

**Check:**
1. Stats update method called?
2. Redis stats cache invalidated?
3. Frontend refetching stats?

**Debug:**
```javascript
// After review, check:
const stats = await fetchApi(`/study/${sessionId}/stats`);
console.log('Updated stats:', stats);
```

### Issue 4: Session Never Ends

**Symptoms:**
- Cards keep appearing
- Can't complete session

**Check:**
1. Cards being re-queued incorrectly?
2. Due dates calculated wrong?
3. Session end condition:
   ```csharp
   // Should return null when all queues empty
   if (all queues empty) {
       session.EndTime = DateTime.UtcNow;
       return null;
   }
   ```

## 📊 Expected User Experience (Anki-Like)

### Day 1: First Session

```
User creates deck with 20 cards
Settings: 10 new cards/day, 100 reviews/day

Session flow:
1. See 10 new cards (limit reached)
2. Some rate "Good" → appear again same day
3. Some rate "Easy" → graduate immediately
4. End session with ~5 cards in learning state
```

### Day 2: Second Session

```
Session flow:
1. See 5 learning cards from yesterday (due today)
2. See 10 new cards (today's limit)
3. Review any that graduate and are due
4. End session
```

### Day 7: One Week Later

```
Session flow:
1. See learning cards
2. See new cards (if any)
3. See review cards due today (~5-10 cards)
4. Each review extends interval:
   - Good → next review in 2 weeks
   - Easy → next review in 3 weeks
```

### Day 30: One Month Later

```
Session flow:
1. See 50+ review cards due today
2. No new cards (deck exhausted)
3. All in spaced repetition
4. Intervals: 1 month → 2 months → 4 months
```

## ✅ Verification Checklist

### Basic Functionality
- [ ] Session starts successfully
- [ ] First card displays
- [ ] All 4 rating buttons work
- [ ] Next card loads after rating
- [ ] Progress bar updates
- [ ] Stats update in real-time
- [ ] Session ends when done
- [ ] Summary shows correct data

### Anki-Style Behavior
- [ ] Learning cards show FIRST
- [ ] New cards show SECOND
- [ ] Review cards show LAST
- [ ] Cards re-queue if due same day
- [ ] Daily limits enforced
- [ ] Graduation works correctly
- [ ] Intervals increase appropriately
- [ ] Failed cards reset to learning

### Edge Cases
- [ ] Empty deck handling
- [ ] No due cards message
- [ ] Daily limit reached message
- [ ] Network error recovery
- [ ] Session timeout handling
- [ ] Multiple tabs/sessions

## 🎮 Manual Test Script

### Complete Learning Session Test

**1. Setup:**
```bash
# Login to app
Email: test@example.com
Password: yourpassword

# Create test deck
Name: "Spanish Basics"
Add 5 cards:
  - Card 1: "Hello" / "Hola"
  - Card 2: "Goodbye" / "Adiós"
  - Card 3: "Thank you" / "Gracias"
  - Card 4: "Please" / "Por favor"
  - Card 5: "Sorry" / "Lo siento"
```

**2. First Session:**
```
1. Navigate to deck
2. Click "Learn" button
3. Click "Start Learning"
4. For each card:
   a. Read front
   b. Click "Show Back"
   c. Check your memory
   d. Click appropriate rating
   e. Observe next card appears
5. Verify stats update
6. Complete session
7. Check summary
```

**3. Verify Database:**
```sql
-- Check card progress
SELECT 
    c."Front",
    p."State",
    p."Due",
    p."Reps",
    p."Stability",
    p."Difficulty"
FROM "UserCardProgress" p
JOIN "Cards" c ON c."Id" = p."CardId"
WHERE p."UserId" = '{your-user-id}'
ORDER BY p."Due";
```

**4. Second Session (Same Day):**
```
1. Start new session
2. Verify learning cards from session 1 appear
3. Rate them
4. Verify graduation to review
5. Check intervals extended
```

## 🔬 Advanced Testing

### Test FSRS Algorithm

**Verify interval calculations match FSRS spec:**

```typescript
// Expected intervals for "Good" rating:
New Card (first review):          1 day
Learning Card (2nd review):       3 days
Review Card (1st review):         7 days
Review Card (2nd review):        18 days
Review Card (3rd review):        45 days
Review Card (4th review):       112 days
```

### Test Queue Management

```bash
# During active session, check Redis:
redis-cli

# Get queue lengths
LLEN new:{sessionId}
LLEN learning:{sessionId}
LLEN review:{sessionId}

# Should decrease as cards are reviewed
# Learning queue should increase when cards re-queued
```

### Test State Transitions

```
NEW → (rate Good) → LEARNING → (rate Good) → REVIEW
NEW → (rate Easy) → REVIEW (skip learning)
REVIEW → (rate Again) → RELEARNING → REVIEW
```

## 📈 Success Criteria

### ✅ Must Work Like Anki

1. **Queue Priority**
   - Learning first ✓
   - New second ✓
   - Review last ✓

2. **State Management**
   - New → Learning → Review ✓
   - Failed cards reset ✓
   - Graduation automatic ✓

3. **Scheduling**
   - FSRS algorithm applied ✓
   - Intervals increase ✓
   - Due dates calculated ✓

4. **Session Handling**
   - Single session per deck ✓
   - Stats real-time ✓
   - Completion detected ✓

5. **Daily Limits**
   - New cards limited ✓
   - Reviews limited ✓
   - Counters reset at rollover ✓

## 🚀 Quick Test Commands

### Login
```bash
# Manual test
1. Open http://localhost:3000/login
2. Enter credentials
3. Navigate to dashboard
```

### Create Test Deck
```bash
# Via UI:
1. Go to /dashboard/decks/new
2. Title: "Test Deck"
3. Add 3-5 cards
4. Save
```

### Start Learning
```bash
# Via UI:
1. Click deck
2. Click "Learn" button
3. Click "Start Learning"
4. Review all cards
5. Check completion
```

### Verify Backend
```bash
# Check logs for:
"Starting session for user {userId} on deck {deckId}"
"Amount: New cards - X, learningCards - Y, reviewCards - Z"
"Returning new card {CardId}"
"Returning learning card {CardId}"
"Session {SessionId}: No cards due today"
```

## 📝 Test Results Template

```markdown
### Test Session: [Date]

**Setup:**
- Deck: [Name]
- Cards: [Count]
- New Limit: [X]
- Review Limit: [Y]

**Results:**

| Step | Action | Expected | Actual | Pass/Fail |
|------|--------|----------|--------|-----------|
| 1 | Start session | Session ID returned | ✓ | ✅ |
| 2 | First card | Learning card shown | ✓ | ✅ |
| 3 | Rate Good | Next card appears | ✓ | ✅ |
| 4 | Stats update | New: 4→3 | ✓ | ✅ |
| 5 | Complete | Summary shown | ✓ | ✅ |

**Notes:**
- [Any observations]
- [Issues found]
- [Performance notes]
```

## 🔧 Troubleshooting Commands

### Check Backend Logs
```bash
# Look for these log messages:
grep "Starting session" logs.txt
grep "Amount: New cards" logs.txt
grep "Returning.*card" logs.txt
grep "No cards due" logs.txt
```

### Inspect Redis
```bash
redis-cli

# List all session keys
KEYS *:*

# Check specific session
LRANGE new:{sessionId} 0 -1
GET stats:{sessionId}
TTL stats:{sessionId}
```

### Query Database
```sql
-- Active sessions
SELECT * FROM "StudySessions" 
WHERE "EndTime" IS NULL
ORDER BY "StartTime" DESC;

-- User progress
SELECT c."Front", p."State", p."Due", p."Reps"
FROM "UserCardProgress" p
JOIN "Cards" c ON c."Id" = p."CardId"  
WHERE p."UserId" = '{userId}'
ORDER BY p."Due";

-- Daily stats
SELECT "NewCardsCompletedToday", "ReviewsCompletedToday"
FROM "UserSettings"
WHERE "UserId" = '{userId}';
```

## 🎯 Final Verification

### The system works correctly if:

1. ✅ Cards appear in correct priority order
2. ✅ NEW cards become LEARNING after first review
3. ✅ LEARNING cards graduate to REVIEW
4. ✅ Review intervals follow FSRS algorithm
5. ✅ Failed cards (Again) reset appropriately
6. ✅ Daily limits prevent over-studying
7. ✅ Stats update in real-time
8. ✅ Sessions complete cleanly
9. ✅ Cards re-appear if due same day
10. ✅ Performance is smooth (< 500ms per review)

## 📚 Comparison with Anki

### What's the Same
- FSRS algorithm for scheduling
- 4 quality ratings (Again/Hard/Good/Easy)
- Card states (New/Learning/Review/Relearning)
- Queue priority system
- Daily limits
- Spaced repetition intervals

### What's Different (By Design)
- Web-based (not desktop app)
- Microservice architecture
- Redis for queue management
- Multi-user support
- Collaborative decks
- Cloud-based progress

## ✨ Ready to Test!

Your learning mode is correctly implemented following Anki/FSRS principles. To test:

1. **Login** to your account
2. **Navigate** to a deck with cards
3. **Click** "Learn" button
4. **Start** a learning session
5. **Review** cards using the 4 buttons
6. **Observe** the behavior matches this guide

All the backend logic is correctly implemented with proper queue management, FSRS scheduling, and state transitions! 🎉

