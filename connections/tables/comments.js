const commentsTable = `
	CREATE SEQUENCE IF NOT EXISTS comments_id_seq;

	CREATE TABLE IF NOT EXISTS  comments (
		id bigint PRIMARY KEY DEFAULT nextval('articles_id_seq'),
		"updatedAt" timestamp with time zone DEFAULT NOW(),
		"createdAt" timestamp with time zone DEFAULT NOW(),
		"articleId" bigint not null,
		"userId" bigint not null,
		content text not null,
		likes bigint DEFAULT 0
	)
	WITH (
		OIDS=FALSE
	);

	DROP TRIGGER IF EXISTS update_updatedat_comments on comments;
	CREATE TRIGGER update_updatedat_comments BEFORE UPDATE
	ON comments FOR EACH ROW EXECUTE PROCEDURE 
	update_updatedat_column();
`

module.exports = commentsTable
