cd ..
docker build -t hsldevcom/digitransit-proxy:test .

PROXIED_HOSTS=`grep proxy_pass *.conf|cut -d'/' -f3|cut -d':' -f1|uniq`

#TARGETHOST=`host www.example.com|grep -v v6|rev|cut -d' '  -f1|rev`
TARGETHOST=`ifconfig|grep inet|grep -v inet6|grep -v 127.0.0.1|cut -d' ' -f2`

#construct --add-host parameters
for HOST in $PROXIED_HOSTS;do ADDHOSTS="--add-host $HOST:$TARGETHOST $ADDHOSTS";done;

echo $ADDHOSTS

cd test

npm install

CONTAINER_ID=`docker run -d --rm -p 9000:8080 $ADDHOSTS hsldevcom/digitransit-proxy:test`

echo started proxy-container $CONTAINER_ID
echo starting echo server...
node server.js &
PID=$!

./node_modules/.bin/mocha
STATUS=$?

echo stopping test server
kill -9 $PID
echo stopping proxy-container $CONTAINER_ID
docker stop $CONTAINER_ID

exit $STATUS
