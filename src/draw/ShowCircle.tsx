import React from 'react';
import './CircleShow.css'

 const OFFSET = 60
const radius = 75;

function draw(ctx : any, location:any) {
    ctx.beginPath();
    ctx.fillStyle = "dodgerblue";
    ctx.font = "20px Georgia";
    ctx.lineWidth = 10;
    ctx.arc(location.x, location.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillText("Lorem ipsum", location.x - OFFSET, location.y);
    ctx.fill();
}


function usePersistentState(init:any){
    const [value, setValue] = React.useState(
      JSON.parse((localStorage as any).getItem('draw-app')) || init
    )
    React.useEffect(() => {
      localStorage.setItem('draw-app', JSON.stringify(value))
    })
    return [value, setValue]
}

function usePersistentCanvas() {
    const [locations, setLocations] = usePersistentState([])
    
    const canvasRef = React.useRef(null)
    
    React.useEffect(() => {
      const canvas = canvasRef.current
      const ctx = (canvas as any).getContext("2d");
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      locations.forEach((location: any) => draw(ctx, location))
    })
    return [locations, setLocations, canvasRef]
  }

interface IPoint {
    x:number,
    y:number
}

export function ShowCircle() {  
    const [locations, setLocations, canvasRef] = usePersistentCanvas()

    function drawNewCanvas() {
        const x = Math.floor((Math.random()*801)+32);
        const y = Math.floor((Math.random()*801)+32);
        const newLocation = {x,y}
        const result = locations.find((el:IPoint)=>{
            return isCollide(el,newLocation);
        })

        if(result){
            drawNewCanvas();  
        }else {
            setLocations([...locations, newLocation])
        }   
    }

    function isCollide(circle1:IPoint, circle2:IPoint) {
        const distance_x = circle1.x - circle2.x;
        const distance_y = circle1.y - circle2.y;
        let radii_sum = radius*2;

        if(distance_x * distance_x + distance_y * distance_y <= radii_sum * radii_sum) return true;

        return false;

    }

    function handleUndo() {
        setLocations(locations.slice(0, -1))
    }

    return(
        <div>
            <div className="controls">
                <button onClick={drawNewCanvas}>Add circle</button>
                <button onClick={handleUndo}>Undo</button>
            </div>
            <canvas 
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </div>
    );
};

export default ShowCircle;