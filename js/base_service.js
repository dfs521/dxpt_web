var service_baseUrl="http://"+window.location.host+"/glp/";                   
var service_downResFile="res/comn/downResFile.action?";                        
var service_getPracticeList="res/examItem/queryExamPaper.action?";            
var service_getQueryChapter="res/std/queryChapter.action?";                    
var service_saveExamItem="res/examItem/saveExamItem.action?"; 
var service_getExamKind="comn/code/getCode.action?"; 
var service_saveExamPaper="res/examItem/saveExamPaper.action?"; 
var service_saveExamPaperItem="res/examItem/saveExamPaperItem.action?"; 
var service_saveExamPapersSchema="res/examPaperSchema/saveExamPaperSchema.action?"; 
var service_queryExamPapersSchema="res/lschema/querySchema.action?"; 
var service_queryExamPaper="res/examItem/queryExamPaper.action?"; 
var service_queryExamItem="res/examItem/queryExamItem.action?"; 
var service_querySchema="res/lschema/querySchema.action?"; 
var service_queryGroup="comn/queryGroup.action?";
var service_queryStuRelation="comn/queryStuRelation.action?";
var service_saveExamItemResponse="study/saveExamItemResponse.action?";
var service_queryLearnClass='study/tea/queryLearnClass.action?';
var service_saveLearnClass='study/tea/saveLearnClass.action?';
var service_queryExamItemResponse='study/queryExamItemResponse.action?';
var service_queryStuExamPaperResult='study/stu/queryStuExamPaperResult.action?';
var service_queryUser='priv/queryUser.action?';
var queryStuExamPaperControl='/study/stu/queryStuExamPaperControl.action?';
 

