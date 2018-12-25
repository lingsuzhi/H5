var cvs = new LszCanvans("myCanvas");

cvs.pushObj(cvs.objSelect.type, {
    left: cvs.objLeft,
    top: cvs.objTop,
    wid: cvs.objSelect.wid,
    hei: cvs.objSelect.hei,
    tagCode: 'if',
    tag: '如果：'
});
cvs.pushObj(cvs.objSelect.type, {
    left: cvs.objLeft,
    top: 250,
    wid: cvs.objSelect.wid,
    hei: cvs.objSelect.hei,
    tagCode: 'success',
    tag: '那么：'
});
cvs.pushObj(cvs.objSelect.type, {
    left: cvs.objLeft,
    top: 400,
    wid: cvs.objSelect.wid,
    hei: cvs.objSelect.hei,
    tagCode: 'fail',
    tag: '否则：'
});
cvs.refresh();

function btn1() {
    cvs.refresh();
}

function addFlower(src) {
    cvs.appendImgDo(src);

}

function btnChenggong() {
    cvs.setDrawEx("select", '成功', 'success');
}

function btnShibai() {
    cvs.setDrawEx("select", '失败', 'fail');
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
        if (obj.id != 1) {
            obj.state = 'kill';
        }

    } else if (type == 'condition') {
        cvs.pushObjByParent(id, cvs.objCondition)
    } else if (type == 'unionCondition') {
        cvs.pushObjByParent(id, cvs.objSelect)
    } else if (type == 'complex') {
        cvs.pushObjByParent(id, cvs.objComplex)
    } else if (type == 'complex_add') {
        if (!obj.data.list) {
            obj.data.list = [];
        }
        let list = obj.data.list;
        list.push({});
        obj.wid = obj.wid + cvs.objCondition.wid1 + cvs.objCondition.wid2;
    } else {

        let optpos = item.parent().attr("data-optpos");
        let opttype = item.parent().attr("data-opttype");
        let text = item.attr("data-text");
        if (optpos && opttype && obj.data.list) {
            let item = obj.data.list[optpos - 1];
            if (item) {
                if (opttype == 'left') {
                    item.optText = text;
                    item.optType = type;
                } else {
                    item.text = text;
                    item.type = type;
                }
                return false;

            }
        }

        let pos = item.attr("data-pos");
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
        let domId = '';
        if (obj.type == 'select') {
            domId = 'menu_add';

        } else if (obj.type == 'complex') {
            domId = 'menu_complex_add'
        }
        if (domId) {
            var menu = document.getElementById(domId);
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
var thenJson = [{
    code: 'totalSum',
    text: '贷款量',
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
        code: 'total50',
        text: '50万'
    }, {
        code: 'total30',
        text: '30万'
    }, {
        code: 'total20',
        text: '20万'
    }, {
        code: 'total10',
        text: '10万'
    }, {
        code: 'total5',
        text: '5万'
    }]
}, {
    code: 'rates',
    text: '月利率',
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
        code: 'rates10',
        text: '10%'
    }, {
        code: 'rates8',
        text: '8%'
    }, {
        code: 'rates5',
        text: '5%'
    }, {
        code: 'rates3',
        text: '3%'
    }, {
        code: 'rates15',
        text: '15%'
    }]
}, {
    code: 'repayment',
    text: '还款方式',
    compare: [{
        code: 'equal',
        text: '等于'
    }], result: [{
        code: 'benjinlx',
        text: '本金利息'
    }, {
        code: 'bymonth',
        text: '每月还款'
    }, {
        code: 'bannian',
        text: '半年还款'
    }]
}
];

function getLiHtml(comp, pos) {
    return `<li onclick="liClick(this)" class="" data-type = '` + comp.code + `' data-text = '` + comp.text + `' data-pos = '` + pos + `'><em  ></em><a href="javascript:;">` + comp.text + `</a></li>\n`
}

function findObjParentRoot(obj) {

    for (let i = 0; i < 100; i++) {
        if (obj && obj.parentId) {
            obj = cvs.findById(obj.parentId, cvs.objArr);
        }
    }
    return obj;


}

EventUtil.addHandler(document.getElementById('myCanvas'), "click", function (event) {
    if (closeMenu()) {
        return false;
    }
    let obj = cvs.findFocus(cvs.objArr);
    if (obj && obj.id) {
        let optpos = 0;
        let opttype = '';
        let menuJson = conditionJson;
        let htmlStr = '';
        let domId = "menu_" + obj.type;
        if ("condition" == obj.type) {
            let rootObj = findObjParentRoot(obj);
            if (rootObj && (rootObj.tagCode == 'success' || rootObj.tagCode == 'fail' )) {
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
            menu.style.left = event.clientX + "px";
            menu.style.top = event.clientY + "px";
            menu.style.visibility = "visible";
        }

    }
});

$("#myCanvas").dblclick(function () {
    let obj = cvs.findFocus(cvs.objArr);
    if (obj && obj.type == 'rect') {
        layer.open({
            type: 2,
            title: "0.0 满足前端一切需求~",
            //    closeBtn: 0,
            area: ['55%', '75%'],
            content: 'edit.html'
        });

    }
});