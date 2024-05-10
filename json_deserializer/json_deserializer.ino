#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>

const char *ssid     = "DWIT-Hotspot";
const char *password = "@DWZone-hotspot1";

ESP8266WebServer server(80);

void setup() {
  Serial.begin(9600);
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
  StaticJsonDocument<300> JSONData;

  String jsonString = server.arg("plain");
  DeserializationError error = deserializeJson(JSONData, jsonString);


  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    server.send(500,"application/json","Error in parsing"); 
    return;

  }
  // else{
  //  if(JSONData.containsKey("name"))
  //  { 
  //   server.send(200,"application/json",String(JSONData["name"].as<String>())+" Received");
  //  }
  //  else{
  //    server.send(400,"application/json","Bad JSON");
  //  }
  // }
  const char* name = JSONData["name"];
  Serial.println(name);

  JsonArray dayArray = JSONData["day"];
  
  for (int i = 0; i < dayArray.size(); i++) {
    String day = dayArray[i];
    Serial.println(day);
  }

  JsonArray timeArray = JSONData["time"];
  for (int i = 0; i < timeArray.size(); i++) {
    String time = timeArray[i];
    Serial.println(time);
  }
}
