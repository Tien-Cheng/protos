/*
  Pathos with HTTP

  For the SSTuino boards.

  Sends a HTTP message to Pathos for datalogging purposes. This code
  sends random numbers to Pathos, but one can easily repurpose the
  code to send their own information.

  This example code is in the public domain.

  https://d3lta-v.github.io/SSTuino/
*/

#include "SSTuino_Companion.h"
#include <dht11.h>

#define LDRpin A0
#define DHT11PIN 7
#define IRPIN 8
#define SSID          "AndroidAPP"
#define PASSWORD      "password123"
#define HOSTNAME      "192.168.50.211:4090"
#define IO_USERNAME   "AIO USERNAME GOES HERE"
#define IO_KEY        "AIO KEY GOES HERE"
#define FEED_KEY      "FEED KEY GOES HERE"
#define DEVICEID      "o0269qzidJ4KaXlHdVTI"

SSTuino wifi = SSTuino();

dht11 DHT11;

int pirVal = 0;
int ldrVal = 0;
int temperature = 0;
int humidity = 0;
int randNumber;

void setup()
{
  Serial.begin(9600);
  pinMode(IRPIN, INPUT);

  // Open the link between the two devices
  wifi.openLink();

  // Reset the Wi-Fi chip to clear any previous settings
  wifi.reset();

  // Verify that the link is ok between the two devices
  if (!wifi.smokeTest()) {
    Serial.println(F("Unable to establish link with Wi-Fi chip. Halting.")); 
    while (true){};
  }

  // Setup random number generator (as dummy data)
  randomSeed(analogRead(0));

  wifiConnect();
}

void loop()
{
  Status wifiStatus = wifi.getWifiStatus();
  if (wifiStatus != SUCCESSFUL) {
    wifiConnect();
  }

  // Read Data from Sensors
  int chk = DHT11.read(DHT11PIN);
  pirVal = digitalRead(IRPIN);
  ldrVal = analogRead(LDRpin);
  humidity = DHT11.humidity;
  temperature = DHT11.temperature;

  // Serial.println(deviceID);
  // Serial.println(F(pirVal ldrVal humidity FEED_KEY temperature));

  transmitData(pirVal, ldrVal, humidity, temperature);
  delay(5000); // 5 second interval
}

void wifiConnect(void)
{
  // Connects to Wifi and displays connection state
  wifi.connectToWifi(F(SSID), F(PASSWORD));
  Serial.println(F("Connecting to Wi-Fi..."));

  Status wifiStatus = wifi.getWifiStatus();

  while (wifiStatus != SUCCESSFUL) {
    delay(5000); // 5 seconds optimal for wifi connection to fully establish
    wifiStatus = wifi.getWifiStatus();

    if (wifiStatus != SUCCESSFUL) {
      Serial.println(F("Connecting to Wi-Fi..."));
    }
  }
  Serial.println(F("Wi-Fi connected"));
}

void transmitData(int pirVal, int ldrVal, int humidity, int temperature)
{
  // Setup the connection
  int handle = wifi.setupHTTP(POST, F("http://" HOSTNAME "/devices/" DEVICEID "/metrics/"));
  if (handle == -1) {
    Serial.println(F("Unable to setup HTTP connection! Skipping this connection attempt"));
    return;
  }

  Serial.println(F("http://" HOSTNAME "/devices/" DEVICEID "/metrics"));

  // Serial.println(combinedString);

  // Set POST data
  String combinedString = "{\"pirVal\":";
  combinedString += pirVal;
  combinedString += ", \"ldrVal\":";
  combinedString += ldrVal;
  combinedString += ", \"humidity\":";
  combinedString += humidity;
  combinedString += ", \"temperature\":";
  combinedString += temperature;
  combinedString += "}";

  if (!wifi.setHTTPPOSTParameters(handle, combinedString)) {
    Serial.println(F("HTTP unable to set POST parameters! Skipping this connection attempt"));
    return;
  }

  // String combinedString2 = "ldrVal=";
  // combinedString2 += ldrVal;
  // if (!wifi.setHTTPPOSTParameters(handle, combinedString2)) {
  //   Serial.println(F("HTTP unable to set POST parameters! Skipping this connection attempt"));
  //   return;
  // }
  // combinedString2 = "ldrVal=";
  // combinedString2 += ldrVal;
  // combinedString += "; humidity=";
  // combinedString += humidity;
  // combinedString += "; temperature=";
  // combinedString += temperature;

  // Set headers to contain the key
  if (!wifi.setHTTPHeaders(handle, "Content-Type: application/json\n")) {
    Serial.println(F("HTTP unable to set headers! Skipping this connection attempt"));
    return;
  }

  // Actually transmit the data
  Serial.println(F("Transmitting data to Server via HTTP..."));
  if (!wifi.transmitHTTP(handle)) {
    Serial.println(F("Transmit failed! Skipping this connection attempt"));
    return;
  }

  delay(10000);

  // Check if the message was received properly
  Status http = wifi.getHTTPProgress(handle);
  if (http != SUCCESSFUL) {
    Serial.println(F("HTTP request did not succeed!"));
  }
  // Print out the reply in full
  Serial.print(F("Got HTTP status code: "));
  Serial.println(wifi.getHTTPStatusCode(handle));
  Serial.print(F("Got HTTP reply: "));
  Serial.println(wifi.getHTTPReply(handle, CONTENT, false));
  // Purge the previous HTTP data
  wifi.deleteHTTPReply(handle);
}
