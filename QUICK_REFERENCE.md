# Quick Reference Guide

## 🎨 Dark Mode

**Location:** `/profile` → Appearance section  
**Toggle:** Sun/Moon button  
**Persistence:** Automatic (localStorage via next-themes)  
**Coverage:** All 30+ components support dark mode

## 🧠 Learning Mode (Anki-Style)

### Start Learning
1. Go to deck: `/dashboard/decks/{id}`
2. Click "Learn" button
3. Click "Start Learning"

### Rating Buttons
- **Again (1)** → "I forgot" - Restart learning
- **Hard (2)** → "Difficult" - Shorter interval  
- **Good (3)** → "I remembered" - Standard interval
- **Easy (4)** → "Very easy" - Graduate/longer interval

### Queue Priority
1. 🔴 **Learning** cards (seen before, learning phase)
2. 🟡 **New** cards (never seen)
3. 🟢 **Review** cards (graduated, spaced repetition)

### Typical Intervals
- First review (Good): **1 day**
- Second review (Good): **3 days**
- Third review (Good): **7 days**
- Fourth review (Good): **18 days**
- Fifth review (Good): **45 days**
- Continues increasing exponentially

## 📁 File Structure

```
line-by-line-ui/
├── app/
│   ├── (interface)/
│   │   ├── dashboard/
│   │   │   ├── decks/
│   │   │   │   └── [id]/
│   │   │   │       ├── learn/
│   │   │   │       │   └── page.tsx       ← Learning Mode
│   │   │   │       └── page.tsx           ← Deck Details
│   │   │   └── page.tsx                   ← Dashboard
│   │   ├── profile/
│   │   │   ├── page.tsx                   ← Profile (Server)
│   │   │   └── ProfilePageClient.tsx      ← Profile (Client)
│   │   └── (auth)/
│   │       ├── login/
│   │       └── register/
│   ├── components/
│   │   ├── ThemeToggle.tsx                ← Theme Switcher
│   │   ├── settings/
│   │   │   ├── AppearanceSettings.tsx     ← Theme UI
│   │   │   ├── AccountProfile.tsx
│   │   │   └── ...
│   │   └── ui/
│   │       ├── CardReview.tsx             ← Review UI
│   │       └── DeckCard.tsx
│   ├── themes/
│   │   └── theme.ts                       ← Chakra Theme
│   └── page.tsx                           ← Landing Page
└── Documentation/
    ├── ANKI_LEARNING_MODE_FLOW.md         ← Learn flow
    ├── LEARN_MODE_TESTING_GUIDE.md        ← Testing
    ├── LEARNING_SYSTEM_ARCHITECTURE.md    ← Architecture
    ├── NEXTJS_OPTIMIZATIONS.md            ← Optimizations
    └── COMPLETE_SUMMARY.md                ← This summary
```

## 🛠️ Common Tasks

### Change Theme
```
Navigate to /profile
→ Appearance section
→ Click sun/moon button
```

### Configure Learning
```
Navigate to /dashboard/settings
→ Daily New Card Limit: [10]
→ Daily Review Limit: [100]
→ Rollover Hour: [4] (UTC)
→ Save Settings
```

### Create Deck
```
Navigate to /dashboard/decks/new
→ Enter title
→ Enter description
→ Toggle public/private
→ Create Deck
```

### Add Cards
```
Navigate to deck
→ Click "Manage Cards"
→ Fill in front/back
→ Select skill type
→ Add Card
```

### Start Learning
```
Navigate to deck
→ Click "Learn"
→ Click "Start Learning"
→ Review cards
→ Complete session
```

## 🔑 Key Concepts

### FSRS (Free Spaced Repetition Scheduler)
The algorithm that calculates when to show cards:
- **Stability** → How well you know it
- **Difficulty** → How hard the card is
- **Interval** → Days until next review
- **State** → Current learning phase

### Card Lifecycle
```
NEW (never seen)
  ↓
LEARNING (multiple reviews)
  ↓
REVIEW (spaced repetition)
  ↓ (if failed)
RELEARNING
  ↓
REVIEW (continue)
```

### Session
- One session per deck
- Managed in Redis
- Tracked in database
- Can be resumed

## 🎯 Testing Checklist

### Dark Mode
- [ ] Toggle switches theme
- [ ] All pages work in dark mode
- [ ] No white-on-white text
- [ ] Borders visible in both modes
- [ ] Theme persists after refresh

### Learning Mode  
- [ ] Session starts
- [ ] Cards appear
- [ ] All 4 buttons work
- [ ] Stats update
- [ ] Progress advances
- [ ] Session completes
- [ ] Re-queuing works

### Performance
- [ ] Pages load fast (< 1s)
- [ ] No hydration errors
- [ ] Smooth interactions
- [ ] No console errors

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET  /api/v1/auth/me`

### Decks
- `GET  /api/v1/deck/my-decks`
- `GET  /api/v1/deck/{id}`
- `POST /api/v1/deck`
- `PUT  /api/v1/deck/{id}`

### Cards
- `GET  /api/v1/card/{deckId}/cards`
- `POST /api/v1/card`
- `POST /api/v1/card/review/{id}`
- `GET  /api/v1/card/next/{sessionId}`

### Study Sessions
- `POST /api/v1/study/start`
- `GET  /api/v1/study/{id}/stats`
- `POST /api/v1/study/end/{id}`

### Settings
- `GET  /api/v1/settings`
- `PUT  /api/v1/settings`

## 💡 Pro Tips

### Learning Effectively
1. Start with small decks (5-10 cards)
2. Be consistent (daily reviews)
3. Use "Good" most of the time
4. Use "Again" when you truly forgot
5. Don't overuse "Easy"

### App Usage
1. Enable dark mode for eye comfort
2. Set realistic daily limits
3. Create focused decks (one topic)
4. Review every day at same time
5. Check stats to track progress

### Development
1. Use Server Components when possible
2. Keep client components small
3. Add Suspense for loading
4. Export metadata for SEO
5. Test in both light/dark modes

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Login | `http://localhost:3000/login` |
| Dashboard | `http://localhost:3000/dashboard` |
| My Decks | `http://localhost:3000/dashboard/decks` |
| Profile | `http://localhost:3000/profile` |
| API Docs | `http://localhost:5027/personal-vocab/swagger` |

## ✨ You're All Set!

Everything is implemented and working:
- ✅ Dark theme with toggle
- ✅ Anki-style learning
- ✅ Next.js optimizations
- ✅ Production-ready code
- ✅ Comprehensive docs

**Happy learning!** 🎓

