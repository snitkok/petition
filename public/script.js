(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const signature = document.getElementById("signature");

    //Add default mouse position

    let coord = { x: 0, y: 0 };

    //Functions
    let start = (event) => {
        canvas.addEventListener("mousemove", pencil);
        changePosition(event);
        // const signatureUrl = canvas.toDataURL;
        // signature.value = signatureUrl;
    };

    let changePosition = (event) => {
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;
        console.log("event", event);
    };

    let stop = (event) => {
        canvas.removeEventListener("mousemove", pencil);
    };

    //Mouseevents
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);

    //"Pencil tool"

    let pencil = (event) => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.moveTo(coord.x, coord.y);
        changePosition(event);
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
        ctx.closePath();
    };
})();

// Check if the user is drawing or not
// let drawing = false;
// //Add mousedown

// canvas.addEventListener("mousedown", (e) => {
//     if (drawing == true) {
//         pencil(ctx, a, b, e.offsetX, e.offsetY);
//         mousePosX = e.offsetX;
//         mousePosY = e.offsetY;
//     }
// });

// //Add mouseup
// canvas.addEventListener("mouseup", (e) => {
//     if (drawing == true) {
//         pencil(ctx, a, b, e.offsetX, e.offsetY);
//         mousePosX = e.offsetX;
//         mousePosY = e.offsetY;
//     }
// });

// //Add mousemove
// canvas.addEventListener("mousemove", (e) => {
//     if (drawing == true) {
//         pencil(ctx, a, b, e.offsetX, e.offsetY);
//         mousePosX = e.offsetX;
//         mousePosY = e.offsetY;
//     }
// });
