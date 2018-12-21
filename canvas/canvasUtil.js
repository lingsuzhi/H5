var canvasUtil = {
    loadImg:function (url) {
        var img = new Image();
        img.src = url;
        return img;
    }
    ,posToRect : function(xx1,yy1,xx2,yy2){
        let x1 = xx1;
        let x2 = xx2;

        let y1 = yy1;
        let y2 = yy2;
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
        var obj ={};
        obj.left = x1;
        obj.top = y1;
        obj.wid = x2 - x1;
        obj.hei = y2 - y1;
        return obj;
    }

}

