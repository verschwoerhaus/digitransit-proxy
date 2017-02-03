let chai = require('chai');
let chaiHttp = require('chai-http');
const expect=chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);

function get(host, path) {
  return chai.request('http://127.0.0.1:9000')
    .get(path)
    .redirects(0)
    .set('host', host)
}

function httpsGet(host, path) {
  return get(host, path)
    .set('X-Forwarded-Proto','https')
}

function parse(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.log(json + ' did not parse to JSON', error)
  }
}

function verifyHost(host, res) {
  let content = parse(res.text);
  expect(content.host).to.be.equal(host);
}

function verifyForwardedHost(host, res) {
  let content = parse(res.text);
  expect(content['x-forwarded-host']).to.be.equal(host);
}

function testProxying(host, path, proxyTo, secure) {
  it(host + path + ' should be proxied to container at ' + proxyTo, function(done) {
    const verify = (err,res) => {
      expect(err).to.be.null;
      verifyHost(proxyTo, res);
      verifyForwardedHost(host, res);
      done();
    };
    let fn = secure?httpsGet:get;

    fn(host, path).end(verify);
  });
}

function testRedirect(host, path, expectedUrl) {
  it('http request to ' + host + path + ' should redirect to ' + expectedUrl, function(done) {
    get(host,path).end((err,res)=>{
      expect(err.status).to.be.equal(301);
      expect(err.response.header.location).to.be.equal(expectedUrl);
      done();
    });
  });
}

describe('api.digitransit.fi', function() {

  it('https should not redirect', function(done) {
    httpsGet('api.digitransit.fi','/geocoding/v1/').end((err,res)=>{
      expect(err).to.be.null;
      done();
    });
  });

  it('/ should contain static content', function(done) {
    get('api.digitransit.fi','/').end((err,res)=>{
      expect(err).to.be.null;
      expect(res.statusCode).to.be.equal(200);
      expect(res.text).to.contain('Digitransit APIs');
      done();
    });
  });

  testProxying('api.digitransit.fi','/geocoding/v1/','pelias-api:8080');
  testProxying('api.digitransit.fi','/realtime/siri2gtfsrt/v1/','siri2gtfsrt:8080');
  testProxying('api.digitransit.fi','/realtime/trip-updates/v1/','siri2gtfsrt:8080');
  testProxying('api.digitransit.fi','/realtime/hslalert/v1/','hslalert:8080');
  testProxying('api.digitransit.fi','/realtime/service-alerts/v1/','hslalert:8080');
  testProxying('api.digitransit.fi','/realtime/navigator-server/v1/','navigator-server:8080');
  testProxying('api.digitransit.fi','/realtime/vehicle-positions/v1/','navigator-server:8080');
  testProxying('api.digitransit.fi','/realtime/mqtt-cache/v1/','navigator-server:8080');
  testProxying('api.digitransit.fi','/realtime/raildigitraffic2gtfsrt/v1/','raildigitraffic2gtfsrt:8080');
  testProxying('api.digitransit.fi','/map/v1/','hsl-map-server:8080');
  testProxying('api.digitransit.fi','/routing/v1/routers/finland','opentripplanner-finland:8080');
  testProxying('api.digitransit.fi','/routing/v1/routers/hsl','opentripplanner-hsl:8080');
  testProxying('api.digitransit.fi','/routing/v1/routers/waltti','opentripplanner-waltti:8080');
  testProxying('api.digitransit.fi','/routing-data/v1/','opentripplanner-data-con:8080');
});

describe('hsl ui', function() {
  testRedirect('www.beta.reittiopas.fi','/kissa','http://beta.reittiopas.fi/kissa');

  testRedirect('beta.reittiopas.fi','/kissa','https://beta.reittiopas.fi/kissa');
  testRedirect('dev.reittiopas.fi','/kissa','https://dev.reittiopas.fi/kissa');

  it('https should not redirect', function(done) {
    httpsGet('beta.digitransit.fi','/kissa').end((err,res)=>{
      expect(err).to.be.null;
      done();
    });
  });

  testProxying('beta.reittiopas.fi','/','digitransit-ui-hsl:8080', true);
  testProxying('dev.reittiopas.fi','/','digitransit-ui-hsl:8080', true);
});

describe('matka ui', function() {
  testRedirect('www.opas.matka.fi','/kissa','http://opas.matka.fi/kissa');
  testRedirect('opas.matka.fi','/kissa','https://opas.matka.fi/kissa');
  testRedirect('www.beta.matka.fi','/kissa','http://beta.matka.fi/kissa');
  testRedirect('beta.matka.fi','/kissa','https://beta.matka.fi/kissa');

  testProxying('beta.matka.fi','/','digitransit-ui-default:8080', true);
  testProxying('opas.matka.fi','/','digitransit-ui-default:8080', true);

  it('https should not redirect', function(done) {
    httpsGet('opas.matka.fi','/kissa').end((err,res)=>{
      expect(err).to.be.null;
      done();
    });
  });
});

describe('waltti ui', function() {
  testRedirect('dev-joensuu.digitransit.fi','/kissa','https://dev-joensuu.digitransit.fi/kissa');
  testProxying('dev-joensuu.digitransit.fi','/','digitransit-ui-waltti:8080', true);
  testRedirect('joensuu.digitransit.fi','/kissa','https://joensuu.digitransit.fi/kissa');
  testProxying('joensuu.digitransit.fi','/','digitransit-ui-waltti:8080', true);

  testRedirect('dev-turku.digitransit.fi','/kissa','https://dev-turku.digitransit.fi/kissa');
  testProxying('dev-turku.digitransit.fi','/','digitransit-ui-waltti:8080', true);
  testRedirect('turku.digitransit.fi','/kissa','https://turku.digitransit.fi/kissa');
  testProxying('turku.digitransit.fi','/','digitransit-ui-waltti:8080', true);

  it('https should not redirect', function(done) {
    httpsGet('turku.digitransit.fi','/kissa').end((err,res)=>{
      expect(err).to.be.null;
      done();
    });
  });
});



describe('digitransit', function() {
  testRedirect('www.digitransit.com','/kissa','http://digitransit.fi/kissa');
});
