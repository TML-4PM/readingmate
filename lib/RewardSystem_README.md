# Reading Buddy — Reward System

## Flow
1. Session ends → `api/read/process` returns {wpm, accuracy}
2. Call `rb_compute_stars(wpm, accuracy, level)` → 1–3 stars
3. UPDATE reading_sessions SET stars = result
4. Call `rb_update_streak(user_id)`
5. Check achievement triggers (see below)
6. Return to client: {stars, streak, newAchievements[]}

## Achievement triggers
| achievement    | trigger                           | reward display        |
|----------------|-----------------------------------|-----------------------|
| first_book     | total books = 1                   | 🌟 Sticker unlock     |
| 5_books        | total books = 5                   | 🎉 Buddy party anim   |
| 10_books       | total books = 10                  | 📜 Certificate PDF    |
| 25_books       | total books = 25                  | 🏆 Bookshelf complete |
| streak_3       | current_streak = 3                | 🔥 Flame badge        |
| streak_7       | current_streak = 7                | 🔥🔥 Super reader     |
| all_3_stars    | 3-star read                       | ⭐⭐⭐ shine anim     |
| buddy_mastered | 5 reads with same buddy           | Buddy level-up anim   |

## Buddy reaction states
spark:  😐 (start) → 😊 (1★) → 😄 (2★) → 🥳 (3★)
luna:   Same mapping, different anim
pip:    Same
nova:   Same

## Certificate trigger
- 10 books read → auto-call /api/generate-pdf with cert_type='kids_10_books'
- Cert includes: child name, buddy name, book titles, date, T4H/OutcomeReady logo

## Family leaderboard
- Query: SELECT * FROM v_rb_family_leaderboard WHERE family_id = $1 ORDER BY total_stars DESC
- Show weekly + all-time tabs
- 4-kid cap in free tier (perfect for family plan)
