# Command Center

### Goal

User group wanted a way to control several Cisco Room Devices systems from a single interface

![Parent Interface](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/T10%20Command%20Center/commandHub%20Menu.png)

### Use Cases

* AV Control Menu for Cisco Endpoints
* Remote Building Support
* Tool for Administrative Assistants

## How the script works
* The parent system will post a message to the child system with a single single string of information.
* This information includes the Type of command to be executed by the child system, and any acompanying User Input that may be needed.
  * For example, in order to place a call, the Parent endpoint would receive a number entered by the user and append it to ```001```
  * This new string would be sent to the endpoint as ```001:someNumber```
  * The child endpoint would see that ```001``` is a dial command, and use the ```someNumber``` user information to place a call a call upon receiving it.
*Not all command have user input, but still follow the same scheme.

## How to operate the UI
* Select the target room system
* Select the task to send to that system
  * If prompted, provide the neccessary information, such as Dial String, DTMF, Volume, Et.
* When complete, you will see the information you entered in the "Input Stored ===>" row
* When ready to execute the command, press "Send Active Task

* **NOTE**: You can swap between room systems without changing the task information
  * Use, enter 1 number to dial, send it to each system without having to re-enter the number

## Prerequisites
* 2 or more Macro compatible Cisco Room Devices
  * The Sx10 could be compatible if making use of the jsxapi library and an intermediary system
* The 2+ systems can communicate over HTTPS in your network environment
* Admin access
* Some knowledge of the Macro Environment
* Some knowledge in editing scripts

## Getting Started

This tool requires a script to rest on the Parent system and a script on each accompanying Child system.

Please Download the following Scripts prior to starting:
* _Parent Scripts_
  * [commandHub_Parent_Template.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/T10%20Command%20Center/commandHub_Parent_Template.js)
  * [commandHub_Parent-UI_Template.xml](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/T10%20Command%20Center/commandHub_Parent-UI_Template.xml)
* _Child Script_
  * [commandHub_Child_Template.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/T10%20Command%20Center/commandHub_Child_Template.js)

### Step 1 - Modify the Parent Script (commandHub_Parent_Template.js)
* The Parent script will need the neccessary information to connect over the netwrok to the child system
  * On Line 27, you'll find ```const = devices``` and a list of example devices here
  
  ```javascript
  const devices = {
                  'default':   {'Url': 'https://x.x.x.x/putxml',
                                'Header': [defaults.xml, defaults.auth + 'YWRtaW46'],
                                'AllowInsecureHTTPS': defaults.https},

                  'room_001':   {'Url': 'https://'+{/*Enter Device IP Here*/}+'/putxml',
                                'Header': [defaults.xml, defaults.auth + {/*Enter Device base64 Authentication Credentials Here*/}],
                                'AllowInsecureHTTPS': defaults.https},

                  'room_002':   {'Url': 'https://'+{/*Enter Device IP Here*/}+'/putxml',
                                'Header': [defaults.xml, defaults.auth + {/*Enter Device base64 Authentication Credentials Here*/}],
                                'AllowInsecureHTTPS': defaults.https}
}```
 


  * This is structured example of the information you'll need in order to connect to the child system
    * I recommend you leave defaults as is, since it's good to have as a reference.
  * Edit room_001 & room_002 to contain the IP and admin credentials needed to work with this script
    * Notice on the default device, the credentials are ```'YWRtaW46'```
    * This is "admin" written in base64
    * [base64encode.org](https://www.base64encode.org/) is a great tool
      * When encoding to base64, your username and password should be formated like so ```username:password```
* The last peice you'll need to edit in this script is the Switch Case values for room_01 and room_02
  * Change these cases to match the new names of the devices you inserted. If you chose to keep room_01 and room_02 as the naming convention, please disregard this instruction.
  ```xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.Type == 'released'){
    let message = command+":"+userInput;
        switch(event.Value||event.WidgetId){
          case 'event1':
            device = 'room_001';
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event2':
            device = 'room_002';
            console.log('"'+device+'"'+ " selected.");
            break;```
* Feel free to continue to add in devices to expand how many you'd like to control from the parent system.

### Step 2 - Load in the Modified Parent Script

* Log into your the Parent video system
  * The Dx70/80 or Webex Desk Pro make for a great parent system, but any Macro enabled system will do fine.
* Load in the script in the Macro Editor
* Adjust the system config to allow to enable the HTTP Client and allow for insecure HTTPS
* Enable the script

### Step 3 - Load in and Modify the UI (commandHub_Parent-UI_Template.xml)
* Go to the UI extensions editor
* Load in the .xml file
* Modify the row for Select Room system to match the room names of your child systems.
  * Be sure to match the Widget Id to the case in your switch above
* Push the new UI to your endpoint

### Step 4 - Load in the Child script to each child endpoint (commandHub_Child_Template.js)
* No changes need to occur for this script.
* Load this into the Child system macro editor and enable the script
* Adjust the system config to allow to enable the HTTP Client and allow for insecure HTTPS

## Things to consider
* This script did not account for all neccessay control features, as this particular ask had no need for Camera control and other features found on Room Devices.
* Depending on your need, you may need  to change UI, parent and child scripts to add in any missing elements for your use case.


## Deployment

There are many flavors of deployment, but I recommned using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* **Magnus Ohm** - *Provided the base communication video between endpoints*
* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*
