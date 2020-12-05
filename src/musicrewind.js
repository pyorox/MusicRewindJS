//class used to represent songs and artists
class Entry {
    constructor(name) {
        this.name = name;
        this.count = 1;
    }
}

//processes the JSON file and generates the top artists/songs table
function rewind() {
    //read options from the html file
    var year = parseInt(document.getElementById("year").value);
    var lines = parseInt(document.getElementById("lines").value);
    var showTotals = document.getElementById("showTotals").checked;
    
    //get the JSON history file
    var file = document.getElementById('file').files[0];
    
    //read and process the JSON file
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {

            //parse JSON file into an object
            var jsonArray = JSON.parse(e.target.result);

            //initialize arrays
            var artists = new Array();
            var songs = new Array();
            //this ended up not being used but I'm leaving it in if I decide to add it in the future
            //var totalPlays = 0;

            //iterate through all history entries
            for(i=0; i<jsonArray.length; i++) {
                var jsonObject = jsonArray[i];
                //process only YouTube Music entries from the selected year that actually correspond to listened music (technically watched videos)
                if(jsonObject.header === "YouTube Music" && jsonObject.time.startsWith(year + "-") && jsonObject.title.startsWith("Watched ")) {
                    try {
                        //get song and artist name, getting rid of unnecessary garbage
                        var songName = jsonObject.title.replace("Watched ", "");
                        var artistName = jsonObject.subtitles[0].name.replace(" - Topic", "");

                        //ignore entries where subtitles.name is "Music Library Uploads" (i.e., songs uploaded by the user)
						//in these cases we just can't get the artist's name, but song name should be fine
                        if(artistName !== "Music Library Uploads") {
                            var pos = -1;
                            //add artist to list or increment count if it's already in it
                            for(j=0; j<artists.length; j++) {
                                if(artists[j].name === artistName) {
                                    pos = j;
                                    break;
                                }
                            }
                            if(pos != -1) {
                                artists[pos].count++;
                            }
                            else {
                                var a = new Entry(artistName);
                                artists.push(a);
                            }
                        }

                        var pos = -1;
                        //add song to list or increment count if it's already in it
                        for(j=0; j<songs.length; j++) {
                            if(songs[j].name === songName) {
                                pos = j;
                                break;
                            }
                        }
                        if(pos != -1) {
                            songs[pos].count++;
                        }
                        else {
                            var s = new Entry(songName);
                            songs.push(s);
                        }
                        //totalPlays++;
                    }
                    catch(err) {
                        //JSON entry doesn't have song or artist name so we'll just quietly skip it
                    }
                }
            }

            //sort lists in decreasing order
            artists.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));
            songs.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));

            //generate table headers
            var tableCode = "<table class=\"tg\" id=\"results\">\n<thead>\n<tr>\n";
            tableCode += "<th class=\"tg-def\">TOP ARTISTS";
            if(showTotals) {
                tableCode += " <span class = \"gray\">(" + artists.length + ")</span>";
            }
            tableCode += "</th>" + 
            "<th class=\"tg-def\">TOP SONGS";
            if(showTotals) {
                tableCode += " <span class = \"gray\">(" + songs.length + ")</span>";
            }
            tableCode += "</th>\n</tr>\n</thead>\n<tbody>";

            //generate table body (i.e. the actual top songs/artists)
            //if the user-selected number of lines exceeds the number of artists or songs we have, we'll only iterate until we run out of both artists and songs
            //if we run out of one but not the other in the loop below, we'll just print what we can and leave the other one blank
            var maxLines = Math.max(Math.min(artists.length,lines),Math.min(songs.length,lines));
            for(i=0; i<maxLines; i++) {
                var num = "" + (i+1);
                if(maxLines >= 10 && num.length == 1) {
                    num = "0" + num;
                }

                var artistName = "&nbsp;";
                try {
                    artistName = artists[i].name;
                }
                catch(err) {
                    //ran out of artists so we'll leave this entry blank
                }

                var songName = "&nbsp;";
                try {
                    songName = songs[i].name;
                }
                catch(err) {
                    //ran out of songs so we'll leave this entry blank
                }

                tableCode += "<tr>\n";
                tableCode += "<td class=\"tg-def\">";
                if(artistName !== "&nbsp;") {
                    tableCode += "<span class=\"red\">" + num + "</span> " + artistName;
                    if(showTotals) {
                        tableCode += " <span class = \"gray\">(" + artists[i].count + ")</span>";
                    }
                }
				tableCode += "</td>\n";
                tableCode += "<td class=\"tg-def\">";
                if(songName !== "&nbsp;") {
                    tableCode += "<span class=\"red\">" + num + "</span> " + songName;
                    if(showTotals) {
                        tableCode += " <span class = \"gray\">(" + songs[i].count + ")</span>";
                    }
                }
				tableCode += "</td>\n";
				tableCode += "</tr>\n";
            }

            //add a nice little footer
            tableCode += "<tr>\n"
				+ "<td class=\"tg-footer-left\">pyoro.me/MusicRewind</td>\n"
				+ "<td class=\"tg-footer-right\">&#35;YTMusicRewind</td>\n"
				+ "</tr>\n";
            tableCode += "</tbody>\n</table>";

            //finally, write code to table and make it visible
            document.getElementById("results").outerHTML = tableCode;
            document.getElementById("results_paragraph").style.display = "block";

        };
      })(file);

      //read the JSON file
      reader.readAsText(file);
}

//called when the page loads to set the year input box to the current year
function setYear() {
    document.getElementById("year").setAttribute("value",new Date().getFullYear());
}

//show/hide instructions
function toggleInstructions() {
    var e = document.getElementById("instructions_body");
    if(e.style.display === "none") {
        e.style.display = "block";
    }
    else {
        e.style.display = "none";
    }
}