// NODE MCU 1.0 ESP-12E - TYPE C wala
// NODE MCU 1.0 ESP12S - Microusb wala
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>



const char *ssid     = "United.10_2.4";
const char *password = "Lalmatiya@4!";

const long utcOffsetInSeconds = 19620;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);


#define SUN D0
#define MON D1
#define TUE D2
#define WED D3
#define THR D4
#define FRI D5
#define SAT D6

void setup() {
  Serial.begin(9600);
  pinMode(SUN, OUTPUT);  
  pinMode(MON, OUTPUT);
  pinMode(TUE, OUTPUT);
  pinMode(WED, OUTPUT);
  pinMode(THR, OUTPUT);
  pinMode(FRI, OUTPUT);
  pinMode(SAT, OUTPUT); 

  WiFi.begin(ssid, password);

  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }

  timeClient.begin();
}

// the loop function runs over and over again forever
void loop() {

  timeClient.update();
  
  String date = daysOfTheWeek[timeClient.getDay()];
  String time = timeClient.getFormattedTime();

  String currTime = (date+ " " + time);
  Serial.println(currTime);
  delay(1000);


//   digitalWrite(SUN, LOW);  
//   delay(100);                      
//   digitalWrite(SUN, HIGH);  
//   delay(100);
//   // ..........
//   digitalWrite(MON, LOW);  
//   delay(100);                      
//   digitalWrite(MON, HIGH);  
//   delay(100);
//   // ..........
//   digitalWrite(TUE, LOW);  
//   delay(100);                      
//   digitalWrite(TUE, HIGH);  
//   delay(100);
//   // ..........
//   digitalWrite(WED, LOW);  
//   delay(100);                      
//   digitalWrite(WED, HIGH);  
//   delay(100);
//   // ..........
//   digitalWrite(THR, LOW);  
//   delay(100);                      
//   digitalWrite(THR, HIGH);  
//   delay(100);
//   // ..........
if (currTime == "Friday 23:21:30")
{
  for (int i=0; i < 10; i++)
  {      
    digitalWrite(FRI, HIGH);  
    delay(100);
    digitalWrite(FRI, LOW);  
    delay(100);    
  }
}
// // ..........
//   digitalWrite(SAT, LOW);  
//   delay(100);                      
//   digitalWrite(SAT, HIGH);  
//   delay(100);
}
