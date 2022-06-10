const articlesTable = `
	CREATE SEQUENCE IF NOT EXISTS articles_id_seq;

	DO $$
	BEGIN
		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'articles_category_type') THEN
			CREATE TYPE articles_category_type AS ENUM ('review', 'news', 'video', 'blog', 'podcast');
		END IF;

		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'articles_status_type') THEN
			CREATE TYPE articles_status_type AS ENUM ('draft', 'approved', 'active');
		END IF;
	END
	$$;

	CREATE TABLE IF NOT EXISTS articles (
		id bigint PRIMARY KEY DEFAULT nextval('articles_id_seq'),
		"updatedAt" timestamp with time zone DEFAULT NOW(),
		"createdAt" timestamp with time zone DEFAULT NOW(),
		"publishedAt" timestamp with time zone DEFAULT null,
		"userId" bigint not null,
		url varchar(300) not null,
		title varchar(200) not null,
		tags text[] not null default '{}',
		category articles_category_type not null default 'news',
		status articles_status_type not null default 'draft',
		article text not null,
		notes text,
		thumbnail text,
		mp3 text,
		CONSTRAINT articles_title_key UNIQUE (title),
		CONSTRAINT articles_url_key UNIQUE (url)
	)
	WITH (
		OIDS=FALSE
	);

	CREATE INDEX IF NOT EXISTS articles_id_index ON articles USING btree (id);
	CREATE INDEX IF NOT EXISTS articles_url_index ON articles USING btree (url);

	DROP TRIGGER IF EXISTS update_updatedat_articles on articles;
	CREATE TRIGGER update_updatedat_articles BEFORE UPDATE
	ON articles FOR EACH ROW EXECUTE PROCEDURE 
	update_updatedat_column();
`

module.exports = articlesTable
