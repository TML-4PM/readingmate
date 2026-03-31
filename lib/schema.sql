-- ReadingMate schema

-- Learner profiles
CREATE TABLE IF NOT EXISTS rm_learner_profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  mode          text NOT NULL CHECK (mode IN ('adult','esl','pensioner','vocational')),
  level_label   text NOT NULL,
  native_lang   text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
ALTER TABLE rm_learner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON rm_learner_profiles FOR ALL USING (auth.uid() = user_id);

-- Sessions
CREATE TABLE IF NOT EXISTS rm_reading_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  mode          text NOT NULL,
  text_id       text,
  text_title    text,
  wpm           int,
  accuracy      numeric(5,2),
  comprehension int,  -- 0-100, from post-read questions
  vocab_flags   jsonb DEFAULT '[]',  -- words stumbled on
  confidence    text CHECK (confidence IN ('low','medium','high')),
  duration_secs int,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE rm_reading_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sessions" ON rm_reading_sessions FOR ALL USING (auth.uid() = user_id);

-- Progress milestones
CREATE TABLE IF NOT EXISTS rm_milestones (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  milestone     text NOT NULL,  -- '1_session','10_sessions','level_up','streak_7' etc
  awarded_at    timestamptz DEFAULT now()
);
ALTER TABLE rm_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own milestones" ON rm_milestones FOR ALL USING (auth.uid() = user_id);

-- ─── Reading Buddy (kids) reward tables ────────────────────────────────────

-- Per-session stars (1-3)
ALTER TABLE reading_sessions ADD COLUMN IF NOT EXISTS stars int CHECK (stars BETWEEN 1 AND 3);
ALTER TABLE reading_sessions ADD COLUMN IF NOT EXISTS buddy text DEFAULT 'spark';

-- Reading streaks
CREATE TABLE IF NOT EXISTS rb_reading_streaks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  family_id       uuid,  -- for family leaderboard
  current_streak  int DEFAULT 0,
  longest_streak  int DEFAULT 0,
  last_read_date  date,
  updated_at      timestamptz DEFAULT now()
);
ALTER TABLE rb_reading_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own streak" ON rb_reading_streaks FOR ALL USING (auth.uid() = user_id);

-- Achievements / stickers / certs
CREATE TABLE IF NOT EXISTS rb_achievements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  family_id     uuid,
  achievement   text NOT NULL,  -- 'first_book','5_books','10_books','streak_3','streak_7','cert_10'
  buddy         text,           -- which buddy unlocked it
  unlocked_at   timestamptz DEFAULT now()
);
ALTER TABLE rb_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own achievements" ON rb_achievements FOR ALL USING (auth.uid() = user_id);

-- Family group (links kids to same family leaderboard)
CREATE TABLE IF NOT EXISTS rb_families (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  invite_code text UNIQUE DEFAULT upper(substring(gen_random_uuid()::text, 1, 6)),
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE rb_families ENABLE ROW LEVEL SECURITY;

-- Stars function: compute stars from WPM+accuracy
CREATE OR REPLACE FUNCTION rb_compute_stars(p_wpm int, p_accuracy numeric, p_level text)
RETURNS int LANGUAGE plpgsql AS $$
DECLARE v_stars int := 1;
BEGIN
  -- Level-adjusted WPM thresholds
  IF p_level = 'prep' THEN
    IF p_wpm >= 30 AND p_accuracy >= 90 THEN v_stars := 3;
    ELSIF p_wpm >= 20 AND p_accuracy >= 80 THEN v_stars := 2; END IF;
  ELSIF p_level = 'y1' THEN
    IF p_wpm >= 60 AND p_accuracy >= 92 THEN v_stars := 3;
    ELSIF p_wpm >= 40 AND p_accuracy >= 82 THEN v_stars := 2; END IF;
  ELSIF p_level = 'y2' THEN
    IF p_wpm >= 90 AND p_accuracy >= 94 THEN v_stars := 3;
    ELSIF p_wpm >= 65 AND p_accuracy >= 84 THEN v_stars := 2; END IF;
  END IF;
  RETURN v_stars;
END $$;

-- Streak update function
CREATE OR REPLACE FUNCTION rb_update_streak(p_user_id uuid, p_family_id uuid DEFAULT NULL)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_last date; v_streak int; v_longest int;
BEGIN
  SELECT last_read_date, current_streak, longest_streak
    INTO v_last, v_streak, v_longest
    FROM rb_reading_streaks WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    INSERT INTO rb_reading_streaks (user_id, family_id, current_streak, longest_streak, last_read_date)
    VALUES (p_user_id, p_family_id, 1, 1, CURRENT_DATE);
    RETURN;
  END IF;
  IF v_last = CURRENT_DATE THEN RETURN; END IF;  -- already counted today
  IF v_last = CURRENT_DATE - 1 THEN v_streak := v_streak + 1;
  ELSE v_streak := 1; END IF;
  IF v_streak > v_longest THEN v_longest := v_streak; END IF;
  UPDATE rb_reading_streaks SET current_streak=v_streak, longest_streak=v_longest,
    last_read_date=CURRENT_DATE, updated_at=now() WHERE user_id=p_user_id;
END $$;

-- Family leaderboard view
CREATE OR REPLACE VIEW v_rb_family_leaderboard AS
SELECT
  s.user_id,
  str.family_id,
  COUNT(DISTINCT s.id)              AS total_books,
  COALESCE(SUM(s.stars),0)          AS total_stars,
  str.current_streak,
  MAX(s.created_at::date)           AS last_read
FROM reading_sessions s
LEFT JOIN rb_reading_streaks str ON str.user_id = s.user_id
GROUP BY s.user_id, str.family_id, str.current_streak;
