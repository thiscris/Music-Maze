

//Adding sound clips
function AddSound(id, src, group) {
    this.sound = document.createElement("audio");
    this.sound.setAttribute("id",id);
    this.sound.src = src;
    this.sound.class = group;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0;
    this.sound.loop = true;
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }

    //start playing immeadiately
    this.play();

    return sound;
  } 




//Game has multiple levels
 class Level {

    constructor(maxCols,maxRows) {
        this.map = new Array();
        for (var i = 1; i<maxCols+1;i++){
            this.map[i] = new Array();
        }

        this.maxCols = maxCols;
        this.maxRows = maxRows;
    }

    AddRoom(col,row,instruments,echo,movesteps,fadetime,fadevolume){
        col > this.maxCols ? col = this.maxCols : col;
        row > this.maxRows ? row = this.maxRows : row;
        
        this.map[col][row] = new Room(col,row,instruments,echo,movesteps,fadetime,fadevolume);
    }

    EnterRoom(room){
        room.PlayInstruments();
    }
}

//Levels are split in rooms.
class Room {

    constructor(col,row,instruments,echo,movesteps,fadetime,fadevolume) {
        //room position on the map
        this.col = col;
        this.row = row;

        this.visited = false;

        //array of mp3 sounds
        this.instruments = instruments;


        //some rooms have stronger echo than others?
        this.echo = echo;
        //different rooms = different floors = different step sounds
        this.movesteps = movesteps;

        //simulate room size by having different fade distances at different fade volumes
        this.fadetime = fadetime;
        this.fadevolume = fadevolume;
    }

    AddInstrument(mp3) {
        this.instruments.push(mp3);
    }

    RemoveInstrument(mp3) {
        
    }

    PlayInstruments() {
        console.log(this.instruments);
        this.instruments.forEach(function(e){
            e.volume = 0.5;
            console.log(e);
        });
        soBase.volume = 0.3;
    }

    StopInstruments() {
        this.instruments.forEach(function(e){
            e.volume = 0;
        });
        ("changing soBase.volume to 0");
        soBase.volume = 0;
    }
}

class agent{
    
    constructor(position,facingDirection){
        this.facingDirection = facingDirection || 3;
        this.position = position || [1,1];
        this.heldInstrument = null;
        this.speech = [];
        this.speech.Affirmations = [
            "audio/speech/ok1.mp3",
            "audio/speech/ok2.mp3",
            "audio/speech/ok3.mp3",
            "audio/speech/ok4.mp3",
            "audio/speech/ok5.mp3"
        ];

        this.speech.CantGo = [
            "audio/speech/cantGo1.mp3",
            "audio/speech/cantGo2.mp3",
            "audio/speech/cantGo3.mp3",
            "audio/speech/cantGo4.mp3",
            "audio/speech/cantGo5.mp3",
            "audio/speech/cantGo6.mp3"
        ];

        this.speech.hello = [
            "audio/speech/hello.mp3"
        ];

        this.speech.victory = [
            "audio/speech/victory.mp3"
        ];

        this.speech.empty = [
            "audio/speech/nothingHere1.mp3"
        ];


    }

    ToldTo (action, param) {
        soNotify.play(); //notification sound
        soNotify.onended = function(){
            switch(action) {
                case "Move":
                    NPC.Move(param);
                break;
    
                case "PickInstrument":
                    NPC.PickInstrument(0);
                break;
    
                case "DropInstrument":
                    NPC.DropInstrument();
                break;
            }
        }      
    }

    Say(phrase,followup) {
        console.log(this);
        var c = this.position[0];
        var r = this.position[1];

        followup = followup || console.log("no callback");

        switch(phrase){
            case "OK, boss":
                soSpeech.src = PickRandom(NPC.speech.Affirmations);
                soSpeech.play();
            break;

            case "Can't go":
                soSpeech.src = PickRandom(NPC.speech.CantGo);
                soSpeech.play(); 
            break;

            case "Empty":
                soSpeech.src = PickRandom(NPC.speech.empty);
                soSpeech.play(); 
            break;

            case "Victory":
                console.log("win");
                soSpeech.src = PickRandom(NPC.speech.victory);
                soSpeech.play(); 
            break;

            case "newPlace":
                if(c==1 && r==1) {
                    soSpeech.src = PickRandom(NPC.speech.hello);
                    soSpeech.play(); 
                }
        }
        if(followup)  {
            soSpeech.onended(followup());
        }
        
    };

