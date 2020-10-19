# USB Headset Mod

## Inspiration

The Room Kit mini, the pseudo successor the the Sx10, in many ways is a fantastic tool, but also a drawback to its predecessor.

I'm not hear to bash the Room Kit mini, I love the device. It is a unique device in the Room Device portfolio, but you do sacrifice sacrifice a few items when upgrading from an Sx10

The biggest flaw in my mind is the lack of support for an additional microphone. In my experience, the Sx10's ability to add a microphone in a space really made the difference. Not all organizations have the budget to acoustically treat an environment and the internal Microphone on All room systems are set as they are with no way to tune them. The external microphone allowed us to get an element closer to the speaker and reduce it's input level to help improve acoustically awful spaces.

But Cisco did not leave us in the dust, there is Headset support, but that has its unique challenges as well.

Headset mode: 
* Is toggle-able
* Takes over the Microphones
* Takes over the speaker output

All in all, headset mode is only made with a single user in mind

However, there are devices that can look like a headset from the Room Kit Mini's (RK MINI) perspective, but function as an in room DSP, allowing us to expand our audio footprint

So the inspiration of this script is to resolve the user's ability to toggle this setting on/off

## Goal

Prevent the user in a modified headset RK Mini space from de-selecting the Headset option on the Touch Interface

Why?!?!

Well if you're running all audio through the headset feature, letting them shut that off might not pan over well when trying to create a great experience :smiley:

## What You'll Need

* Cisco Room Kit Mini on ce9.8.X or greater (Works on Cloud registered endpoints too)
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts
* A USB Headset to test with
  * More prefereably a USB Solution that will serve as Microphone(s)/Speaker(s) 

## How does the script work

* The script simply listens to the **Audio SelectedDevice** xStatus
  * If a user were to change this to **Internal**, then the system will change this back to USBHeadset and give the user the prompt below
  ![User Prompt-USB Headset](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/RK%20Mini%20USB%20Headset%20Mod/images/blockInternal%20Mode.png)

**NOTE**: There is a testing mode in this script too. This will allow you to easily toggle on and off this tool while testing.

On line 22 change the **active** object to ```true``` then a new UI will load in for you to test this script. Be sure to change this to false on a production endpoint :smiley:

```javascript
var testMode = {
  active: false, //<true/false>
  state: 'On' //do not modify this value
}
```
You will get a UI that will provide USB Info and the ability to toggle on/off the tool

![Test Mode UI](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/RK%20Mini%20USB%20Headset%20Mod/images/testMode.png)

## Getting Started

* Go to [UsbHeadsetModv1-0-0.js](), copy the contents of this script
* Paste this script in as a new Macro on a Room Kit Mini
* Save the script, and toglle the script on

* Then plug in a USB Headset **or headset like device** :smirk:

The script should be up and running!

## Things to consider
* This is definitley a work-around, so please **TEST! TEST! TEST!**
  * This is not the intended or expected use of the USB Headset feature, be sure to test this on stable software and be pro-active and test this on preview or beta software if possible
* I have no idea if this work on the Desk Pro, but I'll know soon enough :smirk:

## Use Cases
* Crafting a USB compatible Audio DSP for Audio expansion
* Creating a private room, where only USB is allowed
* Creating a Kiosk Endpoint, where only USB Audio is allowed

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to Jordan Eliason for inspiration and testing this script on a real hardware solution
* My End Users
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
