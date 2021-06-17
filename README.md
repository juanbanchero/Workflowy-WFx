# Workflowy-WFx

## Table of Contents
- [Description](#description)
- [Instructions](#instructions)
- [Scripts](#scripts)
  * [Multi Noter](#multi-noter)
  * [Sort by descendants](#sort-by-descendants)
  * [Move to Grandchild](#move-to-grandchild)
  * [WIP | Habit Tracker](#habit-tracker)
- [Reference](#reference)

## Description
This repository that contains all of the scripts that I'm constantly doing for the extension of WFx for Workflowy.

## Instructions
To setup one of this scripts you should have WFx for Workflowy and activate the options.
- Active WFx
- Type "wfo"
- Go to "add Javascript" tab and paste the selected code
- Next put the shortcut for the code 
- Final step is to manually fill the params of the function with the proper values. Ex. If it says WID="''" transforms into WID="b59a5a0d4c05" (the alphanumeric sequence is the last part of your selected bullet in Worflowy, also with Ctrl+L or CMD+L you copy the link node and take the last part) 

## Scripts
### Multi Noter
![image](https://user-images.githubusercontent.com/26557565/122469909-d7a52a80-cf93-11eb-8a5e-def46b79772a.png)

Will display a list of tags, where you can select one. Also you can type whatever you want and it provides you with three options.
- Append which will put the tag at the end of your first line in the note
- Prepend which will put the tag at the beginning of your note
- New line which will create a new first line in the note and put the tags in there. This is useful if you have a really long note and you want to begin your node with the tags.

### Sort by descendants
One image speaks more that a thousand words (In this case, 3 images)
![image](https://user-images.githubusercontent.com/26557565/122470571-97927780-cf94-11eb-989d-50dc3d52c9a9.png)
![image](https://user-images.githubusercontent.com/26557565/122470638-aed16500-cf94-11eb-8cb1-4c4b477a69d5.png)
![image](https://user-images.githubusercontent.com/26557565/122470667-b729a000-cf94-11eb-9053-81997d12d015.png)


### Move to Grandchild 
If you know _moveToChild_ from the WFx extension, probably you guess what this does. It moves the node that you are, to a grand children location.
**Use Case**
Let's say you are a calendar driven task person. So probably in WFx you have a stucture like this for each day:
- Calendar
  * January
    * 2021.01.06
    * 2021.01.07
    * 2021.01.08
  * February
    * 2021.02.06
    * 2021.02.07
    * 2021.02.08
  * March
    * 2021.03.06
    * 2021.03.07
    * 2021.03.08

So, now, you are in your inbox dealing with tasks from that day and you come across a task that you would like to do on 2021.01.06, no problem! You activate WFx, type your shortcut for _moveToGrandchild_ and something like this will come up:

![image](https://user-images.githubusercontent.com/26557565/122471893-379cd080-cf96-11eb-87c9-6409752d3485.png)

Once you select your month, this other dialog will come up:

![image](https://user-images.githubusercontent.com/26557565/122471955-4daa9100-cf96-11eb-9798-6300e4e8e850.png)

...and that's all. Use your imagination, this was only for dates, but it could be widely used in another ways.

## Habit Tracker
![image](https://user-images.githubusercontent.com/26557565/122472093-7e8ac600-cf96-11eb-8af4-b7a77e846d97.png)

## Reference
- [Workflowy](www.workflowy.com)
- [WFx extension](https://rawbytz.wordpress.com/2021/04/18/what-happened-to-wfx/)
- [WIP] Shared node to make easy installation of scripts