    Move(rotate){
        

        console.log(rotate);

        //update facing direction based on where we want to go
        //left = -3  ; right = +3

        var newDirection = rotate + this.facingDirection;
        //clamp to clockface orientation
        newDirection >12 ? newDirection -= 12
        :newDirection <1 ? newDirection += 12
        :newDirection;

        var newC = this.position[0];
        var newR = this.position[1];

        switch (newDirection){
            case 3:
                //next column
                newC++;
            break;
            
            case 6:
                //next row
                newR++;
            break;

            case 9:
                //previous column
                newC--;
            break;

            case 12:
                //previous row
                newR--;
            break;
        }

        var moved = false;
        //if tile is not on the map report that
        if(!current_lvl.map[newC][newR]){
            NPC.Say("Can't go",NPC.ActionDone());
            return;
        } 


        current_lvl.map[this.position[0]][this.position[1]].StopInstruments();
        
        this.position[0]=newC;
        this.position[1]=newR;
        this.facingDirection = newDirection;
        NPC.Say("OK, boss",NPC.Walk);
  
    }     
        
    Walk(){
        soWalk.play();
        setTimeout(function(){
            soWalk.pause();
            NPC.UpdateLocation();
        }, 3000);    
    } 
        
    UpdateLocation(){
        console.log(this.facingDirection);
        document.getElementById("posIndicator").innerHTML="You are in: "+this.position[0]+","+this.position[1];
        
        this.Listen();
        if(!current_lvl.map[this.position[0],this.position[1]].visited) {
            NPC.Say("newPlace");
        }

        current_lvl.map[this.position[0],this.position[1]].visited=true;
        this.ActionDone();
    }

    Listen() {
        //console.log(current_lvl.map);
        current_lvl.map[this.position[0]][this.position[1]].PlayInstruments();
    }

    PickInstrument(ins){

        console.log(this.heldInstrument);
        if (this.heldInstrument) {
            console.log("already holding something");
            return;
        }

        var a = current_lvl.map[this.position[0]][this.position[1]].instruments[ins];
        console.log(a);

        if( a !== undefined) {
            this.heldInstrument =a;
            this.heldInstrument.volume = 1;
            soBase.volume = 0.45
        } else {
            console.log("empty");
            NPC.Say("empty");
        }

        current_lvl.map[this.position[0]][this.position[1]].instruments.splice(ins,1);

        this.ActionDone();
    }

    DropInstrument(){

        console.log(this.heldInstrument);
        var instr_group = this.heldInstrument.class;
        
        this.heldInstrument.volume = 0.5;
        current_lvl.map[this.position[0]][this.position[1]].instruments.push(this.heldInstrument);
        this.heldInstrument = "";
        
        //check if all instruments of one group are together
        console.log(instr_group);
        var instr_group_count =0;
        current_lvl.map[this.position[0]][this.position[1]].instruments.forEach (function(e){
            e.class == instr_group ? instr_group_count++ : 0;
            console.log(e.class);
            console.log(instr_group_count);
        });
        instr_group_count==4 ? NPC.Say("Victory",NPC.Victory()) : 0; //Fixed to 3 instruments

        this.ActionDone();

    }

    //Execute at the end of each action
    ActionDone() {
        //restore default communication buttons
        interf.ChangeMode("default");
    }

    Victory() {
        //something awesome

    }
    
}

class INTERFACE{

    constructor() {
        this.interfacemode = "move";
        this.btnUp = document.getElementById("button-up");
        this.btnDown = document.getElementById("button-down");
        this.btnRight = document.getElementById("button-right");
        this.btnLeft = document.getElementById("button-left");
    }
    
