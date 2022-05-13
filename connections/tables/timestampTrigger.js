const timestampTrigger = `
	CREATE OR REPLACE FUNCTION update_updatedat_column()
	RETURNS TRIGGER AS $$
	BEGIN
		NEW."updatedAt" = now(); 
		RETURN NEW;
	END;
	$$ language 'plpgsql';
`

module.exports = timestampTrigger
