-- Créer la table user_favorites
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte pour s'assurer qu'un seul type de contenu est référencé
  CONSTRAINT check_content_type CHECK (
    (course_id IS NOT NULL AND guide_id IS NULL) OR 
    (course_id IS NULL AND guide_id IS NOT NULL)
  ),
  
  -- Contrainte d'unicité pour éviter les doublons
  CONSTRAINT unique_user_course_favorite UNIQUE (user_id, course_id),
  CONSTRAINT unique_user_guide_favorite UNIQUE (user_id, guide_id)
);

-- Activer RLS (Row Level Security)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leurs propres favoris
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent ajouter leurs propres favoris
CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent supprimer leurs propres favoris
CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_course_id ON user_favorites(course_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_guide_id ON user_favorites(guide_id);
