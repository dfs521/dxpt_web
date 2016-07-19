﻿/************************默认空白页*************************************/
app.controller('def',function($state,baseService){
    oth.stArr.$state=$state;
    baseService.fuckWF("123",function(){
        alert("456");
    });
      function dfs(){
        alert("dfs");
    }
    
});

/************************编辑器*************************************/
app.controller('editor_def',function(){
    FG("#fn").css("height",(window.innerHeight-10)+"px");
});

/************************练习-PC*************************************/
app.controller('practice_def',function($scope,$state,baseService){
    //页面设置调整
    onresize_fn();
    FG("#nav>p").click(function(){
        var temp=FG(this).attr("name");
        if (temp=="") {return;}
        FG("#nav .bg2-h").className("def-h");
        FG(this).className("bg2-h");
        $state.go(temp);
    });
    
    //回到客户端
    $scope.back=function(){
        getClientData(["backHome",''],function(){});
    }

    //缓存试题类型    
    oth.stArr.qtype=[];
    baseService.getExamKind(function(e){
        for (var i = 0; i < e.length; i++) {
            oth.stArr.qtype.push({
                id:e[i].code,
                name:e[i].value
            });
        }
    }); 

    oth.stArr.Chapter_list=[];
    baseService.getChapter(function(data){
        for (var v = 0; v < data.length; v++) {
            var temp={};
            temp.id="k"+data[v].code;
            temp.ttname=data[v].value;
            temp.is_ttat=false;
            temp.rows=[];
            for (var d = 0; d < data[v].items.length; d++) {                        
                var rowtemp={};
                rowtemp.id=data[v].items[d].code;
                rowtemp.rowname=data[v].items[d].value;
                rowtemp.is_rowat=false;
                temp.rows.push(rowtemp);
            }
            oth.stArr.Chapter_list.push(temp);
        }
    });

    $state.go('practice.list');
})
.controller('practice_list',function($scope,$state,baseService){
    FG("#bg_img").className("img_bg-pos11");
    $scope.items=[];
    $scope.myval=undefined;

    //查询
    $scope.sel=function(){
        setPagination(-1);
    }   
    $scope.keyDownFn = function(event){
        $scope.keyCode = event.keyCode;
        if ($scope.keyCode == 13) {
            $scope.sel();
        }        
    };

    $scope.onPageChange = function() {
        var index=$scope.currentPage;
        setPagination(index);
    };
    function setPagination(index){
        if (index==-1) {$scope.currentPage=1}
        var param={pageSize:10,pageNo:index,masterId:oth.user.id}; 
        if ($scope.myval!='' && $scope.myval!=undefined) {param.search_param=$scope.myval;}
        var list=[];
        baseService.queryExamPaper(param,function(data,total){
            for (var i = 0; i < data.length; i++) {
                list.push({
                    id:data[i].row[0].code
                    ,name:data[i].row[3].code
                    ,updtime:data[i].row[15].code
                    ,qNumber:data[i].row[8].code
                    ,score:parseInt(data[i].row[7].code)
                    ,linkNumber:0
                });
            }
            $scope.items=list;
            $scope.recordCount=total;
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.sel_linkNumber($scope.items[i]);
            }
        });            
    }

    //查询试卷关联的学案数
    $scope.sel_linkNumber=function(e){
        var param={kind:'code',hierId:"learnSchemaExam",codeId:e.id};
        baseService.queryExamPapersSchema(param,function(data){
            e.linkNumber=data.length;
        });                
    }

    //删除练习
    $scope.del_fn = function(item) {
        if(item.linkNumber>0){
            msg("该练习已经关联学案，无法删除！");
            return;
        }
        msg("确定要删除该练习吗？",function(){
            var param={kind:'delete',id:item.id};
            baseService.saveExamPaper(param,function(data){
                setPagination(-1);
            });
        });
    }

    //关联学案和查看试卷内容
    $scope.link_fn=function(e,d){
        oth.stArr.examPaper_obj=e;
        $state.go(d);
    }

    //分页
    setTimeout(function() {
        setPagination(-1);
    }, 1000);

    //新建练习
    next_back('','新建练习',function(){
        $scope.editoradd_fn();
    });
    $scope.editoradd_fn = function(e) {
        oth.stArr.bulid_list=null;
        $state.go("practice.add");
    }      
})
.controller('practice_linklschema',function($scope,$state,baseService){
    FG("#bg_img").className("img_bg-pos12"); 
    $scope.paper=oth.stArr.examPaper_obj;
    $scope.rows=[];
    $scope.linkItems=[];
    
    //页面加载
    $scope.pageLoad=function(){
        var linkparam={kind:'code',hierId:"learnSchemaExam",codeId:$scope.paper.id};
        baseService.queryExamPapersSchema(linkparam,function(data){
            for (var i = 0; i < data.length; i++) {
                $scope.linkItems.push({
                    id:data[i].code,
                    cot:data[i].value,
                    bd:bdArr[oth.fRandomBy(0,10)]
                });
            }        
            setPagination(-1);
        });        
    }
    $scope.pageLoad();

    //分页
    $scope.onPageChange = function() {
        var index=$scope.currentPage;
        setPagination(index);
    };
    function setPagination(index){
        if (index==-1) {$scope.currentPage=1}
        var list=[];
        var param={pageSize:10,pageNo:index,createId:oth.user.id}
        baseService.querySchema(param,function(total,data){
            for (var i = 0; i < data.length; i++) {
                var temp={
                    id:data[i].row[0].code,
                    is_active:false,
                    cot:data[i].row[1].code,
                    time:data[i].row[14].code
                };
                filter(temp);
                list.push(temp);
            }
            $scope.rows=list;
            $scope.recordCount=total;
        });
    }

    //过滤已关联过的学案
    function filter(e){
        for (var i = 0; i < $scope.linkItems.length; i++) {
            if ($scope.linkItems[i].id==e.id) {
                e.is_active=true;
                break;
            }
        } 
    }

    //关联学案
    $scope.link_fn=function(e){
        var param={kind:'insert',paperId:oth.stArr.examPaper_obj.id,schemaId:e.id};
        baseService.saveExamPaperSchemaData(param,function(){
            e.is_active=true;
            $scope.linkItems.push({
                id:e.id,
                cot:e.cot,
                bd:bdArr[oth.fRandomBy(0,10)]
            });
        });
    }; 

    //取消关联学案
    $scope.unlink_fn=function(e,index){
        msg("你确定要取消关联吗？",function(){
            var param={kind:'deleteByKeys',paperId:oth.stArr.examPaper_obj.id,schemaId:e.id};
            baseService.saveExamPaperSchemaData(param,function(){
                for (var i = 0; i < $scope.rows.length; i++) {
                    if ($scope.rows[i].id==e.id) {
                        $scope.rows[i].is_active=false;
                        break;
                    }
                }
                $scope.linkItems.remove(index);
            });
        });
    };    

    //跳转
    next_back('练习列表',function(){
        $state.go('practice.list');
    },'');    
})
.controller('practice_view_paper',function($scope,$state,baseService,$sce){
    FG("#bg_img").className("img_bg-pos12"); 
    $scope.items=[];
    $scope.myPaper=oth.stArr.examPaper_obj;
    $scope.list76=[];

    var param={viewId:'examItemPaper',"examPaper.id":$scope.myPaper.id};
    baseService.queryExamItemBySelect(param,function(data){
        var bgindex=0;
        for (var i = 0; i < data.length; i++) {
            if (i>10) {bgindex=0};
            var temp={
                id:data[i].row[0].code,
                qid:data[i].row[1].code,
                score:data[i].row[37].code,
                qname:data[i].row[1].caption,
                answer:filter(data[i].row[29].code),
                analysis:data[i].row[32].code,
            }
            if(data[i].row[28].code){
                temp.parentId=data[i].row[28].code;
                $scope.list76.push(temp); 
            }else{
                temp.nodes=[];
                temp.cot=$sce.trustAsHtml(oth.Base64.decode(data[i].row[6].code));
                temp.bg=bgArr[bgindex];
                $scope.items.push(temp); 
            }
            bgindex++;
        }

        //挑选复合题子题加入集合
        for (var i = 0; i < $scope.items.length; i++) {
            if($scope.items[i].qid=="76"){
                sel76($scope.items[i]);
            }
        }
        function sel76(e){
            for (var i = 0; i < $scope.list76.length; i++) {
                if(e.id == $scope.list76[i].parentId){
                    e.nodes.push($scope.list76[i]);
                }
            }
        }

        //过滤判断题
        function filter(e){
            if(e=="0"){
                return "错误";
            }else if(e=="1"){
                return "正确";
            }else{
                return e;
            }
        }               
    });    

    //跳转
    next_back('练习列表',function(){
        $state.go('practice.list');
    },'');      
})
.controller('practice_add',function($scope,$state,ngDialog,baseService){
    FG("#bg_img").className("img_bg-pos12");  
    $scope.view_list=[];
    $scope.bookName=oth.user.bookName;
    //练习名称
    var dt=new Date();
    $scope.defName='练习'+dt.getFullYear()+(dt.getMonth()+1)+dt.getDate();

    //默认章节
    $scope.section=oth.stArr.Chapter_list[0].rows[0];

    //绑定页面列表
    if (oth.stArr.bulid_list===null) {
        for (var i = 0; i < oth.stArr.qtype.length; i++) {
            $scope.view_list.push({
                qid:oth.stArr.qtype[i].id
                ,name:oth.stArr.qtype[i].name
                ,number:0
                ,id:$scope.section.id                
                ,range:$scope.section.rowname
            });
        }
    }else{
        $scope.view_list=oth.stArr.bulid_list;
    }  

    //选择教材
    $scope.change_JC = function(){
        getClientData(["tmBook",''],function(){});
    };

    //选择章节
    $scope.change_ZJ = function () {
        var parent=$scope;
        var dlg_zj=ngDialog.open({
            template: 'v4/practice/dlg_zj.html',
            controller: ['$scope', function($scope) {
                $scope.items=oth.stArr.Chapter_list;
                FlushTree(parent.section);
                $scope.item_fn=Tree_fn;
                $scope.rpdone_fn=Tree_rpd_fn;
                $scope.row_fn=function(e){
                    parent.section.is_rowat=false;
                    e.is_rowat=true;
                    parent.section=e;
                    for (var i = 0; i < parent.view_list.length; i++) {
                        parent.view_list[i].range=e.rowname;
                        parent.view_list[i].id=e.id;
                    }
                }                
            }]
        });
    };

    $scope.cacheChapter=function(){
        oth.stArr.Chapter_list=[];
        baseService.getChapter(function(data){
            for (var v = 0; v < data.length; v++) {
                var temp={};
                temp.id="k"+data[v].code;
                temp.ttname=data[v].value;
                temp.is_ttat=false;
                temp.rows=[];
                for (var d = 0; d < data[v].items.length; d++) {                        
                    var rowtemp={};
                    rowtemp.id=data[v].items[d].code;
                    rowtemp.rowname=data[v].items[d].value;
                    rowtemp.is_rowat=false;
                    temp.rows.push(rowtemp);
                }
                oth.stArr.Chapter_list.push(temp);
            }
            $scope.bookName=oth.user.bookName;
        });          
    }

    //添加修改题型
    $scope.AUQtypeFn=function(e){
        var parent=$scope;
        var dlg_st=ngDialog.open({
            template: 'v4/practice/dlg_au_qtype.html',
            controller: ['$scope', function($scope) {
                $scope.activities =oth.stArr.qtype;
                $scope.actv_qtype=$scope.activities[0]; 
                $scope.number=1;
                $scope.items=oth.stArr.Chapter_list;
                $scope.actv_item=parent.section;

                //是否编辑状态
                if (e) {
                    //题型
                    for (var i = 0; i < $scope.activities.length; i++) {
                        if ($scope.activities[i].id==e.qid) {
                            $scope.actv_qtype=$scope.activities[i]; 
                            break;
                        }
                    }
                    //题量
                    $scope.number=e.number;
                    //展开的章节
                    FlushTree(e);
                }else{
                    FlushTree(parent.section);
                }

                $scope.item_fn=Tree_fn;
                $scope.rpdone_fn=Tree_rpd_fn;

                $scope.row_fn=function(e){
                    $scope.actv_item.is_rowat=false;
                    e.is_rowat=true;
                    $scope.actv_item=e;
                }

                $scope.cancel=function(){
                    dlg_st.close();
                }
                $scope.ok=function(){
                    if (!page_check()) {return;}
                    $scope.cancel();    
                    if (e) {      
                        e.id=$scope.actv_qtype.id;
                        e.name=$scope.actv_qtype.name;
                        e.number=$scope.number;
                        e.id=$scope.actv_item.id;                
                        e.range=$scope.actv_item.rowname;              
                    }else{       
                        parent.view_list.push({
                            qid:$scope.actv_qtype.id
                            ,name:$scope.actv_qtype.name
                            ,number:$scope.number
                            ,id:$scope.actv_item.id                
                            ,range:$scope.actv_item.rowname
                        }); 
                    }
                }

                //页面数据检查
                function page_check(){
                    if (isNaN($scope.number)) {
                        msg("题目数量格式错误！");
                        return false;
                    }
                    for (var i = 0; i < parent.view_list.length; i++) {
                        if (parent.view_list[i].qid==$scope.actv_qtype.id && parent.view_list[i].id==$scope.actv_item.id) {
                            msg("该章节下已有"+$scope.actv_qtype.name+"!");
                            return false;
                        }
                    }
                    return true;                     
                }
            }]
        });        
    }

    //删除题型
    $scope.delQtypeFn=function(e){
        for (var i = 0; i < $scope.view_list.length; i++) {
            if ($scope.view_list[i].qid==e.qid && $scope.view_list[i].id==e.id) {
                $scope.view_list.remove(i);
                break;
            }
        }
    }

    //增加试题数量
    $scope.add_number=function(e){
        if (isNaN(e.number)){e.number=0;}
        if (e.number==50) {return;}
        e.number++;
    }
    //减少试题数量
    $scope.reduce_number=function(e){
        if (isNaN(e.number)){e.number=0;}
        if (e.number==0) {return;}
        e.number--;
    }

    //跳转
    next_back('练习列表',function(){
        $scope.bcakFn();
    },'生成练习',function(){
        $scope.buildFn();
    });

    $scope.bcakFn = function(){
        FG("#bg_img").className("img_bg-pos11");
        $state.go('practice.list');
    }; 
    $scope.buildFn=function(){
        var sum=0;
        if($scope.defName==""){
            msg("练习名称不能为空！");
            return;
        }        
        else if ($scope.view_list.length==0) {
            msg("请至少添加一个题型！");
            return;
        }
        for (var i = 0; i < $scope.view_list.length; i++) {
            if (isNaN($scope.view_list[i].number)) {
                msg($scope.view_list[i].name+'填写数量格式错误！');
                return;
            }else{
                var my_number=parseInt($scope.view_list[i].number);
                sum+=my_number;
            }
        }
        if (sum>50) {
            msg("试题数量不能超过 50 ");
            return;
        }else if(sum==0){
            msg("试题数量不能为 0 ");
            return;
        }
        oth.stArr.bulid_list=$scope.view_list;
        $state.go('practice.bulid',{param:$scope.defName});
    }            
})
.controller('practice_bulid',function($scope,$state,ngDialog,$stateParams,baseService,$sce){
    FG("#bg_img").className("img_bg-pos13");
    $scope.bulid_list = oth.stArr.bulid_list;
    $scope.practice_name=$stateParams.param;
    $scope.isEidt=false;
    $scope.sum_score=0;
    $scope.saveCot=0;
    
    //页面初始化
    page_load();
    function page_load(){
        $scope.items=[];
        $scope.sum_q=0;
        $scope.sum_score=0.0;        
        for (var i = 0; i < $scope.bulid_list.length; i++) {
            var temp_cot=parseInt($scope.bulid_list[i].number);
            if (temp_cot!=0) {
                $scope.sum_q+=temp_cot;
                for (var j = 0; j < temp_cot; j++) {
                    $scope.items.push({
                        q_id:$scope.bulid_list[i].qid
                        ,q_name:$scope.bulid_list[i].name
                        ,chapter_id:$scope.bulid_list[i].id
                        ,chapter_name:$scope.bulid_list[i].range
                        ,exam_id:""
                        ,exam_cot:$sce.trustAsHtml("无题可用，请新增试题！")
                        ,q_score:0.0
                        ,nodes:[]
                    });
                }                        
            }
        }

        for (var i = 0; i < $scope.bulid_list.length; i++) {
            var temp_cot=parseInt($scope.bulid_list[i].number);
            if (temp_cot!=0){
                get_exam_item($scope.bulid_list[i]);
            }
        }        
    }

    //根据试题类型和章节获得试题
    function get_exam_item(e){
        var param={chapterNo:e.id,primaryKind:e.qid,pageSize:e.number,pageNo:-1,parentIdNull:1};
        baseService.queryExamItemBySelect(param,function(data){
            for (var i = 0; i < data.length; i++) { 
                var a=data[i].row[0].code,
                    a1=data[i].row[1].code,
                    a6=data[i].row[6].code,
                    a22=data[i].row[22].code;

                for (var j = 0; j < $scope.items.length; j++) {
                    if ($scope.items[j].exam_id=="" && $scope.items[j].q_id==a1 && $scope.items[j].chapter_id==a22) {
                        $scope.items[j].exam_id=a;
                        $scope.items[j].exam_cot=$sce.trustAsHtml(oth.Base64.decode(a6));
                        if($scope.items[j].q_id==76){
                            get_nodes76($scope.items[j]);
                        }
                        break;
                    }
                }
            }
        });    
    }

    //获取复合题的子题
    function get_nodes76(e){
        var param={parentId:e.exam_id,orderby:"mdorder",orderDesc:false};
        baseService.queryExamItemBySelect(param,function(data){ 
            for (var i = 0; i < data.length; i++) { 
                e.nodes.push({
                     exam_id:data[i].row[0].code
                    ,q_id:data[i].row[1].code
                    ,q_name:data[i].row[1].caption
                    ,q_score:0.0
                });
            }                
        });        
    }

    //增加和减少分值
    $scope.modified=function(e,t){
        var b_number=parseFloat(parseFloat(e.q_score).toFixed(1));
        if (t) {
            if (b_number==50.0) {return;}
            else if(b_number+1>50.0){return;}
            b_number+=1;
            $scope.sum_score+=1;
        }
        else{
            if (b_number==0.0) {return;}
            else if(b_number-1<0.0){return;}
            b_number-=1;
            $scope.sum_score-=1;
        }
        $scope.sum_score=parseFloat($scope.sum_score.toFixed(1));
        e.q_score=b_number.toFixed(1);
    }

    //分值文本框失去焦点
    $scope.blur_fn=function(e){
        if (isNaN(e.q_score)){
            e.q_score=0.0;
        }
        e.q_score=parseFloat(parseFloat(e.q_score).toFixed(1));
        if(e.q_score<0.0){
            e.q_score=0.0;
        }
        else if(e.q_score>50.0){
            e.q_score=50.0;          
        }
        $scope.reckon_score();  
    }

    //自选试题
    $scope.choose_fn=function(e){
        var parent=$scope;
        var dlg=ngDialog.open({
            template: 'v4/practice/dlg_choose_exam.html',
            controller: ['$scope','baseService','$sce', function($scope,baseService,$sce) {
                $scope.rows=[];
                $scope.active_item=undefined;
                $scope.click_fn=function(e){
                    for (v in $scope.rows) {
                        $scope.rows[v].is_active=false;
                    }
                    e.is_active=true;
                    $scope.active_item=e;
                }
                setPagination(-1);
                $scope.onPageChange = function() {
                    var index=$scope.currentPage;
                    setPagination(index);
                };
                function setPagination(index){
                    if (index==-1) {$scope.currentPage=1}
                    var list=[];
                    var param={chapterNo:e.chapter_id,primaryKind:e.q_id,pageSize:5,pageNo:index,selectedExamIds:e.exam_id,parentIdNull:1};
                    baseService.queryExamItemBySelect(param,function(data,total){
                        for (var i = 0; i < data.length; i++) { 
                            var tid=data[i].row[0].code;
                            list.push({
                                id:tid,
                                is_active:tid==e.exam_id?true:false,
                                cot:$sce.trustAsHtml(oth.Base64.decode(data[i].row[6].code)),
                                time:data[i].row[12].code
                            });                                
                        }
                        $scope.rows=list;
                        $scope.pageSize=5;                                                        
                        $scope.recordCount=total;   
                    });                       
                }
                $scope.cancel=function(){
                    dlg.close();
                }
                $scope.ok=function(){
                    if ($scope.active_item.id!=e.exam_id) {
                        for (var i = 0; i < parent.items.length; i++) {
                            if (parent.items[i].exam_id==$scope.active_item.id) {
                                msg("该试题已存在于生成列表当中！");
                                return;
                            }
                        }
                    }
                    if ($scope.active_item!=undefined) {
                        e.exam_id=$scope.active_item.id;
                        e.exam_cot=$scope.active_item.cot;                        
                    }else{msg("请选择一个试题");}
                    $scope.cancel();
                }                                              
            }]
        });
    }

    //设置复合题分数
    $scope.setExam76_fn=function(exam){
        var parent=$scope;
        var dlg=ngDialog.open({
            template: 'v4/practice/dlg_setExam76.html',
            controller: ['$scope','baseService','$sce', function($scope,$sce) {
                $scope.rows=exam.nodes;
                $scope.tt=exam.exam_cot;
                //增加和减少分值
                $scope.modified=function(e,t){
                    var b_number=parseFloat(parseFloat(e.q_score).toFixed(1));
                    if (t) {
                        if (b_number==50.0) {return;}
                        else if(b_number+1>50.0){return;}
                        b_number+=1;
                    }
                    else{
                        if (b_number==0.0) {return;}
                        else if(b_number-1<0.0){return;}
                        b_number-=1;
                    }
                    e.q_score=b_number.toFixed(1);
                    change();
                }   
                //分值文本框失去焦点
                $scope.blur_fn=function(e){
                    if (isNaN(e.q_score)){
                        e.q_score=0.0;
                    }
                    e.q_score=parseFloat(parseFloat(e.q_score).toFixed(1));
                    if(e.q_score<0.0){
                        e.q_score=0.0;
                    }
                    else if(e.q_score>50.0){
                        e.q_score=50.0;          
                    }
                    change();
                }
                function change(){
                    exam.q_score=0.0;
                    for (var i = 0; i < $scope.rows.length; i++) {
                        var temp=parseFloat(parseFloat($scope.rows[i].q_score).toFixed(1));
                        exam.q_score+=temp;
                    }
                    parent.reckon_score();
                }                                              
            }]
        });
    }

    //删除试题
    $scope.del_fn=function(e){
        $scope.items.remove(e);
        $scope.sum_q--;
        $scope.reckon_score();
    }
    
    //添加试题
    $scope.add_fn=function(){
        var parent=$scope;
        var dlg_st=ngDialog.open({
            template: 'v4/practice/dlg_au_qtype.html',
            controller: ['$scope','baseService','$sce', function($scope,baseService,$sce) {
                $scope.activities =oth.stArr.qtype;
                $scope.actv_qtype=$scope.activities[0]; 
                $scope.number=1;
                $scope.items=oth.stArr.Chapter_list;
                $scope.actv_item=oth.stArr.Chapter_list[0].rows[0];

                FlushTree(oth.stArr.Chapter_list[0].rows[0]);

                $scope.item_fn=Tree_fn;
                $scope.rpdone_fn=Tree_rpd_fn;

                $scope.row_fn=function(e){
                    $scope.actv_item.is_rowat=false;
                    e.is_rowat=true;
                    $scope.actv_item=e;
                }

                $scope.cancel=function(){
                    dlg_st.close();
                }
                $scope.ok=function(){
                    if (!page_check()) {return;}
                    $scope.cancel();
                    parent.sum_q+=parseInt($scope.number); 
                    var param={chapterNo:$scope.actv_item.id,primaryKind:$scope.actv_qtype.id,pageSize:$scope.number,pageNo:1,parentIdNull:1};
                    baseService.queryExamItemBySelect(param,function(data){
                        for (var i = 0; i < data.length; i++) { 
                            var a=data[i].row[0].code,
                                a6=data[i].row[6].code;
                            parent.items.push({
                                q_id:$scope.actv_qtype.id
                                ,q_name:$scope.actv_qtype.name
                                ,chapter_id:$scope.actv_item.id
                                ,chapter_name:$scope.actv_item.rowname
                                ,exam_id:a
                                ,exam_cot:$sce.trustAsHtml(oth.Base64.decode(a6))
                                ,q_score:0.0
                                ,nodes:[]
                            });                             
                        }
                        var b1 = parseInt($scope.number)-data.length;
                        for (var i = 0; i < b1; i++) {
                            parent.items.push({
                                q_id:$scope.actv_qtype.id
                                ,q_name:$scope.actv_qtype.name
                                ,chapter_id:$scope.actv_item.id
                                ,chapter_name:$scope.actv_item.rowname
                                ,exam_id:""
                                ,exam_cot:$sce.trustAsHtml("无题可用，请新增试题！")
                                ,q_score:0.0
                                ,nodes:[]
                            });
                        }
                    });
                }

                //页面数据检查
                function page_check(){
                    if (isNaN($scope.number)) {
                        msg("题目数量格式错误！");
                        return false;
                    }
                    return true;                     
                }
            }]
        });             
    }

    //上移
    $scope.move_up=function(e){
        if (e==0) {return;}
        var temp=$scope.items[e-1];
        $scope.items[e-1]=$scope.items[e];
        $scope.items[e]=temp;
    }

    //下移
    $scope.move_down=function(e){
        if (e==$scope.items.length-1) {return;}
        var temp=$scope.items[e+1];
        $scope.items[e+1]=$scope.items[e];
        $scope.items[e]=temp;
    }

    //重新计算分数
    $scope.reckon_score=function(){
        $scope.sum_score=0.0;
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.sum_score+=parseFloat($scope.items[i].q_score);
        }
        $scope.sum_score=parseFloat($scope.sum_score.toFixed(1));
    }

    //页面数据检查
    function page_check(){
        if ($scope.items.length==0) {
            msg("没有任何题目 ！")
            return;
        }

        var cot_a=0,
            cot_b=0;
        for (var i = 0; i < $scope.items.length; i++) {
            if (parseFloat($scope.items[i].q_score)==0.0) {
                cot_a++;
            }else{
                cot_b++;
            }
            for (var j = 0; j < $scope.items[i].nodes.length; j++) {
                if (parseFloat($scope.items[i].nodes[j].q_score)==0.0) {
                    cot_a++;
                }else{
                    cot_b++;
                }
            }            
        }

        if(cot_b>0 && cot_a!=0){
            msg("有未设置分数题目或复合题子题目！");
            return false;
        }

        for (var j = 0; j < $scope.items.length; j++) {
            if ($scope.items[j].exam_id==""){
                msg("第 "+(j+1)+" 小题未设置，请添加试题！");
                return false;
            }
        }

        return true;
    }

    //生成试卷
    $scope.bulid_fn=function(){
        if (page_check()) {
            notify.open();
            var contrast_number=$scope.items.length;
            var param={kind:'insert',name:$scope.practice_name,
            score:$scope.sum_score,mdorder:$scope.sum_q,
            description:$scope.practice_name,chapterNo:oth.stArr.Chapter_list[0].rows[0].id};
            baseService.saveExamPaper(param,function(data){
                for (var i = 0; i < $scope.items.length; i++) {
                    contrast_number+=$scope.items[i].nodes.length;
                    var paramEPI={kind:'insert',itemId:$scope.items[i].exam_id,
                    paperId:data,score:$scope.items[i].q_score,mdorder:i+1};
                    send(paramEPI);
                    for (var j = 0; j < $scope.items[i].nodes.length; j++) {
                        var paramNode={kind:'insert',itemId:$scope.items[i].nodes[j].exam_id,
                        parentId:$scope.items[i].exam_id,
                        paperId:data,score:$scope.items[i].nodes[j].q_score,mdorder:(paramEPI.mdorder*10)+j+1};
                        send(paramNode);
                    }
                }
            });

            //提交保存
            function send(paramEPI){
                baseService.saveExamPaperItem(paramEPI,function(){
                    $scope.saveCot++;
                });                
            }
            
            var st=setInterval(function(){
                if ($scope.saveCot==contrast_number) {
                    clearInterval(st);
                    notify.advanced("生成成功！");
                    $state.go('practice.list');
                }
            },500);
        }
    }

    //跳转
    next_back('试题策略',function(){
        $scope.bcakFn();
    },'');

    //返回策略页面
    $scope.bcakFn = function(){      
        $state.go('practice.add',{param:$scope.practice_name});
    };     
})
.controller('practice_manage',function($scope,$sce,$state,baseService,ngDialog){
    FG("#bg_img").className("img_bg-pos21");
    $scope.items=[];
    $scope.q_list=[];
    $scope.active_qname=undefined;
    $scope.active_chapter=undefined;
    $scope.myval=undefined;

    for (var i = 0; i < oth.stArr.qtype.length; i++) {
        $scope.q_list.push({
            id:oth.stArr.qtype[i].id
            ,name:oth.stArr.qtype[i].name
            ,is_active:false
        });
    }

    //查询
    $scope.sel=function(){
        setPagination(-1);
    }   
    $scope.keyDownFn = function(event){
        $scope.keyCode = event.keyCode;
        if ($scope.keyCode == 13) {
            $scope.sel();
        }        
    };

    //分页
    setPagination(-1);
    $scope.onPageChange = function() {
        var index=$scope.currentPage;
        setPagination(index);
    };
    function setPagination(index){
        if (index==-1) {$scope.currentPage=1}
        var list=[];

        var param={pageSize:4,pageNo:index,parentIdNull:1,createId:oth.user.id}; 
        if ($scope.active_qname) {param.primaryKind=$scope.active_qname.id;}
        if ($scope.active_chapter) {param.chapterNo=$scope.active_chapter.id;}
        if ($scope.myval!='' && $scope.myval) {param.search_param=$scope.myval;}

        baseService.queryExamItemBySelect(param,function(data,total){
            for (var i = 0; i < data.length; i++) { 
                list.push({
                    id:data[i].row[0].code,
                    qid:data[i].row[1].code,
                    qname:data[i].row[1].caption,
                    chapter_id:data[i].row[22].code,
                    chapterName:sel_chapterName(data[i].row[22].code),
                    cot:$sce.trustAsHtml(oth.Base64.decode(data[i].row[6].code)),
                    cot_old:oth.Base64.decode(data[i].row[6].code),
                    answer:filter_answer(data[i].row[1].code,data[i]),
                    answer_old:data[i].row[29].code,
                    analysis:data[i].row[32].code,
                    time:data[i].row[12].code
                });
            }
            
            //查询章节名称
            function sel_chapterName(id){
                oth.stArr.Chapter_list.forEach(function(e){
                    e.rows.forEach(function(d){
                        if(id==d.id){
                            return d.name; 
                        }
                    });
                });
            }

            $scope.items=list;
            $scope.pageSize=4;
            $scope.recordCount=total;                                   
        });

        //过滤答案
        function filter_answer(t,e){
            if (t=="72") {return e.row[29].code=="1"?'正确':'错误';}
            else if (t=="75" || t=="76") {return "略";}
            return e.row[29].code;    
        }                       
    }

    //选择题型
    $scope.sel_qtype=function(e){
        if ($scope.active_qname) {
            $scope.active_qname.is_active=false;
        }
        e.is_active=true;
        $scope.active_qname=e;
        setPagination(-1);
    }
    //删除选择的题型
    $scope.del_active_qname=function(){
        $scope.active_qname.is_active=false;
        $scope.active_qname=undefined;
        setPagination(-1);
    }

    //选择章节
    $scope.sel_chapter=function(){
        var parent=$scope;
        var dlg=ngDialog.open({
            template: 'v4/practice/dlg_choose_chapter.html',
            controller: ['$scope', function($scope) {
                $scope.items=oth.stArr.Chapter_list;
                FlushTree(parent.active_chapter);

                $scope.item_fn=Tree_fn;
                $scope.rpdone_fn=Tree_rpd_fn;

                $scope.row_fn=function(e){
                    if (parent.active_chapter) {
                        parent.active_chapter.is_rowat=false;
                    }
                    e.is_rowat=true;
                    parent.active_chapter=e;
                    setPagination(-1);
                }                
            }]
        });          
    }
    //删除选择的章节
    $scope.del_active_chapter=function(){
        $scope.active_chapter.is_rowat=false;
        $scope.active_chapter=undefined;
        setPagination(-1);
    }    

    //删除试题
    $scope.del_fn=function(e){
        msg("确定要删除该试题吗？",function(){
            if (e.qid=="76") {
                var param={parentId:e.id};
                baseService.queryExamItemBySelect(param,function(data){               
                    for (var i = 0; i < data.length; i++) { 
                        var temp={type:"delete",id:data[i].row[0].code};        
                        baseService.saveExamItem(temp,function(data){});                              
                    }                
                });
            }
            var examItem={type:"delete",id:e.id};        
            baseService.saveExamItem(examItem,function(data){
                setPagination(-1);
            });
        });
    }

    //新建练习
    next_back('','添加试题',function(){
        $scope.eidt_add_fn();
    });

    //编辑或添加试题
    $scope.eidt_add_fn=function(e){
        if (e) {
            oth.stArr.edit_exam_obj=e;
        }else{
            oth.stArr.edit_exam_obj=undefined;
        }
        $state.go("practice.exam_edit");
    }
})
.controller('practice_exam_edit',function($scope,$state,baseService){
    FG("#bg_img").className("img_bg-pos22");
    $scope.bookName=oth.user.bookName;
    $scope.active_chapter=oth.stArr.Chapter_list[0].rows[0];
    $scope.my_exam=[];
    $scope.save_cot=0;
    $scope.is_edit=false;
    $scope.del_list=[];

    //设置章节树
    $scope.items=oth.stArr.Chapter_list;
    $scope.item_fn=Tree_fn;
    $scope.rpdone_fn=Tree_rpd_fn;
    $scope.row_fn=function(e){
        if ($scope.active_chapter) {
            $scope.active_chapter.is_rowat=false;
        }
        e.is_rowat=true;
        $scope.active_chapter=e;
    }

    //创建一个新的试题
    $scope.create_item=function(e){
        var temp={};
        if (arguments.length>0) {
            temp.id=e.id;
            temp.qid=parseInt(e.qid);
            temp.qtype=get_qtype(temp.qid);
            temp.answer=e.answer_old;
            temp.qanswer=get_qanswe(temp.qid,temp,'edit');
            temp.analysis=e.analysis;
            temp.is_analysis=e.analysis==''?false:true; 
        }else{
            temp.id='';
            temp.qid=70;
            temp.qtype=get_qtype();
            temp.answer='';
            temp.qanswer=get_qanswe(70,temp);
            temp.analysis='';
            temp.is_analysis=false;
        }

        $scope.my_exam.push(temp);
    }
    
    //编辑还是添加      
    if (oth.stArr.edit_exam_obj) {
        $scope.is_edit=true;
        $scope.active_chapter=FlushTree({id:oth.stArr.edit_exam_obj.chapter_id});
        if (oth.stArr.edit_exam_obj.qid==76) {
            var param={parentId:oth.stArr.edit_exam_obj.id,orderby:"mdorder",orderDesc:false};
            baseService.queryExamItemBySelect(param,function(data){ 
                for (var i = 0; i < data.length; i++) { 
                    var nodeid=data[i].row[0].code;
                    $scope.del_list.push(nodeid);
                    $scope.create_item({
                        id:nodeid,
                        qid:data[i].row[1].code,
                        answer_old:data[i].row[29].code,
                        analysis:data[i].row[32].code}
                    );
                }                
            });
        }else{
            $scope.create_item(oth.stArr.edit_exam_obj);
        }
        var st_um=setInterval(function(){
            if (fn.window.Setcot) {
                clearInterval(st_um);
                fn.window.Setcot(oth.stArr.edit_exam_obj.cot_old);
            }
        },300);
    }else{
        FlushTree($scope.active_chapter);
        $scope.create_item();
    }

    //删除一个小题
    $scope.del_exam=function(e){
        $scope.my_exam.remove(e);
    }

    //生成一个试题类型列表
    function get_qtype(qid){
        var temp=[];
        for (var i = 0; i < oth.stArr.qtype.length-1; i++) {
            temp.push({
                qid:oth.stArr.qtype[i].id
                ,qname:oth.stArr.qtype[i].name
                ,is_at:false              
            })
        }
        if (arguments.length>0) {
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].qid==qid) {
                    temp[i].is_at=true;
                    break;
                }
            }
        }else{temp[0].is_at=true;}

        return temp;
    }

    //根据题型，生成不同的答案对象
    function get_qanswe(qid,v,type){
        var temp=[];
        if (qid==70 || qid==71) {
            temp.push({name:"A",is_at:false});
            temp.push({name:"B",is_at:false});
            temp.push({name:"C",is_at:false});
            temp.push({name:"D",is_at:false});                  
        }
        else if (qid==72) {
            temp.push({name:"1",is_at:false});
            temp.push({name:"0",is_at:false});
        }
        if (type) {
            set_item(v.answer);
        }else{
            switch(qid){
                case 70: 
                    v.answer="A";
                    temp[0].is_at=true;
                break;
                case 71: 
                    v.answer="BC";
                    temp[1].is_at=true;
                    temp[2].is_at=true;
                break;
                case 72:
                    v.answer="1";
                    temp[0].is_at=true;
                break; 
            }            
        }

        function set_item(answer){
            if (qid==75) {return;}
            if (answer.length>1) {
                for (var i = 0; i < answer.length; i++) {
                    inlineFn(answer[i]);
                }
            }else{
                inlineFn(answer);
            }            

            function inlineFn(d){
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].name==d) {
                        temp[i].is_at=true;
                        break;
                    }
                }
            }       
        }

        return temp;
    }

    //试题类型点击事件
    $scope.sel_qtype=function(e,v){
        for (var i = 0; i < v.qtype.length; i++) {
            v.qtype[i].is_at=false;
        }
        e.is_at=true;
        v.qid=e.qid;
        v.qanswer=get_qanswe(parseInt(e.qid),v);
    }

    //单选按钮事件
    $scope.sel_radio=function(e,v){
        for (var i = 0; i < v.qanswer.length; i++) {
            v.qanswer[i].is_at=false;
        }
        e.is_at=true;
        v.answer=e.name;
    }

    //多选按钮事件
    $scope.sel_checkbox=function(e,v){
        e.is_at=!e.is_at;
        var temp="";
        for (var i = 0; i < v.qanswer.length; i++) {
            if (v.qanswer[i].is_at) {
                temp+=v.qanswer[i].name;
            }
        }
        v.answer=temp;        
    }

    //试题解析点击事件
    $scope.analysis_fn=function(e){
        e.is_analysis=!e.is_analysis;
    }

    //保存
    $scope.save_fn=function(){
        if (!fn.um.hasContents()) {
            msg("试题内容不能为空！");
            return;
        }
        for (var i = 0; i < $scope.my_exam.length; i++) {
            if($scope.my_exam[i].answer==''){
                msg("第"+(i+1)+"小题标准答案不能为空！");
                return;
            }   
        }
        var keyword=fn.um.getContentTxt().substring(0,100);
        keyword=keyword==""?"TU":keyword;
        fn.RemoverKG();
        var cot=oth.Base64.encode(fn.um.getContent());
        if (oth.len(cot)>4000) {msg("试题内容太长了...");return;}
        notify.open();

        //先删除复合题
        if ($scope.is_edit && oth.stArr.edit_exam_obj.qid==76) {
            var examItem={type:"delete",id:oth.stArr.edit_exam_obj.id};        
            baseService.saveExamItem(examItem,function(data){
                for (var i = 0; i < $scope.del_list.length; i++) {
                    examItem.id=$scope.del_list[i];
                    baseService.saveExamItem(examItem,function(data){});
                }
            });
        }

        if ($scope.my_exam.length>1) {
            baseService.saveExamItem(getParam(),function(e){
                for (var i = 0; i < $scope.my_exam.length; i++) {
                    req_server(getParam($scope.my_exam[i],e,i+1));
                }
            });                            
        }else{
            req_server(getParam($scope.my_exam[0]));
        }        
        var st=setInterval(function(){
            if ($scope.save_cot==$scope.my_exam.length) {
                clearInterval(st);
                notify.advanced("保存成功！");
                $scope.$apply(function () {
                    if (!$scope.is_edit) {
                        $scope.my_exam=[];
                        fn.um.setContent('');
                        $scope.create_item();
                    }else{
                        $state.go('practice.manage');
                    }
                    $scope.save_cot=0;
                });
                
            }
        },300);

        

        //请求后台接口
        function req_server(e) {
            baseService.saveExamItem(e,function(){
                $scope.save_cot++;
            });
        }

        //获得增加修改参数对象
        function getParam(e,d,f) {
            temp={};
            temp.chapterNo=$scope.active_chapter.id;
            if (arguments.length==0) {
                temp.type="insert";
                temp.id='';                
                temp.primaryKind=76;
                temp.description=cot;
                temp.answer='';
                temp.analysis='';
                temp.keyword=keyword;
            }
            else if (arguments.length==1) {
                temp.type=e.id==''?"insert":"update";
                temp.id=e.id; 
                if ($scope.is_edit && oth.stArr.edit_exam_obj.qid==76) {
                    temp.type="insert";
                    temp.id=''; 
                }                     
                temp.primaryKind=e.qid;
                temp.description=cot;
                temp.answer=e.answer;
                temp.analysis=e.analysis;
                temp.keyword=keyword;                          
            }else{
                temp.type="insert";
                temp.id='';
                temp.primaryKind=e.qid;
                temp.description='node';
                temp.answer=e.answer;
                temp.analysis=e.analysis;
                temp.keyword='';                        
                temp.parentId=d;
                temp.mdorder=f;
            }
            return temp;
        }
    }
    //选择教材
    $scope.change_JC = function(){
        getClientData(["tmBook",''],function(){});
    };
    $scope.cacheChapter=function(){
        oth.stArr.Chapter_list=[];
        baseService.getChapter(function(data){
            for (var v = 0; v < data.length; v++) {
                var temp={};
                temp.id="k"+data[v].code;
                temp.ttname=data[v].value;
                temp.is_ttat=false;
                temp.rows=[];
                for (var d = 0; d < data[v].items.length; d++) {                        
                    var rowtemp={};
                    rowtemp.id=data[v].items[d].code;
                    rowtemp.rowname=data[v].items[d].value;
                    rowtemp.is_rowat=false;
                    temp.rows.push(rowtemp);
                }
                oth.stArr.Chapter_list.push(temp);
            }
            $scope.bookName=oth.user.bookName;
            $scope.items=oth.stArr.Chapter_list;
            $scope.active_chapter=oth.stArr.Chapter_list[0].rows[0];
            FlushTree($scope.active_chapter);
        });          
    }

    //跳转
    next_back('试题管理',function(){
        $scope.bcakFn();
    },'');

    //返回试题管理
    $scope.bcakFn = function(){    
        $state.go('practice.manage');
    }; 
});

