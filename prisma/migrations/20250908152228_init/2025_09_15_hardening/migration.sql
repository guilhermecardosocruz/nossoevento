-- Garantir tabela Event com as colunas novas

-- Se existir coluna antiga "startAt", renomeia para "startsAt"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Event' AND column_name = 'startAt'
  ) THEN
    EXECUTE 'ALTER TABLE "Event" RENAME COLUMN "startAt" TO "startsAt"';
  END IF;
END
$$;

-- Adiciona colunas que faltarem (idempotente)
ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "startsAt"   TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "endsAt"     TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN;

-- Se "startsAt" ainda estiver NULL em definição, deixa NOT NULL com default agora()
-- (seguro mesmo se houver 0 linhas)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Event' AND column_name = 'startsAt'
  ) THEN
    -- Preenche valores nulos (se houver linhas antigas)
    EXECUTE 'UPDATE "Event" SET "startsAt" = NOW() WHERE "startsAt" IS NULL';
    -- Garante NOT NULL + default
    EXECUTE 'ALTER TABLE "Event" ALTER COLUMN "startsAt" SET DEFAULT NOW()';
    EXECUTE 'ALTER TABLE "Event" ALTER COLUMN "startsAt" SET NOT NULL';
    -- Remove default para futuras inserções exigirem valor explícito
    EXECUTE 'ALTER TABLE "Event" ALTER COLUMN "startsAt" DROP DEFAULT';
  END IF;
END
$$;

-- Define defaults padrão se estiverem ausentes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Event' AND column_name='isPublished') THEN
    EXECUTE 'UPDATE "Event" SET "isPublished" = COALESCE("isPublished", false)';
    EXECUTE 'ALTER TABLE "Event" ALTER COLUMN "isPublished" SET DEFAULT false';
  END IF;
END
$$;

-- Índice para “próximos eventos publicados”, só cria se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'event_published_starts_idx'
  ) THEN
    CREATE INDEX "event_published_starts_idx" ON "Event" ("isPublished", "startsAt");
  END IF;
END
$$;

