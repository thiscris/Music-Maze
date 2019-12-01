

var so1 = document.getElementById("sound-glory1");
var so2 = document.getElementById("sound-glory2");
var so3 = document.getElementById("sound-glory3");

so1.loop = true;
so2.loop = true;
so3.loop = true;



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

    PlayInstruments() {
        console.log(this.instruments);
        this.instruments.forEach(function(e){
            e.play();
        });
    }

    StopInstruments() {
        this.instruments.forEach(function(e){
            e.pause();
        });
    }
}

class agent{
    
    constructor(position,facingDirection){
        this.facingDirection = facingDirection || 3;
        this.position = position || [1,1];
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
    }

    Listen() {
        console.log(lvl1.map);
        lvl1.map[this.position[0]][this.position[1]].PlayInstruments();
    }
    
}



lvl1 = new Level(3,1);
//lvl1.AddRoom("A1",[so1,so2,so3]);

lvl1.AddRoom(1,1,[so1]);
lvl1.AddRoom(2,1,[so2]);
lvl1.AddRoom(3,1,[so3]);

console.log(lvl1.map);


var startingPos = [1,1];
var NPC = new agent(startingPos,3);
console.log(NPC.position);
document.getElementById("posIndicator").innerHTML="You are in: "+NPC.position[0]+","+NPC.position[1];