    ChangeMode(newMode) {
        switch(newMode){
            case "default" :
                    //button functions
                    // add to onClick event Navigator.vibrate();
                    this.btnUp.setAttribute( "onClick", "interf.ChangeMode('move')");
                    this.btnDown.setAttribute( "onClick", ""); //empty button
                    this.btnRight.setAttribute( "onClick", "interf.ChangeMode('talk')");
                    
                    //change button based on holding instrument or not
                    !NPC.heldInstrument ? 
                        this.btnLeft.setAttribute( "onClick", "NPC.ToldTo('PickInstrument')") :
                        this.btnLeft.setAttribute( "onClick", "NPC.ToldTo('DropInstrument')") ;


                    //button texts
                    document.getElementById("tUP").innerHTML="Move";
                    document.getElementById("tDOWN").innerHTML="";
                    document.getElementById("tRIGHT").innerHTML="Talk";

                    console.log(NPC.heldInstrument );
                    //change button based on holding instrument or not
                    !NPC.heldInstrument ? 
                        document.getElementById("tLEFT").innerHTML="Pick up" :
                        document.getElementById("tLEFT").innerHTML="Place instrument" ;
                    

            break;
            case "move" :
                //button functions
                this.btnUp.setAttribute( "onClick", " NPC.ToldTo('Move',0)");
                this.btnDown.setAttribute( "onClick", " NPC.ToldTo('Move',6)");
                this.btnRight.setAttribute( "onClick", " NPC.ToldTo('Move',3)");
                this.btnLeft.setAttribute( "onClick", " NPC.ToldTo('Move',-3)");

                //button texts
                document.getElementById("tUP").innerHTML="Go Forward";
                document.getElementById("tDOWN").innerHTML="Go Back";
                document.getElementById("tRIGHT").innerHTML="Go Right";
                document.getElementById("tLEFT").innerHTML="Go Left";
            break;
        }
    }
    
    
}


var startingPos = [1,1];
var NPC = new agent(startingPos,3);


//INITIALIZE
function Initialize(){
    interf = new INTERFACE;

    soNotify = document.getElementById("notification");
    soWalk = document.getElementById("walkSound");
    soWalk.loop = true;
    soSpeech = document.getElementById("Speech");
/*
    so1A1 = AddSound("glory1","audio/music/glory1.mp3","glory");
    so1A2 = AddSound("glory2","audio/music/glory2.mp3","glory");
    so1A3 = AddSound("glory3","audio/music/glory3.mp3","glory");
    so1B1 = AddSound("popular1","audio/music/popular1.mp3","popular");
    so1B2 = AddSound("popular2","audio/music/popular2.mp3","popular");
    so1B3 = AddSound("popular3","audio/music/popular3.mp3","popular");
    so1C1 = AddSound("shanghai1","audio/music/shanghai1.mp3","shanghai");
    so1C2 = AddSound("shanghai2","audio/music/shanghai2.mp3","shanghai");
*/


    intro = new Level(3,1);


    lvl1 = new Level(3,3);
/*    lvl1.AddRoom(1,3,[so1A1]);
    lvl1.AddRoom(2,3,[so1A2]);
    lvl1.AddRoom(3,3,[so1A3]);
    lvl1.AddRoom(1,2,[so1B1]);
    lvl1.AddRoom(2,2,[so1B2]);
    lvl1.AddRoom(3,2,[so1B3]);
    lvl1.AddRoom(3,1,[so1C1]);
    lvl1.AddRoom(2,1,[so1C2]);
    lvl1.AddRoom(1,1,[]);
*/
    so2A3 = AddSound("loveme1","audio/music/love_me_do1.mp3","loveme");
    so2B1 = AddSound("loveme2","audio/music/love_me_do2.mp3","loveme");
    so2D1 = AddSound("loveme3","audio/music/love_me_do3.mp3","loveme");
    //so2C2 = AddSound("loveme4","audio/music/love_me_do4.mp3","loveme");
    soBase = AddSound("loveme4","audio/music/love_me_do4.mp3","loveme");

    

    lvl2 = new Level(4,3);
    lvl2.AddRoom(1,1,[]);
    lvl2.AddRoom(2,1,[so2B1]);
    lvl2.AddRoom(4,1,[so2D1]);
    lvl2.AddRoom(1,2,[]);
    lvl2.AddRoom(2,2,[]);
    lvl2.AddRoom(3,2,[]);
    // lvl2.AddRoom(3,2,[so2C2]);
    lvl2.AddRoom(4,2,[]);
    lvl2.AddRoom(1,3,[so2A3]);
    lvl2.AddRoom(2,3,[]);
    lvl2.AddRoom(4,3,[]);


    /*
        * Change level here
    */
   levels = [intro,lvl1,lvl2];
   var selected_lvl = getUrlParam('lvl','2');
   console.log(selected_lvl);

    current_lvl = levels[selected_lvl];

    console.log(current_lvl.map);


    console.log(NPC.position);
    interf.ChangeMode("default");
    document.getElementById("posIndicator").innerHTML="You are in: "+NPC.position[0]+","+NPC.position[1];
    
    document.getElementById("title").style.display="none";

    NPC.Say("newPlace",document.getElementById("game").style.display="block");

    
}










// HELP FUNCTIONS
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function PickRandom(array) {
    return item = array[Math.floor(Math.random()*array.length)];
}

