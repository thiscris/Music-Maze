

//Adding sound clips
function AddSound(id, src) {
    this.sound = document.createElement("audio");
    this.sound.setAttribute("id",id);
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.sound.volume = 0;
    this.sound.loop = true;
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
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
        col > this.maxCols ? col = this.maxCols : console.log(col);
        row > this.maxRows ? row = this.maxRows : console.log(row);
        
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
        });
    }

    StopInstruments() {
        this.instruments.forEach(function(e){
            e.volume = 0;
        });
    }
}

class agent{
    
    constructor(position,facingDirection){
        this.facingDirection = facingDirection || 3;
        this.position = position || [1,1];
        this.heldInstrument = "";
    }

    Move(newDirection){

        lvl1.map[this.position[0]][this.position[1]].StopInstruments();
        //update facing direction based on where we want to go
        //left = -3  ; right = +3

        this.facingDirection = newDirection + this.facingDirection;
        //clamp to clockface orientation
        this.facingDirection >12 ? this.facingDirection -= 12
        :this.facingDirection <1 ? this.facingDirection += 12
        :this.facingDirection;


        switch (this.facingDirection){
            case 3:
                //next column
                this.position[0]++;
            break;
            
            case 6:
                //next row
                this.position[1]++;
            break;

            case 9:
                //previous column
                this.position[0]--;
            break;

            case 12:
                //previous row
                this.position[1]--;
            break;
        }

        console.log(this.facingDirection);
        document.getElementById("posIndicator").innerHTML="You are in: "+this.position[0]+","+this.position[1];
        this.Listen();
    }

    Listen() {
        //console.log(lvl1.map);
        lvl1.map[this.position[0]][this.position[1]].PlayInstruments();
    }

    PickInstrument(ins){
        this.heldInstrument = lvl1.map[this.position[0]][this.position[1]].instruments[ins];
        this.heldInstrument.volume = 1;

        lvl1.map[this.position[0]][this.position[1]].instruments.splice(ins,1);

    }

    DropInstrument(){
        this.heldInstrument.volume = 0.5;
        lvl1.map[this.position[0]][this.position[1]].instruments.push(this.heldInstrument);
        this.heldInstrument = null;
        

    }
    
}


//INITIALIZE

soA1 = AddSound("glory1","audio/glory1.mp3");
soA2 = AddSound("glory2","audio/glory2.mp3");
soA3 = AddSound("glory3","audio/glory3.mp3");
soB1 = AddSound("popular1","audio/popular1.mp3");
soB2 = AddSound("popular2","audio/popular2.mp3");
soB3 = AddSound("popular3","audio/popular3.mp3");
soC1 = AddSound("shanghai1","audio/shanghai1.mp3");
soC2 = AddSound("shanghai2","audio/shanghai2.mp3");


lvl1 = new Level(3,3);
//lvl1.AddRoom("A1",[so1,so2,so3]);

lvl1.AddRoom(1,1,[soA1]);
lvl1.AddRoom(2,1,[soA2]);
lvl1.AddRoom(3,1,[soA3]);
lvl1.AddRoom(1,2,[soB1]);
lvl1.AddRoom(2,2,[soB2]);
lvl1.AddRoom(3,2,[soB3]);
lvl1.AddRoom(1,3,[soC1]);
lvl1.AddRoom(2,3,[soC2]);
lvl1.AddRoom(3,3,[]);

console.log(lvl1.map);


var startingPos = [1,1];
var NPC = new agent(startingPos,3);
console.log(NPC.position);
document.getElementById("posIndicator").innerHTML="You are in: "+NPC.position[0]+","+NPC.position[1];