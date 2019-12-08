document.addEventListener('keydown', initKeys);
var presses = 0;
var clicks = 0;

function clickToHear(){
    if(clicks == 0) { document.getElementById("soInstructions").play(); }
    clicks++;
    if(clicks >= 2) {
        document.getElementById("instructions").remove(); 
        document.getElementById("soInstructions").pause();
        document.getElementById("incomingCall").play();
    }
}

function initKeys(k){
    if(document.getElementById("instructions")){
        presses++;
        if(presses >= 2) { 
            document.getElementById("instructions").remove(); 
            document.getElementById("soInstructions").pause();
            document.getElementById("incomingCall").play();
        }
        return;
    }
    if(document.getElementById("title")){
        Initialize(); 
    }
}




//Adding sound clips
function AddSound(id, src, group, _play, _loop, _volume) {
    
    this.sound = document.createElement("audio");
    this.sound.setAttribute("id",id);
    this.sound.src = src;
    this.sound.class = group;
    this.sound.setAttribute("class",group);
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        //this.sound.volume = 1;
        this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }


    _volume = _volume || 0;
    this.sound.volume = _volume;

    //start playing immeadiately
    _play = _play || 0;
    _play ? this.play() : 0;

    //loop or not?
    _loop = _loop || 0;
    _loop ? this.sound.loop = true : 0;


    return sound;
  } 




