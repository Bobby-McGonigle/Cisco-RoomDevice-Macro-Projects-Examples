# Memory Functions!

## Disclaimer

This Script was originally written by a colleague of mine, and I had beta tested it. 

Through our tests, we found ways to optimize this script to be the best it can be in this Macro environment.

Definitely a Co-Authored Script, details below :smiley:

## Inspiration

The need for a better and more robust version of the initial Macro Memory script

The original was limited, required a bit of set-up and wasted a facility service slot

With the enhancements of the Macro Editor in ce9.14 and Higher, we can make a more refined version eliminating those constraints.

## What You'll Need
* A compatible Endpoint
  * Sx20, Sx80, Mx Series, Dx Series
  * Room Series, Board Series, Desk Series or greater
* Admin Access to the Room Device
* Room Device on CE9.14.X or greater, or Stable Cloud Channel
* Some Knowledge on the Macro Editor
* Some Knowledge on Javascript
* Some Knowledges on Importing/Exporting Modules

## How does the script work

When "**Memory_Functions**" is activated on your endpoint, it will generate a new Macro called "**Memory_Storage**" by default.
  * This will not re-generate a new one if one already exists on your endpoint :smiley:

This new macro will work alongside the Memory_Functions Macro as your main storage repository

You won't see this at first, so please **refresh your page** :smiley:

In addition to generating the storage repo for your endpoint, it will also search your endpoint for any script that do no have the Memory Functions imported and will edit each macro to provide an import.

This search relies on your endpoint having the following string available

```javascript
import xapi from 'xapi';
```

Once you see the import messages stop in the console, once again, **refresh the page** :smiley:

This is the default string found in all newer scripts by default. If your script does not have this string, then the automatic import will fail.
Directions for a manual import will be shown later on in this document.

