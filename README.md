# MQTT subscriber & mongodb writer

This module is designed to subscribe to topics published to a MQTT broker and deliver the messages to long term storage in MongoDB.

For the module to function, there has to be an active MQTT broker such as Mosquitto, Mosca, or Aedes. There are test brokers available so that you do not need to configure your own.

You can install mongodb locally or use a hosted solution such as Mongodb Atlas or mLab.

Note that the URLs will have to be modified to match your resources. You can rename the database and collection names.