//Game has multiple levels
 class Level {

    constructor(name,maxCols,maxRows) {
        this.name = name;
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
            e.volume = 0.2;
            
        });
        // this.instruments.length > 0 ? soBase.volume = 0.3 : 0;
    }

    StopInstruments() {
        console.log("stopping "+NPC.position[0]+" "+NPC.position[1]);
        current_lvl.map[NPC.position[0]][NPC.position[1]].instruments.forEach(function(e){
            e.volume = 0;
        });
        //changing soBase.volume to 0
        // soBase.volume = 0;
        // console.log(soBase.volume);

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


        this.speech.empty = [
            "audio/speech/nothingHere1.mp3"
        ];

        this.speech.emptyHands = [
            "audio/speech/dropEmpty.mp3"
        ];

        this.speech.pickupFull = [
            "audio/speech/pickupFull.mp3"
        ];

        //Object
        this.speech.new = {
            "lvl0.14":"audio/speech/hello.mp3",
            "lvl0.13":"audio/speech/0A3-1.mp3",
            "lvl0.12":"audio/speech/0A2-1.mp3",
            "lvl0.11":"audio/speech/0A1-1.mp3",
            "lvl1.11":"audio/speech/1B1-1.mp3",
            "lvl1.21":"audio/speech/1C1-1.mp3",
            "lvl1.31":"audio/speech/1D1-1.mp3",

        }

        this.speech.complete = {
            "lvl0":"audio/speech/lvl0-complete.mp3",
            "lvl1":"audio/speech/lvl1-complete.mp3",
            "lvl2":"audio/speech/lvl2-complete.mp3",
            "lvl3":"audio/speech/victory.mp3",            
        }

    }

    ToldTo (action, param) {
        soNotify.play(); //notification sound
        interf.acceptInput = false;
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

    Say(phrase,followup,arg) {
        
        var c = this.position[0];
        var r = this.position[1];
        var lvl = current_lvl.name;
        var place =lvl+"."+c+r;
        

        followup = followup || console.log("no callback");

        
        console.log(phrase);
        switch(phrase){
            case "OK, boss":
                soSpeech.src = PickRandom(NPC.speech.Affirmations);
                soSpeech.play();
            break;

            case "Can't go":
                soSpeech.src = PickRandom(NPC.speech.CantGo);
                soSpeech.play(); 
            break;

            case "empty":
                soSpeech.src = PickRandom(NPC.speech.empty);
                soSpeech.play(); 
            break;

            case "emptyHands":
                soSpeech.src = PickRandom(NPC.speech.emptyHands);
                soSpeech.play(); 
            break;

            case "Victory":
                console.log("win");
                soSpeech.src = PickRandom(NPC.speech.victory);
                soSpeech.play(); 
            break;

            case "CompleteLvl":
                if(NPC.speech.complete[lvl]!==undefined) {
                    console.log(NPC.speech.complete[lvl]);
                    soSpeech.src = NPC.speech.complete[lvl];
                    soSpeech.play(); 
                } 
            break;

            case "newPlace":
                console.log(place);

                console.log(NPC.speech.new[place]);
                if(NPC.speech.new[place]!==undefined) {
                    // console.log(NPC.speech.new[place]);
                    soSpeech.src = NPC.speech.new[place];
                    soSpeech.play(); 
                }

            break;

        }
        if(followup)  {
            soSpeech.onended = followup(arg);
        }

        return soSpeech;
        
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
        if(current_lvl.map[newC]==undefined || current_lvl.map[newC][newR]===undefined){
            sound = NPC.Say("Can't go");
            sound.onended = NPC.ActionDone();
            interf.acceptInput = true;
            return;
        } 


        current_lvl.map[this.position[0]][this.position[1]].StopInstruments();
        
        this.position[0]=newC;
        this.position[1]=newR;
        this.facingDirection = newDirection;
        sound = NPC.Say("OK, boss");
        sound.onended = NPC.Walk();
  
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
        console.log(current_lvl.name);
        document.getElementById("posIndicator").innerHTML="You are in: "+current_lvl.name+" "+this.position[0]+","+this.position[1];
        
        this.Listen();
        if(!current_lvl.map[NPC.position[0]][NPC.position[1]].visited) {
            sound = NPC.Say("newPlace");
            current_lvl.map[this.position[0]][this.position[1]].visited=true;
            sound.onended = this.ActionDone();
        } else { 
            this.ActionDone(); }

    }

    Listen() {
        console.log(current_lvl.map);
        // console.log(this);
        current_lvl.map[NPC.position[0]][NPC.position[1]].PlayInstruments();
    }

    PickInstrument(ins){


        var a = current_lvl.map[this.position[0]][this.position[1]].instruments[ins];
        console.log(a);


        //room is not empty
        if( a !== undefined) {

            console.log(this.heldInstrument);
            if (this.heldInstrument) { 
                console.log("already holding something");
                NPC.Say("pickupFull")
                soSpeech.onended = this.ActionDone();
                return;
            }
            this.heldInstrument =a;
            this.heldInstrument.volume = 0.4;
            sound = NPC.Say("OK, boss");
            // soBase.volume = 0.45
        } else {
            console.log("empty");
            sound = NPC.Say("empty");
        }

        current_lvl.map[this.position[0]][this.position[1]].instruments.splice(ins,1);

        sound.onended = this.ActionDone();
    }

    DropInstrument(){

        console.log(NPC.heldInstrument);
        if(NPC.heldInstrument === null) {
            NPC.Say("emptyHands");
            this.ActionDone();
            return;
        }

        var instr_group = NPC.heldInstrument.class;
        
        this.heldInstrument.volume = 0.2;
        current_lvl.map[this.position[0]][this.position[1]].instruments.push(this.heldInstrument);
        this.heldInstrument =null;
        sound = NPC.Say("OK, boss");
        
        //check if all instruments of one group are together
        

        //how many are there of this group
        var thisclass_total = document.getElementsByClassName(instr_group).length

        var instr_group_count =0;
        current_lvl.map[this.position[0]][this.position[1]].instruments.forEach (function(e){
            e.class == instr_group ? instr_group_count++ : 0;
        });
        sound.onended = function() {
            instr_group_count==thisclass_total ? NPC.Victory(instr_group) : 0;
        };

        this.ActionDone();

    }

    //Execute at the end of each action
    ActionDone() {
        //restore default communication buttons
        interf.ChangeMode("default");
        interf.acceptInput = true;
    }

    Victory(group) {
        //something awesome
        console.log("sorted "+group);
        interf.acceptInput = false;

        if(group == "shanghai") {
           sound = NPC.Say("CompleteLvl");
           sound.onended = function() { SwitchToLevel(1) };
        }


        if(group == "glory") {
            sound = NPC.Say("CompleteLvl");
            sound.onended = function() { SwitchToLevel(2) };
        }

        if(group == "popular") {
            sound = NPC.Say("CompleteLvl");
            sound.onended = function() { SwitchToLevel(3) };
        }


        if(group == "mdn") {
            sound = NPC.Say("CompleteLvl");
        }

    }
    
}

class INTERFACE{

    constructor() {
        this.interfacemode = "default";
        this.btnUp = document.getElementById("button-up");
        this.btnDown = document.getElementById("button-down");
        this.btnRight = document.getElementById("button-right");
        this.btnLeft = document.getElementById("button-left");
        this.acceptInput = true;

        document.addEventListener('keydown', this.logKey);
    }

