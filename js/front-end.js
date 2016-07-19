//DOM操作
var FG=function(e){
    var obj={},
        Element=[];

    obj.length=0;
    obj.id=null;

    obj.get=function(index){
        if (arguments.length>0) {return Element[index];}
        return Element[0];
    }

    obj.EById=function(){
        var temp=document.getElementById(e.substring(1));
        if (temp!=null) {Element.push(temp);}
        if (Element.length>0) {
            obj.length=Element.length;
            obj.id=Element[0].id;            
        }
        return obj;
    }

    obj.EThis=function(){
        Element.push(e);
        if (Element.length>0) {
            obj.length=Element.length;
            obj.id=Element[0].id;            
        }
        return obj;
    }

    obj.EQuery=function(){
        Element=document.querySelectorAll(e);
        if (Element.length>0) {
            obj.length=Element.length;
            obj.id=Element[0].id;            
        }
        return obj;
    }

    obj.html=function(d){
        if (arguments.length>0) {
            for (var i = 0; i < Element.length; i++) {
                Element[i].innerHTML=d;
            }            
            return;
        }        
        return Element[0].innerHTML;
    };

    obj.text=function(d){
        if (arguments.length>0) {
            for (var i = 0; i < Element.length; i++) {
                Element[i].innerText=d;
            }            
            return;
        }        
        return Element[0].innerText;
    };

    obj.width=function(){      
        return Element[0].clientWidth;
    };    
    obj.height=function(){      
        return Element[0].clientHeight;
    };
    obj.hide=function(){      
        Element[0].style.display="none";
    };
    obj.show=function(){      
        Element[0].style.display="block";
    };                
    obj.val=function(){      
        return Element[0].value;
    };
    obj.attr=function(e,d){
        if (arguments.length==1) {
            return Element[0].getAttribute(e);
        }else{
            for (var i = 0; i < Element.length; i++) {
                Element[i].setAttribute(e,d);
            } 
        }
        return;      
    };

    obj.css=function(c,v){
        if (arguments.length==1){return Element[0].style[c];}
        for (var i = 0; i < Element.length; i++) {
            Element[i].style[c]=v;
        }            
        return;        
    };

    obj.append=function(d){
        for (var i = 0; i < Element.length; i++) {
            Element[i].innerHTML+=d;
        }            
        return;        
    };

    obj.remove=function(){
        for (var i = 0; i < Element.length; i++) {
            var p_elm = Element[i].parentNode;
            p_elm.removeChild(Element[i]);
        }            
        return;   
    }

    obj.click=function(d){
        if (arguments.length==0) {Element[0].click();return;}
        for (var i = 0; i < Element.length; i++) {
            Element[i].onclick=d;
        }
        return;
    };

    obj.hover=function(o,v){
        if (arguments.length==1) {
            for (var i = 0; i < Element.length; i++) {
                Element[i].onmouseover=o;
            }
        }else{
            for (var i = 0; i < Element.length; i++) {
                Element[i].onmouseover=o;
                Element[i].onmouseout=v;                
            }
        }
        return;
    };  

    obj.addClass=function(css_name){
        for (var i = 0; i < Element.length; i++) {
            Element[i].className+=" "+css_name;
        }            
        return; 
    }

    obj.removeClass=function(css_name){
        // for (var i = 0; i < Element.length; i++) {
        //     Element[i].className+=" "+css_name;
        // }            
        return; 
    }  

    obj.className=function(css_name){
        if (arguments.length>0){
            for (var i = 0; i < Element.length; i++) {
                Element[i].className=css_name;
            }            
            return; 
        }
        return Element[0].className;
    }

    obj.each=function(f){
        for (var i = 0; i < Element.length; i++) {
            var b=f(Element[i],i);
            if (!b && b!=undefined) {break;}
        }
        return;
    }; 

    if (arguments.length>0) {
        var reg = /\s|>|\./;
        if (typeof(e)!="string") {
            return obj.EThis();
        }
        else if (e.substring(0,1)=="#" && reg.test(e) != true) {
            return obj.EById();
        }
        return obj.EQuery();
    }
    return obj;
}

//颜色数组
var bgArr=['s-tomatoRed','s-tangerine','s-bananaYellow','s-basilGreen','s-sageGreen','s-peacock','s-blueberryColor','s-lavender','s-grayishPurple','s-hairRed'];//背景
var bdArr=['bd-tomatoRed','bd-tangerine','bd-bananaYellow','bd-basilGreen','bd-sageGreen','bd-peacock','bd-blueberryColor','bd-lavender','bd-grayishPurple','bd-hairRed','bd-graphiteBlack'];//边框

