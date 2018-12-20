function LszCanvans(canvansId) {
    var me = this;

    me.canvansDom = document.getElementById(canvansId);
    me.ctx = me.canvansDom.getContext("2d");

    me.objArr = [];
    me.width = 1024;
    me.height = 1024;

    //鼠标矩形
    me.mouseRectDraw = function (ca) {
        if (me.mouseRect.show) {
            let x1 = me.mouseRect.x1;
            let x2 = me.mouseRect.x2;

            let y1 = me.mouseRect.y1;
            let y2 = me.mouseRect.y2;
            let tmp = 0;
            if (x1 > x2) {
                tmp = x1;
                x1 = x2;
                x2 = tmp;
            }
            if (y1 > y2) {
                tmp = y1;
                y1 = y2;
                y2 = tmp;
            }
            let left = x1;
            let top = y1;
            let wid = x2 - x1;
            let hei = y2 - y1;
            ca.strokeRect(left, top, wid, hei);
        }
    }
    me.mouseRect = {
        show: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }
    me.del = function (xxkType) {
        for (let i = 0; i < me.objArr; i++) {
            let obj = me.objArr[i];
            if (obj.type == xxkType) {
                me.objArr.splice(i, 1);
                break;
            }
        }
    }
    me.pushImg = function (url, left, top) {
        var img = canvasUtil.loadImg(url);
        if (!left) {
            left = 0;
        }
        if (!top) {
            top = 0;
        }
        me.objArr.push({
            type: "img",
            data: img,
            left: left,
            top: top,
            sort: me.objArr.length + 1
        })
    }
    me.buff = newCtx(me.width, me.height);
    me.refresh = function () {
        me.buff.clearRect(0, 0, me.width, me.height);
        for (let obj of me.objArr) {
            if (obj.type == "img") {
                me.buff.drawImage(obj.data, obj.left, obj.top);
            }

        }
        me.mouseRectDraw(me.buff);
        var imgData = me.buff.getImageData(0, 0, me.width, me.height);
        me.ctx.putImageData(imgData, 0, 0);
    }

    me.canvansDom.onmousedown = function (e) {
        if(e.button = 1){
            //左键
            me.mouseRect.show = true;
            me.mouseRect.x1 = e.layerX;
            me.mouseRect.y1 = e.layerY;

            me.mouseRect.x2 = me.mouseRect.x1;
            me.mouseRect.y2 = me.mouseRect.y1;
        }
    }
    me.canvansDom.onmousemove = function (e) {
        if(e.button = 1) {
            //左键
            if(me.mouseRect.show){
                me.mouseRect.x2 = e.layerX;
                me.mouseRect.y2 = e.layerY;

                me.refresh();
            }
        }
    }
    me.canvansDom.onmouseup = function (e) {
        if(e.button = 1){
            //左键
            me.mouseRect.show = false;
        }
    }
}

function newCtx(wid, hei) {
    var c2 = document.createElement("canvas");
    c2.width = wid;
    c2.height = hei;
    return c2.getContext("2d");
}