#!/bin/bash
export $(cat .env.development | sed 's/#.*//g' | xargs)

ZIPFILE="uoc-20221201-133444.zip"
BACKUPNAME="${ZIPFILE::-4}.sql"

echo "$ZIPFILE >>> $BACKUPNAME"

unzip $ZIPFILE

sudo cat $BACKUPNAME | docker exec -i uoc-pg psql -U postgres

#rm $BACKUPNAME
#rm $ZIPFILE
