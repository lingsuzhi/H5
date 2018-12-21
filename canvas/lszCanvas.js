function LszCanvans(canvansId) {
    var me = this;

    me.canvansDom = document.getElementById(canvansId);
    me.ctx = me.canvansDom.getContext("2d");

    me.objArr = [];
    me.width = 1024;
    me.height = 1024;
    me.draw = {
        type: ''
    };

    me.setDraw = function (type) {
        me.draw.type = type;
        me.canvansDom.style.cursor = 'crosshair';
    }
    //鼠标矩形
    me.mouseRectDraw = function (ca) {
        if (me.mouseRect.show) {
            var rect = me.mouseRect.getRect();
            ca.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
        }
    }
    me.mouseRect = {
        show: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        getRect: function () {
            return canvasUtil.posToRect(me.mouseRect.x1, me.mouseRect.y1, me.mouseRect.x2, me.mouseRect.y2);
        }
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
    me.pushObj = function (type, rect) {
        me.objArr.push({
            type: type,
            data: {},
            left: rect.left,
            top: rect.top,
            wid: rect.wid,
            hei: rect.hei,
            focus: false,
            sort: me.objArr.length + 1
        })
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
            focus: false,
            sort: me.objArr.length + 1
        })
    }
    me.buff = newCtx(me.width, me.height);
    me.refresh = function () {
        me.buff.clearRect(0, 0, me.width, me.height);
        for (let obj of me.objArr) {
            if (obj.type == "img") {
                me.buff.drawImage(obj.data, obj.left, obj.top);
            } else if (obj.type = "select") {
                drawSelect(obj);
            }
        }
        me.mouseRectDraw(me.buff);
        var imgData = me.buff.getImageData(0, 0, me.width, me.height);
        me.ctx.putImageData(imgData, 0, 0);
    }
    me.canvansDom.onmousedown = function (e) {
        if (e.button = 1) {
            //左键
            me.mouseRect.show = true;
            me.mouseRect.x1 = e.layerX;
            me.mouseRect.y1 = e.layerY;

            me.mouseRect.x2 = me.mouseRect.x1;
            me.mouseRect.y2 = me.mouseRect.y1;
        }
    }
    me.canvansDom.onmousemove = function (e) {
        if (e.button = 1) {
            //左键
            if (me.mouseRect.show) {
                me.mouseRect.x2 = e.layerX;
                me.mouseRect.y2 = e.layerY;

                me.refresh();
            }
        }
    }

    function findObj(x, y) {
        for (let obj of me.objArr) {
            if (obj.type == "img") {
                // img 不算
            } else {
                //暂时不排序
                obj.focus = false;
                if (x > obj.left && x < (obj.left + obj.wid)
                    && y > obj.top && y < (obj.top + obj.hei)) {
                    obj.focus = true;

                }

            }
        }
    }

    me.canvansDom.onmouseup = function (e) {
        let x = e.layerX;
        let y = e.layerY;
        if (e.button = 1) {
            //左键
            me.mouseRect.show = false;
            if (me.draw.type == 'select') {
                me.canvansDom.style.cursor = 'default';
                var rect = me.mouseRect.getRect();
                me.pushObj(me.draw.type, rect);
            }else  if (me.draw.type == '') {
                findObj(x,y)
            }
            me.refresh();
            me.draw.type = '';
        }
    }

    function drawSelect(obj) {
        let ctx = me.buff;
        let rect = obj;

        if (obj.focus){
            //焦点 画8个矩形
            ctx.strokeStyle="#FF0000";

        }else{
            ctx.strokeStyle="#333333";
        }
        ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
    }

}

function newCtx(wid, hei) {
    var c2 = document.createElement("canvas");
    c2.width = wid;
    c2.height = hei;
    return c2.getContext("2d");
}