const mqtt = require('mqtt');
// var config = require('./config');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URLs
const mongourl = 'mongodb://192.168.0.101:27017';
const mqtturl = 'mqtt://192.168.0.101:2883';

// Constants
const dbName = 'mqttdata';
const mqttSubId = 'mongolog00';

// Use connect method to connect to the server
MongoClient.connect(mongourl, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  console.log('%s connected successfully to mongodb', mqttSubId);

  const db = client.db(dbName);

  const mqttoptions = {
    keepalive: 60,
    clientId: mqttSubId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: false,
    retain: false,
    reconnectPeriod: 1000 * 3,
    connectTimeout: 1000 * 30,
    will: {
      topic: 'WilllMsg',
      payload: 'Subscriber Connection Closed abnormally..!',
      qos: 1,
      retain: false
    }
  };

  let subscriptions = {'clientTest': 1};

  const mqttclient = mqtt.connect(mqtturl, mqttoptions);

  mqttclient.on('error', function (err) {
    console.log(err);
    mqttclient.end();
  });

  mqttclient.on('connect', function () {
    console.log('%s mqtt client connected', mqttSubId);
  });

  mqttclient.subscribe({subscriptions, mqttSubId});

  mqttclient.on('message', function (topic, message) {
    console.log('%s Rec: %s Topic: %s', mqttSubId, message, topic);
    var mongoPacket = {
      client: mqttSubId,
      message: message.toString(),
      topic: topic
    };
    db.collection('timestamps').insertOne(mongoPacket, function (err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
    });
  });
});
