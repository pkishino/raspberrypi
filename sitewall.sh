#!/bin/bash
linkfile='sites'
#Tabs
while IFS='' read -r line || [[ -n $line ]]
do
   chromium --kiosk "$line" &
done < $linkfile
#Tab Loop
while [ True ]
do
   xdotool key ctrl+Tab;
   sleep 60;
done
