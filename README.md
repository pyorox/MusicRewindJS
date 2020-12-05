 # MusicRewindJS
 Generates a summary of your top artists/songs streamed through YouTube Music (for those jealous of Spotify's "Wrapped" feature).  
 Now in JavaScript form to make things easier for the user.
 [Try it out yourself here!](https://pyoro.me/MusicRewind)
 
 # Limitations
 This program is limited to working with the data contained in the history file provided by Google Takeout. There are mainly two problems associated with that, namely:
 - For some reason, some entries only have a URL as the title and no actual song title or artist information; those entries are ignored.
 - When it comes to files uploaded by the user, the entries contain the name of the song but not the artist. So, in these cases, the artist is ignored.