app.service('req',function($http){       
    this.get=function(apistr,par,back,cache){
        var new_par=par;
        var is_cache=cache?true:false;
        $http.get(service_baseUrl+apistr, {params:new_par,cache:is_cache}).success(function(data) {
            back(data);
            return;
        }).error(function(data) {msg("网络故障："+apistr+":"+data);});
    }
})
.service('baseService',function(req){ 
    var base_service=this;

    //查询试卷的答题状态
    this.queryStuExamPaperControl=function(param,back){
      set_user(param);
      req.get(queryStuExamPaperControl,param,function(data){
           if(data.Result.ReturnFlag==0){
            back(data.Result.Data.result.rows);
          }
           else{ msg(data.Result.ReturnInfo);}
          return;
      }); 
    }

    //查询用户信息
    this.queryUser=function(param,back){
      param.classId=oth.user.classId;
      param.viewId='studentClass';
      param.filterFlag=true;
      
      set_user(param);
      req.get(service_queryUser,param,function(data){
           if(data.Result.ReturnFlag==0){
            back(data.Result.Data.result.rows);
          }
           else{ msg(data.Result.ReturnInfo);}
          return;
      }); 
    }

    //排行榜查询
    this.queryStuExamPaperResult=function(param,back){
      param.kind='queryBoard';
      param.filterFlag=true;
      set_user(param);
      req.get(service_queryStuExamPaperResult,param,function(data){
           if(data.Result.ReturnFlag==0){
            back(data.Result.Data.result.rows);
          }
           else{ msg(data.Result.ReturnInfo);}
          return;
      }); 
    }

    //试卷答题开始和结束
    this.saveLearnClass=function(param,back){
      set_user(param);
      req.get(service_saveLearnClass,param,function(data){
           if(data.Result.ReturnFlag==0){back();}
           else{ msg(data.Result.ReturnInfo);}
          return;
      }); 
    }

    //查询答卷
    this.queryExamItemResponse=function(param,back){
      set_user(param);
      req.get(service_queryExamItemResponse,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
             back(data.Result.Data.result.rows);
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      }); 
    }    
    
    //获得课堂信息
    this.queryLearnClass=function(back){
      var param={
        classId:oth.user.classId,
        lschemaId:oth.user.lschemaid,
        pageNo:-1
      };
      set_user(param);
      req.get(service_queryLearnClass,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
             var temp=data.Result.Data.result.rows[0];
             if (temp.row[13].code) {
                oth.stArr.statusExam=2;
             }else if(temp.row[12].code){
                oth.stArr.statusExam=1;
             }else{oth.stArr.statusExam=0;} 
             back();
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      }); 
    }

    //查询学生是否提交过试卷
    this.queryItemResponse=function(param,back){
      param.kind='isCheckStudent';
      set_user(param);
      req.get(service_saveExamItemResponse,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
               back(data.Result.Data.checkStudent);
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      });   
    }

    //提交试题
    this.submitItemResponse=function(param,back){
      param.kind='insert';
      param.commit=false;
      set_user(param);
      req.get(service_saveExamItemResponse,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
               back();
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      });             
    }

    //提交试卷
    this.submitPaperResponse=function(param,back){
      param.kind='checkStudent';
      set_user(param);
      req.get(service_saveExamItemResponse,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
               back();
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      });   
    }    

    //查询小组
    this.queryGroup=function(param,back){
      set_user(param);
      req.get(service_queryGroup,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
              back(data.Result.Data.result.rows);
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      },true);   
    }

    //查询学生
    this.queryStuRelation=function(param,back){
      set_user(param);
      req.get(service_queryStuRelation,param,function(data){
          if(data.Result.ReturnFlag==0)
           {
              if(data.Result.Data){
                back(data.Result.Data.result.rows);
              }
           }
           else{msg(data.Result.ReturnInfo); }
          return;
      },true);  
    }

    //下载头像
    this.downHead=function(userid){
      return service_baseUrl+"priv/downUserFile.action?viewId=student&loginName=wangm&pwd=123456&userId="+userid;
    }

    //查询章节信息
    this.getChapter=function(back){
      var param={kind:"code",includeSubs:true,codeId:oth.user.bookId};
      set_user(param);
      req.get(service_getQueryChapter,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
              back(data.Result.Data.options);
           }
           else
           {
              msg(data.Result.ReturnInfo);
             
           }
          return;
      });    
    }

    //查询学案列表
    this.querySchema=function(param,back){ 
        set_user(param);
        req.get(service_querySchema,param,function(data){
            if(data.Result.ReturnFlag==0)
             {
                if(data.Result.Data){
                  back(data.Result.Data.result.total,data.Result.Data.result.rows);
                }
             }
             else{msg(data.Result.ReturnInfo); }
            return;
        });    
    }

    //下载学案
    this.getLschema=function(back){
        var param={type:1,rid:oth.user.lschemaid};
        set_user(param);
        req.get(service_downResFile,param,function(data){
            var objson = oth.XMLtoJSON(data);
            var temp=objson.lschema.step[0].step;
            back(temp);
            return;
        },true);    
    }

    // 获取试题类型
    this.getExamKind=function(back){
        var param={kind:'code',hierId:"200300000000000000000000000000000000",codeId:0};
        set_user(param);
        req.get(service_getExamKind,param,function(data){
             if(data.Result.ReturnFlag==0)
             {
                back(data.Result.Data.options);
             }
             else
             {
                msg(data.Result.ReturnInfo);
             }
            return;
        });    
    }

    //保存试题 type值确定是插入\更新\删除\
    this.saveExamItem=function(param,back){ 
        var dataContent=getExamItemData(param);
        var params={kind:param.type,dataContent:dataContent};
        set_user(params);
        req.get(service_saveExamItem,params,function(data){
            if(data.Result.ReturnFlag==0)
            {
                if(data.Result.Data){
                    back(data.Result.Data.id);
                }
                else{back("ok");}
            }
            else{msg(data.Result.ReturnInfo); }
            return;
        });

        //拼接字符串
        function getExamItemData(examItem){
            var examItemData='<data viewId="examItem">';
                examItemData+='<row id="'+examItem.id+'">';            
                if (examItem.type!="delete") {
                    examItemData+='<field name="primaryKind">'+examItem.primaryKind+'</field>';
                    examItemData+='<field name="name">'+examItem.name+'</field>';
                    examItemData+='<field name="shareStatus">0</field>';
                    examItemData+='<field name="secondKind">0</field>';
                    examItemData+='<field name="gradeNo">'+oth.user.gradeNo+'</field>';
                    examItemData+='<field name="subjectNo">'+oth.user.subjectNo+'</field>';
                    examItemData+='<field name="volumeNo">'+oth.user.volumeNo+'</field>';
                    examItemData+='<field name="pressNo">'+oth.user.pressNo+'</field>';
                    examItemData+='<field name="chapterNo">'+examItem.chapterNo+'</field>';
                    examItemData+='<field name="createId">'+oth.user.id+'</field>';
                    examItemData+='<field name="description">'+examItem.description+'</field>';
                    examItemData+='<field name="answer">'+examItem.answer+'</field>';
                    examItemData+='<field name="analysis">'+examItem.analysis+'</field>';
                    examItemData+='<field name="keyword">'+examItem.keyword+'</field>';
                    examItemData+='<field name="isVisual">0</field>';
                    examItemData+='<field name="auditStatus">0</field>';  
                }
                if (examItem.parentId) {
                    examItemData+='<field name="parentId">'+examItem.parentId+'</field>';
                    examItemData+='<field name="mdorder">'+examItem.mdorder+'</field>';     
                }
                examItemData+='</row>';
                examItemData+='</data>';                            
                return examItemData;
        }
    }    

     //查询试题
    this.queryExamItemBySelect=function(param,back){ 
        set_user(param);           
        req.get(service_queryExamItem,param,function(data){
            if(data.Result.ReturnFlag==0)
            {
                if(data.Result.Data){
                    back(data.Result.Data.result.rows,data.Result.Data.result.total);                    
                }else{
                    back([],data.Result.Data.result.total);
                }
            }
            else{msg(data.Result.ReturnInfo);}
            return;
        });    
    }

    //保存试卷 kind值确定是插入\更新\删除\
    this.saveExamPaper=function(param,back){ 
        param.dataContent=getExamPaperData(param);
        set_user(param);
        req.get(service_saveExamPaper,param,function(data){
          if(data.Result.ReturnFlag==0)
          {
            if(data.Result.Data){back(data.Result.Data.id);}
            else{back("ok");}
          }
          else{msg(data.Result.ReturnInfo);}
          return;
        });

        //拼接字符串
        function getExamPaperData(examPaperTemp){
          var examPaperData='<data viewId="examPaper">';
            if (examPaperTemp.kind=='delete') {
              examPaperData+='<row id="'+examPaperTemp.id+'">';
            }else{
              examPaperData+='<row>';
              examPaperData+='<field name="levelKind">0</field>';
              examPaperData+='<field name="paperKind">1</field>';
              examPaperData+='<field name="name">'+examPaperTemp.name+'</field>';
              examPaperData+='<field name="description">'+examPaperTemp.description+'</field>';
              examPaperData+='<field name="score">'+examPaperTemp.score+'</field>';
              examPaperData+='<field name="mdorder">'+examPaperTemp.mdorder+'</field>';
              examPaperData+='<field name="gradeNo">'+oth.user.gradeNo+'</field>';
              examPaperData+='<field name="subjectNo">'+oth.user.subjectNo+'</field>';
              examPaperData+='<field name="volumeNo">'+oth.user.volumeNo+'</field>';
              examPaperData+='<field name="pressNo">'+oth.user.pressNo+'</field>';
              examPaperData+='<field name="chapterNo">'+examPaperTemp.chapterNo+'</field>';  
              examPaperData+='<field name="masterId">'+oth.user.id+'</field>';  
            }
            examPaperData+='</row>';
            examPaperData+='</data>';
            return examPaperData;
        }           
    }

    //将试题插入试卷  
    this.saveExamPaperItem=function(param,back){ 
      param.dataContent=getExamPaperItemData(param);
      set_user(param);
      req.get(service_saveExamPaperItem,param,function(data){
           if(data.Result.ReturnFlag==0)
           {
              if(data.Result.Data){
                back(data.Result.Data);
              }else{
                back("ok");
              }
           }
           else
           {
              msg(data.Result.ReturnInfo);
           }
          return;
      }); 

      //拼接字符串
      function getExamPaperItemData(examPaperItemTemp){
        var examPaperItemData='<data viewId="examPaperItem">';
        if (examPaperItemTemp.kind=="delete") {
          examPaperItemData+='<row>';
          examPaperItemData+='<field name="paperId">'+examPaperItemTemp.paperId+'</field>';
          examPaperItemData+='<field name="itemId">'+examPaperItemTemp.itemId+'</field>';
        }
        else{
          examPaperItemData+='<row>';
          examPaperItemData+='<field name="itemId">'+examPaperItemTemp.itemId+'</field>';
          if(examPaperItemTemp.parentId){
              examPaperItemData+='<field name="parentId">'+examPaperItemTemp.parentId+'</field>';
          }else{
              examPaperItemData+='<field name="parentId">null</field>';
          }
          examPaperItemData+='<field name="paperId">'+examPaperItemTemp.paperId+'</field>';
          examPaperItemData+='<field name="score">'+examPaperItemTemp.score+'</field>';
          examPaperItemData+='<field name="mdorder">'+examPaperItemTemp.mdorder+'</field>';
        }   
        examPaperItemData+='</row>';
        examPaperItemData+='</data>';
        return examPaperItemData;
      }         
    }

     //查询试卷
    this.queryExamPaper=function(param,back){ 
        set_user(param);
        req.get(service_queryExamPaper,param,function(data){
            if(data.Result.ReturnFlag==0)
             {
                if(data.Result.Data){
                    back(data.Result.Data.result.rows,data.Result.Data.result.total);                    
                }else{
                    back([],data.Result.Data.result.total);
                }
             }
             else
             {
                msg(data.Result.ReturnInfo);
             }
            return;
        });    
    }  
    
    //将试卷和学案关联   删除关联type为delete 传入试卷id
    this.saveExamPaperSchemaData=function(param,back){ 
        if (param.kind=='insert') {param.dataContent=getExamPaperSchemaData(param);}
        set_user(param);
        req.get(service_saveExamPapersSchema,param,function(data){
             if(data.Result.ReturnFlag==0)
             {
              if(data.Result.Data){
                back(data.Result.Data);
              }
              else{back("ok");}
             }
             else
             {
                msg(data.Result.ReturnInfo);
             }
            return;
        }); 
        function getExamPaperSchemaData(examPaperSchemaTemp){
          var examPaperSchemaData='<data viewId="examPaperSchema">';
          examPaperSchemaData+='<row>';
          examPaperSchemaData+='<field name="schemaId">'+examPaperSchemaTemp.schemaId+'</field>';
          examPaperSchemaData+='<field name="createId">'+oth.user.id+'</field>';
          examPaperSchemaData+='<field name="paperId">'+examPaperSchemaTemp.paperId+'</field>';  
          examPaperSchemaData+='</row>';
          examPaperSchemaData+='</data>';
          return examPaperSchemaData;
        }           
    }

     //查询和试卷关联的学案  
    this.queryExamPapersSchema=function(param,back){ 
        set_user(param);
        req.get(service_queryExamPapersSchema,param,function(data){
            if(data.Result.ReturnFlag==0)
             {
                back(data.Result.Data.options);
             }
             else
             {
                msg(data.Result.ReturnInfo);
             }
            return;
        });    
    }      

    //设置登陆用户信息
    function set_user(e){
//        e.clientsession=oth.user.ssid;
        e.loginName='wangm';
        e.pwd='123456';
    }

    this.fuckWF=function(param,back){
        alert("1234444");
        back();
    }
});

