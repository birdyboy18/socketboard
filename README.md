## Web Sockets Soundboards

An easy to change and simple websockets powered soundboard.

Comes with 100% more Nicolas Cage, there are Nicolas Cage sound clips in the sounds folder.

For a demo

Receiver - [nic-soundboard.vps.paulbird.co](http://nic-soundboard.vps.paulbird.co)

Controller - [nic-soundboard.vps.paulbird.co/public](http://nic-soundboard.vps.paulbird.co/public)

### Why Make it

The idea of this soundboard was made in preparation for a joke of a talk at Barcamp Bournemouth 7, if you've not been, I recommend you do. Its great fun.

We wanted to be able to have a soundboard to add some humor to our talk, the idea being that Nicolas Cage was there. We couldn't find any good Nicolas cage soundboards with the sounds we wanted. So I made one.

We knew only one thing, a phone isn't loud enough and hopefully the computer we were demonstrating would be plugged into a sound system. There were two of us in our talk. One person coded and demonstrated the techniques, the other spoke. The person speaking needed to be able to trigger the soundboard but it was on the computer currently being used demonstrating the code. __Hello web sockets__

### How it works

As mentioned this soundboard is powered by websockets. It is run on a nodejs & expressjs server. One page will play the sounds that have been pressed on another page. Its split into two parts one page will act as the device that will play the sound. While the other page will broadcast the button pressed and the page listening for it will play it. It means lots of people can control the soundboard if they wanted to, it leads to some hilarious results.

#### Adding Sounds

In order to load in any new sounds, or change them all completely then simply change the sounds in the sounds folder. I haven't tested what formats work, currently I only know .mp3 works.

Thats it, the javascript on the pages will add and remove buttons based on what sounds are in the sounds folder. Simple.

#### Receiver page - Being the page that plays the sound

To load up the page that the sound plays then once it is downloaded and running, or hosted on maybe a dokku server or heroku go to the root path and you'll be redirected to '/public/soundBoard.html' this is correct. Any devices that have loaded the Sender / Controller page will be able to trigger sound to be played on this receiver page. Ideally you should only have one open.

#### Sender / Controller Page - The page that sends the button pressed

To have a device act as a controller of the soundboard then go to '/public' route. Now any button you press will be sent to any pages / devices that are acting as receivers.

#### Warning

This code is super rough and raw, it was made in roughly 5-6 hours on a late thursday night.
