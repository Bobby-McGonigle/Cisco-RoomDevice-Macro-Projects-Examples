# Meet the Keybeam!

## Inspiration
Most of what I wanted to do around divisible spaces revolved around making configuration changes to a few Cisco Endpoints.

Thanks the powers at Cisco, the Macro editor gave me a playground to do just that; to be able to send information between 2 Room Devices and triggering the xApi. An good example of this can be found the [T10 Command Center](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/tree/master/T10%20Command%20Center) script.

Now I have all the pieces I needed to do some Cisco Based combine and divide scenarios, especially since the Sx80/Room Kit Pro have such a robust audio matrix available.

My only problem was the User.

My first combine and divide scenario (which ran beautifully I might say) failed because of users. I had a button on the Touch 10 that let you trigger combine/divide, but no one noticed it.
I blame myself for my poor communication skills, not the user.

I knew there are solutions out there to enable this with Cisco quite easily, but the overhead was a bit much for what we've already invested in.

So thanks to product adds in my email and my overwhelming excitement for this idea, I decided to craft the KeyBeam!

## Goal
* Craft a Room Partition Sensor that works with Cisco Room Systems and the Macro editor
  * It had to be:
    * Simple enough to craft
    * A significant drop in cost
    * Reliable
#### Spoiler image!
![The Keybeam](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/images/IMG_2650.jpg)

## What You'll Need
* **A Project in Mind**
  * A Fun project to do on its own, but really worth your while with a project in mind
* Cisco Room Series or Board Series endpoint (Though supported, my Dx80 crashed, so I'd stick to the Room and Board series, haven't fully tested the Sx or Mx series)
* Admin Access
* Some knowledge on the xApi
* Some Knowledge in editing scripts
  * Both Javascript and C++
    * This is project dependent
* USB Micro B Male to USB A Male

  * [Arduino Micro](https://store.arduino.cc/usa/arduino-micro)
    * **NOTE**: This particular micro-controller registers as an HID device, which is precisely how we're going to send commands to the Room Device
    * I believe any board with the [ATmega32U4](http://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7766-8-bit-AVR-ATmega16U4-32U4_Datasheet.pdf) Micro-controller will do fine
  * 2x 10k Ohm resistor
  * 1 Red LED
  * 1 Green LED
  * [IR 5mm Beam Break sensor](https://www.adafruit.com/product/2168)

## Getting Started

### Step One
Let's start with [keybeamInput_Macro.js](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/keybeamInput_Macro.js)
* It's a short and simple script
  ```javascript
    const xapi = require('xapi');

    xapi.config.set('Peripherals InputDevice Mode', 'On');

    xapi.event.on('UserInterface InputDevice Key Action', (event) => {
        //console.log('KEY = '+ event.Key + ' || Code = ' + event.Code + ' || Type = ' + event.Type);
        if(event.Type == 'Pressed'){
        switch(event.Key){
          case 'KEY_SPACE' : //Combine Key
            xapi.command("UserInterface Message Prompt Display", {
                Title: 'Combined',
                Text: 'Your space has Combined',
                Duration: 0,
                'Option.1': "Dismiss",
            });
            console.log("Beam Formed, running COMBINE instructions");
            break;
          case 'KEY_BACKSPACE': //Divide Key
            xapi.command("UserInterface Message Prompt Display", {
                Title: 'Divided',
                Text: 'Your space has Divided',
                Duration: 0,
                'Option.1': "Dismiss",
            });
            console.log("Beam Formed, running DIVIDE instructions");
            break;
          }
        }
      }
    );
  ```
    * This script first enables the xConfiguration we need to make use of a USB device
    * Then we have a simple switch-case arguments to listen for specific key clicks being pressed
      * **NOTE**: If making modifications, or using other HID devices, I recommend using this in your log under the Key-action event
      
      ``` console.log('KEY = '+ event.Key + ' || Code = ' + event.Code + ' || Type = ' + event.Type); ```
      
      It will help you discover any unknown Keys in your testing, or verify that you're coding for the correct ones :smiley:
    
    * Now this script is short, but it's mainly a template to go along with [keybeam.ino](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/keybeam.ino)
    * If making a divide/combine set-up like myself, then simply modify the 2 switch case arguments to run the xAPI you need per state
* Once you've completed your edits, load in this script into your Room Device's Macro editor and enable the script

### Step Two
Moving over to the [keybeam.ino](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/keybeam.ino)

  * This script is written in C++ and can be easily modified
    * Can be easily improved upon too, not my final script, but enough to get you started :smiley:. 
  * You can either download and re-use this script as is, or you can modify it to create input in all sorts of other ways.
  
  ![Wiring Diagram](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/images/Arduino%20Micro%20Wire.png)


   * The diagram above shows how each piece is connected to the Arduino Micro
     * In this example, we have set the the 5mm Beam break sensor as our input and we have 2 LEDs as output.
   * I recommend you start this on a breadboard, before making more permanent connections
 * This Script is set up to press, then immediately release a Keyboard Key when the beam is formed, and a different key when the beam is broken
   * Since this set-up has a sending and receiving IR set, it will work well with reflective surfaces, but not so much transparent.
* If you've made any changes to this script, such as which Keys you intend to use, or added more, be sure to address those changes in the keybeamInput_Macro.js script as well
* Compile your script into the arduino
* Once compiled, plug the USB connection to the Room Device
  * It should receive power from the endpoint just fine, and start operating

### Step Three
Testing

* Use your hand to break the IR beam, and see if the LEDs on the board function as intended
  * If this passes, then we are receiving input correctly on the arduino
* Check to see if your xAPI have been executed on the endpoint

* If replicating this example 1 to 1, then you should see a message prompt with different information on a breaking or forming of the beam.
* Check out [this link](https://github.com/Bobby-McGonigle/RoomDevice-Macro-Samples/blob/master/KeyBeam/images/POC_KeyBeam.mp4) to get a Proof of Concept video of this KeyBeam in Action

## Things to consider
* I recommend reviewing this example, I have thus optimized it and added more options for my use case such as (will post the final script post-covid)
  * A Heartbeat pulse
  * Manual Combine and Divide buttons
  * Manual Reset button
* 3d Printing a proper Case (Still working on one, will post when finished)
* Works fine on USB 2.0 extension systems
* This isn't the only sensor on the market that can connect to arduino

## How to use this for a combine/divide setup
* Keybeam triggers ```Combine``` key
* Endpoint A sees ```Combine``` and reconfigures itself for a combined scenario
* Endpoint A then sends an HTTP message to Endpoint B
* Endpoint B see ```Combine``` Message
* Endpoint B reconfigures itself for a combined scenario
    * Then the opposite for Divide :smiley:

Other Use Cases
* Creating a Touch pad with physical keys, with braille inscribed on them for those who have a vision impairment
* Creating Physical Macro buttons for a custom approach to your room
* Creating a camera control Joystick for a control booth

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Adafruit's Coding Community
* Arduino's Coding Community
* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*

