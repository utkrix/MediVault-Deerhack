#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
// #include <Ticker.h>


const char *ssid = "DWIT-Hotspot";
const char *password = "@DWZone-hotspot1";

#define led1 D4
#define led2 D5

#define touch1 D7
#define touch2 D8



const long utcOffsetInSeconds = 19620;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

ESP8266WebServer server(80);


void handleLED(int);
// Ticker timer1(handleLED(int), 0, 1);


void setup() {
  Serial.begin(9600);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(touch1, INPUT);
  pinMode(touch2, INPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting");
    delay(1000);
  }
  Serial.println("Connected to");
  Serial.println(WiFi.localIP());

  // timer1.start();

  server.on("/test", HTTP_GET, sendData);

  server.on("/test", HTTP_POST, receiveData);

  timeClient.begin();
  server.begin();

  // Timer1.initialize(interval * 1000); // Microseconds for desired interval
  // Timer1.attachInterrupt(blinkLEDs);
  // Timer1.start();
}

void loop() {
  
  server.handleClient();

  timeClient.update();
  
  String date = daysOfTheWeek[timeClient.getDay()];
  String time = timeClient.getFormattedTime();

  String currTime = (date+ " " + time);
  Serial.println(currTime);
  delay(1000);
  // timer1.update();
}

// to send data to api

void sendData() {
  StaticJsonDocument<300> JSONData;
  JSONData["key"] = "Value";  // like dictionary
  //more fields
  char data[300];
  // Convert JSON object to String and stores it in data variable
  serializeJson(JSONData, data);
  // Set status code as 200, content type as application/json and send the data
  server.send(200, "application/json", data);
}

void touchSensor(){  
  int state1 = digitalRead(touch1);
  Serial.println(state1);
  int state2 = digitalRead(touch2);
  Serial.println(state2);
  if (state1 == 1 && state2 == 1) {
    Serial.println("Touched!");
}

}

// Function to handle LED blinking
void handleLED(int led) {
  for (int i=0; i < 15; i++)
  {
    digitalWrite(led, HIGH);
    delay(300);
    digitalWrite(led, LOW);
    delay(300);
  }
}

void receiveData() {
  String jsonString = server.arg("plain");
  Serial.println("Received JSON String:");
  Serial.println(jsonString);

  StaticJsonDocument<1024> JSONData;

  DeserializationError error = deserializeJson(JSONData, jsonString);

  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    server.send(500, "application/json", "Error in parsing");
    return;
  }

  JsonArray dataArray = JSONData["data"];
  int dataSize = dataArray.size();

  Serial.print("Number of data sets received: ");
  Serial.println(dataSize);

  for (int i = 0; i < dataSize; i++) {
    JsonObject obj = dataArray[i];
    Serial.print("Processing data set ");
    Serial.println(i + 1);  // Print index starting from 1

    const char *name = obj["name"];
    Serial.print("Name: ");
    Serial.println(name);

    JsonArray dayArray = obj["day"];
    int dayArraySize = dayArray.size();
    Serial.print("Number of days: ");
    Serial.println(dayArraySize);
    Serial.println("Days:");
    for (int j = 0; j < dayArraySize; j++) {
      Serial.println(dayArray[j].as<String>());
    }

    JsonArray timeArray = obj["time"];
    int timeArraySize = timeArray.size();
    Serial.print("Number of times: ");
    Serial.println(timeArraySize);
    Serial.println("Times:");
    for (int j = 0; j < timeArraySize; j++) {
      Serial.println(timeArray[j].as<String>());
    }
    for (int i = 0; i < dayArraySize; i++) {
      if (dayArray[i] == "Tuesday") {
        for (int o = 0; o < timeArraySize; o++) {
          if (timeArray[o] == "14:00:00") {
            handleLED(led1);
            touchSensor();
            }
          if (timeArray[o] == "14:00:00"){
            handleLED(led2);
            touchSensor();
          }
          }
        }
      }
  }
}