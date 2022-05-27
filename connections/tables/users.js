const usersTable = `
	CREATE SEQUENCE IF NOT EXISTS users_id_seq;

	CREATE TABLE IF NOT EXISTS users (
		id bigint PRIMARY KEY DEFAULT nextval('users_id_seq'),
		"updatedAt" timestamp with time zone DEFAULT NOW(),
		"createdAt" timestamp with time zone DEFAULT NOW(),
		name text NOT null,
		email text NOT null,
		password text NOT null,
		privileges text DEFAULT '',
		photo text DEFAULT null,
		token text DEFAULT null,
		actiontoken text DEFAULT null,
		active boolean DEFAULT true,
		online boolean DEFAULT false,
		points bigint DEFAULT 0,
		CONSTRAINT users_name_key UNIQUE (name),
		CONSTRAINT users_email_key UNIQUE (email)

	)
	WITH (
		OIDS=FALSE
	);

	CREATE INDEX IF NOT EXISTS users_id_index ON users USING btree (id);

	DROP TRIGGER IF EXISTS update_updatedat_users on users;
	CREATE TRIGGER update_updatedat_users BEFORE UPDATE
	ON users FOR EACH ROW EXECUTE PROCEDURE 
	update_updatedat_column();
`

module.exports = usersTable