//提示
var msg=function(d,back){
    FG("#m-msg-cot").html(d);    
    var msg_h=FG("#msg").height();
    msg_h=(window.innerHeight/2-(parseInt(msg_h)/2+80));
    if (window.innerWidth<=540) {msg_h=0;}
    FG("#msg").css("top",msg_h+"px");
    FG("#msg").className("popopen");

    if (arguments.length==1) {
        FG("#msg_but_ok").hide();
    }else{
        FG("#msg_but_ok").css("display","inline-block");
        FG("#msg_but_ok").click(function(){
            FG("#msg").className("popclose");
            back();
        });
    }

}

//通知
var notify={
    open:function(){
        FG("#notify").className("notify-show");       
    }
    ,close:function(){
        FG("#notify").className("notify-close");
        FG("#notifyCot").className("notify_w100");
        FG("#notifyCot>img").css('display','inline-block');
        FG("#notifyCot_span").css('display','none');        
    }
    ,advanced:function(e){
        FG("#notifyCot>img").css('display','none');
        FG("#notifyCot_span").css('display','inline-block');
        FG("#notifyCot_span").html(e);
        FG("#notifyCot").className("notify_w200");
        setTimeout(function(){
            notify.close();
        },1500);
    }
}

//图片查看
var imgBox={
    set:function(e){
        FG("#imgBox_res").attr("src",e);
        FG("#imgBox").className("imgBox-open");
    }
}

//其他
var oth={
    //公共状态对象
    stArr:{
         swvb:false
        ,is_scale:false //缩放跳转
        ,st_notify:undefined //通知窗口的线程状态
        ,$state:null //路由跳转对象
        ,qtype:null //试题类型列表
        ,Chapter_list:undefined //章节列表1
        ,bulid_list:undefined //生成策略列表
        ,GroupList:undefined //分组列表
        ,stuList:undefined //学生列表
        ,edit_exam_obj:undefined //待编辑试题对象
        ,examPaper_obj:undefined // 试卷对象
        ,exam75_obj:undefined //解答题对象
        ,statusExam:0 //答题状态
        ,examList:undefined //试题列表
    }
    //用户交互信息类
    ,user:{
         id:'1019abaad14357924e14bea08c04952003be'
        ,name:'郑茜文'
        ,ssid:undefined
        ,isTeacher:true
        ,groupInstanceId:'00008aecff793ff14f8085f23efc2a907eff' //分组ID
        ,lschemaid:'00007c55404c39bc425a80b5286743ad6a7a' //学案ID
        ,examitem_cot:undefined //探究主题内容
        ,lclassId:'0000a5e11ea3790442428a327a3f44cf97ce' //课堂编号
        ,classId:'1019a56b906f0b414398ab73d76feec99213'//班级
        ,subjectNo:'21' //学科
        ,gradeNo:'9' //年级
        ,volumeNo:'107' //册别
        ,pressNo:'0977' //版别
        ,bookId:'6e519d7e-34aa-4c56-a713-3650581f88bb'
        ,bookName:'历史-九年级上册-四川教育出版社-龚奇柱'
    }
    // ,user:{
    //      id:undefined
    //     ,name:undefined
    //     ,loginName:undefined
    //     ,pwd:undefined
    //     ,ssid:undefined
    //     ,isTeacher:true
    //     ,groupInstanceId:undefined                //分组ID
    //     ,lschemaid:undefined                      //学案ID
    //     ,examitem_cot:undefined                   //探究主题内容
    //     ,lclassId:undefined                       //课堂编号
    //     ,classId:undefined                        //班级
    //     ,gradeNo:undefined                        //年级
    //     ,subjectNo:undefined                      //学科
    //     ,volumeNo:undefined                       //册别
    //     ,pressNo:undefined                        //版别
    //     ,bookId:undefined
    //     ,bookName:undefined
    // }
    //获取地址栏参数
    ,getUrlPara:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return '';
    }
    //生成指定范围的随机数
    ,fRandomBy:function(under, over){
        switch (arguments.length) {
            case 1: return parseInt(Math.random() * under + 1);
            case 2: return parseInt(Math.random() * (over - under + 1) + under);
            default: return 0;
        }
    }
    //获得元素距离左边的相对位置
    ,getElementLeft:function(element){
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    //获得元素距离顶部的相对位置
    ,getElementTop:function(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
        　　actualTop += current.offsetTop;
        　　current = current.offsetParent;
        }
        return actualTop;
    }
    //生成GUID
    ,Guid:function(){
        var guid = "";
        for(var i=1;i<=32;i++){
          var n=Math.floor(Math.random()*16.0).toString(16);
          guid+=n;
          if((i==8) || (i==12) || (i==16) || (i==20)){guid   +=   "-";}
        }
        return guid;
    }
    //ajax请求
    ,ajax_get:function(apistr,params,back){
        var xmlHttp;
        if(window.ActiveXObject){
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if(window.XMLHttpRequest){
            xmlHttp = new XMLHttpRequest();
        }
        apistr+=createQueryString(params)+"timestamp="+new Date().getTime();
        xmlHttp.open("GET",apistr);
        xmlHttp.onreadystatechange=function(){
            if(xmlHttp.readyState==4 && xmlHttp.status == 200)
            {
                back(xmlHttp.responseText);
            }      
        };
        xmlHttp.send(null);

        function createQueryString(p){
            var str="";
            for (v in p) {
                str+=v+"="+p[v]+"&";
            }
            return str;
        }
    }
    //base64
    ,Base64:{
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = oth.Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = oth.Base64._utf8_decode(output);
            return output;
        },
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }
    //XML转JSON
    ,XMLtoJSON:function(xml,rstr) {    
        if(window.DOMParser) {
          var getxml = new DOMParser();
          var xmlDoc = getxml.parseFromString(xml,"text/xml");
        }
        else {
          var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
        }
        var json_str = jsontoStr(setJsonObj(xmlDoc));
        return (typeof(rstr) == 'undefined') ? JSON.parse(json_str) : json_str;

        function setJsonObj(xml) {
            var js_obj = {};
            if (xml.nodeType == 1) {
              if (xml.attributes.length > 0) {
                js_obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                  var attribute = xml.attributes.item(j);
                  js_obj["@attributes"][attribute.nodeName] = attribute.value;
                }
              }
            } else if (xml.nodeType == 3) {
              js_obj = xml.nodeValue;
            }            
            if (xml.hasChildNodes()) {
              for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(js_obj[nodeName]) == "undefined") {
                  js_obj[nodeName] = setJsonObj(item);
                } else {
                  if (typeof(js_obj[nodeName].push) == "undefined") {
                    var old = js_obj[nodeName];
                    js_obj[nodeName] = [];
                    js_obj[nodeName].push(old);
                  }
                  js_obj[nodeName].push(setJsonObj(item));
                }
              }
            }
            return js_obj;
        }
        function jsontoStr(js_obj) {
            var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
            return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
        }
    }
    //获取字符串的实际长度
    ,len:function(s) {
        var l = 0; 
        var a = s.split(""); 
        for (var i=0;i<a.length;i++) { 
            if (a[i].charCodeAt(0)<299) { 
                l++; 
            } else { l+=2; } 
        } 
        return l; 
    }
};

