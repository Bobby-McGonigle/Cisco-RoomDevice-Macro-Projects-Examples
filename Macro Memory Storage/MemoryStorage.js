const xapi = require('xapi');

/*
This Script was created in order to store information that would need to persist after the Endpoint Restarts, or if the Macro Environment Crashes.

This is especially useful if you have variables in your script that are dynamic and you would like to recover their previous states in the event a restart or a crash does occur.

An example use case would be applying password protection on an endpoint that unlocks advanced UI elements and control. 
Where the user group can update the passwords themselves, and the information is stored on the endpoint.

//
Created by Robert (Bobby) McGonigle Jr
Video Conferencing Services Technician at Harvard University Information Technology
*/

var stored_Information;
var lastStore;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
"mem" is the variable we'll use to store up to 20 blocks of unique information for our script.

When using "mem", do not change the name of the "block_[n]" object, this is important for the rest of the script to work properly.

Feel free to change the "id" object string to something related to your project. This is meant to help make your code/logs more readable and easy to work with. It is not stored.

The "value" object is the information stored in this block. You can enter information in as a default set to start with, but this will ultimately change over time.

For example, I want to use "block_0" as a divisible wall state
  - I would change the "id" to "wallStatus" for me to understand its role in my code.
  - I would store the "value" as true/false depending on the state.
    - If I were to run '''console.log(mem.block_0)``` for the above example, my log will print {
      //	{ id: 'wallStatus', value: 'true' }
    }
*/
var mem = {
    'block_0': { //Do Not Change, important for the rest of the code
        "id": "wallStatus", //Change understand which Block of information you're changing
        "value": "" //Feel free to leave blank, or set a default value
    },
    'block_1': {
        "id": "slot_2",
        "value": ""
    },
    'block_2': {
        "id": "slot_3",
        "value": ""
    },
    'block_3': {
        "id": "slot_4",
        "value": ""
    },
    'block_4': {
        "id": "slot_5",
        "value": ""
    },
    'block_5': {
        "id": "slot_6",
        "value": ""
    },
    'block_6': {
        "id": "slot_7",
        "value": ""
    },
    'block_7': {
        "id": "slot_8",
        "value": ""
    },
    'block_8': {
        "id": "slot_9",
        "value": ""
    },
    'block_9': {
        "id": "slot_10",
        "value": ""
    },
    'block_10': {
        "id": "slot_11",
        "value": ""
    },
    'block_11': {
        "id": "slot_12",
        "value": ""
    },
    'block_12': {
        "id": "slot_13",
        "value": ""
    },
    'block_13': {
        "id": "slot_14",
        "value": ""
    },
    'block_14': {
        "id": "slot_15",
        "value": ""
    },
    'block_15': {
        "id": "slot_16",
        "value": ""
    },
    'block_16': {
        "id": "slot_17",
        "value": ""
    },
    'block_17': {
        "id": "slot_18",
        "value": ""
    },
    'block_18': {
        "id": "slot_19",
        "value": ""
    },
    'block_19': {
        "id": "slot_20",
        "value": ""
    }
};

/*
getMemInformation()
This is used to reach out to Facility Service 5 Name's text field and update the mem variable above.
- The "~" is used as the .split() mechanism, so it would be best to avoid using the "~" when storing information.
- - If you have a need for "~", then you should update getMemInformation() and memChain() to reflect a new .split() symbol
*/
function getMemInformation() {
    xapi.config.get('FacilityService Service 5 Name').then((config) => {
        stored_Information = config.split("~");
        mem.block_0.value = stored_Information[0];
        mem.block_1.value = stored_Information[1];
        mem.block_2.value = stored_Information[2];
        mem.block_3.value = stored_Information[3];
        mem.block_4.value = stored_Information[4];
        mem.block_5.value = stored_Information[5];
        mem.block_6.value = stored_Information[6];
        mem.block_7.value = stored_Information[7];
        mem.block_8.value = stored_Information[8];
        mem.block_9.value = stored_Information[9];
        mem.block_10.value = stored_Information[10];
        mem.block_11.value = stored_Information[11];
        mem.block_12.value = stored_Information[12];
        mem.block_13.value = stored_Information[13];
        mem.block_14.value = stored_Information[14];
        mem.block_15.value = stored_Information[15];
        mem.block_16.value = stored_Information[16];
        mem.block_17.value = stored_Information[17];
        mem.block_18.value = stored_Information[18];
        mem.block_19.value = stored_Information[19];
    });
}

getMemInformation();

/*
memChain() is used to assemble the new Facility Service 5 Name text field.
- This information is stored as a single string, so we need to concatenate all mem.block[n] values together and insert our "~" .split() symbol in between each piece of information
*/
function memChain() {
    let memChain = mem.block_0.value + "~" + mem.block_1.value + "~" + mem.block_2.value + "~" + mem.block_3.value + "~" + mem.block_4.value + "~" + mem.block_5.value + "~" + mem.block_6.value + "~" + mem.block_7.value + "~" + mem.block_8.value + "~" + mem.block_9.value + "~" + mem.block_10.value + "~" + mem.block_11.value + "~" + mem.block_12.value + "~" + mem.block_13.value + "~" + mem.block_14.value + "~" + mem.block_15.value + "~" + mem.block_16.value + "~" + mem.block_17.value + "~" + mem.block_18.value + "~" + mem.block_19.value;
    return memChain;
}

/*
updateMemBlock(newInfo, targetBlock)
This is the function you will start to make use of in your script.
- Simply call "updateMemBlock(newInfo, targetBlock)" whenever you need to update new information.
- - The "newInfo" parameter should be a string < 50 characters** and is the information you want to pass into memory storage.
- - The "targetBlock" parameter is the block you want to update in the Facility Service 5 Name slot

For exmaple, if I wanted to update the "wallStatus" from the example above from true to false I would write the following into my script
 - updateMemBlock('false', 'block_0');
 The console will then print the following to acknowledge the change
  - 'Memory Update ==> Block_Id: "wallStatus" changed from: "true" to: "false"'
  - You can see this change in the Configuration menu, under facility service 5 Name (Be sure to refresh this page after changes)
  - - or you can SSH into the system and run xConfig FacilityService Service 5 Name and should print...
  - - - *c xConfig FacilityService Service 5 Name: "true~2~3~4~5~6~7~8~9~10~11~12~13~14~15~16~17~18~19~20" **end (Be sure to re-execute after changes)
  
**The 50 Character Limit is an estimate. Facility Service 5 Name Slot has a limit of 1024 Characters. 
**This Script set up with 20 blocks of memory, which consumes a minimum of 20 characters with the .split() symbol. Leaving 1004 characters for you to use.
**Now with that being said, it's not a strict limit. Some strings in blocks can have 85 characters, while others have 15. So long as your total character limit is under 1004 characters, you should be fine.
*/
function updateMemBlock(newInfo, targetBlock) {
    getMemInformation();
    sleep(500).then(() => {
        switch (targetBlock) {
            case targetBlock:
                lastStore = mem[targetBlock].value;
                mem[targetBlock].value = newInfo;
                xapi.config.set('FacilityService Service 5 Name', memChain());
                if (lastStore !== newInfo) {
                    console.log('Memory Update ==> Block_Id: "' + mem[targetBlock].id + '" changed from: "' + lastStore + '" to: "' + newInfo + '"');
                }
                break;
        }
    });
}

/*
Try Changing the Value of this testBlock value from true to false, and see how it updates the Facility Service 5 Name Slot. 
Be sure to refresh the page when viewing Facility Service 5 in the configuration menu :)

NOTE: This script can be modified to include more memory blocks, or less as needed. This can restrict you character limits, but increase your unique information.
- For example, if we wanted 100 blocks....
    (1024-100)/100 = ~9 characters per block
  - If we wanted 10 blocks....
    (1024-10)/10 = ~101 characters per block
*/

var testBlock = true;

if (testBlock === true) {
    updateMemBlock('true', 'block_0');
    updateMemBlock('2', 'block_1');
    updateMemBlock('3', 'block_2');
    updateMemBlock('4', 'block_3');
    updateMemBlock('5', 'block_4');
    updateMemBlock('6', 'block_5');
    updateMemBlock('7', 'block_6');
    updateMemBlock('8', 'block_7');
    updateMemBlock('9', 'block_8');
    updateMemBlock('10', 'block_9');
    updateMemBlock('11', 'block_10');
    updateMemBlock('12', 'block_11');
    updateMemBlock('13', 'block_12');
    updateMemBlock('14', 'block_13');
    updateMemBlock('15', 'block_14');
    updateMemBlock('16', 'block_15');
    updateMemBlock('17', 'block_16');
    updateMemBlock('18', 'block_17');
    updateMemBlock('19', 'block_18');
    updateMemBlock('20', 'block_19');
} else {
    updateMemBlock('a', 'block_0');
    updateMemBlock('b', 'block_1');
    updateMemBlock('c', 'block_2');
    updateMemBlock('d', 'block_3');
    updateMemBlock('e', 'block_4');
    updateMemBlock('f', 'block_5');
    updateMemBlock('g', 'block_6');
    updateMemBlock('h', 'block_7');
    updateMemBlock('i', 'block_8');
    updateMemBlock('j', 'block_9');
    updateMemBlock('k', 'block_10');
    updateMemBlock('l', 'block_11');
    updateMemBlock('m', 'block_12');
    updateMemBlock('n', 'block_13');
    updateMemBlock('o', 'block_14');
    updateMemBlock('p', 'block_15');
    updateMemBlock('q', 'block_16');
    updateMemBlock('r', 'block_17');
    updateMemBlock('s', 'block_18');
    updateMemBlock('t', 'block_19');
}