    logKey(k) {
        console.log(k.code);
        switch(k.code) {
            case "ArrowUp":
            case "Digit1":
                console.log(1);
                interf.ButtonPress("UP");
            break;
            case "ArrowDown":
            case "Digit4":
                interf.ButtonPress("DOWN");
            break;
            case "ArrowRight":
            case "Digit3":
                interf.ButtonPress("RIGHT");
            break;
            case "ArrowLeft":
            case "Digit2":
                interf.ButtonPress("LEFT");
            break;
        }
    }

    ButtonPress(btn){
        if(!this.acceptInput) return;

        if(interf.interfacemode=="move"){
            switch(btn) {
                case "UP":
                    soVox.src = "audio/sfx/voxGoForward.mp3";
                    var dir = 0;
                break;
                case "DOWN":
                    soVox.src = "audio/sfx/voxGoBack.mp3";
                    var dir = 6;
                break;
                case "RIGHT":
                    soVox.src = "audio/sfx/voxGoRight.mp3";
                    var dir = 3;
                break;
                case "LEFT":
                    soVox.src = "audio/sfx/voxGoLeft.mp3";
                    var dir = -3;
                break;
            }
            soVox.play();
            soVox.onended = function(){ NPC.ToldTo('Move',dir)};
            
            
        }
        if (interf.interfacemode=="default"){
            switch(btn) {
                case "UP":
                    soVox.src = "audio/sfx/voxMove.mp3";
                    soVox.play();
                    soVox.onended = function(){ interf.ChangeMode('move')};
                break;

                case "DOWN":
                    return;
                break;

                case "RIGHT":
                    soVox.src = "audio/sfx/voxDropDown.mp3";
                    soVox.play();
                    soVox.onended = function(){  NPC.ToldTo('DropInstrument');};
                
                break;
                case "LEFT":
                    soVox.src = "audio/sfx/voxPickUp.mp3";
                    soVox.play();
                    soVox.onended = function(){  NPC.ToldTo('PickInstrument');};
                    
                break;
            }
        }
        //soBleep.play();//sound feedback
        Haptics.vibrate(40); //vibration feedback 
    }
    