//刷新章节树
function FlushTree(e){
    if (e==undefined) {
        for (var v = 0; v < oth.stArr.Chapter_list.length; v++) {
            oth.stArr.Chapter_list[v].is_ttat=false;
            for (var k = 0; k < oth.stArr.Chapter_list[v].rows.length; k++) {
                oth.stArr.Chapter_list[v].rows[k].is_rowat=false;
            }
        }        
        return;
    }
    var temp=undefined;
    for (var v = 0; v < oth.stArr.Chapter_list.length; v++) {
        oth.stArr.Chapter_list[v].is_ttat=false;
        for (var k = 0; k < oth.stArr.Chapter_list[v].rows.length; k++) {
            oth.stArr.Chapter_list[v].rows[k].is_rowat=false;
            if (oth.stArr.Chapter_list[v].rows[k].id==e.id) {
                temp=oth.stArr.Chapter_list[v].rows[k];
                oth.stArr.Chapter_list[v].rows[k].is_rowat=true;
                oth.stArr.Chapter_list[v].is_ttat=true;
            }
        }
    }
    return temp;        
}
//章节树点击事件
function Tree_fn(e){
    if (e.is_ttat) {
        FG("#"+e.id).css("height","0px");                        
    }else{
        var h=FG("#"+e.id+">p").length*30;
        FG("#"+e.id).css("height",h+"px");                        
    }
    e.is_ttat=!e.is_ttat;           
}
//章节树绑定结束事件
function Tree_rpd_fn(){
    for (var v = 0; v < oth.stArr.Chapter_list.length; v++) {
        if (oth.stArr.Chapter_list[v].is_ttat) {
            var h=FG("#"+oth.stArr.Chapter_list[v].id+">p").length*30;
            FG("#"+oth.stArr.Chapter_list[v].id).css("height",h+"px");
            break;
        }
    }
} 

//一些组件的初始化
(function(){
    //给JS数组添加删除方法
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    //提示窗口的HTML片段
    var msgstr="<div id='msg' class='popclose'><div><div class='m-mgs-head'><p><span class='icon-exclamation-circle'></span></p><p>提示信息</p></div><p id='m-msg-cot'></p><p class='m-msg-foot'><button id='msg_but_close'>关 闭</button>&nbsp;&nbsp;<button id='msg_but_ok'>确 定</button></p></div></div>";

    //通知窗口HTML片段
    var notifystr='<div id="notify" class="notify-close"><div id="notifyCot" class="notify_w100"><img src="v4/img/load.gif"/><span id="notifyCot_span" style="display: none"></span></div></div>';  

    if (FG("body").id=='ifm' || FG("#no-msg").length>0) {return;}

    FG("body").append(msgstr);
    FG("body").append(notifystr);

    FG("#msg_but_close").click(function(){
        FG("#msg").className("popclose");
    });
})();