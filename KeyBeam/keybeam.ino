#include <Keyboard.h>

char KEY_SPACE = 32;

#define DIVIDE_LED 13

#define COMBINE_LED 12

#define SENSOR_PIN 2

// variables will change:
int sensorState = 0, lastState=0;// variable for reading the pushbutton status

void setup() {
  // initialize the LED pin as an output:
  pinMode(DIVIDE_LED, OUTPUT);
  pinMode(COMBINE_LED, OUTPUT);
  // initialize the sensor pin as an input:
  pinMode(SENSOR_PIN, INPUT);
  digitalWrite(SENSOR_PIN, HIGH); // turn on the pullup
  Serial.begin(9600);
}

void loop(){  
  // read the state of the pushbutton value:
  sensorState = digitalRead(SENSOR_PIN);

  // check if the sensor beam is broken
  // if it is, the sensorState is LOW:
  if (sensorState == LOW) {     
    // Divide mode LED Active
    digitalWrite(DIVIDE_LED, HIGH);
    delay(10);
    digitalWrite(COMBINE_LED, LOW);
    delay(10);
  } 
  else {
    // Combine mode LED Active
    digitalWrite(DIVIDE_LED, LOW);
    delay(10);
    digitalWrite(COMBINE_LED, HIGH);
    delay(10);
  }

  // Detect Sensor State
  if (sensorState && !lastState) {
    Serial.println("Beam Restored -> COMBINE");
    delay(5);
    Keyboard.press(KEY_SPACE);
    delay(5);
    Keyboard.release(KEY_SPACE);
  } 
  if (!sensorState && lastState) {
    Serial.println("Beam Broken -> DIVIDE");
    delay(5);
    Keyboard.press(KEY_BACKSPACE);
    delay(5);
    Keyboard.release(KEY_BACKSPACE);

  }
  lastState = sensorState;
}
