const testTable = `
	CREATE SEQUENCE IF NOT EXISTS test_id_seq;

	CREATE TABLE IF NOT EXISTS test (
		id bigint PRIMARY KEY DEFAULT nextval('test_id_seq'),
		"updatedAt" timestamp with time zone DEFAULT NOW(),
		"createdAt" timestamp with time zone DEFAULT NOW(),
		message TEXT DEFAULT null
	)
	WITH (
		OIDS=FALSE
	);

	CREATE INDEX IF NOT EXISTS test_id_index ON test USING btree (id);

	DROP TRIGGER IF EXISTS update_updatedat_test on test;
	CREATE TRIGGER update_updatedat_test BEFORE UPDATE
	ON test FOR EACH ROW EXECUTE PROCEDURE 
	update_updatedat_column();

	INSERT into test (message) values ('Test post');
`

module.exports = testTable
