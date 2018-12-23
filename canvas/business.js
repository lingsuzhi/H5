var cvs = new LszCanvans("myCanvas");

cvs.pushObj(cvs.objSelect.type, {
    left: cvs.objLeft,
    top: cvs.objTop,
    wid: cvs.objSelect.wid,
    hei: cvs.objSelect.hei
});
cvs.refresh();

function btn1() {
    cvs.refresh();
}
function addFlower(src){
    cvs.appendImgDo(src);

}
function showJson() {
    layer.open({
        type: 2,
        title: '0.0查看Json',
        shadeClose: true,
        shade: 0.5,
        area: ['70%', '90%'],
        content: 'showJson.htm' //iframe的url
    });
}

function drawDo(type) {
    cvs.setDraw(type);
}

//菜单单击事件
$(".menu li").click(function () {
    liClick(this);

});

function liClick(e) {

    let item = $(e);
    let id = item.parent().attr("data-id");
    let type = item.attr("data-type");

    // console.log(id)
    // console.log(type)
    menuClick(id, type, item);
    cvs.refresh();

}

function menuClick(id, type, item) {
    closeMenu();
    let obj = cvs.findById(id, cvs.objArr);
    if (type == 'and') {
        obj.data.text = '并且';
        obj.data.leftType = type;
    } else if (type == 'or') {
        obj.data.text = '或者';
        obj.data.leftType = type;
    } else if (type == 'kill') {
        if(obj.id != 1){
            obj.state = 'kill';
        }

    } else if (type == 'condition') {
        cvs.pushObjByParent(id, cvs.objCondition)
    } else if (type == 'unionCondition') {
        cvs.pushObjByParent(id, cvs.objSelect)
    } else {
        let pos = item.attr("data-pos");
        let text = item.attr("data-text");
        if (pos == 'left') {
            obj.data.text = text;
            obj.data.leftType = type;
        } else if (pos == 'mid') {
            obj.data.optText = text;
            obj.data.optType = type;
        } else if (pos == 'right') {
            obj.data.resultText = text;
            obj.data.resultType = type;
        }

    }

}

EventUtil.addHandler(document.getElementById("myCanvas"), "contextmenu", function (event) {
    event = EventUtil.getEvent(event);
    EventUtil.preventDefault(event);
    if (closeMenu()) {
        return false;
    }
    let obj = cvs.findFocus(cvs.objArr);
    if (obj && obj.id) {

        if (obj.type == 'select') {
            var menu = document.getElementById("menuAdd");
            menu.setAttribute("data-id", obj.id);
            menu.style.left = event.clientX + "px";
            menu.style.top = event.clientY + "px";
            menu.style.visibility = "visible";

        }
    }

    //  console.log("右键菜单");
});

function closeMenu() {
    let menuArr = document.getElementsByClassName("menu");
    for (let menu of menuArr) {
        if (menu.style.visibility == 'visible') {
            menu.style.visibility = "hidden";
            return true;
        }
    }
}

var conditionJson = [{
    code: 'education',
    text: '学历',
    compare: [{
        code: 'greater',
        text: '大于'
    }, {
        code: 'equal',
        text: '等于'
    }, {
        code: 'less',
        text: '小于'
    }],
    result: [{
        code: 'dazhuan',
        text: '大专'
    }, {
        code: 'benke',
        text: '本科'
    }, {
        code: 'shuoshi',
        text: '硕士'
    }, {
        code: 'boshi',
        text: '博士'
    }, {
        code: 'nvboshi',
        text: '女博士'
    }]
}, {
    code: 'age',
    text: '年龄',
    compare: [{
        code: 'greater',
        text: '大于'
    }, {
        code: 'equal',
        text: '等于'
    }, {
        code: 'less',
        text: '小于'
    }],
    result: [{
        code: 'age18',
        text: '18岁'
    }, {
        code: 'age25',
        text: '25岁'
    }, {
        code: 'age30',
        text: '30岁'
    }, {
        code: 'age40',
        text: '40岁'
    }, {
        code: 'age50',
        text: '50岁'
    }]
}, {
    code: 'sex',
    text: '性别',
    compare: [{
        code: 'equal',
        text: '等于'
    }], result: [{
        code: 'man',
        text: '男'
    }, {
        code: 'woman',
        text: '女'
    }, {
        code: 'hezihua',
        text: '贺子华'
    }]
}
];

function getLiHtml(comp, pos) {
    return `<li onclick="liClick(this)" class="" data-type = '` + comp.code + `' data-text = '` + comp.text + `' data-pos = '` + pos + `'><em  ></em><a href="javascript:;">` + comp.text + `</a></li>\n`
}

EventUtil.addHandler(document.getElementById('myCanvas'), "click", function (event) {
    if (closeMenu()) {
        return false;
    }
    let obj = cvs.findFocus(cvs.objArr);
    if (obj && obj.id) {

        if (obj.type == 'img'){
            if (obj.data.fanzhuan){
                obj.data.fanzhuan = false;
            } else{
                obj.data.fanzhuan = true;
            }
            cvs.refresh();
            return false;
        }
        let htmlStr = '';
        let domId = "menu_" + obj.type;
        if ("condition" == obj.type) {
            if (event.layerX > (obj.left + cvs.objCondition.wid1)) {
                if (event.layerX > (obj.left + cvs.objCondition.wid1 + cvs.objCondition.wid2)) {

                    if (conditionJson && conditionJson.length) {
                        for (let con of conditionJson) {
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

                } else if (conditionJson && conditionJson.length) {
                    for (let con of conditionJson) {
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
                if (conditionJson && conditionJson.length) {
                    for (let comp of conditionJson) {
                        htmlStr += getLiHtml(comp, 'left');

                    }
                    htmlStr +=  `<li onclick="liClick(this)" class="" data-type = 'kill' ><em  ><i class="layui-icon" style="font-size: 20px; margin-left: 2px; color: #FF8888;">&#x1007;</i></em><a href="javascript:;">删除</a></li>`
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
            menu.style.left = event.clientX + "px";
            menu.style.top = event.clientY + "px";
            menu.style.visibility = "visible";
        }

    }
});

$("#myCanvas").dblclick(function(){
    let obj = cvs.findFocus(cvs.objArr);
    if(obj && obj.type == 'rect'){
        layer.open({
            type: 2,
            title: "0.0 满足前端一切需求~",
            //    closeBtn: 0,
            area: ['55%', '75%'],
            content: 'edit.html'
        });

    }
});