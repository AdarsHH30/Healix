# Supabase Database Schema

This document outlines the database schema for the Healix wellness application.

## Setup Instructions

### 1. Create Your Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be ready

### 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy your Project URL and anon/public key
3. Add them to your `.env.local` file

### 3. Run SQL Migrations

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  emergency_phone_1 TEXT,
  emergency_phone_2 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gif_url TEXT,
  youtube_url TEXT NOT NULL,
  duration TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('physical', 'mental', 'breathing', 'nutrition')),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  notes TEXT,
  CONSTRAINT unique_user_exercise_completion UNIQUE (user_id, exercise_id, completed_at)
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('motivation', 'mindfulness', 'health', 'wellness', 'inspiration')),
  tags TEXT[],
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create nutrition_plans table
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  youtube_url TEXT,
  calories TEXT NOT NULL,
  protein TEXT NOT NULL,
  carbs TEXT NOT NULL,
  fats TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  category TEXT NOT NULL CHECK (category IN ('weight-loss', 'muscle-gain', 'balanced', 'vegan', 'keto', 'paleo', 'vegetarian', 'high-protein', 'low-carb')),
  prep_time TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  benefits TEXT[] NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_exercise_id ON public.user_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON public.user_progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_quotes_category ON public.quotes(category);
CREATE INDEX IF NOT EXISTS idx_quotes_active ON public.quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_nutrition_meal_type ON public.nutrition_plans(meal_type);
CREATE INDEX IF NOT EXISTS idx_nutrition_category ON public.nutrition_plans(category);
CREATE INDEX IF NOT EXISTS idx_nutrition_difficulty ON public.nutrition_plans(difficulty);
CREATE INDEX IF NOT EXISTS idx_nutrition_active ON public.nutrition_plans(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON public.nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for exercises table
CREATE POLICY "Anyone can view active exercises"
  ON public.exercises FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own exercises"
  ON public.exercises FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own exercises"
  ON public.exercises FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for user_progress table
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quotes table
CREATE POLICY "Anyone can view active quotes"
  ON public.quotes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own quotes"
  ON public.quotes FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own quotes"
  ON public.quotes FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for nutrition_plans table
CREATE POLICY "Anyone can view active nutrition plans"
  ON public.nutrition_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert nutrition plans"
  ON public.nutrition_plans FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own nutrition plans"
  ON public.nutrition_plans FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own nutrition plans"
  ON public.nutrition_plans FOR DELETE
  USING (auth.uid() = created_by);

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, emergency_phone_1, emergency_phone_2)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'emergency_phone_1',
    NEW.raw_user_meta_data->>'emergency_phone_2'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Database Tables

### `users`

Stores user profile information, extends Supabase auth.users.

| Column     | Type        | Description                        |
| ---------- | ----------- | ---------------------------------- |
| id         | UUID        | Primary key, references auth.users |
| email      | TEXT        | User email (unique)                |
| full_name  | TEXT        | User's full name                   |
| avatar_url | TEXT        | URL to user's avatar image         |
| created_at | TIMESTAMPTZ | Account creation timestamp         |
| updated_at | TIMESTAMPTZ | Last update timestamp              |

### `exercises`

Stores all exercises for physical health, mental health, breathing, and nutrition.

| Column        | Type        | Description                                |
| ------------- | ----------- | ------------------------------------------ |
| id            | UUID        | Primary key                                |
| name          | TEXT        | Exercise name                              |
| description   | TEXT        | Detailed description                       |
| image_url     | TEXT        | Static image URL                           |
| gif_url       | TEXT        | Animated GIF URL (optional)                |
| youtube_url   | TEXT        | YouTube tutorial link                      |
| duration      | TEXT        | Duration (e.g., "10-15 min")               |
| difficulty    | TEXT        | Beginner, Intermediate, or Advanced        |
| category      | TEXT        | Subcategory (e.g., "cardio", "meditation") |
| exercise_type | TEXT        | physical, mental, breathing, or nutrition  |
| created_by    | UUID        | References users.id (who created it)       |
| created_at    | TIMESTAMPTZ | Creation timestamp                         |
| updated_at    | TIMESTAMPTZ | Last update timestamp                      |
| is_active     | BOOLEAN     | Whether exercise is visible                |

### `user_progress`

Tracks user's exercise completion and progress.

| Column           | Type        | Description                              |
| ---------------- | ----------- | ---------------------------------------- |
| id               | UUID        | Primary key                              |
| user_id          | UUID        | References users.id                      |
| exercise_id      | UUID        | References exercises.id                  |
| completed_at     | TIMESTAMPTZ | When the exercise was completed          |
| duration_minutes | INTEGER     | Duration in minutes (optional)           |
| notes            | TEXT        | User notes about the exercise (optional) |

### `quotes`

Stores inspirational and motivational quotes.

