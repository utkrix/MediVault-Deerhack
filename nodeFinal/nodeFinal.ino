#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>

const char *ssid     = "DWIT-Hotspot";
const char *password = "@DWZone-hotspot1";

#define led D4
#define touch1 D7
#define touch2 D8


ESP8266WebServer server(80);


void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  pinMode(touch1, INPUT);
  pinMode(touch2, INPUT);
  WiFi.begin(ssid,password);
    while(WiFi.status() != WL_CONNECTED){
      Serial.println("Connecting");
    delay(1000);
    }
    Serial.println("Connected to");
    Serial.println(WiFi.localIP());

    server.on("/test",HTTP_GET,sendData);

    server.on("/test",HTTP_POST,receiveData);

    server.begin();

}

void loop() {
    server.handleClient();
}

// to send data to api

void sendData(){
    StaticJsonDocument<300> JSONData;
    JSONData["key"] = "Value"; // like dictionary
    //more fields
    char data[300];
    // Convert JSON object to String and stores it in data variable
    serializeJson(JSONData,data);
    // Set status code as 200, content type as application/json and send the data
  server.send(200,"application/json",data);
}



void receiveData(){
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
    Serial.println(i + 1); // Print index starting from 1

    const char* name = obj["name"];
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
  
  for (int i = 0; i < dayArraySize; i++)
  {
    if (dayArray[i] == "Tuesday")
    {
      for (int o = 0; o < timeArraySize; o++)
      {
        if (timeArray[o] == "14:00:00")
        {
          for(int n = 0; n < 15; n++)
          {
            digitalWrite(led, HIGH);
            delay(300);
            digitalWrite(led, LOW);
            delay(300);
          }
          
          // checking if sensor is activated after consumption
          int state1 = digitalRead(touch1);
          Serial.println(state1);
          int state2 = digitalRead(touch2);
          Serial.println(state2);
          if (state1 == state2 == 1)
          {
            Serial.println("Touched!");
          }

        }
      }
    }
  }
  }
}