Once all of that has processed (it's rather quick) you should be ready to make use of all of the functions available

## Function List

For more detail on how to use these functions, please scroll to the of end of this readme. Details listed under **[Function Details](#function-details)**

* [mem.write(key, value)](#memwritekey-value)
* [mem.write.global(key, value)](#memwriteglobalkey-value)
* [mem.read(key)](#memreadkey)
* [mem.read.global(key)](#memreadkeyglobal)
* [mem.remove(key)](#memremovekey)
* [mem.remove.global(key)](#memremovekeyglobal)
* [mem.print()](#memprint)
* [mem.print.global()](#memprint)

## Getting Started
* Go to [Memory_Functions.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Macro%20Memory%20Storage/Memory_Functions.js)
* Copy and Paste the contents of this script in a as a new macro on your Cisco Room Device
  * Label this Macro **Memory_Functions**
* Save the script, and toggle it on. This should begin to work immediately
  * Be sure to refresh your browser when it's done :smiley:

## Things to consider
* We're always looking for way to improve this script, if you have an idea, send it along :smiley:
* Some of these functions rely on crashing your script to get the script name. It currently does not effect anything, and works reliably on ce9.14 and higher. Current Date Dec 2020
  * So far it works, but we wanted you to know. We're hoping to find a way to have a script, discover it's own name. At them moment, this is the only way :sweat_smile:

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

### mem.write(key, value)

**mem.write(_key_, _value_)** is a Promise and expects an object key and a value to assign that object. 

This is also a function that effects the script your currently working in. That way you can work in each script independently, without having to worry if you're mixing information with another macro. All non **.global()** functions only effect the script you're working in.

Let's create a new macro called "myTestMacro"

In this macro, let's write a new piece of information.

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

mem.write('myInfo', 'ABC123')
```
Save this script, once it runs, refresh your browser and you will see this new piece of information written to our **Memory_Storage** Macro as

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
Notice how, in our example above, we did not have a object called "myTestMacro". What mem.write() will do, is add in the name will create an object named after the macro you're working in and created a nested object of the information you want to write :smiley:

This is how we're able to avoid other scripts from accessing information they don't necessarily need

#### What if I want to right more that just 1 piece of information?
* You can, but you need to be mindful that this process needs to resolve a promise first before it rights, so syntax is Key for a successful write

### Writing style A (preferred)
Build a nested object locally in your macro then write this object when it's finished being built

For example

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

var myNestedObject = {
    "newObject" : "Hello from New Object"
}

myNestedObject["anotherObject"] = { 
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

mem.write('myNestedObject', myNestedObject)
```

Style A will allow you to quickly build your information and store it all at once

### Writing style B

If you need to write multiple nest objects, then either make build a larger nested object with all the information or chain your mem.write functions

For example
```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

var myNestedObject = {
    "newObject" : "Hello from New Object",
    "secondObject" : "Hello from Second Object"
}

var myOtherObject = {
    "Test_A" : "3.127",
    "Test_B": "8.625",
    "Results" : {
                  "A*B" : "26.970375",
                  "A+B" : "11.752"
               }
}


mem.write('myNestedObject', myNestedObject).then(()=>{
  mem.write('myOtherObject', myOtherObject).the(()=>{
    //Keep Chaining as need or run other code when complete
  })
})
```
Though Style A is preferred, Style be may be a necessary alternative to right, depending on your use case.

### Before we move on
Most other functions we'll cover makes us of the same principles detailed in mem.write() for that, I won't be going as in depth in the remaining examples, to allow this document some breathing room :smiley:

### mem.write._global_('key', 'value)

**mem.write._global_(_key_, _value_)** is a Promise and expects an object key and a value to assign that object. 

The main difference between mem.write() and mem.write.**global** is that this will allow you to save information at the top level of the Memory_Storage macro and can not be read by any non-global functions
(well, unless you have a macro as the same name as an object you're trying to create :sweat_smile:)

To identify what is global vs local
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

All example in mem.write() apply to mem.write.global()

### mem.read(key)

**mem.read(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

To make use of this, you'll need to know the key you need to find and use the .then() method to get that key's value

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

We see in storage, there is one key available to use **myLocalVar**

Let's pull that key's value into our script for use, then update it's value using mem.write

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

mem.read('myLocalVar').then((value) => {
    console.log(value)
    if (value !== "$3,000") {
        mem.write('myLocalVar', '$3,000').then(() => {
            mem.read('myLocalVar').then((otherValue) => {
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

**mem.read.global(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

Just like mem.write.global(), this will read a key at the top level of your Memory_Storage script

refer to the example in mem.read for use

### mem.remove(key)

**mem.remove(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

mem.remove(key) allows your to remove an object from memory

To make use of this, you'll need to know the key you need to find and use the .then() method to get that key's value

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
But let's also use mem.read.global() to see all the changes happening to the memory of "otherMacros"

```javascript
mem.read.global('otherMacro').then((value) => {
    console.log(value)
    mem.remove('icecream').then(()=>{
        mem.read.global('otherMacro').then((otherValue) => {
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

Notice how we get an additional console message with a warning, this is telling use we removed information from our Memory_Storage macro and makes for a great tool while troubleshooting to see if you accidentally removed the wrong information.

### mem.remove(key)

**mem.remove.global(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

Just like mem.write.global(), this will remove a key at the top level of your Memory_Storage script

refer to the example in mem.remove for use

### mem.print() && mem.print.global()

**mem.print()** and **mem.print.global()** are not functions with a promise, so the .then() method won't necessarily work here.

These functions are meant to be a streamlined way to print your memory information to the console without having to use mem.read or mem.read.global several times throughout your script.

**mem.print()** will print all information found in the Memory_Storage of the script your working in.

An example log for a macro named "otherMacro" will print the following

```txt
14:33:11	otherMacro	>	{ icecream: '[\'chocolate\', \'strawberry\', \'vanilla\']',
                        pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' }
```

**mem.print.gobal()** will print all information found in the entire Memory_Storage script

An example log for the same macro named "otherMacro" will print the following

```txt
14:33:38	otherMacro	>	{ key: 'value',
                        myGlobalVar: '[a-zA-Z]',
                        myMacro: { myLocalVar: '$2,000' },
                        otherMacro: 
                           { icecream: '[\'chocolate\', \'strawberry\', \'vanilla\']',
                             pizza: '[\'pepperoni\', \'cheese\', \'bacon\']' },
                        Test: { Test: 'Test' } }
```

Call these functions whenever you need a print out of your saved information.

## Non-Exported Functions
These functions are not exported for use, they help run a initial set-up on the Memory_Functions Script

* getSourceScriptName()
  * This script, which can be export if needed, is responsible for getting the name of the local script
  * It technically causes a crash, but as of December 2020, this is the only way for us to discover the script name
* memoryInit()
  * This check to see if you have a Memory_Storage script on your endpoint, if not, it will create one for you
* importMem()
  * This check to see if any scripts outside of Memory_Functions and Memory_Storage have 
  ```javascript
  import { mem } from './Memory_Functions';
  ```
  applied to them, they must contain the standard ```import xapi from 'xapi';``` for this to work, else nothing will happen.
