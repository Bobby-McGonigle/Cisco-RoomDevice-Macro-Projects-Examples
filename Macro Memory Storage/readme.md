# Simply Store Some Values with [MemoryStorage.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Macro%20Memory%20Storage/MemoryStorage.js)

## Inspiration

* As I dove deeper into Macros, I learned that I can create some really fantastic tools for my users, but the more creative I got, the more complex the challenge.
* I learned that 
  * My variables reset if the Macro Environment crashed (beacuse I'm a noob, I get it)
  * My variables reset if the system restarts (I know, I know, noob on javascript, I get it)
* Joking aside, I had some real challenges trying to keep a consistant experience in some use cases and needed a more complex ballet of variables in other use cases
* One thing I did have at my disposal were _Unused Assets_
  * Peices of the configuration my environment had little use for.
    * Not to say they aren't important, it's just our org doesn't need them.

## Introducing "xConfiguration FacilityService Service 5 Name"
* My unused asset of choice, but can be substituted with another comparable text feild, keep an open mind if you use this asset already, there may be another way.

## Properties
**FacilityService Service 5 Name** has 2 unique properties that make this an exellent spot for me.
* It can store up to _1024_ characters
  * That's alot of room
* The service slot will **NOT** show on the touch 10, so long as I don't fill in a ```FacilityService Service 5 Number```
  * This is important, because i don't want that help desk Icon showing, and I don't want this seen by users if at all possible.


## How this works

There are several functions for getting an updating information in this code, and a few handy tools to help manage it too.

### getMemInformation()
This function is built on line 128 of [MemoryStorage.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Macro%20Memory%20Storage/MemoryStorage.js)
* Its main purpose is to reach out to my unused asset (FacilityService Service 5 Name), split up the information, and assign it to the ```mem``` array.
* I call it as soon as the script starts, and a few other spots to make sure I have up to date information

### updateMemBlock(newInfo, targetBlock)
This is the _KEY_ function you will call throughout the rest of your use case and is built on line 196 of [MemoryStorage.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Macro%20Memory%20Storage/MemoryStorage.js)
* It's how you update you memory in your unused asset, and all the temp information stored in the ```mem``` array.
  * ```newInfo``` is the string you'll enter in to replace the previous information stored in this block of memory
  * ```targetBlock``` is the memory block you want to change in the ```mem``` array.
  * For example, if i want to change block_0 in the ```mem``` array, I'd write the following
  ```
  var mem = {
    'block_0': {
        "id": "slot_1", 
        "value": "" 
    },
    'block_1': {
        "id": "slot_2",
        "value": ""
    }....
    
    updateMemBlock('Hey, I am New Info', 'block_0'); //I'd write it like this
  ```
  * block_0's Value will change from '' to 'Hey, I am New Info'
  * _What's the ID for?_
    * The ID is a unique Identifier for you to reference in your script. Name it something that makes sense to your use case.
* You'll notice 2 other functions get called within updateMemBlock(newInfo, targetBlock)
  * The first is **memChain()**
    * memChain() is responsible for building the new single string chain to be inserted back into FacilityService Service 5 Name.
    * it simplifies the code a bit, and allows it to be a bit more legible.
  * The second is **memoryCapacity()**
    * memoryCapacity() is a tool for You. As I noted above, FacilityService Service 5 Name has a character limit of 1024. This function will print out a percentage of how full your memory storage is while developing.
    * Hopefully this helps you stay on target :)
    
## Great Use Cases to consider
* Creating a password to lock and unlock certain features of the Room Device
  * Great for public spaces
  * Special Integrations
* Saving a rooms state for Matrixing, Audio Routing, etc
* Saving GUI feedback information
  * Update the value of all Widgets after a restart


