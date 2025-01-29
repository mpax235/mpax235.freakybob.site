id = null;

function myMove() {
    var elem = document.getElementById('testAnimation');
    var pos = 0;
    clearInterval(id);
    id = setInterval(frame,5);
    function frame() {
        if (pos == 350) {
            clearInterval(id);
        } else {
            pos++;
            elem.style.top = pos + 'px';
            elem.style.left = pos + 'px';
        }
    }
}

function myFunction() {
    var inp = document.getElementById('usernameinput').value;
    var x = document.createElement("BUTTON");
    var t = document.createTextNode(inp);
    x.appendChild(t);
    x.className = 'clone-button';
    document.body.appendChild(x);
    document.body.style.backgroundColor = '#FF0000';
}