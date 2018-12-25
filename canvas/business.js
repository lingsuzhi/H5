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
function appendObj(code){
    cvs.setDrawByCode(code)
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


function closeMenu() {
    let menuArr = document.getElementsByClassName("menu");
    for (let menu of menuArr) {
        if (menu.style.visibility == 'visible') {
            menu.style.visibility = "hidden";
            return true;
        }
    }
}
document.oncontextmenu = function(){
    return false;
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

function findMenuByCode(code){
    if (code =='and'){
        return {
            code: code,
            text: '并且'
        }
    } else if(code =='or'){
        return {
            code: code,
            text: '或者'
        }
    }
    let menuJson = conditionJson;
    if (menuJson && menuJson.length) {
        for (let con of menuJson) {
            if (con.code == code) {
                 return con;
            }
        }
    }
    return null;
}

$(window).keyup(function (event) {
  if(event.keyCode == 17){
      //ctrl
      mergeObj();
  }
});

function mergeObj() {
    let count = cvs.findFocusCount();
    if (count > 1){
        layer.confirm('共选定：' + count +"条记录，请选择合并条件~"   , {
            btn: ['并且','或者'] //按钮
        }, function(index){
            cvs.mergeObjDo('and')
            layer.close(index);
        }, function(index){
            cvs.mergeObjDo('or')
            layer.close(index);
        });
    }
}

var collideRect = function(rect1,rect2) {
    var maxX,maxY,minX,minY

    maxX = rect1.left+rect1.wid >= rect2.left+rect2.wid ? rect1.left+rect1.wid : rect2.left+rect2.wid
    maxY = rect1.top+rect1.hei >= rect2.top+rect2.hei ? rect1.top+rect1.hei : rect2.top+rect2.hei
    minX = rect1.left <= rect2.left ? rect1.left : rect2.left
    minY = rect1.top <= rect2.top ? rect1.top : rect2.top

    if(maxX - minX <= rect1.wid+rect2.wid && maxY - minY <= rect1.hei+rect2.hei){
        return true
    }else{
        return false
    }
}