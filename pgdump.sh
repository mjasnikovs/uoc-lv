#!/bin/sh
export $(cat .env.development | sed 's/#.*//g' | xargs)
BACKUPNAME="uoc"

TIMESTAMP=`date "+%Y%m%d-%H%M%S"`
FILE="$BACKUPNAME-$TIMESTAMP.sql"
ZIPFILE="$BACKUPNAME-$TIMESTAMP.zip"

echo "$FILE start dump"

docker exec uoc-pg pg_dumpall -c -U postgres > $FILE

echo "$FILE to $ZIPFILE"

zip $ZIPFILE $FILE
rm $FILE

echo "$ZIPFILE exit"
