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

describe('api.digitransit.fi', function() {
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
});

describe('hsl ui', function() {
  it('http should redirect to https', function(done) {
    get('beta.digitransit.fi','/kissa').end((err,res)=>{
      expect(err.status).to.be.equal(301);
      expect(err.response.header.location).to.be.equal('https://beta.digitransit.fi/kissa');
      done();
    });
  });

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
  it('http should redirect to https', function(done) {
    get('opas.matka.fi','/kissa').end((err,res)=>{
      expect(err.status).to.be.equal(301);
      expect(err.response.header.location).to.be.equal('https://opas.matka.fi/kissa');
      done();
    });
  });

  testProxying('beta.matka.fi','/','digitransit-ui-default:8080', true);
  testProxying('opas.matka.fi','/','digitransit-ui-default:8080', true);

  it('https should not redirect', function(done) {
    httpsGet('opas.matka.fi','/kissa').end((err,res)=>{
      expect(err).to.be.null;
      done();
    });
  });
});
