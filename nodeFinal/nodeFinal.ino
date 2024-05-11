#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "DWIT-Hotspot";
const char *password = "@DWZone-hotspot1";

#define led1 D0
#define led2 D1
#define led3 D2
#define led4 D3
#define led5 D4
#define led6 D5
#define led7 D6


#define touch1 D7
#define touch2 D8



const long utcOffsetInSeconds = 20700;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

ESP8266WebServer server(80);
bool touch = false;

void handleLED(int);
// Ticker timer1(handleLED(int), 0, 1);


void setup() {
  Serial.begin(9600);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(led4, OUTPUT);
  pinMode(led5, OUTPUT);
  pinMode(led6, OUTPUT);
  pinMode(led7, OUTPUT);

  pinMode(touch1, INPUT);
  pinMode(touch2, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting");
    delay(1000);
  }
  Serial.println("Connected to");
  Serial.println(WiFi.localIP());

  server.begin();

  //server.on("/test", HTTP_GET, sendData);

  server.on("192.168.103.37:6175/dispenser_data?id=6b1a7161-d65e-48c2-9200-4c60012fba3b", HTTP_POST, [](){ receiveData("Sunday", "00:00");});
  // server.on("/test", HTTP_POST, sendData);

  timeClient.begin();
  
}

unsigned long previousMillis = 0;
const long interval = 300; // Blink interval in milliseconds
bool ledState = false; // Track LED state
bool blinking = true; // Flag to control LED blinking
int touchState = 0;
int pin = D1;

void handleLED(int ledPin) {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval && blinking && !touchState) {
    previousMillis = currentMillis;
    digitalWrite(ledPin, HIGH);
    ledState = !ledState;

    if (blinking) {
      digitalWrite(ledPin, ledState);
      ledState = !ledState;
    }
  }
}
String formattedTime;
void loop() {
  server.handleClient();
  timeClient.update();
  String day;
  int hour, minute;
  currenttime(day, hour, minute);
 
  String time = String(hour) + ":" + String(minute);
  String currTime = day + " " + time;

  int state1 = digitalRead(touch1);
  int state2 = digitalRead(touch2);
  // print state to Serial Monitor
  if (state1 && state2)
{
  touch = true;
} 
  Serial.println(state1);
  Serial.println(state2);
  formattedTime = timeClient.getFormattedTime();  

backend();
  receiveData(day, time);
}

void currenttime(String &day, int &hour, int &minute) {
  int currentDay = timeClient.getDay();
  day = daysOfTheWeek[currentDay];
  hour = timeClient.getHours();
  minute = timeClient.getMinutes();
  delay(1000);

}

void touchSensor(){
  int state1 = digitalRead(touch1);
  Serial.println(state1);
  int state2 = digitalRead(touch2);
  Serial.println(state2);
  if (state1 == 1 && state2 == 1) {
    touchState = 1;
    digitalWrite(led1, LOW);
    Serial.println("Touched!");
    blinking = false;
  }
}


void backend(){
  // Create a JSON document
  StaticJsonDocument<200> JSONData;
  // Populate the JSON document with data
  JSONData["medicine_name"] = "SantaNew";
  JSONData["id"] = "0b149c78-b8d3-4a7c-963e-59b8b5932917";
  JSONData["sensitive"] = true;
  JSONData["dispensed"] = true;
  Serial.println("BACKENDD!");
  Serial.println(formattedTime);
  JSONData["time_elapsed"] = true;

  // Serialize the JSON document into a char array
  char data[200];
  serializeJson(JSONData, data);
  // Initialize HTTPClient and WiFiClient
  HTTPClient http;
  WiFiClient client;
  // Specify the server's IP address and port using WiFiClient
  http.begin(client, "http://192.168.103.37:6175/dispensed");
  // Add header specifying content type as JSON
  http.addHeader("Content-Type", "application/json");
  // Send the POST request with the JSON payload
  int httpResponseCode = http.POST(data);
  // Check for response
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.print("Error in HTTP request: ");
    Serial.println(httpResponseCode);
  }
  // Close the connection
  http.end();
}

void sendData(){
  // Create a JSON document
  StaticJsonDocument<200> JSONData;

  // Populate the JSON document with data
  JSONData["notification"] = "Medicine Taken";
  JSONData["time"] = timeClient.getFormattedTime();


  // Serialize the JSON document into a char array
  char data[200];
  serializeJson(JSONData, data);

  // Initialize HTTPClient and WiFiClient
  HTTPClient http;
  WiFiClient client;

  // Specify the server's IP address and port using WiFiClient
  http.begin(client, "http://192.168.103.55:9929/api/notify");

  // Add header specifying content type as JSON
  http.addHeader("Content-Type", "application/json");

  // Send the POST request with the JSON payload
  int httpResponseCode = http.POST(data);

  // Check for response
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.print("Error in HTTP request: ");
    Serial.println(httpResponseCode);
  }
  // Close the connection
  http.end();
}

void receiveData(String day, String time) {
  Serial.println(day);
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

  bool ledFound = false; // Track if a matching LED is found

  for (int i = 0; i < dataSize; i++) {
    JsonObject obj = dataArray[i];
    Serial.print("Processing data set ");
    Serial.println(i + 1);  // Print index starting from 1

    const char *name = obj["name"];

    JsonArray dayArray = obj["day"];
    int dayArraySize = dayArray.size();

    JsonArray timeArray = obj["time"];
    int timeArraySize = timeArray.size();

    for (int i = 0; i < dayArraySize; i++) {
      if (dayArray[i] == day) {
        for (int o = 0; o < timeArraySize; o++) {
          if (timeArray[o] == time) {
            blinking = true; // Set blinking to true for matching time
            ledFound = true; // Mark LED as found
            // Determine LED pin based on the day
            if (day == "Sunday") {
              pin = D0;
            } else if (day == "Monday") {
              pin = D1;
            } else if (day == "Tuesday") {
              pin = D2;
            } else if (day == "Wednesday") {
              pin = D3;
            } else if (day == "Thursday") {
              pin = D4;
            } else if (day == "Friday") {
              pin = D5;
            } else if (day == "Saturday") {
              pin = D6;
            } else {
              return; // Invalid day of the week
            }
            if (touch){
              sendData();
              digitalWrite(pin, LOW);
            }else{
              handleLED(pin);
              
              
            }
            return;
          }else{
            digitalWrite(pin, LOW);
            touch = false;
          }
        }
      }
    }
  }
}
