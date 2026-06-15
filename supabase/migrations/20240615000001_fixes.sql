-- Fix missing columns for UI parity

-- SEANCES
ALTER TABLE public.seances ADD COLUMN IF NOT EXISTS duree_minutes integer DEFAULT 60;
ALTER TABLE public.seances ADD COLUMN IF NOT EXISTS lieu text;
ALTER TABLE public.seances ADD COLUMN IF NOT EXISTS type text DEFAULT 'Formation';
ALTER TABLE public.seances ADD COLUMN IF NOT EXISTS titre text;

-- PAIEMENTS
ALTER TABLE public.paiements ADD COLUMN IF NOT EXISTS eleve_id uuid REFERENCES public.eleves(id);

-- EXAMENS
ALTER TABLE public.examens ADD COLUMN IF NOT EXISTS formation_id uuid REFERENCES public.formations(id);
ALTER TABLE public.examens ADD COLUMN IF NOT EXISTS type_permis text;

-- ELEVES
ALTER TABLE public.eleves ADD COLUMN IF NOT EXISTS dossier_code text;
ALTER TABLE public.eleves ADD COLUMN IF NOT EXISTS type_permis text;
ALTER TABLE public.eleves ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE public.eleves ADD COLUMN IF NOT EXISTS inspecteur text; -- For backward compatibility if needed

-- FACTURES
-- Ensure statut is consistent
-- (The check constraint already exists but might need adjustment if we change from 'impayee' to 'non_payee')
ALTER TABLE public.factures DROP CONSTRAINT IF EXISTS factures_statut_check;
ALTER TABLE public.factures ADD CONSTRAINT factures_statut_check CHECK (statut IN ('non_payee', 'partielle', 'payee', 'impayee'));
