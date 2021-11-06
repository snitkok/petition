(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const signature = document.getElementById("signature");

    //Add mouse coordinates

    let coord = { x: 0, y: 0 };

    // Functions

    // call canvas. getBoundingClientRect() and subtract the left from clientX and top from clientY

    let changePosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        coord.x = event.clientX - rect.left;
        coord.y = event.clientY - rect.top;
        console.log("event", event);
    };

    let stop = (event) => {
        canvas.removeEventListener("mousemove", pencil);
    };

    //Mouseevents
    canvas.addEventListener("mousedown", function (event) {
        canvas.addEventListener("mousemove", pencil);
        changePosition(event);
        const signatureUrl = canvas.toDataURL;
        signature.value = signatureUrl;
    });

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
