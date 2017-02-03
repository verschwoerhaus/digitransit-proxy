# digitransit-proxy
Digitransit proxy

# Local testing in Docker

1. Build:
`docker build hsldevcom/digitransit-proxy .`

2. Run:
`docker run \
--add-host pelias-api:127.0.0.1 \
--add-host pelias-data-container:127.0.0.1 \
--add-host siri2gtfsrt:127.0.0.1 \
--add-host opentripplanner-hsl:127.0.0.1 \
--add-host opentripplanner-finland:127.0.0.1 \
--add-host opentripplanner-waltti:127.0.0.1 \
--add-host opentripplanner-data-con:127.0.0.1 \
--add-host hsl-map-server:127.0.0.1 \
--add-host raildigitraffic2gtfsrt:127.0.0.1 \
--add-host navigator-server:127.0.0.1 \
--add-host hslalert:127.0.0.1 \
--add-host digitransit-ui-hsl:127.0.0.1 \
--add-host digitransit-ui-default:127.0.0.1 \
--add-host digitransit-ui-turku:127.0.0.1 \
--add-host digitransit-ui-joensuu:127.0.0.1 \
--add-host digitransit-site:127.0.0.1 \
-p 8080:8080 \
hsldevcom/digitransit-proxy`


# Running testsuite
Requires docker + node

```bash
cd tets
test.sh