/************************学案展示-android*************************************/
app.controller('learning',function($scope,baseService,$state){
    if(!oth.stArr.is_scale){
        oth.stArr.is_scale=true;
        $state.go("def",{},{ reload: true });
        return;
    }
    var st_val=setInterval(function(){
        if (window.innerHeight!=0) {
            clearInterval(st_val);            
            FG("#m-bd").css("height",window.innerHeight+"px");       
            baseService.getLschema(function(temp){
                var tags=[];
                for (var i = 0; i < temp.length; i++) {
                    var cot=temp[i].content?temp[i].content["#text"]:"";
                    if (cot!=undefined) {cot=oth.Base64.decode(cot);}
                    else{continue;}

                    tags.push({name:temp[i]["@attributes"].name,cot:cot});
                }
                for (var i = 0; i < tags.length; i++) {
                    var nav_html="<div class='swiper-slide'><h1>"+tags[i].name+"</h1></div>";
                    var cot_html="<div class='swiper-slide'>"+tags[i].cot+"</div>";        
                    FG("#sw-nav").append(nav_html);
                    FG("#sw-cot").append(cot_html);
                }
                var galleryTop = new Swiper('.gallery-top', {
                    spaceBetween: 10,
                    loop:tags.length==1?false:true,
                    loopedSlides: tags.length
                });
                var galleryThumbs = new Swiper('.gallery-thumbs', {
                    spaceBetween: 10,
                    slidesPerView: tags.length>4?4:tags.length,
                    touchRatio: 0.2,
                    loop:tags.length==1?false:true,
                    loopedSlides: tags.length, 
                    slideToClickedSlide: tags.length==1?false:true
                });
                galleryTop.params.control = galleryThumbs;
                galleryThumbs.params.control = galleryTop;
            });               
        }
    },300);

    //停止播放音乐
    $scope.stopFn=function(){
        musicPS();
    }
});

