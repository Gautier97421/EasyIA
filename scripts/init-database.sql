-- Création des tables pour EasyIA
-- Exécutez ce script dans votre dashboard Supabase (SQL Editor)

-- Table des profils utilisateurs (données supplémentaires)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  has_completed_intro BOOLEAN DEFAULT false,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des cours vidéo
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('débutant', 'intermédiaire', 'avancé')),
  category TEXT NOT NULL,
  thumbnail TEXT,
  tools TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des guides écrits
CREATE TABLE IF NOT EXISTS guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time INTEGER NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('débutant', 'intermédiaire', 'avancé')),
  category TEXT NOT NULL,
  thumbnail TEXT,
  tools TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de progression des utilisateurs
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_course_or_guide CHECK (
    (course_id IS NOT NULL AND guide_id IS NULL) OR 
    (course_id IS NULL AND guide_id IS NOT NULL)
  )
);

-- Table des avis
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_guide_id ON user_progress(guide_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les profils
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques pour la progression
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
CREATE POLICY "Users can view their own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Politiques pour les avis
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews;
CREATE POLICY "Users can view their own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Politiques pour les cours (lecture publique, modification admin)
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify courses" ON courses;
CREATE POLICY "Only admins can modify courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les guides (lecture publique, modification admin)
DROP POLICY IF EXISTS "Anyone can view guides" ON guides;
CREATE POLICY "Anyone can view guides" ON guides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify guides" ON guides;
CREATE POLICY "Only admins can modify guides" ON guides FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, has_completed_intro)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'user', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insérer les données initiales
INSERT INTO courses (title, description, video_url, duration, level, category, thumbnail, tools) VALUES
('Introduction à ChatGPT', 'Découvrez les bases de ChatGPT et comment l''utiliser efficacement', '/placeholder.mp4', 15, 'débutant', 'IA Générative', '/placeholder.svg?height=200&width=300', ARRAY['ChatGPT', 'OpenAI API']),
('Prompts avancés pour l''IA', 'Maîtrisez l''art du prompting pour obtenir de meilleurs résultats', '/placeholder.mp4', 25, 'intermédiaire', 'Techniques', '/placeholder.svg?height=200&width=300', ARRAY['ChatGPT', 'Claude', 'Gemini']),
('IA pour la productivité', 'Automatisez vos tâches quotidiennes avec l''IA', '/placeholder.mp4', 20, 'débutant', 'Productivité', '/placeholder.svg?height=200&width=300', ARRAY['Notion AI', 'Zapier', 'Make'])
ON CONFLICT DO NOTHING;

INSERT INTO guides (title, description, content, read_time, level, category, thumbnail, tools) VALUES
('Guide complet de ChatGPT', 'Tout ce que vous devez savoir sur ChatGPT', '# Guide complet de ChatGPT

## Introduction
ChatGPT est un modèle de langage développé par OpenAI...

## Comment commencer
1. Créez un compte sur OpenAI
2. Accédez à ChatGPT
3. Commencez à poser vos questions

## Conseils pour de meilleurs résultats
- Soyez précis dans vos demandes
- Donnez du contexte
- Utilisez des exemples', 10, 'débutant', 'IA Générative', '/placeholder.svg?height=200&width=300', ARRAY['ChatGPT', 'OpenAI Playground']),
('Créer des présentations avec l''IA', 'Étapes pour générer des présentations professionnelles', '# Créer des présentations avec l''IA

## Outils recommandés
- ChatGPT pour le contenu
- Gamma pour la génération automatique
- Canva AI pour le design

## Processus étape par étape
1. Définissez votre sujet et objectifs
2. Générez un plan avec l''IA
3. Créez le contenu de chaque slide
4. Ajoutez des visuels appropriés', 8, 'intermédiaire', 'Productivité', '/placeholder.svg?height=200&width=300', ARRAY['Gamma', 'Canva AI', 'Beautiful.ai'])
ON CONFLICT DO NOTHING;
