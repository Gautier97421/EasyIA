-- Créer la table pour les messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ajouter RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion à tous les utilisateurs authentifiés
CREATE POLICY "Users can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture aux administrateurs seulement
CREATE POLICY "Only admins can read contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON contact_messages(email);
