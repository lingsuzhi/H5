function LszCanvans(canvansId) {
    var me = this;
    me.outoId = 0;
    me.canvansDom = document.getElementById(canvansId);
    me.ctx = me.canvansDom.getContext("2d");
    me.objLeft = 50;
    me.objTop = 50;

    me.objComplex = {
        wid: 300,
        hei: 30,
        type: 'complex'
    }
    me.objSelect = {
        wid: 80,
        hei: 30,
        type: 'select'
    };
    me.objCondition = {
        wid: 300,
        hei: 30,
        type: 'condition'
    };
    me.objCondition.wid1 = 110;
    me.objCondition.wid2 = 80;
    me.objCondition.wid3 = 110;


    me.objSpaceWid = 6;
    me.objSpaceHei = 5;
    //js 就是好，变量都不需要声明，直接用
    me.objArr = [];

    me.width = me.canvansDom.clientWidth;
    me.height = me.canvansDom.clientHeight;
    me.draw = {
        type: ''
    };
    me.appendImgDo = function (src) {
        me.appendImg = canvasUtil.loadImg(src);
        me.canvansDom.style.cursor = 'crosshair';
    }
    me.setDraw = function (type, tag, tagCode) {
        me.draw.type = type;
        me.draw.tag = tag;
        me.draw.tagCode = tagCode;
        me.canvansDom.style.cursor = 'crosshair';
    }
    me.setDrawEx = function (type, tag, tagCode) {
        me.setDraw(type, tag, tagCode);
        me.mouseRect.show = 2;
    }
    //鼠标矩形
    me.mouseRectDraw = function (ctx) {
        if (me.appendImg) {

            if (me.appendImg.width) {
                ctx.drawImage(me.appendImg, me.mouseRect.x2 - me.appendImg.width / 2, me.mouseRect.y2 - me.appendImg.height / 2)
            }

            return true;
        }
        if (me.mouseRect.show) {
            if (me.draw.type == 'select') {
                ctx.strokeRect(me.mouseRect.x2 - me.objSelect.wid / 2, me.mouseRect.y2 - me.objSelect.hei / 2, me.objSelect.wid, me.objSelect.hei);
            } else {
                ctx.setLineDash([6, 4]);
                let rect = me.mouseRect.getRect();
                ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);

            }
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
    me.delObj = function (xxkType) {
        for (let i = 0; i < me.objArr; i++) {
            let obj = me.objArr[i];
            if (obj.type == xxkType) {
                me.objArr.splice(i, 1);
                break;
            }
        }
    }
    me.newObj = function (obj, arr) {
        obj.id = getNewId();
        obj.children = [];
        arr.push(obj);
    }

    function getNewId() {
        me.outoId = me.outoId + 1;
        return me.outoId;
    }

    me.pushObj = function (type, rect) {
        me.newObj({
            type: type,
            data: {},
            left: rect.left,
            top: rect.top,
            wid: rect.wid,
            hei: rect.hei,
            tag: rect.tag,
            tagCode: rect.tagCode,
            focus: false,
            sort: me.objArr.length + 1
        }, me.objArr)
    }
    me.pushImg = function (img, left, top, allowMove) {

        if (!left) {
            left = 0;
        }
        if (!top) {
            top = 0;
        }
        me.newObj({
            type: "img",
            data: img,
            left: left,
            top: top,
            allowMove: allowMove,
            wid: img.width,
            hei: img.height,
            focus: false,
            sort: me.objArr.length + 1
        }, me.objArr)
    }
    me.pushImgByUrl = function (url, left, top) {
        let img = canvasUtil.loadImg(url);
        me.pushImg(img, left, top);
    }
    me.buff = newCtx(me.width, me.height);

    me.refresh = function () {
        me.refreshHei = 0;
        me.buff.clearRect(0, 0, me.width, me.height);
        me.refreshEx(me.objArr);
        me.mouseRectDraw(me.buff);
        // drawLine(me.buff, 10, 10, 100, 100);
        let imgData = me.buff.getImageData(0, 0, me.width, me.height);
        me.ctx.putImageData(imgData, 0, 0);
    }

    me.refreshEx = function (arr, parent) {

        for (let obj of arr) {
            if (obj.state == 'kill') {
                //arr.splice(i,1); //还是不要删把
                continue;
            }

            if (obj.type == "img") {

                if (!obj.data.fanzhuan) {
                    me.buff.drawImage(obj.data, obj.left, obj.top);
                } else {
                    me.buff.save();
                    me.buff.transform(-1, 0, 0, 1, 0, 0);
                    me.buff.drawImage(obj.data, -obj.data.width - obj.left, obj.top);
                    me.buff.restore();
                }


            } else {
                //初始化
                obj.treeLeft = obj.left + obj.wid + me.objSpaceWid;

                if (parent) {
                    obj.left = parent.treeLeft;
                    obj.top = me.refreshHei;
                    me.refreshHei = me.refreshHei + obj.hei + me.objSpaceHei;

                    let lineX = parent.left + parent.wid / 2;
                    let lineY2 = me.refreshHei - parent.hei / 2 - 3;
                    let color = '#5FB878';
                    if (parent.data.leftType == 'and') {
                        color = '#FF5722'
                    }
                    drawLine(me.buff, lineX, parent.top + parent.hei + 1, lineX, lineY2, color);

                    drawLine(me.buff, lineX, lineY2, obj.left, lineY2, color);
                } else {
                    if (obj.tagCode == 'success' || obj.tagCode == 'fail') {
                        if (obj.top < me.refreshHei + 10) {
                            obj.top = me.refreshHei + 50;
                        }
                    }
                    me.refreshHei = obj.top + obj.hei;
                }
                if (obj.type == "select") {


                    drawSelect(obj);
                } else if (obj.type == 'condition') {
                    //条件
                    drawCondition(obj);
                } else if (obj.type == 'complex') {
                    drawComplex(obj);
                } else if (obj.type == 'rect') {
                    drawRect(obj);
                }

                //递归
                if (obj.children && obj.children.length) {
                    me.refreshEx(obj.children, obj);


                }


            }

        }
    }
    me.moveObj = {};
    me.canvansDom.onmousedown = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        if (e.buttons == 1) {
            //左键
            me.mouseRect.show = true;
            me.mouseRect.x1 = x;
            me.mouseRect.y1 = y;

            me.mouseRect.x2 = me.mouseRect.x1;
            me.mouseRect.y2 = me.mouseRect.y1;

            let obj = me.findFocus(me.objArr);
            if(obj && obj.allowMove == 'move'){
                me.moveObj.id = obj.id;
                me.moveObj.offX = x - obj.left;
                me.moveObj.offY = y - obj.top;

                if (me.moveObj.offX < 0 || me.moveObj.offY<0 || me.moveObj.offY > obj.hei || me.moveObj.offX > obj.wid){
                    me.moveObj ={};

                }else{
                    me.mouseRect.show = false;
                }
            }
        }
    }
    me.findById = function (id, arr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            if (obj.id == id) {
                return obj;
            }
            //递归
            if (obj.children && obj.children.length) {
                let b = me.findById(id, obj.children);
                if (b) {
                    return b;
                }
            }
        }
        return false;
    }
    me.findFocus = function (arr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            if (obj.focus == true) {
                return obj;
            }

            //递归
            if (obj.children && obj.children.length) {
                let b = me.findFocus(obj.children);
                if (b) {
                    return b;
                }
            }
        }
        return false;
    }
    me.canvansDom.onmousemove = function (e) {

        let x = e.offsetX;
        let y = e.offsetY;
        if (e.buttons == 1) {
            //左键
            if (me.mouseRect.show || me.appendImg) {
                me.mouseRect.x2 = x;
                me.mouseRect.y2 = y;
            }else{
                if (me.moveObj){
                    let tmpObj = me.findById(me.moveObj.id,me.objArr);
                    if (tmpObj){
                        tmpObj.left = x - me.moveObj.offX;
                        tmpObj.top = y - me.moveObj.offY;
                        if (tmpObj.left < 0 ){
                            tmpObj.left = 0;
                        }
                        if (tmpObj.top < 0){
                            tmpObj.top = 0;
                        }
                    }

                }
            }
            me.refresh();

        }
    }

    function findObj(x, y, arr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            if (obj.type == "img#") {
                // img 也算
            } else {
                //暂时不排序
                obj.focus = false;
                if (x > obj.left && x < (obj.left + obj.wid)
                    && y > obj.top && y < (obj.top + obj.hei)) {
                    obj.focus = true;

                }
                //递归
                if (obj.children && obj.children.length) {
                    findObj(x, y, obj.children);
                }

            }
        }
    }

    function drawLine(ctx, x, y, x2, y2, color) {
        if (!color) {
            color = '#ccc';
        }
        ctx.setLineDash([5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    me.pushObjByParent = function (parentId, objEnum) {
        let parent = me.findById(parentId, me.objArr);
        if (!parent) {
            return false;
        }
        let obj = {
            type: objEnum.type,
            parentId: parentId,
            data: {},
            wid: objEnum.wid,
            hei: objEnum.hei,
            focus: false,
            sort: parent.children.length + 1
        };
        me.newObj(obj, parent.children);

    }
    me.canvansDom.onmouseup = function (e) {
        let x = e.layerX;
        let y = e.layerY;
        me.moveObj = {};
        if (e.button == 2) {
//右键
            let obj = me.findFocus(me.objArr);
            if (obj.type == 'img') {
                if (obj.data.fanzhuan) {
                    obj.data.fanzhuan = false;
                } else {
                    obj.data.fanzhuan = true;
                }
                cvs.refresh();
                return false;
            }


        }
        //左键
        me.mouseRect.show = false;
        me.canvansDom.style.cursor = 'default';
        if (!me.draw.type) {
            findObj(x, y, me.objArr);
        } else {
            let rect = me.mouseRect.getRect();
            if (me.draw.type == 'select') {

                rect = {
                    left: x - me.objSelect.wid / 2,
                    top: y - me.objSelect.hei / 2,
                    wid: me.objSelect.wid,
                    hei: me.objSelect.hei
                }
            }
            rect.tag = me.draw.tag;
            rect.tagCode = me.draw.tagCode;
            if (rect.wid) {
                me.pushObj(me.draw.type, rect);
            }
            //me.draw.type = '';
            me.draw = {};
            me.refresh();
            return false;
        }
        me.refresh();

        if (me.appendImg) {
            me.pushImg(me.appendImg, x - me.appendImg.width / 2, y - me.appendImg.height / 2,'move')

            me.appendImg = false;
            findObj(x, y, me.objArr);
        }


    }

    function drawComplex(obj) {
        //  有个list 对象
        let ctx = me.buff;
        let rect = {
            left: obj.left,
            top: obj.top,
            wid: me.objCondition.wid1,
            hei: obj.hei
        };
        ctx.fillStyle = "#EEEE66";
        ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
        drawText(obj.data.text, ctx, rect);
        if (obj.data.list) {
            let list = obj.data.list;
            let left = obj.left + rect.wid;
            let otpWid = me.objCondition.wid2;
            let valWid = me.objCondition.wid1;
            let rectTmp = {
                left: rect.left,
                top: rect.top,
                wid: rect.wid,
                hei: rect.hei
            };
            for (let item of list) {
                ctx.fillStyle = "#339933";
                rectTmp.left = left;
                rectTmp.wid = otpWid;
                ctx.fillRect(rectTmp.left, rectTmp.top, rectTmp.wid, rectTmp.hei);
                drawText(item.optText, ctx, rectTmp);

                ctx.fillStyle = "#EEEE66";
                left = left + rectTmp.wid;
                rectTmp.left = left;
                rectTmp.wid = valWid;
                ctx.fillRect(rectTmp.left, rectTmp.top, rectTmp.wid, rectTmp.hei);
                drawText(item.text, ctx, rectTmp);
                left = left + rectTmp.wid;
            }
        }


        rect.left = obj.left + obj.wid - me.objCondition.wid2 - me.objCondition.wid3;
        rect.wid = me.objCondition.wid2;
        ctx.fillStyle = "#99EE99";
        ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
        drawText(obj.data.optText, ctx, rect);
//最后
        rect.left = obj.left + obj.wid - me.objCondition.wid3;
        rect.wid = me.objCondition.wid3;
        ctx.fillStyle = "#EEEEEE";
        ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
        drawText(obj.data.resultText, ctx, rect);
    }

    //条件
    function drawCondition(obj) {
        let ctx = me.buff;
        let rect = {
            left: obj.left,
            top: obj.top,
            wid: me.objCondition.wid1,
            hei: obj.hei
        };
        if (obj.data) {
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
            drawText(obj.data.text, ctx, rect);
//中间
            rect.left = rect.left + rect.wid;
            rect.wid = me.objCondition.wid2;
            ctx.fillStyle = "#99EE99";
            ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);

            drawText(obj.data.optText, ctx, rect);
//右间
            rect.left = rect.left + rect.wid;
            rect.wid = me.objCondition.wid3;
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);

            drawText(obj.data.resultText, ctx, rect);
        }
    }

    function drawRect(obj) {
        let text = obj.data.text;
        if (!text) {
            text = '双击修改';
        }

        drawSelect(obj, text);
    }

    //联合条件
    function drawSelect(obj, text) {
        let ctx = me.buff;
        let rect = obj;
        ctx.setLineDash([]);
        if (obj.focus) {
            //焦点 画8个矩形
            ctx.strokeStyle = "#FF0000";

        } else {
            ctx.strokeStyle = "#333333";
        }
        ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
        if (obj.data) {
            if (!text) {
                text = obj.data.text;
            }
            drawText(text, ctx, rect);
        }
        if (obj.tag) {
            let tmpRect = {
                left: rect.left + rect.wid + 5,
                top: rect.top,
                wid: 60,
                hei: rect.height
            };
            drawTextLeft(obj.tag, ctx, tmpRect, "#5FBB78");
        }
    }

    function drawText(text, ctx, rect) {
        if (text) {
            ctx.fillStyle = "#333333";

            ctx.font = "18px Arial";
            ctx.textAlign = 'center';

            ctx.fillText(text, rect.left + (rect.wid / 2), rect.top + 22);
        }
    }

    function drawTextLeft(text, ctx, rect, color) {
        if (text) {
            ctx.fillStyle = color;

            ctx.font = "20px Arial";
            ctx.textAlign = 'left';

            ctx.fillText(text, rect.left, rect.top + 22);
        }
    }

    //分分钟转换成json
    me.toJson = function () {
        let json = [];
        let tmpJson = toJsonEx(me.objArr, json);

        let newJson = {};
        if (tmpJson) {
            for (let item of tmpJson) {
                if (item.tagCode) {

                    newJson[item.tagCode] = item;
                    delete  item.tagCode
                }
            }
        }
        return JSON.stringify(newJson);
    }

    function toJsonEx(arr, jsonArr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            let json = {};
            let data = obj.data;
            json.type = obj.type;
            json.text = data.text;
            json.tagCode = obj.tagCode;
            json.leftType = data.leftType;
            if (data.resultType) {
                json.resultType = data.resultType;
                json.resultText = data.resultText;
                json.optType = data.optType;
                json.optText = data.optText;
            }
            if (obj.children && obj.children.length) {
                json.children = [];
                toJsonEx(obj.children, json.children);
            }
            jsonArr.push(json);
        }
        return jsonArr;
    }
}

function newCtx(wid, hei) {
    var c2 = document.createElement("canvas");
    c2.width = wid;
    c2.height = hei;
    return c2.getContext("2d");
}