/************************探究主题-android*************************************/
app.controller('show',function($scope){
    FG("#no-msg").html(oth.user.examitem_cot);
    FG("#no-msg").click(function(){
        getClientData(["zoom",""],function(){});
    });
});

/************************试卷列表-android*************************************/
app.controller('paperlist',function($scope,baseService,$state){
    $scope.items=[];
    
    //刷新状态
    $scope.refresh=function(){
        for (var i = 0; i < $scope.items.length; i++) {
            lineFun($scope.items[i]);
        }
    }

    function lineFun(e){
        var param3={paperId:e.id,lclassId:oth.user.lclassId}
        baseService.queryStuExamPaperControl(param3,function(data){
            if(data.length==0){
                e.status=0;
                e.view_status='未开始';                    
            }else{
                if (data[0].row[4].code) {
                    e.status=2;
                    e.view_status='已结束';   
                }else{
                    e.status=1;
                    e.view_status='作答中';   
                } 
            }
        }); 
    }

    var param={"examPaperSchema.schemaId":oth.user.lschemaid,pageNo:-1};
    baseService.queryExamPaper(param,function(data){
        for (var i = 0; i < data.length; i++) {
            $scope.items.push({
                id:data[i].row[0].code
                ,name:data[i].row[3].code
                ,updtime:data[i].row[15].code
                ,qNumber:data[i].row[8].code
                ,score:parseInt(data[i].row[7].code)
                ,status:2
                ,view_status:'已结束'
            });
        }    
        $scope.refresh();
    });

    //回到客户端
    $scope.back=function(){
        getClientData(["back",''],function(){});
    }

    //跳转到练习内容页
    $scope.jump=function(e){
        oth.stArr.examPaper_obj=e;
        if (oth.user.isTeacher) {
            $state.go('exercise');
        }else{
            if (e.status>0) {
                $state.go('answering');
            }else{
                msg("还未开始答题！");
            }
        }
    }

    //缓存小组和学生
    if (oth.stArr.GroupList) {return;}
    oth.stArr.GroupList=[];
    oth.stArr.stuList=[];
    var param={gclusterId:oth.user.groupInstanceId};
    baseService.queryGroup(param,function(data){
        for (var i = 0; i < data.length; i++) {
            oth.stArr.GroupList.push({
                 id:data[i].row[0].code
                ,groupName:data[i].row[1].code
                ,students:[]
                ,is_act:false
            });
        }

        for (var i = 0; i < oth.stArr.GroupList.length; i++) {
            GetStudent(oth.stArr.GroupList[i]);
        }

        //根据小组获取学生
        var bgindex=0;
        function GetStudent(e){
            var param_STU={viewId:'studentGroup',groupId:e.id};
            baseService.queryStuRelation(param_STU,function(result){
                for (var i = 0; i < result.length; i++) {
                    if (bgindex>9) {bgindex=0};
                    var temp={                        
                        id:result[i].row[1].code
                        ,stuName:result[i].row[1].caption
                        ,groupId:e.id
                        ,bg:bgArr[3]
                        ,head:baseService.downHead(result[i].row[1].code)
                        ,is_act:false
                        ,is_submit:false
                        ,asi:undefined
                        ,takeTime:3600
                        ,score:0
                    };
                    e.students.push(temp);
                    oth.stArr.stuList.push(temp);
                    bgindex++;
                }
            });
        }
    });    
});