    ChangeMode(newMode) {
        interf.interfacemode=newMode;
        switch(newMode){
            case "default" :
                //button texts
                document.getElementById("tUP").innerHTML="Move";
                document.getElementById("tDOWN").innerHTML="";
                document.getElementById("tRIGHT").innerHTML="Drop instrument";
                document.getElementById("tLEFT").innerHTML="Pick instrument" ;
            break;

            case "move" :
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



function LoadLevel(level_name) {

    //forget current level if any
    current_lvl = null;
    //forget non-sfx sounds
    var all_sounds = document.getElementsByTagName("audio");
    for (s = 0; s<all_sounds.length;s++) {
        if (all_sounds[s].class != "sfx"){
            console.log(all_sounds[s]);
            all_sounds[s].parentNode.removeChild(all_sounds[s]);
        };
        
    }


    //retrieve new level name
    var level = levels[level_name];
    console.log(level);

    //load level sounds
    if (level == lvl0) {

        so0A1 = AddSound("shanghai1","audio/music/shanghai1.mp3","shanghai",1,1);
        so0A3 = AddSound("shanghai2","audio/music/shanghai2.mp3","shanghai",1,1);

       // lvl0.AddRoom(1,1,[so0A1]);
        // lvl0.AddRoom(1,2,[]);
        // lvl0.AddRoom(1,3,[so0A3]);
        // lvl0.AddRoom(1,4,[]);

        lvl0.AddRoom(1,1,[so0A1]);
        lvl0.AddRoom(1,2,[]);
        lvl0.AddRoom(1,3,[so0A3]);
        lvl0.AddRoom(1,4,[]);

        var start_c = 1;
        var start_r = 4;
        var start_direction = 0;
    }

    if (level == lvl1) {

        so1A1 = AddSound("glory1","audio/music/glory1.mp3","glory",1,1);
        so1B1 = AddSound("glory3","audio/music/glory3.mp3","glory",1,1);
        so1C1 = AddSound("glory2","audio/music/glory2.mp3","glory",1,1);

        lvl1.AddRoom(1,1,[so1A1]);
        lvl1.AddRoom(2,1,[so1B1]);
        lvl1.AddRoom(3,1,[so1C1]);

        var start_c = 1;
        var start_r = 1;
        var start_direction = 3;
    }

    if (level == lvl2) {
        so2B1 = AddSound("popular1","audio/music/popular1.mp3","popular",1,1);
        so2A2 = AddSound("popular2","audio/music/popular2.mp3","popular",1,1);
        so2B3 = AddSound("popular3","audio/music/popular3.mp3","popular",1,1);
    
        lvl2.AddRoom(1,1,[]);
        lvl2.AddRoom(1,2,[so2B1]);
        lvl2.AddRoom(1,3,[]);
        lvl2.AddRoom(2,1,[so2B3]);
        lvl2.AddRoom(2,2,[]);
        lvl2.AddRoom(2,3,[so2A2]);

        var start_c = 1;
        var start_r = 1;
        var start_direction = 3;
    }

    if (level == lvl3) {
        //Mozilla
        so3A3 = AddSound("mdn1","audio/music/mdn1.mp3","mdn",1,1);
        so3D2 = AddSound("mdn2","audio/music/mdn2.mp3","mdn",1,1);
        so3A1 = AddSound("mdn3","audio/music/mdn3.mp3","mdn",1,1);
        so3B2 = AddSound("mdn4","audio/music/mdn4.mp3","mdn",1,1);
        so3B3 = AddSound("mdn5","audio/music/mdn5.mp3","mdn",1,1);
        //Beatles
        so3D3 = AddSound("loveme1","audio/music/love_me_do1.mp3","loveme",1,1);
        so3B1 = AddSound("loveme2","audio/music/love_me_do2.mp3","loveme",1,1);
        so3D1 = AddSound("loveme3","audio/music/love_me_do3.mp3","loveme",1,1);
        so3C2 = AddSound("loveme4","audio/music/love_me_do4.mp3","loveme",1,1);


        lvl3.AddRoom(1,1,[]);
        lvl3.AddRoom(2,1,[so3B1]);
        lvl3.AddRoom(4,1,[so3D1]);
        lvl3.AddRoom(1,2,[so3A1]);
        lvl3.AddRoom(2,2,[so3B2]);
        lvl3.AddRoom(3,2,[so3C2]);
        lvl3.AddRoom(4,2,[so3D2]);
        lvl3.AddRoom(1,3,[so3A3]);
        lvl3.AddRoom(2,3,[so3B3]);
        lvl3.AddRoom(4,3,[so3D3]);

        var start_c = 1;
        var start_r = 1;
        var start_direction = 6;
    }

    //update starting position
    NPC.position[0] = start_c;
    NPC.position[1] = start_r;
    NPC.facingDirection = start_direction;
    

    interf.ChangeMode("default");
    document.getElementById("posIndicator").innerHTML="You are in: "+level.name+" "+NPC.position[0]+","+NPC.position[1];
    return level;
}

//INITIALIZE
function Initialize(start_level){
    interf = new INTERFACE;


    soNotify = AddSound("notification","audio/sfx/235911_notification.wav","sfx",0,0,1);
    soBleep = AddSound("bleep","audio/sfx/MenuSound.wav","sfx",0,0,1);
    soWalk = AddSound("walkSound","audio/sfx/steps.mp3","sfx",0,1,1); //no_play, but loop
    soSpeech = AddSound("Speech","","sfx",0,0,1);
    soVox = AddSound("vox","","sfx",0,0,1);//interface reader



    /*
        * Change level here
    */
   lvl0 = new Level('lvl0',1,4);
   lvl1 = new Level('lvl1',3,1);
   lvl2 = new Level('lvl2',2,3);
   lvl3 = new Level('lvl3',4,3);

   levels = [lvl0,lvl1,lvl2,lvl3];

   //use the function parameter level, the one from the url, or the default
   default_level = "0";
   var selected_lvl = start_level || getUrlParam('lvl',default_level);
   console.log(selected_lvl);

   current_lvl = LoadLevel(selected_lvl);
   NPC.UpdateLocation();
    
    //console.log(current_lvl.map);



    // console.log(NPC.position);
    
    document.getElementById("title").remove();

    Haptics.vibrate(100);

    sound = NPC.Say("newPlace");
    sound.onended = function() {document.getElementById("game").style.display="block"};
   
    
}

function SwitchToLevel(id){
    current_lvl.map[NPC.position[0]][NPC.position[1]].StopInstruments();
    current_lvl = LoadLevel(id);
    NPC.UpdateLocation();
};




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

