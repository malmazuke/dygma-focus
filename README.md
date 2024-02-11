## Note
This project is sourced from the original Focus API, found in the [DygmaLabs Bazecor](https://github.com/malmazuke/Bazecor/blob/development/src/api/focus/index.js) project itself. I have simply extracted the API itself into its own repo for reusability in other projects. Besides changes to get it working as its own library, the project remains unchanged from the original source.

# Focus API documentation

## Concept

The Focus API is a two-way communication mechanism between the Raise and any computer software that wants to get information or configure/activate the raise\'s plugins.

It discovers all the EEPROM assigned positions of the memory with specific commands to update or trigger them depending on the kind of plugin that uses them.

This means for example being capable of storing the macros or to be able to trigger them through the serial interface without touching the keyboard or Bazecor.

The focus library is a part of the Keyboard's Firmware but also has a helper class created in JavaScript for the Bazecor, we will show here the commands for the JavaScript Focus API and how to trigger them through the serial interface also, just as an example if you want to retrieve all available commands you have to send the keyboard the string "help".

**For JavaScript:** `focus.command("help")`

**Serial Command (Unix):** `echo 'help' > /dev/ttyACM0`

The serial interface will always end the current message by a newline feed plus a period.

You can expand on this knowledge in the docs about the [kaleidoscope Firmware](https://kaleidoscope.readthedocs.io/en/latest/index.html) from which the Raise extends

## ⚠ Memory usage disclaimer ⚠

When sending focus commands to the keyboard, keep in mind that every time you put data after the command, that stores the information in the keyboard, this means that the flash memory is using up it's lifespan, so avoid loops that save data to the keyboard frequently, so that the chip will last you as long as possible.

## Available Methods

Running `focus.command("help")` will get you the following list of available commands:

**Version**

The version of the firmware

[version](#version)

**KeyMap Section**

KeyMap commands allow you to read/wirte the current keymap stored in the keyboard for each layer

[keymap.custom](#keymapcustom)

[keymap.default](#keymapdefault)

[keymap.onlyCustom](#keymaponlycustom)

**Settings Section**

Settings allow you to check the integrity of the EEPROM stored data

[settings.defaultLayer](#settingsdefaultlayer)

[settings.valid?](#settingsvalid)

[settings.version](#settingsversion)

[settings.crc](#settingscrc)

[eeprom.contents](#eepromcontents)

[eeprom.free](#eepromfree)

**Leds Section**

Commands to help you with the testing and settings of the raise's leds

[led.at](#ledat)

[led.getMultiple](#ledgetmultiple)

[led.setMultiple](#ledsetmultiple)

[led.setAll](#ledsetall)

[led.mode](#ledmode)

[led.brightness](#ledbrightness)

[led.brightnessUG](#ledbrightnessUG)

[led.theme](#ledtheme)

**Colors Section**

Commands to read/write the color palette and colorMap from the raise to change it's static colors

[palette](#palette)

[colormap.map](#colormapmap)

**Led time to remain lit**

Time to wait until turning the led's off

[idleleds.time_limit](#idleledstime_limit)

**Hardware Section**

Hardware commands that allow you to perform certain operations like retrieving side's versions, watch power consumption, etc..

[hardware.version](#hardwareversion)

[hardware.side_power](#hardwareside_power)

[hardware.side_ver](#hardwareside_ver)

[hardware.sled_ver](#hardwaresled_ver)

[hardware.sled_current](#hardwaresled_current)

[hardware.layout](#hardwarelayout)

[hardware.joint](#hardwarejoint)

[hardware.keyscan](#hardwarekeyscan)

[hardware.crc_errors](#hardwarecrc_errors)

[hardware.firmware](#hardwarefirmware)

**Plugins section**

Plugin's section to configure them, like the DynamicMacros plugin.

[tapdance.map](#tapdancemap)

[macros.map](#macrosmap)

[macros.trigger](#macrostrigger)

[superkeys.map](#superkeysmap)

[superkeys.waitfor](#superkeyswaitfor)

[superkeys.timeout](#superkeystimeout)

[superkeys.repeat](#superkeysrepeat)

[superkeys.holdstart](#superkeysholdstart)

[superkeys.overlap](#superkeysoverlap)

**Sides Section**

Hardware commands specific to the sides for flashing them.

[hardware.flash_left_side](#hardwareflash_left_side)

[hardware.flash_right_side](#hardwareflash_right_side)

[hardware.verify_left_side](#hardwareverify_left_side)

[hardware.verify_right_side](#hardwareverify_right_side)

**Help**

Help command to display this list

[help](#help)

**Layers Section**

Layer commands to switch between them (for example when changing a from a program to another and more goodies)

[layer.activate](#layeractivate)

[layer.deactivate](#layerdeactivate)

[layer.isActive](#layerisactive)

[layer.moveTo](#layermoveto)

[layer.state](#layerstate)

### version

Returns the version of the Raise firmware stored in the keyboard's EEPROM

#### Commands

- JavaScript:
  ```js
  focus.command("version")
  ```
- Serial Command (Unix):
  ```shell
  echo 'version' > /dev/ttyACM0
  ```

#### Expected output

it should give back 3 strings,

- Bazecor Version:
  ```shell
  '0.2.5'
  ```
- Kaleidoscope's newest Git commit incorporated
  ```shell
  '6bd1f81e'
  ```
- Raise's Firmware newest Git commit
  ```shell
  'fe423ce-dirty'
  ```
- Dirty here means it was custom-built with the makefile, not built automatically by Travis.

### keymap.custom

This command of the focus API has two functions, when sent alone, it retrieves the whole custom keymap stored in the keyboard, when sent with the map as trailing numbers (in the same format as received) it will update the custom keymap stored in the EEPROM.

To know the actual correlation between the position of the map sent and the actual keys in the keyboard, [look here](https://github.com/Dygmalab/Raise-Firmware/blob/master/FOCUS_API.MD)

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("keymap.custom")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.custom' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("keymap.custom N N N N N N N N N N N N N N N")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.custom N N N N N N N N N N N N N N N' > /dev/ttyACM0
  ```

Being
```shell
 'N N N...'
```
the 16bit numbers that represent each key assigned to that position of the keymap the numbers amount 80(keys per layer)x10(custom layers)

#### Expected output

It should give back the whole custom keymap (80 key positions for each layer and all 10 layers) if sent alone, if sent with the keymap of the same length as received, it should return a nextline, period.

### keymap.default

This command works in the same way as keymap.custom, but affecting the default layers stored in the -1 and -2 positions of the layer stack.

To know the actual correlation between the position of the map sent and the actual keys in the keyboard, [look here](https://github.com/Dygmalab/Raise-Firmware/blob/master/FOCUS_API.MD)

#### Command

To retrieve:

- JavaScript:
  ```js
  focus.command("keymap.default")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.default' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("keymap.default N N N N N N N N N N N N N N N")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.default N N N N N N N N N N N N N N N' > /dev/ttyACM0
  ```

Being
```shell
 'N N N...'
```
the 16bit numbers that represent each key assigned to that position of the keymap the numbers amount 80(keys per layer)x2(default layers)

#### Expected output

It should give back the two default layers keymap (80 key positions for each layer for the two default layers) if sent alone, if sent with the keymap of the same length as received, it should return a nextline, period.

### keymap.onlyCustom

This command returns true or false depending on the user setting of hiding the default layers or not, it does not allow you to increment the number of available layers by start using the default ones, they are there so you can store a backup for two layers in your keyboard

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("keymap.onlyCustom")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.onlyCustom' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("keymap.onlyCustom true")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.onlyCustom trure' > /dev/ttyACM0
  ```

#### Expected output

It should return the current state of the onlyCustom boolean variable stored in the keyboard, being it true or false, when sending the value added to the command, it should return a nextline, period.

### settings.defaultLayer

This command returns the default layer the keyboard will boot in, with this you can change the default layer in which the Raise starts working to any custom layer that you want.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("keymap.defaultLayer")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.defaultLayer' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("keymap.defaultLayer 1")
  ```
- Serial Command (Unix):
  ```shell
  echo 'keymap.defaultLayer 1' > /dev/ttyACM0
  ```

#### Expected output

It should return the current default layer stored in the EEPROM, if it's send with the new default layer, it should return a nextline, period.

### settings.valid?

This command returns a boolean value that states true if all checks have been performed to the current settings and it's upload was done in the intended way

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("settings.valid")
  ```
- Serial Command (Unix):
  ```shell
  echo 'settings.valid' > /dev/ttyACM0
  ```

#### Expected output

It should return true if you changed your settings with Bazecor, if not, it can return false, but is currently not in use.

### settings.version

This command returns the current settings version, it allows Bazecor to identify any changes in the expected output to understand them and shape to them.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("settings.version")
  ```
- Serial Command (Unix):
  ```shell
  echo 'settings.version' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("settings.version 1")
  ```
- Serial Command (Unix):
  ```shell
  echo 'settings.version 1' > /dev/ttyACM0
  ```

#### Expected output

It should return the current settings version stored in the EEPROM.

### settings.crc

Returns the CRC checksum of the layout.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("settings.crc")
  ```
- Serial Command (Unix):
  ```shell
  echo 'settings.crc' > /dev/ttyACM0
  ```

#### Expected output

It should the check of each one of the memory positions reserved in the eeprom, for example 6228/6228

### eeprom.contents

This command returns the whole EEPROM contents. and allows you to send them in one go.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("eeprom.contents")
  ```
- Serial Command (Unix):
  ```shell
  echo 'eeprom.contents' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("eeprom.contents NNNNNNNNNNNNN")
  ```
- Serial Command (Unix):
  ```shell
  echo 'eeprom.contents NNNNNNNNNNNN' > /dev/ttyACM0
  ```

#### Expected output

It should return the whole EEPROM length of contents, in this case as CRC returned, 6228 bytes.

### eeprom.free

This command returns the remaining EEPROM bytes left.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("eeprom.free")
  ```
- Serial Command (Unix):
  ```shell
  echo 'eeprom.free' > /dev/ttyACM0
  ```

#### Expected output

It should return the free EEPROM memory, 2793 bytes in my case.

### led.at

This command returns the color that an individual led has right now in RGB code, also allows you to change that individual led\'s color with the rgb color following it\'s position.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.at 21")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.at 21' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.at 21 255 255 0")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.at 21 255 255 0' > /dev/ttyACM0
  ```
#### Expected output

With this function you can change, based on external events, a led color depending on code outside raise's firmware.

if sent only with the LED number, it will return its color
```js
80 227 194
```

if sent with the color coded (ex: 255 255 0 or yellow) it will change that numbered LEDs color to yellow.

### led.getMultiple

This command returns the colors of each of the numbered LED's that are listed in RGB code.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.getMultiple 1 2 3 4 5")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.getMultiple 1 2 3 4 5' > /dev/ttyACM0
  ```

#### Expected output

With this function you can read the color of a given set of LED's and will return the following:

  ``` js
  1 # 80 227 194
  2 # 80 227 194
  3 # 80 227 194
  4 # 80 227 194
  5 # 80 227 194
  ```

### led.setMultiple

This command applies the defined color to all of the numbered LEDs listed afterwards

#### Commands

To set:

- JavaScript:
  ```js
  focus.command("led.setMultiple 255 0 0 1 2 3 4 5")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.setMultiple 255 0 0 1 2 3 4 5' > /dev/ttyACM0
  ```

#### Expected output

After execution, listed LEDs should physically change their color to the selected one (255 0 0 or RED) on the keyboard, will return newline, period.

### led.setAll

This command sets all leds to a certain color transmitted by RGB.

#### Commands

To set:

- JavaScript:
  ```js
  focus.command("led.setAll 255 255 255")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.setAll 255 255 255' > /dev/ttyACM0
  ```

#### Expected output

The keyboard will change color when the command is sent successfully, will return newline, period.

### led.mode

This command reads/writes the current led mode, which changes the type of led layout the keyboard shows, you can switch between the different led effects with this function, like rainbow, etc... does the same as LedEffect.Next key in Bazecor.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.mode")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.mode' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.mode 2")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.mode 2' > /dev/ttyACM0
  ```
#### Expected output

The keyboard will either return the current effect being displayed following it's coding, or it will change the current efect following that coding also.

| Effect encoding | Effect description |
| :---:        |     :---       |
| 0 | Per Layer colors, they change when you switch between layers |
| 1     | Rainbow Wave effect      |
| 2     | Rainbow effect (single color)      |
| 3     | Stalker effect (keys lit when pressed and then fade out)      |
| 4     | Heatmap effect (keys lit when pressed following a  gardient between red and faint blue based on the most pressed key order [explanation](https://kaleidoscope.readthedocs.io/en/latest/plugins/Kaleidoscope-Heatmap.html) [code](https://github.com/Dygmalab/KaleidoscopeTest/blob/main/libraries/Kaleidoscope-Heatmap/src/kaleidoscope/plugin/Heatmap.cpp) )      |
| 5     | Digital Rain effect |
| 6     | Sprinkling water effect when pressed |

\* The only FW that supports effects 4, 5 and 6 is the Raise stable FW, but it will be implemented on the rest of the FW's in the near future

### led.brightness

This command reads/writes the brightness setting for the Backlight LEDs stored in the EEPROM

When applied to the Defy keyboard, additional commands are available to modify the behavior when in wireless mode, this one remains and only affects wired mode.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.brightness")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.brightness' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.brightness 210")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.brightness 210' > /dev/ttyACM0
  ```

#### Expected output

This function allows you to get/set the current brightness of the backlight LEDs of your keyboard.

the return value will be the same as the sent one, a 8 bit integer (number between 0 and 255)
### led.brightnessUG

This command reads/writes the brightness setting for the Underglow stored in the EEPROM

When applied to the Defy keyboard, additional commands are available to modify the behavior when in wireless mode, these one remain and only affect wired mode.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.brightnessUG")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.brightnessUG' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.brightnessUG 210")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.brightnessUG 210' > /dev/ttyACM0
  ```

#### Expected output

This function allows you to get/set the current brightness of the Underglow LEDs of your keyboard.

the return value will be the same as the sent one, a 8 bit integer (number between 0 and 255)

### led.theme

This command reads/writes the whole LED color assignment currently in use on the keyboard, its encoded using RGB values.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("led.theme")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.theme' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.theme NNN NNN NNN NNN NNN NNN")
  ```
- Serial Command (Unix):
  ```shell
  echo 'led.theme NNN NNN NNN NNN NNN NNN' > /dev/ttyACM0
  ```

#### Expected output

With this function you can get/set, whole LED lighting theme using a single command independently of the palette data stored in the keyboard's EEPROM.

when you ask for the values using `led.theme` you are expected to receive:
```js
248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 248 231 28 248 231 28 248 231 28 80 227 194 248 231 28 255 107 0 248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 80 227 194 80 227 194 80 227 194 80 227 194 80 227 194 248 231 28 248 231 28 248 231 28 248 231 28 248 231 28 80 227 194 248 231 28 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 255 107 0 0 0 0
```
Which is the full RGB map of the values currently being represented by each LED, its encoding is RGB so each 3 values represent a single LED.

The command will expect you to send back the same quantity of LEDs, if any is lacking, they will not get reassigned.
### palette

This command reads/writes the color palette that is used by the color map to establish each color that can be assigned to the keyboard.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("palette")
  ```
- Serial Command (Unix):
  ```shell
  echo 'palette' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("led.palete NNN NNN NNN NNN NNN NNN")
  ```
- Serial Command (Unix):
  ```shell
  echo 'palette NNN NNN NNN NNN NNN NNN' > /dev/ttyACM0
  ```

#### Expected output

This command reads / writes the palette stored in the eeprom, this means the command can change the lighting theme without changing the actual positions on which each color is assigned, you have to provide the whole palette when storing it.

### colormap.map

This command reads/writes the colorMap that assigns each color listed in the palette to individual leds mapping them to the keyboard's current layout.

To know the actual correlation between the position of the map sent and the actual keys in the keyboard, [look here](https://github.com/Dygmalab/Raise-Firmware/blob/master/FOCUS_API.MD)

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("colormap.map")
  ```
- Serial Command (Unix):
  ```shell
  echo 'colormap.map' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("colormap.map N N N N N N N N N N N N N N N N N N")
  ```
- Serial Command (Unix):
  ```shell
  echo 'colormap.map N N N N N N N N N N N N N N N N N N' > /dev/ttyACM0
  ```

#### Expected output

This command allows you to assign each led to a different color stored in the palette, you have to provide the whole colormap when storing it.

### idleleds.time_limit

This command reads/writes the idle led time to be turned off in seconds.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("idleleds.time_limit")
  ```
- Serial Command (Unix):
  ```shell
  echo 'idleleds.time_limit' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("idleleds.time_limit 600")
  ```
- Serial Command (Unix):
  ```shell
  echo 'idleleds.time_limit 600' > /dev/ttyACM0
  ```

#### Expected output

returns the current time stored in the EEPROM and allows you to set it to another time, not exceding 65k seconds

### hardware.version

This empty command has no support as of today, or is disabled / not working properly.

### hardware.side_power

This empty command has no support as of today, or is disabled / not working properly.

### hardware.side_ver

This empty command has no support as of today, or is disabled / not working properly.

### hardware.sled_ver

This empty command has no support as of today, or is disabled / not working properly.

### hardware.sled_current

This empty command has no support as of today, or is disabled / not working properly.

### hardware.layout

This empty command has no support as of today, or is disabled / not working properly.

### hardware.joint

This empty command has no support as of today, or is disabled / not working properly.

### hardware.keyscan

This empty command has no support as of today, or is disabled / not working properly.

### hardware.crc_errors

This empty command has no support as of today, or is disabled / not working properly.

### hardware.firmware

This empty command has no support as of today, or is disabled / not working properly.

### tapdance.map

This empty command has no support as of today, or is disabled / not working properly.

### macros.map

This command reads/writes the macros map (2048 bytes of max length), each action in a macro is composed of an action type and a key attached to it.

| Macro Action                      | Description                                                                                                                                                                                                               | Example                                                                                               | Total Cost                                                                     |   |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|---|
| MACRO_ACTION_END                  | Ends the current macro play sequence, it's used at the end of a macro to separate it from the second                                                                                                                      | " 0 "                                                                                                 | 1                                                                              |   |
| MACRO_ACTION_STEP_INTERVAL        | Changes the reproduction interval between each key of the sequence when a tap sequence or a tap code sequence (12 or 13) are used                                                                                         | " 1 1 44 " for a 300ms delay                                                                          | 3                                                                              |   |
| MACRO_ACTION_STEP_WAIT            | Custom delay that lets the macro wait for any event before continuing the sequence.                                                                                                                                       | " 2 1 44 " for a 300ms delay                                                                          | 3                                                                              |   |
| MACRO_ACTION_STEP_KEYDOWN         | Activates the keydown event for a KeyCode defined by two 8bit numbers, the higher weight carries the flags, the lower weight carries the code.                                                                            | " 3 76 226 " for the keyCode 19682, which activates the keydown action for the Media.Mute button.     | 3                                                                              |   |
| MACRO_ACTION_STEP_KEYUP           | Activates the keyup event for a KeyCode defined by two 8bit numbers, the higher weight carries the flags, the lower weight carries the code.                                                                              | " 4 76 226 " for the keyCode 19682, which activates the keyup action for the Media.Mute button.       | 3                                                                              |   |
| MACRO_ACTION_STEP_TAP             | Activates the tap event for a KeyCode defined by two 8bit numbers, the higher weight carries the flags, the lower weight carries the code.                                                                                | " 5 76 226 " for the keyCode 19682, which activates the tap action for the Media.Mute button.         | 3                                                                              |   |
| MACRO_ACTION_STEP_KEYCODEDOWN     | Activates the keydown event for a KeyCode defined by one 8bit number, it only carries the code up to 255, which means only normal keys can be sent this way.                                                              | " 6 225 " for the keyCode 225, which activates the keydown action for the Right Shift button.         | 2                                                                              |   |
| MACRO_ACTION_STEP_KEYCODEUP       | Activates the keyup event for a KeyCode defined by one 8bit number, it only carries the code up to 255, which means only normal keys can be sent this way.                                                                | " 7 225 " for the keyCode 225, which activates the keyup action for the Right Shift button.           | 2                                                                              |   |
| MACRO_ACTION_STEP_TAPCODE         | Activates the tap event for a KeyCode defined by one 8bit number, it only carries the code up to 255, which means only normal keys can be sent this way.                                                                  | " 8 225 " for the keyCode 225, which activates the tap action for the Right Shift button.             | 2                                                                              |   |
| MACRO_ACTION_STEP_EXPLICIT_REPORT | Not implemented in newer versions of the keyboard.                                                                                                                                                                        | -                                                                                                     | -                                                                              |   |
| MACRO_ACTION_STEP_IMPLICIT_REPORT | Not implemented in newer versions of the keyboard.                                                                                                                                                                        | -                                                                                                     | -                                                                              |   |
| MACRO_ACTION_STEP_SEND_REPORT     | Not implemented in newer versions of the keyboard.                                                                                                                                                                        | -                                                                                                     | -                                                                              |   |
| MACRO_ACTION_STEP_TAP_SEQUENCE    | Activates the tap event for a sequence of KeyCodes (which will be reproduced as a number of taps) defined by one 8bit number each, it only carries the code up to 255, which means only normal keys can be sent this way. | " 12 14 7 18 18 26 0" for the keyCode 225, which activates the tap action for the Right Shift button. | N + 1, where N is the number of actions to be performed in a closed while loop |   |

Please note that the last three macro actions (MACRO_ACTION_STEP_EXPLICIT_REPORT, MACRO_ACTION_STEP_IMPLICIT_REPORT, and MACRO_ACTION_STEP_SEND_REPORT) are not implemented in newer versions of the keyboard, so the corresponding cells in the table are left empty.

then we send the actual keyCode that we can find in the [keymap database](https://github.com/Dygmalab/Bazecor/tree/development/src/api/keymap/db)

We repeat this for each action we want to perform until we finish the whole macro, then a zero is required to close the macro, afterwards we can insert more, when no more macros have to be added, end the map with a " 0 0 " to tell the plugin, no further macros are present.

#### Commands

To retrieve:

- JavaScript: `focus.command("macros.map")`
- Serial Command (Unix): `echo 'macros.map' > /dev/ttyACM0`

To set:

- JavaScript: `focus.command("macros.map 8 4 8 5 8 6 0 8 7 8 8 0 0")`
- Serial Command (Unix): `echo 'macros.map 8 4 8 5 8 6 0 8 7 8 8 0 0' > /dev/ttyACM0`

#### Expected output

The command allows you to remap the macros without bazecor, and to use hidden functions not currently supported by the graphical configurator. there is no need to send the whole map.

### macros.trigger

This command triggers a stored macro programatically.

#### Commands

To use:

- JavaScript: `focus.command("macros.trigger 0")`
- Serial Command (Unix): `echo 'macros.trigger 0' > /dev/ttyACM0`

#### Expected output

Allows you to test any macro stored in the EEPROM without assigning it to a key

### superkeys.map

This command reads/writes the superkeys map (1024 bytes of max length), each action in a superkey is represented by a keyCode number that encodes the action, for example if you use the number 44, you are encoding space, etc... to know more about keycodes and to find the right one for your actions, check [keymap database](https://github.com/Dygmalab/Bazecor/tree/development/src/api/keymap/db)

The structure is composed of the encoded actions in this order

- TAP
  - Tap action which is the first tap to activate. There are certain keys that should not be sent with taps (this applies to any other tap after this one), which are:
    - modifiers
    - one-shot keys
    - other superkeys
- HOLD
  - Hold action which is the first hold to activate. There are certain keys that should not be sent with holds (this applies to any other hold after this one), which are:
    - Layer keys
    - one-shot keys
    - other superkeys
- TAP & HOLD
- DOUBLE TAP
- DOUBLE TAP & HOLD

To end a superkey, place the number of actions you want to use as keyCodes and then a zero. The zero is required to close the superkey. We can then start a new superkey or end the superkey list with a double zero " 0 0 ". This will allow the plugin to know when no further superkeys have been configured.

#### Commands

To retrieve:

- JavaScript: `focus.command("superkeys.map")`
- Serial Command (Unix): `echo 'superkeys.map' > /dev/ttyACM0`

To set:

- JavaScript: `focus.command("superkeys.map 4 5 6 44 7 0 4 224 225 6 226 0 0")`
- Serial Command (Unix): `echo 'superkeys.map 4 5 6 44 7 0 4 224 225 6 226 0 0' > /dev/ttyACM0`

#### Expected output

The command allows you to remap the superkeys without bazecor, and to use hidden functions not currently supported by the graphical configurator. there is no need to send the whole map.

### superkeys.waitfor

This command allows you to get/set the waitfor value of the keyboard to alter the behaviour of the superkeys.

waitfor value specifies the time between the first and subsequent releases of the HOLD actions meanwhile is held, so for example, if the variable is set to 500ms, you can mantain the hold key, it will emmit a keyCode corresponding to the action that it triggers, then it will wait for waitfor time for making another keypress with that same keycode. This enables the user to delay the hold "machinegun" to be able to release the key and achieve a single keypress from a hold action.

#### Commands

To retrieve:

- JavaScript: `focus.command("superkeys.waitfor")`
- Serial Command (Unix): `echo 'superkeys.waitfor' > /dev/ttyACM0`

To set:

- JavaScript: `focus.command("superkeys.waitfor 500")`
- Serial Command (Unix): `echo 'superkeys.waitfor 500' > /dev/ttyACM0`

#### Expected output

Modifies/Retrieves the value stored in the keyboard for the waitfor timeout on the superkeys

### superkeys.timeout

This command allows you to get/set the timeout value of the keyboard to alter the behaviour of the superkeys.

timeout value specifies the time the keyboard waits after a superkey is pressed for a subsequent key press of the same superkey, in this time interval, that subsequent superkey press increases the counter of the action in the following order.

- TAP
- HOLD
- TAP & HOLD
- DOUBLE TAP
- DOUBLE TAP & HOLD

#### Commands

To retrieve:

- JavaScript: `focus.command("superkeys.timeout")`
- Serial Command (Unix): `echo 'superkeys.timeout' > /dev/ttyACM0`

To set:

- JavaScript: `focus.command("superkeys.timeout 250")`
- Serial Command (Unix): `echo 'superkeys.timeout 250' > /dev/ttyACM0`

#### Expected output

Modifies/Retrieves the value stored in the keyboard for the timeout between actions of the superkeys

### superkeys.repeat

This command allows you to get/set the repeat value of the keyboard to alter the behaviour of the superkeys.

the repeat value specifies the time between the second and subsequent keyCode releases when on hold, it only takes effect after the waitfor timer has been exceeded.

#### Commands

To retrieve:

- JavaScript: `focus.command("superkeys.repeat")`
- Serial Command (Unix): `echo 'superkeys.repeat' > /dev/ttyACM0`

To set:

- JavaScript: `focus.command("superkeys.repeat 250")`
- Serial Command (Unix): `echo 'superkeys.repeat 250' > /dev/ttyACM0`

#### Expected output

Modifies/Retrieves the value stored in the keyboard for the repeat time between released actions after the waitfor timeout.

### superkeys.holdstart

This command allows you to get/set the holdstart value of the keyboard to alter the behaviour of the superkeys.

the holdstart value specifies the minimum time that has to pass between the first keydown and any other action to trigger a hold, if held it will emmit a hold action.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("superkeys.holdstart")
  ```
- Serial Command (Unix):
  ```shell
  echo 'superkeys.holdstart' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("superkeys.holdstart 200")
  ```
- Serial Command (Unix):
  ```shell
  echo 'superkeys.holdstart 200' > /dev/ttyACM0
  ```

#### Expected output

Modifies/Retrieves the value stored in the keyboard for the holdstart time.

### superkeys.overlap

This command allows you to get/set the overlap value of the keyboard to alter the behaviour of the superkeys.

the overlap value specifies the percentage of overlap when fast typing that is allowed to happen before triggering a hold action to the overlapped key pressed after the superkey.

#### Commands

To retrieve:

- JavaScript:
  ```js
  focus.command("superkeys.overlap")
  ```
- Serial Command (Unix):
  ```shell
  echo 'superkeys.overlap' > /dev/ttyACM0
  ```

To set:

- JavaScript:
  ```js
  focus.command("superkeys.overlap 80")
  ```
- Serial Command (Unix):
  ```shell
  echo 'superkeys.overlap 80' > /dev/ttyACM0
  ```

#### Expected output

Modifies/Retrieves the value stored in the keyboard for the overlap threshold percentage.

### hardware.flash_left_side

### hardware.flash_right_side

### hardware.verify_left_side

### hardware.verify_right_side

### Help

The help command returns all the available commands in the current version of the serial protocol, the list above is taken from this command as per version 0.2.3 of Bazecor/Raise Firmware.

#### Commands

- JavaScript:
  ```js
  focus.command("help")
  ```
- Serial Command (Unix):
  ```shell
  echo 'help' > /dev/ttyACM0
  ```

#### Expected output

The output of this command is a list of all available commands including itself, this list will be ended with a nextline, period trail.

### layer.activate

This command allows the host PC to activate a certain layer remotely just by sending it's order number. The layer number will start by 0 to address the first one and will end with 9 if we suppose a 10 layer list to address the last one. This command does not affect the memory usage as the value is stored in RAM.

#### Commands

To use:

- JavaScript:
  ```js
  focus.command("layer.activate 1")
  ```
- Serial Command (Unix):
  ```shell
  echo 'layer.activate 1' > /dev/ttyACM0
  ```

#### Expected output

The layer will change inmediately according to the one sent with the command, this allows for example to use a software to recognize which app is in the foreground and switch layers accordingly if any specific layer for that software is configured.

### layer.deactivate

This command allows the host PC to deactivate the last layer that the keyboard switched to, this same function is the way the shift to layer key works on the keyboard. Just add the layer number at the end of the command to make the keyboard go back one layer. The layer number will start by 0 to address the first one and will end with 9 if we suppose a 10 layer list to address the last one.

#### Commands

To use:

- JavaScript:
  ```js
  focus.command("layer.deactivate")
  ```
- Serial Command (Unix):
  ```shell
  echo 'layer.deactivate' > /dev/ttyACM0
  ```

#### Expected output

The layer will change inmediately according to the previous one used, this allows to deactivate the layer when changing the app that is in the foreground to restore the previous layer in case no specific layer is required.

### layer.isActive

This command allows the host PC to ask the keyboard which layer is in use right now. The layer number will start by 0 to address the first one and will end with 9 if we suppose a 10 layer list to address the last one.

#### Commands

To use:

- JavaScript:
  ```js
  focus.command("layer.isActive")
  ```
- Serial Command (Unix):
  ```shell
  echo 'layer.isActive' > /dev/ttyACM0
  ```

#### Expected output

The command will return the active layer inmediately after launching it.

### layer.moveTo

This command allows the host PC to activate a certain layer remotely just by sending it's order number. The layer number will start by 0 to address the first one and will end with 9 if we suppose a 10 layer list to address the last one.

The difference between this command and the layer.activate alternative, is that the activate command adds to the layer switching history, but moveTo will erase that memory and return it to an array length 1 and holding the current layer the keyboard moved to.

This command does not affect the memory usage as the value is stored in RAM.

#### Commands

To use:

- JavaScript:
  ```js
  focus.command("layer.moveTo 1")
  ```
- Serial Command (Unix):
  ```shell
  echo 'layer.moveTo 1' > /dev/ttyACM0
  ```

#### Expected output

The layer will change inmediately according to the one sent with the command, this command equals the layer move from bazecor, which will permanently leave you in the new layer.

### layer.state

This command returns the isActive status for up to 32 layers. It will return a 32 number line answer with the state of each layer represented for a 0 when the layer is not active, or 1 when the layer is active.

#### Commands

To use:

- JavaScript:
  ```js
  focus.command("layer.state")
  ```
- Serial Command (Unix):
  ```shell
  echo 'layer.state' > /dev/ttyACM0
  ```

#### Expected output

This is the typical answer when the first layer is active:
```shell
'1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 '
``````
