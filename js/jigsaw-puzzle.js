var timerFunction;

var jigsawPuzzle = {
    stepCount: 0,
    count: 0,
    startTime: new Date().getTime(),

    startPuzzle: function (pictureUrl, noOfRows, noOfCols) {
        this.setImage(pictureUrl, noOfRows, noOfCols);
        helper.doc('puzzleBox').style.display = 'inline-block';
        helper.shuffle('sortable');
        this.stepCount = 0;
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - jigsawPuzzle.startTime) / 1000, 10);
        helper.doc('timerPanel').textContent = elapsedTime;
        timerFunction = setTimeout(jigsawPuzzle.tick, 1000);
        if (elapsedTime == 3) {
            clearTimeout(timerFunction);
            timerFunction = 0;
            helper.doc('puzzleBox').style.display = 'none !important';
        }
    },
    setImage: function (pictureUrl, noOfRows = 4, noOfCols = 4) {
        var percentage = 100 / (noOfRows - 1);
        helper.doc('actualImage').setAttribute('src', pictureUrl);
        helper.doc('sortable').innerHTML = '';
        for (var i = 0; i < noOfRows * noOfCols; i++) {
            var xpos = (percentage * (i % noOfRows)) + '%';
            var ypos = (percentage * Math.floor(i / noOfCols)) + '%';

            let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            li.style.backgroundImage = 'url(' + pictureUrl + ')';
            li.style.backgroundSize = (noOfRows * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            li.style.width = 500 / noOfRows + 'px';
            li.style.height = 500 / noOfCols + 'px';

            li.setAttribute('draggable', 'true');
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;

                if (origin && dest && p) {
                    let temp = dest.nextSibling;
                    let x_diff = origin.offsetLeft - dest.offsetLeft;
                    let y_diff = origin.offsetTop - dest.offsetTop;

                    if (y_diff == 0 && x_diff > 0) {
                        p.insertBefore(origin, dest);
                        p.insertBefore(temp, origin);
                    }
                    else {
                        p.insertBefore(dest, origin);
                        p.insertBefore(origin, temp);
                    }


                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);
                    var now = new Date().getTime();
                    helper.doc('stepCount').textContent = ++jigsawPuzzle.stepCount;
                    document.querySelector('.timeCount').textContent = (parseInt((now - jigsawPuzzle.startTime) / 1000, 10));

                    if (isSorted(vals)) {
                        helper.doc('gameOver').style.display = 'block';
                        helper.doc('actualImageBox').innerHTML = helper.doc('gameOver').innerHTML;
                        helper.doc('stepCount').textContent = jigsawPuzzle.stepCount;
                    }
                }
            };
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
        }
        helper.shuffle('sortable');
    }
};

isSorted = (arr) => arr.every((elem, index) => { return elem == index; });

var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),

    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }
}