| Column     | Type        | Description                                               |
| ---------- | ----------- | --------------------------------------------------------- |
| id         | UUID        | Primary key                                               |
| quote_text | TEXT        | The quote text                                            |
| author     | TEXT        | Quote author name                                         |
| category   | TEXT        | motivation, mindfulness, health, wellness, or inspiration |
| tags       | TEXT[]      | Array of tags for categorization                          |
| created_by | UUID        | References users.id (who created it)                      |
| created_at | TIMESTAMPTZ | Creation timestamp                                        |
| updated_at | TIMESTAMPTZ | Last update timestamp                                     |
| is_active  | BOOLEAN     | Whether quote is visible                                  |

### `nutrition_plans`

Stores meal plans and nutrition recipes.

| Column       | Type        | Description                                                  |
| ------------ | ----------- | ------------------------------------------------------------ |
| id           | UUID        | Primary key                                                  |
| title        | TEXT        | Meal/food name                                               |
| description  | TEXT        | Meal description                                             |
| image_url    | TEXT        | Food image URL                                               |
| youtube_url  | TEXT        | YouTube recipe video link (optional)                         |
| calories     | TEXT        | Calorie information (e.g., "450 kcal")                       |
| protein      | TEXT        | Protein content (e.g., "30g")                                |
| carbs        | TEXT        | Carbohydrate content (e.g., "45g")                           |
| fats         | TEXT        | Fat content (e.g., "15g")                                    |
| meal_type    | TEXT        | breakfast, lunch, dinner, or snack                           |
| category     | TEXT        | weight-loss, muscle-gain, balanced, vegan, keto, paleo, etc. |
| prep_time    | TEXT        | Preparation time (e.g., "15 min")                            |
| difficulty   | TEXT        | Easy, Medium, or Hard                                        |
| ingredients  | TEXT[]      | Array of ingredients                                         |
| instructions | TEXT[]      | Array of cooking steps                                       |
| benefits     | TEXT[]      | Array of health benefits                                     |
| created_by   | UUID        | References users.id (who created it)                         |
| created_at   | TIMESTAMPTZ | Creation timestamp                                           |
| updated_at   | TIMESTAMPTZ | Last update timestamp                                        |
| is_active    | BOOLEAN     | Whether nutrition plan is visible                            |

## Security

- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Anyone can view active exercises, quotes, and nutrition plans
- Users can only edit/delete content they created
- Automatic profile creation on user signup
- Secure authentication via Supabase Auth

## API Usage Examples

### Create Exercise

```typescript
import { supabase } from "@/lib/supabase";

async function createExercise(exercise: any) {
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      name: exercise.name,
      description: exercise.description,
      image_url: exercise.imageUrl,
      gif_url: exercise.gifUrl,
      youtube_url: exercise.youtubeUrl,
      duration: exercise.duration,
      difficulty: exercise.difficulty,
      category: exercise.category,
      exercise_type: exercise.exerciseType,
    })
    .select();

  return { data, error };
}
```

### Get All Exercises by Type

```typescript
async function getExercises(type: string) {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("exercise_type", type)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return { data, error };
}
```

### Track Exercise Completion

```typescript
async function trackExercise(exerciseId: string, duration?: number) {
  const { data, error } = await supabase.from("user_progress").insert({
    exercise_id: exerciseId,
    duration_minutes: duration,
  });

  return { data, error };
}
```

### Get Quote Favorites

```typescript
async function getFavoriteQuotes(userId: string) {
  const { data, error } = await supabase
    .from("quote_favorites")
    .select("quote_id")
    .eq("user_id", userId);

  return { data, error };
}
```

### Toggle Quote Favorite

```typescript
async function toggleQuoteFavorite(userId: string, quoteId: string) {
  const { data: existing } = await supabase
    .from("quote_favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("quote_id", quoteId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("quote_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("quote_id", quoteId);
    return { isFavorited: false, error };
  } else {
    // Add favorite
    const { error } = await supabase
      .from("quote_favorites")
      .insert({ user_id: userId, quote_id: quoteId });
    return { isFavorited: true, error };
  }
}
```

### Track Quote View

```typescript
async function trackQuoteView(quoteId: string, userId?: string) {
  const { error } = await supabase.from("quote_views").insert({
    quote_id: quoteId,
    user_id: userId,
  });

  return { error };
}
```

## Quote Tables Schema

Add these tables for quote interaction tracking:

```sql
-- Create quote_favorites table
CREATE TABLE IF NOT EXISTS public.quote_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_quote_favorite UNIQUE (user_id, quote_id)
);

-- Create quote_views table
CREATE TABLE IF NOT EXISTS public.quote_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for quote tables
CREATE INDEX IF NOT EXISTS idx_quote_favorites_user ON public.quote_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_favorites_quote ON public.quote_favorites(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_views_quote ON public.quote_views(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_views_viewed_at ON public.quote_views(viewed_at);

-- Enable RLS for quote tables
ALTER TABLE public.quote_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quote_favorites
CREATE POLICY "Users can view their own favorites"
  ON public.quote_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.quote_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.quote_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quote_views (read-only for authenticated users)
CREATE POLICY "Anyone can insert quote views"
  ON public.quote_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view all quote views"
  ON public.quote_views FOR SELECT
  USING (true);
```

````
```
````
