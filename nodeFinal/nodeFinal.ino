#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>


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

  // timer1.start();

  server.on("/test", HTTP_GET, sendData);

  server.on("/test", HTTP_POST, [](){ receiveData("Sunday", "00:00");});
  //server.on("/test", HTTP_POST, receiveData);

  timeClient.begin();
  server.begin();
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

void loop() {

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
  server.handleClient();

  timeClient.update();
  currenttime();

}

int currenttime(){
  String day = daysOfTheWeek[timeClient.getDay()];
  int currentHour = timeClient.getHours();
  int currentMin = timeClient.getMinutes();
  String time1 = String(currentHour);
  String time2 = String(currentMin); 
  String time = time1 +":" + time2; // impppppppppppp
  String currTime = (day+ " " + time);
  Serial.println(currTime);
  delay(1000);
  receiveData(day, time);
  return 0;
}


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


// Function to handle LED blinking
// void handleLED(void *pvParams) {
//   for (int i=0; i < 15; i++)
//   {
//     digitalWrite(led, HIGH);
//     delay(300);
//     digitalWrite(led, LOW);
//     delay(300);
//   }
// }

// void touchSensor(){  
//   int touchState = 0;
//   int state1 = digitalRead(touch1);
//   Serial.println(state1);
//   int state2 = digitalRead(touch2);
//   Serial.println(state2);
//   if (state1 == 1 && state2 == 1) {
//     touchState = 1;
//     Serial.println("Touched!");
//   }
// }
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

  for (int i = 0; i < dataSize; i++) {
    JsonObject obj = dataArray[i];
    Serial.print("Processing data set ");
    Serial.println(i + 1);  // Print index starting from 1

    const char *name = obj["name"];
    // Serial.print("Name: ");
    // Serial.println(name);

    JsonArray dayArray = obj["day"];
    int dayArraySize = dayArray.size();

    JsonArray timeArray = obj["time"];
    int timeArraySize = timeArray.size();


    for (int i = 0; i < dayArraySize; i++) {
      if (dayArray[i] == day) {
        for (int o = 0; o < timeArraySize; o++) {
          if (timeArray[o] == time) {
            blinking = true;
            if (day == "Sunday") {
              pin = D1;
              handleLED(led1);
            } 
            else if (day == "Monday") {
              pin = D2;
              handleLED(led2);
            } 
            else if (day == "Tuesday") {
              pin = D3;
              handleLED(led3);
            } 
            else if (day == "Wednesday") {
              pin = D4;
              handleLED(led4);
            } 
            else if (day == "Thursday") {
              pin = D5;
              handleLED(led5);
            } 
            else if (day == "Friday") {
              pin = D6;
              handleLED(led6);
            } 
            else if (day == "Saturday") {
              pin = D7;
              handleLED(led7);
            } 
            else {
              return; // Invalid day of the week
            }
            return;
            }
          touchState = 0;
          }
      }
    }
  }
}