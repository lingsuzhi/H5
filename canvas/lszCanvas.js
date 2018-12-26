function LszCanvans(canvansId) {
    var me = this;
    me.outoId = 0;
    me.canvansDom = document.getElementById(canvansId);
    me.ctx = me.canvansDom.getContext("2d");
    me.objLeft = 50;
    me.objTop = 50;

    me.objComplex = {
        wid: 300,
        hei: 26,
        type: 'complex'
    }
    me.objSelect = {
        wid: 80,
        hei: 26,
        type: 'select'
    };
    me.objCondition = {
        wid: 260,
        hei: 26,
        type: 'condition'
    };
    me.objCondition.wid1 = 100;
    me.objCondition.wid2 = 60;
    me.objCondition.wid3 = 100;


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
    me.setDrawByCode = function (code) {
        let menuObj = findMenuByCode(code);
        if (menuObj == null) {
            return;
        }
        me.draw.code = code;
        me.draw.type = 'custom';
        me.draw.menuObj = menuObj;
        //me.canvansDom.style.cursor = 'crosshair';
        me.mouseRect.show = 'bycode';

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
            } else if (me.draw.type == 'custom') {
                ctx.strokeRect(me.mouseRect.x2 - me.objSelect.wid / 2, me.mouseRect.y2 - me.objSelect.hei / 2, me.objSelect.wid, me.objSelect.hei);
                let text = me.draw.menuObj.text;
                if (text) {

                    let tmpRect = {
                        left: me.mouseRect.x2 - me.objSelect.wid / 2,
                        top: me.mouseRect.y2 - me.objSelect.hei / 2,
                        wid: me.objSelect.wid,
                        hei: me.objSelect.hei

                    }
                    drawText(text, ctx, tmpRect);
                }
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
        return obj;
    }

    function getNewId() {
        me.outoId = me.outoId + 1;
        return me.outoId;
    }

    me.pushSelect = function (x, y) {
        let rect = {
            left: x,
            top: y,
            wid: me.objSelect.wid,
            hei: me.objSelect.hei
        }
        return me.pushObj(me.objSelect.type, rect);
    }
    me.pushObj = function (type, rect) {
        return me.newObj({
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
                        if (obj.top < me.refreshHei + 50) {
                            obj.top = me.refreshHei + 60;
                        }
                    }
                    me.refreshHei = obj.top + obj.hei;
                }
                if (obj.type == "select") {
                    obj.treeLeft = obj.left + obj.wid + me.objSpaceWid;

                    drawSelect(obj);
                } else if (obj.type == 'condition') {
                    //条件
                    drawCondition(obj);
                } else if (obj.type == 'complex') {
                    drawComplex(obj);
                } else if (obj.type == 'rect') {
                    drawRect(obj);
                }
                if (obj.focus) {
                    drawFocus(obj);
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
            if (obj && obj.allowMove == 'move') {
                me.moveObj.id = obj.id;
                me.moveObj.offX = x - obj.left;
                me.moveObj.offY = y - obj.top;
                me.moveObj.oldLeft = obj.left;
                me.moveObj.oldTop = obj.top;
                if (me.moveObj.offX < 0 || me.moveObj.offY < 0 || me.moveObj.offY > obj.hei || me.moveObj.offX > obj.wid) {
                    me.moveObj = {};

                } else {
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
    me.findFocusCount = function () {
        let count = 0;
        me.diguiFun(me.objArr, function (obj) {
            if (obj.focus && !obj.parentId && !obj.tagCode) {
                count++
            }
        })
        return count;
    }
    me.diguiFun = function (arr, fun) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            fun(obj);
            if (obj.children && obj.children.length) {
                me.diguiFun(obj.children, fun);
            }
        }
    }
    me.diguiFunAndId = function (arr, id, fun) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            fun(obj, id);
            if (obj.children && obj.children.length) {
                me.diguiFunAndId(obj.children, obj.id, fun);
            }
        }
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
            } else {
                if (me.moveObj) {
                    let tmpObj = me.findById(me.moveObj.id, me.objArr);
                    if (tmpObj) {
                        tmpObj.left = x - me.moveObj.offX;
                        tmpObj.top = y - me.moveObj.offY;
                        if (tmpObj.left < 0) {
                            tmpObj.left = 0;
                        }
                        if (tmpObj.top < 0) {
                            tmpObj.top = 0;
                        }
                    }

                }
            }
            me.refresh();

        }
    }

    function closeFocus(arr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }

            obj.focus = false;
            //递归
            if (obj.children && obj.children.length) {
                closeFocus(obj.children);
            }


        }
    }

    function findObjByPos(x, y, arr) {
        for (let obj of arr) {
            if (obj.state == 'kill') {
                continue;
            }
            if (obj.type == "img#") {
                // img 也算
            } else {

                if (x > obj.left && x < (obj.left + obj.wid)
                    && y > obj.top && y < (obj.top + obj.hei)) {
                    return obj;
                }

                //递归
                if (obj.children && obj.children.length) {
                    let b = findObjByPos(x, y, obj.children);
                    if (b) {
                        return b;
                    }
                }

            }
        }
        return false;
    }

    function setFocusByRect(mRect) {
        if (mRect && mRect.hei) {
            me.diguiFun(me.objArr, function (obj) {
                if (collideRect(mRect, obj)) {
                    obj.focus = true;
                } else {
                    obj.focus = false;
                }
            })
        }
        mergeObj();
    }

    me.mergeLeft = 450;
    me.mergeTop = 100;
    me.mergeLeft2 = 900;
    function sumHeight(arr) {
        let sumHei = 0;
        if (arr) {
            me.diguiFun(arr, function (obj) {
                sumHei += obj.hei + me.objSpaceHei;
            })
        }

        return sumHei+me.objSpaceHei;
    }

    me.mergeObjDo = function (code) {
        let list = [];
        let grageMax = 0;
        me.diguiFun(me.objArr, function (obj) {
            if (obj.focus && !obj.parentId && !obj.tagCode) {
                //let newObj = Object.assign({}, obj);

                if (obj.mergeGrade && obj.mergeGrade > grageMax) {
                    grageMax = obj.mergeGrade;
                }

                let newObj = JSON.parse(JSON.stringify(obj));

                newObj.allowMove = '';
                newObj.merge = true;
                list.push(newObj);
                // if (obj.merge){
                //     //这个要删掉、
                //     obj.state = 'kill';
                // }
            }
        })
        let obj = me.pushSelect(me.mergeLeft, me.mergeTop);
        if (obj) {
            obj.mergeGrade = grageMax + 1;
            obj.merge = true;
            let menuObj = findMenuByCode(code);
            if (menuObj) {
                menuToObj(menuObj, obj);
                obj.children = list;
            }
            // 很简单的逻辑
            me.diguiFunAndId(list, obj.id, function (obj, id) {
                obj.id = getNewId();
                obj.parentId = id;
            })
        }
        me.mergeMoveDo();
        me.refresh()
    }
    me.mergeMoveDo = function () {
        me.mergeTop = 100;
        me.mergeTop2 = 100;
        for (let obj of me.objArr) {
            if (obj.state == 'kill') {
                continue;
            }
            if (obj.merge) {

                let tmpHei = sumHeight(obj.children);

                if (obj.mergeGrade > 2) {
                    obj.left = me.mergeLeft2;
                    obj.top = me.mergeTop2;
                    me.mergeTop2 += tmpHei + obj.hei + 1;
                } else {
                    obj.left = me.mergeLeft;
                    obj.top = me.mergeTop;
                    me.mergeTop += tmpHei + obj.hei + 1;
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
        return me.newObj(obj, parent.children);

    }

    function menuToObj(menuObj, obj) {
        obj.data.leftType = menuObj.code;
        obj.data.text = menuObj.text;
    }

    me.canvansDom.onmouseup = function (e) {
        let ctrlDo = e.ctrlKey;
        let x = e.offsetX;
        let y = e.offsetY;
        let focusObj = findObjByPos(x, y, me.objArr);

        let showMenu = !closeMenu();

        if (focusObj) {
            let oldFocus = focusObj.focus;
            showMenu = oldFocus && showMenu;
            if (me.moveObj.id == focusObj.id) {
                let moveSize = me.moveObj.oldLeft - focusObj.left;
                if (moveSize < 0) {
                    moveSize = -moveSize;
                }
                if (moveSize >= 5) {
                    //top 就暂时不算了，心累
                    showMenu = false;
                }

            }
        }
        if (!ctrlDo) {
            closeFocus(me.objArr);
        }

        focusObj.focus = true;
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
                return;
            }

            if (showMenu) {
                me.menuRight(e);
            }
            return;
        }
        //左键
        me.mouseRect.show = false;
        me.canvansDom.style.cursor = 'default';
        if (!me.draw.type) {
            //选择
            let mRect = me.mouseRect.getRect();
            if (mRect.wid > 5) {
                setFocusByRect(mRect);
                showMenu = false;
            }
        } else if (me.draw.type == 'rect') {
            let mRect = me.mouseRect.getRect();
            me.pushObj(me.draw.type,mRect);
        } else if (me.draw.type == 'custom') {
            let rect = {
                left: x - me.objCondition.wid / 2,
                top: y - me.objCondition.hei / 2,
                wid: me.objCondition.wid,
                hei: me.objCondition.hei
            }
            let menuObj = me.draw.menuObj;
            if (!menuObj) {
                return;
            }

            if (rect.wid) {
                let obj = me.pushObj(me.objCondition.type, rect);
                menuToObj(menuObj, obj)
                obj.allowMove = 'move';
                if (obj.left > 150) {
                    obj.left = 150;
                }
                obj.mergeGrade = 1;
            }
            me.draw = {};
            me.refresh();
            return;
        } else if (me.draw.type == 'select') {
            let rect = {
                left: x - me.objSelect.wid / 2,
                top: y - me.objSelect.hei / 2,
                wid: me.objSelect.wid,
                hei: me.objSelect.hei
            }
            rect.tag = me.draw.tag;
            rect.tagCode = me.draw.tagCode;
            if (rect.wid) {
                me.pushObj(me.draw.type, rect);
            }
            me.draw.type = '';
            me.draw = {};
            me.refresh();
            return;
        }

        me.draw.type = ''
        if (me.appendImg) {
            me.pushImg(me.appendImg, x - me.appendImg.width / 2, y - me.appendImg.height / 2, 'move')

            me.appendImg = false;
            //findObj(x, y, me.objArr);
        }
        if (showMenu) {
            me.menuLeft(e);
        }
        me.refresh();
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

    function drawFocus(obj) {
        let ctx = me.buff;
        let rect = obj;
        ctx.setLineDash([]);
        ctx.strokeStyle = "#FF5722";
        ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
    }

    //联合条件
    function drawSelect(obj, text) {
        let ctx = me.buff;
        let rect = obj;

        // if (obj.focus) {
        //     //焦点 画8个矩形
        //     ctx.strokeStyle = "#FF0000";
        //
        // } else {
        //     ctx.strokeStyle = "#333333";
        // }
        // ctx.strokeStyle = "#333333";
        // ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
        ctx.fillStyle = "#ffEEdd";
        ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
        if (obj.data) {
            if (!text) {
                text = obj.data.text;
            }
            drawText(text, ctx, rect);
        }
        if (obj.tag) {
            let tmpRect = {
                left: rect.left,
                top: rect.top - rect.hei,
                wid: 60,
                hei: rect.hei
            };
            drawTextLeft(obj.tag, ctx, tmpRect, "#5F8878");
        }
    }

    function drawText(text, ctx, rect) {
        if (text) {
            ctx.fillStyle = "#333333";

            ctx.font = "16px Arial";
            ctx.textAlign = 'center';

            ctx.fillText(text, rect.left + (rect.wid / 2), rect.top + 20);
        }
    }

    function drawTextLeft(text, ctx, rect, color) {
        if (text) {
            ctx.fillStyle = color;

            ctx.font = "16px Arial";
            ctx.textAlign = 'left';

            ctx.fillText(text, rect.left, rect.top + 20);
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
                    if (item.tagCode == 'success') {
                        //他们要 than else
                        newJson.then = item;
                    } else if (item.tagCode == 'fail') {
                        newJson.else = item;
                    } else {
                        newJson.if = item;
                    }

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
            if (data.list) {
                json.lists = data.list;
            }

            if (obj.children && obj.children.length) {
                json.children = [];
                toJsonEx(obj.children, json.children);
            }
            jsonArr.push(json);
        }
        return jsonArr;
    }

    me.menuRight = function (event) {
        let obj = cvs.findFocus(cvs.objArr);
        if (obj && obj.id) {
            let domId = '';
            if (obj.type == 'select') {
                domId = 'menu_add';

            } else if (obj.type == 'complex') {
                domId = 'menu_complex_add'
            }
            if (domId) {
                var menu = document.getElementById(domId);
                menu.setAttribute("data-id", obj.id);
                menu.style.left = event.offsetX + "px";
                menu.style.top = event.offsetY + "px";
                menu.style.visibility = "visible";

            }
        }
        me.refresh();
    }
    me.menuLeft = function (event) {
        let obj = cvs.findFocus(me.objArr);
        if (obj && obj.id) {
            let optpos = 0;
            let opttype = '';
            let menuJson = conditionJson;
            let htmlStr = '';
            let domId = "menu_" + obj.type;
            if ("condition" == obj.type) {
                let rootObj = findObjParentRoot(obj);
                if (rootObj && (rootObj.tagCode == 'success' || rootObj.tagCode == 'fail')) {
                    menuJson = thenJson;
                }
                if (event.layerX > (obj.left + cvs.objCondition.wid1)) {
                    if (event.layerX > (obj.left + cvs.objCondition.wid1 + cvs.objCondition.wid2)) {

                        if (menuJson && menuJson.length) {
                            for (let con of menuJson) {
                                if (con.code == obj.data.leftType) {
                                    if (con.result && con.result.length) {
                                        for (let comp of con.result) {
                                            htmlStr += getLiHtml(comp, 'right');
                                        }
                                    }
                                    break;
                                }
                            }
                        }

                    } else {
                        if (menuJson && menuJson.length) {
                            for (let con of menuJson) {
                                if (con.code == obj.data.leftType) {
                                    if (con.compare && con.compare.length) {
                                        for (let comp of con.compare) {
                                            htmlStr += getLiHtml(comp, 'mid');
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (menuJson && menuJson.length) {
                        for (let comp of menuJson) {
                            htmlStr += getLiHtml(comp, 'left');

                        }
                        htmlStr += `<li onclick="liClick(this)" class="" data-type = 'kill' ><em  ><i class="layui-icon" style="font-size: 20px; margin-left: 2px; color: #FF8888;">&#x1007;</i></em><a href="javascript:;">删除</a></li>`
                    }
                }


            } else if ('complex' == obj.type) {
                if (event.layerX > (obj.left + obj.wid - cvs.objCondition.wid3)) {

                    if (menuJson && menuJson.length) {
                        for (let con of menuJson) {
                            if (con.code == obj.data.leftType) {
                                if (con.result && con.result.length) {
                                    for (let comp of con.result) {
                                        htmlStr += getLiHtml(comp, 'right');
                                    }
                                }
                                break;
                            }
                        }
                    }
                } else if (event.layerX > (obj.left + obj.wid - cvs.objCondition.wid2 - cvs.objCondition.wid3)) {
                    if (menuJson && menuJson.length) {
                        for (let con of menuJson) {
                            if (con.code == obj.data.leftType) {
                                if (con.compare && con.compare.length) {
                                    for (let comp of con.compare) {
                                        htmlStr += getLiHtml(comp, 'mid');
                                    }
                                }
                                break;
                            }
                        }
                    }
                } else {

                    //复合 这里要算出 点的是哪个节点
                    if (obj.data.list && event.layerX > (obj.left + cvs.objCondition.wid1)) {
                        let list = obj.data.list;
                        let i = 0;
                        let left = obj.left + cvs.objCondition.wid1;

                        for (let item of list) {
                            i++; //从1开始
                            //////////////////////////////////
                            let wid = cvs.objCondition.wid2;
                            if (event.layerX < left + wid) {
                                optpos = i;
                                opttype = 'left';
                                break;
                            }
                            left += wid;
                            wid = cvs.objCondition.wid1;
                            if (event.layerX < left + wid) {
                                optpos = i;
                                opttype = 'right';
                                break;
                            }
                            left += wid;

                        }

                    }

                    if (opttype == 'left') {
                        domId = 'menu_opt';


                    } else {
                        if (menuJson && menuJson.length) {
                            for (let comp of menuJson) {
                                htmlStr += getLiHtml(comp, 'left');

                            }
                            htmlStr += `<li onclick="liClick(this)" class="" data-type = 'kill' ><em  ><i class="layui-icon" style="font-size: 20px; margin-left: 2px; color: #FF8888;">&#x1007;</i></em><a href="javascript:;">删除</a></li>`
                        }
                    }


                }
                if (domId) {
                    let menu = document.getElementById(domId);
                    menu.setAttribute("data-optpos", '');
                    menu.setAttribute("data-opttype", '');
                    if (optpos) {
                        menu.setAttribute("data-optpos", optpos);
                    }
                    if (opttype) {
                        menu.setAttribute("data-opttype", opttype);
                    }
                }
            }

            var menu = document.getElementById(domId);
            if (menu) {
                if (htmlStr) {
                    menu.innerHTML = htmlStr;
                }
                //client  这里
                menu.setAttribute("data-id", obj.id);
                menu.style.left = event.offsetX + "px";
                menu.style.top = event.offsetY + "px";
                menu.style.visibility = "visible";
            }

        }
    }

}

function newCtx(wid, hei) {
    var c2 = document.createElement("canvas");
    c2.width = wid;
    c2.height = hei;
    return c2.getContext("2d");
}