/************************作答-学生-android*************************************/
app.controller('answering',function($scope,baseService,$state,$sce){
    onresize_fn();
    $scope.myPaper=oth.stArr.examPaper_obj;
    $scope.statusExam=$scope.myPaper.status;
    $scope.items=[];
    $scope.is_submit=true;
    $scope.number76=0;
    $scope.list76=[];
    $scope.cot_score=0;

    pageLoad();
    function pageLoad(){
        var param1={studentId:oth.user.id,lclassId:oth.user.lclassId};
        baseService.queryItemResponse(param1,function(data){
            $scope.is_submit=data=="true"?true:false;     
        });
        var param={viewId:'examItemPaper',"examPaper.id":$scope.myPaper.id};
        baseService.queryExamItemBySelect(param,function(data){
            var bdindex=0;
            for (var i = 0; i < data.length; i++) {
                if (i>10) {bdindex=0};
                var temp={
                    id:data[i].row[0].code,
                    qid:data[i].row[1].code,
                    qname:data[i].row[1].caption,
                    score:parseInt(data[i].row[37].code),
                    view_answer:filter(data[i].row[29].code),
                    answer:data[i].row[29].code,
                    analysis:data[i].row[32].code,
                    myanswer:'',
                    myscore:0,
                    result:0
                }
                temp.qanswer=get_qanswe(temp.qid);

                if(data[i].row[28].code){
                    temp.parentId=data[i].row[28].code;
                    $scope.list76.push(temp); 
                }else{
                    temp.nodes=[];
                    temp.cot=$sce.trustAsHtml(oth.Base64.decode(data[i].row[6].code));
                    temp.bd=bdArr[bdindex];
                    $scope.items.push(temp); 
                }
                bdindex++;
            }

            //挑选复合题子题加入集合
            for (var i = 0; i < $scope.items.length; i++) {
                if($scope.items[i].qid=="76"){
                    sel76($scope.items[i]);
                    $scope.number76++;
                }
            }
            //如果已经提交获取答卷
            getASI();

            function sel76(e){
                for (var i = 0; i < $scope.list76.length; i++) {
                    if(e.id == $scope.list76[i].parentId){
                        e.nodes.push($scope.list76[i]);
                    }
                }
            }

            //过滤判断题
            function filter(e){
                if(e=="0"){
                    return "错误";
                }else if(e=="1"){
                    return "正确";
                }else{
                    return e;
                }
            }

            //获取答卷
            function getASI(){
                var param2={paperId:$scope.myPaper.id,studentId:oth.user.id,lclassId:oth.user.lclassId};
                baseService.queryExamItemResponse(param2,function(data){
                    $scope.is_submit=data.length>0?true:false;
                    for (var i = 0; i < data.length; i++) {
                        var new_score=0;
                        var lev=parseInt(data[i].row[12].code);
                        if (data[i].row[11].code && lev==1) {
                            new_score=parseInt(data[i].row[11].code);
                            $scope.cot_score+=new_score;
                        }
                        analyticASI(data[i].row[1].code,filter(data[i].row[8].code),
                            new_score,lev);
                    }
                });
            }       

            //解析答卷
            function analyticASI(e,d,s,l){
                var b=false;
                for (var i = 0; i < $scope.items.length; i++) {
                    if (b) {break;}
                    if($scope.items[i].qid=="76"){
                        for (var j = 0; j < $scope.items[i].nodes.length; j++) {
                            setobj($scope.items[i].nodes[j]);
                        }
                    }else{
                        setobj($scope.items[i]);
                    }
                }
                function setobj(f){
                    if (f.id==e) {
                        if(f.qid==75){f.myanswer=oth.Base64.decode(d);}
                        else{f.myanswer=d;}
                        f.result=l;
                        if (l==1) { f.myscore=s;}
                        else{ f.myscore=0;}
                        b=true;
                    }
                }
            }    
        });               
    }

    //根据题型，生成不同的答案对象
    function get_qanswe(qid){
        var temp=[];
        if (qid==70 || qid==71) {
            temp.push({name:"A",is_at:false});
            temp.push({name:"B",is_at:false});
            temp.push({name:"C",is_at:false});
            temp.push({name:"D",is_at:false});                  
        }
        else if (qid==72) {
            temp.push({name:"1",is_at:false});
            temp.push({name:"0",is_at:false});
        }
        return temp;
    }

    //单选按钮事件
    $scope.sel_radio=function(e,v){
        for (var i = 0; i < v.qanswer.length; i++) {
            v.qanswer[i].is_at=false;
        }
        e.is_at=true;
        v.myanswer=e.name;
    }

    //多选按钮事件
    $scope.sel_checkbox=function(e,v){
        e.is_at=!e.is_at;
        var temp="";
        for (var i = 0; i < v.qanswer.length; i++) {
            if (v.qanswer[i].is_at) {
                temp+=v.qanswer[i].name;
            }
        }
        v.myanswer=temp;        
    }

    //调用客户端画板
    $scope.open_sketchpad=function(e){
        oth.stArr.exam75_obj=e;
        getClientData(["sketchpad",''],function(){});
    }

    //放大解答图片
    $scope.maxImg=function(e){
        imgBox.set(e.myanswer);
    }

    //提交
    $scope.submitFn=function(){
        var str='<data viewId="examItemResponse">';
        baseService.queryStuExamPaperControl({paperId:$scope.myPaper.id,lclassId:oth.user.lclassId},function(data){
            var status=0;
            if(data.length==0){
                status=0;               
            }else{
                if (data[0].row[4].code) {
                    status=2;
                }else{
                    status=1;
                } 
            }
            if (status==2) {
                msg('作答结束，无法提交！');
                return;
            }    
            notify.open();
            for (var i = 0; i < $scope.items.length; i++) {
                if($scope.items[i].qid=="76"){
                    for (var j = 0; j < $scope.items[i].nodes.length; j++) {
                        getRow($scope.items[i].nodes[j]);
                        contrastsAnswer($scope.items[i].nodes[j]);
                    }
                }
                else{
                    getRow($scope.items[i]);
                    contrastsAnswer($scope.items[i]);
                }
            }
            str+='</data>';
            var param={dataContent:str};
            baseService.submitItemResponse(param,function(){
                var param1={paperId:$scope.myPaper.id,studentId:oth.user.id,lclassId:oth.user.lclassId};
                baseService.submitPaperResponse(param1,function(data){
                    $scope.is_submit=true;
                    notify.advanced("提交成功！");                
                    getClientData(["submitPaper",''],function(){});
                });
            });              
        }); 
        //拼接字符串
        function getRow(e){
            var myanswer=e.myanswer
            var temp='0';
            if(e.qid==75){
                var temp='1';
                myanswer=oth.Base64.encode(e.myanswer);
            }
            str+='<row>';
            str+='<field name="examId">'+e.id+'</field>';
            str+='<field name="lclassId">'+oth.user.lclassId+'</field>';
            str+='<field name="examObjType">'+temp+'</field>';
            str+='<field name="paperId">'+$scope.myPaper.id+'</field>';
            str+='<field name="studentId">'+oth.user.id+'</field>';
            str+='<field name="responseContent">'+myanswer+'</field>';
            str+='</row>';            
        }     

        //对比答案
        function contrastsAnswer(e){
            if (e.qid=="75") {return;}

            if (e.answer==e.myanswer) {
                e.result=1;
                e.myscore=e.score;
                $scope.cot_score+=e.score;
            }else{
                e.result=2;
            }
        }
    }

    //跳转到练习列表
    $scope.jump=function(e){
        $state.go('paperlist');
    }
});

