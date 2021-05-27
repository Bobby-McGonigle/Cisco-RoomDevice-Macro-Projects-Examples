# Memory Functions!

### News!

This is the latest installment of Macro Memory Storage and it has been completely re-written. If you had used **MemoryStorage.js** or **MemoryStorage_V2.js** they are now in the [legacy](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Macro%20Memory%20Storage/legacy) folder with the previous readme still contained here for reference. But you should check out this new one for sure :smirk:

## Update
* Spelling and grammar fixes
* Replaced getSourceScriptName() with a stable method of acquiring the script name
* Added mem.localScript variable to work with module.name
* Added mem.Info() - This will print information about Memory Functions.

## Inspiration

The need for a better and more robust version of the initial Macro Memory script.

The original was limited, required a bit of set-up and wasted a facility service slot.

With the enhancements of the Macro Editor in ce9.14 and Higher, we can make a more refined version eliminating those constraints.

## Function List

For more detail on how to use these functions, please scroll to the of end of this readme. Details listed under **[Function Details](#function-details)** or click on any of these hyper-links to jump to any of these functions.

* [mem.write(key, value)](#memwritekey-value)
* [mem.write.global(key, value)](#memwriteglobalkey-value)
* [mem.read(key)](#memreadkey)
* [mem.read.global(key)](#memreadkeyglobal)
* [mem.remove(key)](#memremovekey)
* [mem.remove.global(key)](#memremoveglobalkey)
* [mem.print()](#memprint--memprintglobal)
* [mem.print.global()](#memprint--memprintglobal)
* [mem.info()]()

## What You'll Need
* A compatible Endpoint
  * Sx20, Sx80, Mx Series, Dx Series
  * Room Series, Board Series, Desk Series or greater
* Admin Access to the Room Device
* Room Device on CE9.14.X or greater, or Stable Cloud Channel
* Some Knowledge on the Macro Editor
* Some Knowledge on Javascript
* Some Knowledge on Importing/Exporting Modules

## How does the script work

When "**Memory_Functions**" is activated on your endpoint, it will generate a new Macro called "**Memory_Storage**" by default.
  * This will not re-generate a new one if one already exists on your endpoint :smiley:

This new Memory_Storage macro will work alongside the Memory_Functions Macro as your main storage repository

You won't see this at first, so please **refresh your page** to see this change apply :smiley:

In addition to generating the storage repo for your endpoint, it will also search your endpoint for any script that do no have the Memory Functions imported and will edit each macro to provide an import. **NOTE**: This is disabled by default, but can be enabled in the configurations menu if wanting to run this on all scripts.

Once all of that has processed (it's rather quick) you should be ready to make use of all of the functions available in Memory_Functions

## Getting Started
* Go to [Memory_Functions.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Macro%20Memory%20Storage/Memory_Functions.js)
* Copy and Paste the contents of this script in a as a new macro on your Cisco Room Device
  * Label this Macro **Memory_Functions**
* Make changes to the configuration menu on line 20 of the script
* Save the script and toggle it on. This should begin to work immediately
  * Be sure to refresh your browser when it's done to see all the changes apply :smiley:

**Note**: If autoImport is set to false, you will need to manually import the memory functions to each target script.

To manually import Memory_Functions, simply add this line of code to any of your scripts

```import { mem } from ‘./Memory_Functions; mem.localScript = module.name;```

## Configuration Menu
Starting on line 20 of [Memory_Functions.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Macro%20Memory%20Storage/Memory_Functions.js), there is a small configuration menu where you can make some changes. More to come :smiley:

```javascript
var config = {
  "storageMacro": "Memory_Storage",
  "autoImport": "false",
}
```
**config.storageMacro** : This is the name of the Storage Macro for Memory_Functions, feel free to rename this as you see fit.
* Note: Once changed, your previous Storage macro and will be inaccessible to the script.

**config.autoImport**: This accepts the boolean values true and false. This also accepts the string "activeOnly
* true : Will add ```import { mem } from ‘./Memory_Functions; mem.localScript = module.name;``` to any script that contains ```import xapi from ‘xapi’```
  * Note: Once applied to a script, it will not reverse the import when changed to false.
* false : Disables autoImport
  * Note: This will not remove any previously run imports
* "activeOnly : Case sensitive; Will add ```import { mem } from ‘./Memory_Functions; mem.localScript = module.name;``` to any script **ACTIVE SCRIPT** that contains ```import xapi from ‘xapi’```
  * Note: Once applied to a script, it will not reverse the import when change to false.

## Things to consider
* We're always looking for way to improve this script, if you have an idea, send it along :smiley:
* ~~The function getSourceScriptName(), found in Memory_Functions, **relies on crashing your script** to get the script name. It currently does **NOT** cause any issues and works reliably on ce9.14 and higher. Current Date Dec 2020~~
  * ~~So far it works, but we wanted you to know. We're hoping to find a better way to have a script discover it's own name. At them moment, this is the only way :sweat_smile:~~
  * getSourceScriptName() has been replaced with ```mem.localScript = module.name```

## Author(s)
* Zacharie Gignac - Original Author and Project Lead
* Robert McGonigle - Co-Author/Editor and Tester

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to Zacharie Gignac for finding a new way to write memory to the endpoints, involving me in the project and allowing me to post this on Github
* Our End Users
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*


### Function Details

For the purposes of these function descriptions/guide we will be referencing the below **Memory_Storage** example

Feel free to copy these contents into your **Memory_Storage** script and follow along.

```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    }
}
```

## Exported Functions
All functions under ```var mem``` are exported. These are: 

* mem.write(key, value)
* mem.write.global(key, value)
* mem.read(key)
* mem.read.global(key)
* mem.remove(key)
* mem.remove.global(key)
* mem.print()
* mem.print.global()
* mem.info()

### mem.write(key, value)

**mem.write(_key_, _value_)** is a Promise and expects an object key and a value to assign that object as parameters. 

This is also a function that only effects the script your currently working in. That way you can work in each script independently, without having to worry if you're mixing information in your Memory_Storage script with another macro. All non **.global()** mem functions only effect the script you're working with.

Let's create a new macro called "myTestMacro"

In this macro, let's write a new piece of information using mem.write

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions'; mem.localScript = module.name;

mem.write('myInfo', 'ABC123')
```
Save this script, once it runs, _refresh your browser_ and you will see this new piece of information written to the **Memory_Storage** Macro as

```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": { //<<<-- Where did this value come from?
        "myInfo": "ABC123" //<<<-- Your newly written object is Here!
    }
}
```
Notice how, in our example above, we did not have an object called "**myTestMacro**". What mem.write() will do is use the name of the script your working with as a top level object then nest the information you had wrote as another object. Allowing us an area to save information for each script independently.

This is how we're able to avoid other scripts from accessing information they don't necessarily need :smiley:

#### What if I want to right more that just 1 piece of information?
* You can, but you need to be mindful that this process needs to resolve a promise first before it can fully write, so syntax is important for a successful write

### Writing Style A (preferred)
Build a nested object in your macro then write this object when it's finished being modified in your script.

For example

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions'; mem.localScript = module.name;

var myNestedObject = { //<<<-- Declare an object
    "newObject" : "Hello from New Object"
}

myNestedObject["anotherObject"] = { //<<<-- Add more to that object
                                    "Test_A": "3.127",
                                    "Test_B": "8.625"
                                   }
console.log(myNestedObject)
/*
Printed in Console
{
  "newObject" : "Hello from New Object",
  "anotherObject" : { 
                     "Test_A": "3.127",
                     "Test_B": "8.625"
                    }
*/

mem.write('myNestedObject', myNestedObject) //<<<-- Then write that object to memory
```

Style A will allow you to quickly build your information and store it all at once

### Writing Style B

If you need to write multiple nested objects, then either build a larger nested object in your script or chain your mem.write promises

For example
```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions'; mem.localScript = module.name;

var myNestedObject = { //<<<-- Declare an object
    "newObject" : "Hello from New Object",
    "secondObject" : "Hello from Second Object"
}

var myOtherObject = { //<<<-- Declare another object
    "Test_A" : "3.127",
    "Test_B": "8.625",
    "Results" : {
                  "A*B" : "26.970375",
                  "A+B" : "11.752"
               }
}


mem.write('myNestedObject', myNestedObject).then(()=>{ //<<<-- Write that first object and the .then() method to run more code when the promise resolves
  mem.write('myOtherObject', myOtherObject).the(()=>{ //<<<-- Then write your second object
    //Keep Chaining as need or run other code when complete
  })
})
```
Though **Style A** is preferred, **Style B** may be a necessary alternative to write depending on your use case.

## Before we move on
Most of the other functions we'll cover makes use of the same principles detailed in mem.write(); for that, I won't be going into as much depth in the remaining examples to avoid excessive repetition :smiley:

### mem.write._global_('key', 'value)

**mem.write._global_(_key_, _value_)** is a Promise and expects an object key and a value to assign that object as parameters.

The main difference between mem.write() and mem.write.**global** is that mem.write.**global** will allow you to save information at the top level of the Memory_Storage macro and can not be accessed by any non-global _mem_ functions
(well, unless you have a macro with the same name as an object you're trying to create :sweat_smile:)

To help identify what is global vs local, let's review the Memory_Storage example we're using
```javascript
var memory = {
    "key": "value", //<<<---Global
    "myGlobalVar": "[a-zA-Z]", //<<<---Global
    "myMacro": { //<<<---Global
        "myLocalVar": "$2,000"  //<<<---Local
    },
    "otherMacro": {  //<<<---Global
        "icecream": "['chocolate', 'strawberry', 'vanilla']",//<<<---Local
        "pizza": "['pepperoni', 'cheese', 'bacon']"//<<<---Local
    }
}
```

Notice that the Macro names are considered global, so you can overwrite them if necessary, so be mindful how you coordinate your information and use **.global()**

All execution examples from mem.write() apply to mem.write.global()

### mem.read(key)

**mem.read(_key_)** is a Promise and expects the object key, found in the Memory_Storage script, as a parameter

To make use of this, you'll need to know the key you need to find and use the .then() method to get that key's value for later use.

Let's work with the macro called "myMacro"

For Example
```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": {
        "myInfo": "ABC123" //<<<-- new Information Here!
    }
}
```

We see in Memory_Storage, there is one key available to use, **myLocalVar**.

Let's pull that key's value into our script for use, then update it's value using mem.write

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions'; mem.localScript = module.name;

mem.read('myLocalVar').then((value) => { //<<<-- Read myLocalVar
    console.log(value)
    if (value !== "$3,000") { //<<<-- Evaluate that value
        mem.write('myLocalVar', '$3,000').then(() => { //<<<-- write a new value to myLocalVar
            mem.read('myLocalVar').then((otherValue) => { //<<<-- Read myLocalVar again to see the change
                console.log(otherValue)
                console.log('I wish my bank account had a rule like this...')
            })
        })
    } else { }
    /*
    Console will print:
    13:28:25 myMacro > '$2,000'
    13:28:26 myMacro > '$3,000'
    13:28:26 myMacro > 'I wish my bank account had a rule like this...'
    */
});
```

As mentioned under mem.write(), chaining your promises is important to the success of these functions :smiley:

### mem.read(key)._global_

**mem.read.global(_key_)** is a Promise and expects the object key, found in the Memory_Storage script, as a parameter

Just like mem.write.global(), this will read a key at the top level of your Memory_Storage script.

Allowing you to access information from other scripts, or other global objects available.

For Example, 
```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": {
        "myInfo": "ABC123" //<<<-- new Information Here!
    }
}
```
Let's read all of the informatoin in "myMacro" and log it

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions'; mem.localScript = module.name;

mem.read('myMacro').then((value) => { //<<<-- Read myMacro
    console.log(value)
  });

/*
Console will print:
13:28:25 myMacro > '{ "myLocalVar": "$2,000" }'
*/
```
See how we now get both the object and value when using.

Refer to mem.read for more examples.

### mem.remove(key)

**mem.remove(_key_)** is a Promise and expects the object key, found in the Memory_Storage script, as a parameter.

mem.remove(key) allows your to remove an object from Memory_Storage.

To make use of this, you'll need to know the key in Memory_Storage to remove it.

Let's work with the macro called "otherMacro"

For Example
```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": {
        "myInfo": "ABC123" //<<<-- new Information Here!
    }
}
```
We have 2 objects in "otherMacro", let's remove "icecream" from this, because I'd much prefer pizza over icecream :stuck_out_tongue_closed_eyes:
But let's also use the .then() along with mem.read.global() to see all the changes happening to the Memory_Storage of "otherMacros"

```javascript
mem.read.global('otherMacro').then((value) => { //<<<-- Read otherMacro first to log it's contents
    console.log(value)
    mem.remove('icecream').then(()=>{ //<<<-- Remove icecream
        mem.read.global('otherMacro').then((otherValue) => { //<<<-- Read otherMacro again to log the change
            console.log(otherValue)
        })
    })
    /*
    Console will print:
    13:51:14 otherMacro	> { icecream: '[\'chocolate\', \'strawberry\', \'vanilla\']', 
                            pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' }
    13:51:15 otherMacro	> 'WARNING: Local Object Key {"icecream" : "[\'chocolate\', \'strawberry\', \'vanilla\']"} has been deleted from Memory_Storage. Deletion occurred in script "otherMacro"'
    13:51:15 otherMacro	> { pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' }
    */
});
```

Notice how we get an additional console message with a warning, this is telling use we removed information from our Memory_Storage macro which makes for a great tool while troubleshooting to see if you accidentally removed the wrong information.

### mem.remove.global(key)

**mem.remove.global(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

Just like mem.write.global(), this will remove a key at the top level of your Memory_Storage script

refer to the examples in mem.remove and mem.read for use

### mem.print() && mem.print.global()

**mem.print()** and **mem.print.global()** are not functions with a promise, so the .then() method won't necessarily work here.

These functions are meant to be a streamlined way to print your memory information to the console without having to use mem.read or mem.read.global several times throughout your script.

**mem.print()** will print all information found in the Memory_Storage of the script your working in.

An example log for a macro named "otherMacro" will print the following

```txt
14:33:11 otherMacro > { icecream: '[\'chocolate\', \'strawberry\', \'vanilla\']',
                        pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' }
```

**mem.print.gobal()** will print all information found in the entire Memory_Storage script

An example log for the same macro named "otherMacro" will print the following

```txt
14:33:38 otherMacro > { key: 'value',
                        myGlobalVar: '[a-zA-Z]',
                        myMacro: { myLocalVar: '$2,000' },
                        otherMacro: 
                           { icecream: '[\'chocolate\', \'strawberry\', \'vanilla\']',
                             pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' },
                        Test: { Test: 'Test' } }
```

Call these functions whenever you need a print out of your saved information.

These functions are for reference and troubleshooting purposes

**mem.info()**

mem.info() will print out information on the script to the console. This is pre-loaded into the Memory Storage script. This information can be removed, and if it has, running this will cause an error.

Example Print out
```JSON
"./_$Info": {
        "Warning": "Do NOT modify this document, as other Scripts/Macros may rely on this information",
        "AvailableFunctions": {
            "local": [
                "mem.read('key')",
                "mem.write('key', 'value')",
                "mem.remove('key')",
                "mem.print()"
            ],
            "global": [
                "mem.read.global('key')",
                "mem.write.global('key', 'value')",
                "mem.remove.global('key')",
                "mem.print.global()"
            ]
        },
        "Guide": "https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Macro%20Memory%20Storage"
    }
```

## Non-Exported Functions
These functions are not exported for use, they help run a initial set-up on the Memory_Functions Script

* ~~getSourceScriptName()~~
  * ~~This script, which can be export if needed, is responsible for getting the name of the local script~~
  * ~~It technically causes a crash, but as of December 2020, this is the only way for us to discover the script name``
  * getSourceScriptName was replaced by ```mem.localScript = module.name```. This will be auto-imported if that setting is enabled.
* memoryInit()
  * This checks to see if you have a Memory_Storage script on your endpoint, if not, it will create one for you
* importMem()
  * This checks to see if any scripts outside of Memory_Functions and Memory_Storage have 
  
  ```javascript
  import { mem } from './Memory_Functions'; mem.localScript = module.name;
  ```
  
  applied to them, they must contain the standard ```import xapi from 'xapi';``` for this to work, else nothing will happen.
  * importMem also relies on a configuration option found on Line 20. Refer to [Configuration Menu](#configuration-menu) for more information