/************************表扬批评-android*************************************/
app.controller('teacherPraise',function($scope,baseService,$state){
    $scope.items=[];
    baseService.queryUser({pageSize:100,pageNo:-1},function(data){
        for (var i = 0; i < data.length; i++) {
            var tempId=data[i].row[0].code;
            $scope.items.push({
                 id:tempId
                ,name:data[i].row[1].code
                ,studentNo:data[i].row[20].code
                ,praiseCount:data[i].row[24].code
                ,criticCount:data[i].row[25].code
                ,isMake:oth.user.id==tempId?true:false
            });
        }
    });
});

/************************练习-教师-android*************************************/
app.controller('exercise_def',function($scope,baseService,$state){
    onresize_fn();
    $scope.paperName=oth.stArr.examPaper_obj.name;
    $scope.navItem=[
         {name:'发布试题',url:'exercise.home',is_active:true}
        ,{name:'个人详情',url:'exercise.info',is_active:false}
        ,{name:'查看统计',url:'exercise.statistics',is_active:false}
    ];
    $scope.nav_active=$scope.navItem[0];

    //导航跳转
    $scope.navClick=function(e){
        $scope.nav_active.is_active=false;
        e.is_active=true;
        $scope.nav_active=e;
        $state.go(e.url);
    }

    //跳转到练习列表
    $scope.jump=function(e){
        $state.go('paperlist');
    }

    $state.go('exercise.home');
})
.controller('exercise_home',function($scope,baseService,$state,$sce){
    FG("#bg_img").className("img_bg-pos11");
    var h=window.innerHeight-135;
    FG(".g-ctl,.g-ctr").css("height",h+"px");
    $scope.items=[];
    $scope.list76=[];    
    $scope.myPaper=oth.stArr.examPaper_obj;
    $scope.stuList=oth.stArr.stuList;
    $scope.submit_cot=0;
    $scope.statusExam=0;
    //刷新数据
    $scope.refresh=function(id){    
         GetSub();
         GetScade();
    }

    page_load();
    function page_load(){
        var param={viewId:'examItemPaper',"examPaper.id":$scope.myPaper.id};
        baseService.queryExamItemBySelect(param,function(data){
            var bdindex=0;
            for (var i = 0; i < data.length; i++) {
                if (i>10) {bdindex=0};
                var temp={
                    id:data[i].row[0].code,
                    qid:data[i].row[1].code,
                    score:data[i].row[37].code,
                    qname:data[i].row[1].caption,
                    answer:filter(data[i].row[29].code),
                    analysis:data[i].row[32].code,
                    myanswer:'',
                    myscore:0,
                    result:0,
                    scale:0
                }
                if(data[i].row[28].code){
                    temp.parentId=data[i].row[28].code;
                    $scope.list76.push(temp); 
                }else{
                    temp.nodes=[];
                    temp.is_answer=false;
                    temp.cot=$sce.trustAsHtml(oth.Base64.decode(data[i].row[6].code));
                    temp.bd=bdArr[bdindex];
                    $scope.items.push(temp); 
                }
                bdindex++;
            }

            //挑选复合题子题加入集合
            for (var i = 0; i < $scope.items.length; i++) {
                if($scope.items[i].qid=="76"){
                    sel76($scope.items[i]);
                }
            }
            function sel76(e){
                for (var i = 0; i < $scope.list76.length; i++) {
                    if(e.id == $scope.list76[i].parentId){
                        e.nodes.push($scope.list76[i]);
                    }
                }
            }

            //过滤判断题
            function filter(e){
                if(e=="0"){
                    return "错误";
                }else if(e=="1"){
                    return "正确";
                }else{
                    return e;
                }
            }     

            GetScade();

            //缓存试题列表内容
            oth.stArr.examList=$scope.items;
        });

        GetSub();

        //试卷答题状态
        var param3={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId}
        baseService.queryStuExamPaperControl(param3,function(data){
            if(data.length==0){
                $scope.statusExam=0;
            }else{
                if (data[0].row[4].code) {
                    $scope.statusExam=2;
                }else{$scope.statusExam=1;} 
            }
        }); 
    }

    //提交数
    function GetSub(){
        var param2={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId}
        baseService.queryStuExamPaperResult(param2,function(data){
            for (var i = 0; i < data.length; i++) {
                if (data[i].row[0].code) {$scope.submit_cot++;}
            }
        });          
    }
    
    //单个试题的答题统计
    function GetScade(){
        for (var i = 0; i < $scope.items.length; i++) {
            if($scope.items[i].qid=="76"){
                for (var j = 0; j < $scope.items[i].nodes.length; j++) {
                    inlineFn($scope.items[i].nodes[j]);
                }
            }else{
                inlineFn($scope.items[i]);
            }
        }

        function inlineFn(e){
            var param={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId,examId:e.id}
            baseService.queryExamItemResponse(param,function(data){
                var temp=0;
                for (var i = 0; i < data.length; i++) {
                    if(parseInt(data[i].row[12].code)==1){
                        temp++;
                    }
                }
                e.scale=parseInt(temp/$scope.stuList.length*100);
            });              
        }           
    }

    //停止和开始答题
    $scope.mainFn=function(){
        var temp=$scope.statusExam==0?'startExam':'stopExam';
        var param={kind:temp,lclassId:oth.user.lclassId,paperId:oth.stArr.examPaper_obj.id}
        baseService.saveLearnClass(param,function(){
            $scope.statusExam++;
            getClientData(["statusExam",''],function(){});
        });
    };

    //批注
    $scope.commentFn=function(){
        getClientData(["comment",''],function(){});
    }

    //显示隐藏答案和解析
    $scope.answerFn=function(e){
        e.is_answer=!e.is_answer;
    }
})
.controller('exercise_rank',function($scope,baseService,$state){
    FG("#bg_img").className("img_bg-pos12");
    var h=window.innerHeight-135;
    FG("#g-rank").css("height",h+"px");
    $scope.items=[];

    pageLoad();
    function pageLoad(){
        //排行榜
        var param={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId,pageNo:-1}
        baseService.queryStuExamPaperResult(param,function(data){
            for (var i = 0; i < data.length; i++) {
                var b=false;
                if (data[i].row[0].code) {b=true;}
                $scope.items.push({
                     id:data[i].row[2].code
                    ,stuName:data[i].row[2].caption
                    ,head:baseService.downHead(data[i].row[2].code)
                    ,state:b
                    ,bg:bgArr[4]
                });
            }

            // var str='';
            // for (var i = 0; i < $scope.items.length; i++) {
            //     var margin="margin: 4px 4px 25px 4px;"
            //     var className='hexagon';
            //     if($scope.items[i].state){className='hexagon1';}
            //     if(i==10 || i==30 || i==40){
            //         margin="margin: 4px 4px 25px 58px;"
            //     }
            //     if(i%10==0 && i>9){
            //         str+="<br>";
            //     }
            //     str+='<div class="m-rank6" style="'+margin+'"><div class="'+className+'">'+$scope.items[i].stuName+'</div></div>';
            // }
            // FG("#m-rank-bd").append(str);

        });         
    }

    //刷新
    $scope.refresh=function(id){   
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id==id) {
                $scope.items[i].state=true;
                $scope.$apply();
            }
        }   
    }
})
.controller('exercise_info',function($scope,baseService,$state){
    FG("#bg_img").className("img_bg-pos13");
    var h=window.innerHeight-135;
    FG(".g-lv,.g-rv").css("height",h+"px");
    $scope.ASIlist=oth.stArr.examList;
    $scope.stuList=oth.stArr.stuList;
    $scope.submit_cot=0;
    $scope.objAct=undefined;
    $scope.cot_score=0;

    pageLoad();
    function pageLoad(){
        //清理其他页面的选中状态
        for (var i = 0; i < $scope.stuList.length; i++) {
            $scope.stuList[i].is_act=false;
            $scope.stuList[i].is_submit=false;
        }

        //提交人数
        var param={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId}
        baseService.queryStuExamPaperResult(param,function(data){
            for (var i = 0; i < data.length; i++) {
                if (data[i].row[0].code) {
                    $scope.submit_cot++;
                    var id=data[i].row[2].code;
                    var takeTime=data[i].row[7].code;
                    var score=data[i].row[4].code;
                    for (var j = 0; j < $scope.stuList.length; j++) {
                        if(id==$scope.stuList[j].id){
                            $scope.stuList[j].is_submit=true;
                            $scope.stuList[j].takeTime=takeTime;
                            $scope.stuList[j].score=score;
                            break;
                        }
                    }
                }
            }

            //排序
            $scope.stuList.sort(function(a,b){
                return a.takeTime-b.takeTime;
            });
            $scope.stuList.sort(function(a,b){
                return b.score-a.score;
            });

            if ($scope.stuList[0].is_submit) {
                $scope.stuList[0].is_act=true;
                $scope.objAct=$scope.stuList[0];
                $scope.getASI($scope.stuList[0]);
            }
            $scope.stuList.forEach(function(e) {
                var tt=parseInt(e.takeTime);
                var m=parseInt(tt/60);
                var s=tt%60;
                e.takeTime=m+" 分 "+s+" 秒 ";
            });
        });       
    }

    //根据学生获取试卷
    $scope.getASI=function(e){
        if (!e.is_submit) {return;}
        $scope.objAct.is_act=false;
        e.is_act=true;
        $scope.objAct=e;
        $scope.cot_score=0;

        if(e.asi){
            analyticASI(e.asi); 
        }else{
            var param2={paperId:oth.stArr.examPaper_obj.id,studentId:e.id,lclassId:oth.user.lclassId};
            baseService.queryExamItemResponse(param2,function(data){
                e.asi=data;
                analyticASI(e.asi); 
            });            
        } 

        //解析答卷
        function analyticASI(data){
            for (var i = 0; i < data.length; i++) {
                var new_score=0;
                var lev=parseInt(data[i].row[12].code);
                if (data[i].row[11].code && lev==1) {
                    new_score=parseInt(data[i].row[11].code);
                    $scope.cot_score+=new_score;
                }
                analyticExam(data[i].row[1].code,filter(data[i].row[8].code),
                    new_score,lev);
            }

            
            function analyticExam(e,d,s,l){
                var b=false;
                for (var i = 0; i < $scope.ASIlist.length; i++) {
                    if (b) {break;}
                    if($scope.ASIlist[i].qid=="76"){
                        for (var j = 0; j < $scope.ASIlist[i].nodes.length; j++) {
                            setobj($scope.ASIlist[i].nodes[j]);
                        }
                    }else{
                        setobj($scope.ASIlist[i]);
                    }
                }
                function setobj(f){
                    if (f.id==e) {
                        if(f.qid==75){f.myanswer=oth.Base64.decode(d);}
                        else{f.myanswer=d;}
                        f.result=l;
                        if (l==1) { f.myscore=s;}
                        else{ f.myscore=0;}
                        b=true;
                    }
                }
            }                         
        }

        //过滤判断题
        function filter(e){
            if(e=="0"){
                return "错误";
            }else if(e=="1"){
                return "正确";
            }else{
                return e;
            }
        }
              
    }

    //刷新
    $scope.refresh=function(id){
        for (var i = 0; i < $scope.stuList.length; i++) {
            if ($scope.stuList[i].id==id) {
                $scope.stuList[i].is_submit=true;
                $scope.$apply();
            }
        }
        var nb=0;
        $scope.stuList.forEach(function(e) {
            if(e.is_submit){nb++;}
        });
        $scope.submit_cot=nb;
    }

    //放大图片
    $scope.maxImg=function(e){
        imgBox.set(e.myanswer);
    }
})
.controller('exercise_statistics',function($scope,baseService,$state){
    FG("#bg_img").className("img_bg-pos14");
    var h=window.innerHeight-135;
    FG("#chartv").css("height",(h-100)+"px");
    var option = {
        title: {
            text: '正确率统计图',
            subtext: oth.stArr.examPaper_obj.name
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        toolbox: {
            show: true,
            feature: {
                magicType: {type: ['line', 'bar']}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['一','二','三','四','五','六','日']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            }
        },
        series: []
    };
    var myChart = echarts.init(document.getElementById('chartv'));
    $scope.stuList=oth.stArr.stuList;
    $scope.mod=[];
    $scope.actObj=undefined;

    page_load();
    function page_load(){
        //清理其他页面的选中状态
        for (var i = 0; i < $scope.stuList.length; i++) {
            $scope.stuList[i].is_act=false;
            $scope.stuList[i].is_submit=false;
        }

        //默认显示全班数据
        var xAxis_data=[],series_data=[],mkdata=[];
        for (var i = 0; i < oth.stArr.examList.length; i++) {
            if(oth.stArr.examList[i].qid=="76"){
                for (var j = 0; j < oth.stArr.examList[i].nodes.length; j++) {
                    setXYP((i+1)+"."+(j+1),oth.stArr.examList[i].nodes[j]);
                }
            }else{
                setXYP((i+1),oth.stArr.examList[i]);
            }
        }
        function setXYP(d,e){
            var xval=d+e.qname;
            var yval=e.scale;
            xAxis_data.push(xval);
            series_data.push(yval);
            mkdata.push({
                name: '正确率', value: yval, xAxis: xval, yAxis: yval
            });
            $scope.mod.push({id:e.id,xAxis:xval,yAxis:0});
        }
        option.xAxis.data=xAxis_data;
        addLine('全班',series_data,mkdata,'#D50000');

        //提交人数
        var param={paperId:oth.stArr.examPaper_obj.id,lclassId:oth.user.lclassId}
        baseService.queryStuExamPaperResult(param,function(data){
            for (var i = 0; i < data.length; i++) {
                if (data[i].row[0].code) {
                    var id=data[i].row[2].code;
                    for (var j = 0; j < $scope.stuList.length; j++) {
                        if(id==$scope.stuList[j].id){
                            $scope.stuList[j].is_submit=true;
                            break;
                        }
                    }
                }
            }
        });
    }

    //添加图表数据
    function addLine(name,data,mkdata,c_value){
        option.legend.data.push(name);
        option.series.push({
            name:name,
            type:'line',
            data:data,
            markPoint: {
                data: mkdata
            },
            itemStyle: {
                normal: {
                    color: c_value,
                }
            }
        });
        myChart.setOption(option); 
    }

    //删除图表数据
    function delLine(key,t){
        for (var i = 0; i < option.legend.data.length; i++) {
            if(key==option.legend.data[i]){
                option.legend.data.remove(i);
                break;
            }
        }
        for (var i = 0; i < option.series.length; i++) {
            if(key==option.series[i].name){
                option.series.remove(i);
                break;
            }
        }     
        if(t){return;}
        myChart.clear();              
        myChart.setOption(option);       
    }

    //学生点击事件
    $scope.stuFn=function(e){
        if(!e.is_submit){return;}
        e.is_act=!e.is_act;

        //取消选中删除图例信息
        if(!e.is_act){
            $scope.actObj=undefined;
            delLine(e.stuName);
            return;
        }else{
            if($scope.actObj){
                $scope.actObj.is_act=false;
                delLine($scope.actObj.stuName,false);
            }
            $scope.actObj=e;
        }

        //已经有答卷直接解析不请求
        if(e.asi){
            analyticASI(e.asi); 
        }else{
            var param2={paperId:oth.stArr.examPaper_obj.id,studentId:e.id,lclassId:oth.user.lclassId};
            baseService.queryExamItemResponse(param2,function(data){
                e.asi=data;
                analyticASI(e.asi); 
            });            
        } 

        //解析答卷
        function analyticASI(data){
            for (var i = 0; i < data.length; i++) {
                var lev=parseInt(data[i].row[12].code)==1?100:0;
                var id=data[i].row[1].code;
                analyticExam(id,lev);
            }
            function analyticExam(id,lev){
                for (var i = 0; i < $scope.mod.length; i++) {
                    if ($scope.mod[i].id==id) {
                        $scope.mod[i].yAxis=lev;
                        break;
                    }
                }
            }

            var series_data=[];
            for (var i = 0; i < $scope.mod.length; i++) {
                series_data.push($scope.mod[i].yAxis);
            }

            addLine(e.stuName,series_data,[],'#00FF00');          
        }        
    }
});