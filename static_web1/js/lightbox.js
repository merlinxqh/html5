/**
 * Created by Administrator on 2015/8/7.
 */
//封装LightBox类
;(function($){

  var LightBox=function(settings){
      var self=this;
      this.settings={
          speed:500,
          scale:1
      };
      $.extend(this.settings,settings || {});
      //保存body
      this.bodyNode=$(document.body);
      //创建遮罩层 和 弹出层
      this.pupupMask=$('<div id="G-lightbox-mask">');
      this.pupupWin=$('<div id="G-lightbox-popup">');

      //渲染剩余的dom 并且插入到body
      this.readDom();

      this.pupupViewArea=this.pupupWin.find("div.lightbox-pic-view");//图片预览区域
      this.pupupPic=this.pupupWin.find("img.lightbox-image");//图片
      this.picCaptionArea=this.pupupWin.find("div.lightbox-pic-caption");//图片描述区域
      this.nextBtn=this.pupupWin.find("span.lightbox-next-btn");
      this.prevBtn=this.pupupWin.find("span.lightbox-prev-btn");

      this.captionText=this.pupupWin.find("p.lightbox-pic-desc");//图片标题内容

      this.currentIndex=this.pupupWin.find("span.lightbox-of-index");//图片当前索引
      this.closeBtn=this.pupupWin.find("span.lightbox-close-btn");//关闭按钮

      this.groupName=null;
      //存放当前组对象
      this.groupList=[];
      this.flag=true;//防止重复点击向上向下切换按钮
      //准备开发事件委托  获取组数据
      this.bodyNode.delegate(".js-lightbox,*[data-role='lightbox']","click",function(e){
             //阻止事件冒泡 影响别人在div上可能添加的事件
          e.stopPropagation();
          var currentGroupName=$(this).attr("data-group");
          if(currentGroupName != self.groupName){
              self.groupName=currentGroupName;
              //获取同一组数据
              self.getGroup();
          }
          self.initPupup($(this));
      });

      //添加 点击遮罩层 关闭 弹出 以及遮罩层 方法
      this.pupupMask.click(function(){
          self.pupupMask.fadeOut();
          self.pupupWin.fadeOut();
          self.autoSize=false;
      });
      this.closeBtn.click(function(){
          self.pupupMask.fadeOut();
          self.pupupWin.fadeOut();
          self.autoSize=false;
      });


      //添加向上 下切换按钮效果
      this.nextBtn.hover(function(){
          if(!$(this).hasClass("disabled")){
              $(this).addClass("lightbox-next-btn-show");
          }
      },function(){
          if(!$(this).hasClass("disabled")){
              $(this).removeClass("lightbox-next-btn-show");
          }
      }).click(function(e){//增加 点击事件
          if(!$(this).hasClass("disabled") && self.flag){
              self.flag=false;
              e.stopPropagation();
              self.gotoMethod("next");
          }
      });
      this.prevBtn.hover(function(){
          if(!$(this).hasClass("disabled")){
              $(this).addClass("lightbox-prev-btn-show");
          }
      },function(){
          if(!$(this).hasClass("disabled")){
              $(this).removeClass("lightbox-prev-btn-show");
          }
      }).click(function(e){//增加 点击事件
          if(!$(this).hasClass("disabled") && self.flag){
              self.flag=false;
              e.stopPropagation();
              self.gotoMethod("prev");
          }
      });
      //当前浏览器窗口变化时  图片自适应
      var timer=null;
      this.autoSize=false;//区分 当显示  弹出层 时 才 自动调整 大小
      $(window).resize(function(){
          if(self.autoSize){
              window.clearTimeout(timer);
              timer=window.setTimeout(function(){
                  self.loadPicSize(self.groupList[self.indexOf].src);
              },500);
          }
      }).keyup(function(e){//键盘事件

          if(e.which == 37 || e.which == 38){//按向左 或者 向上 方向箭头
              self.prevBtn.click();
          }
          if(e.which == 39 || e.which == 40){
              self.nextBtn.click();
          }
      });
  };
    LightBox.prototype={
        gotoMethod:function(type){
            var self=this;
            if(type == 'next'){//向下切换
               self.indexOf++;
                if(self.indexOf >= self.groupList.length-1){//到达最后一张
                    self.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(self.indexOf == 1){//从第一张 点 下一张按钮
                    self.prevBtn.removeClass("disabled");
                }
            }else{
                self.indexOf--;
                if(self.indexOf <= 0){//到达第一张
                   self.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(self.indexOf+1 >= self.groupList.length-1){//从最后一张图片点击向上切换
                    self.nextBtn.removeClass("disabled");
                }
            }
            self.loadPicSize(self.groupList[self.indexOf].src);
        },
        loadPicSize:function(sourceSrc){
             var self=this;
            self.picCaptionArea.hide();
            self.preLoadImg(sourceSrc,function(){
                //清除上一张图片设置的 宽高
                self.pupupPic.css({
                    width:"auto",
                    height:"auto"
                }).hide();
                 self.pupupPic.attr("src",sourceSrc);

                //console.log(self.pupupPic.width()+"  "+self.pupupPic.height());
                var picWidth=self.pupupPic.width(),
                    picHeight=self.pupupPic.height();
                self.changePic(picWidth,picHeight);//根据图片宽高 改变弹出层宽高
            });
        },
        changePic:function(width,height){
            var self=this,
                winWidth=$(window).width(),
                winHeight=$(window).height();
            var scale=Math.min(winWidth/(width+10),winHeight/(height+10),1);//设置图片 宽高比例 适应当前 浏览器窗口
            width=width*scale*self.settings.scale;
            height=height*scale*self.settings.scale;
            //设置图片区域宽高
            this.pupupViewArea.animate({
                width:width-10,
                height:height-10
            },self.settings.speed);
            //设置弹出层宽高 以及淡出效果
            this.pupupWin.animate({
                width:width,
                height:height,
                marginLeft:-width/2,
                top:(winHeight-height)/2
            },self.settings.speed,function(){//显示图片
                 self.pupupPic.css({
                     width:width-10,
                     height:height-10
                 }).fadeIn();
                //显示 描述内容
                self.picCaptionArea.fadeIn();
                self.flag=true;
                self.autoSize=true;
            });
            self.captionText.text(self.groupList[this.indexOf].caption);//描述
            self.currentIndex.text("当前索引: "+(this.indexOf+1)+" of "+this.groupList.length);
        },
        preLoadImg:function(sourceSrc,callBack){//加载图片方法
             var image=new Image();
            //区分ie浏览器 因ie没有image onload方法
            if(!!window.ActiveXObject){//标示ie浏览器
                image.onreadystatechange=function(){
                    if(this.readyState == 'complete'){//图片加载完成
                        callBack();//执行callBack
                    }
                }
            }else{//其他浏览器
                image.onload=function(){
                    callBack();
                }
            }
            image.src=sourceSrc;//指定图片路径
        },
        getIndexOf:function(currentId){//获取点击图片当前索引
             var index=0;
            var self=this;
            $(self.groupList).each(function(i){
                if(this.id === currentId){//id匹配
                     index=i;
                    return false;//break
                }
            });
            return index;
        },
        showMaskAndPupup:function(sourceSrc,currentId){
             var  self=this;
            this.pupupPic.hide();//隐藏图片
            this.picCaptionArea.hide();//隐藏 图片描述区域
            this.pupupMask.fadeIn();//遮罩层 淡出

            //获取当前窗口 高度宽度
            var winWidth=$(window).width();
            var winHeight=$(window).height();

            //设置弹出层区域位置
            this.pupupViewArea.css({
                   width:winWidth/2,
                   height:winHeight/2
            });

            this.pupupWin.fadeIn();
            var viewHeight=winHeight/2+10;
            this.pupupWin.css({
                width:winWidth/2+10,
                height:viewHeight,
                marginLeft:-(winWidth/2+10)/2,
                top:-viewHeight//初始定位到看不见的位置
            }).animate({//从上往下显示
                top:(winHeight-viewHeight)/2
            },self.settings.speed,function(){
                //加载图片
                self.loadPicSize(sourceSrc);
            });

            this.indexOf=this.getIndexOf(currentId);
            //判断该图片索引
            var groupDataLength=self.groupList.length;
            if(groupDataLength>1){//大于一张图片 才有显示 上下切换按钮
                if(this.indexOf == 0){//第一张图
                     this.nextBtn.removeClass("disabled");
                     this.prevBtn.addClass("disabled");
                }else if(this.indexOf == groupDataLength-1){//最后一张图
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{//中间  上下按钮都显示
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }
            }
        },
        initPupup:function(currentObj){
             var self=this,
                 sourceSrc=currentObj.attr("data-source"),
                 currentId=currentObj.attr("data-id");
            self.showMaskAndPupup(sourceSrc,currentId);//弹出方法
        },
        getGroup:function(){
            //保存当前对象
            var self=this;
            var groupDataList=self.bodyNode.find("*[data-group='"+self.groupName+"']");
            //先清空list
            self.groupList.length=0;
            groupDataList.each(function(){
                self.groupList.push(
                    {
                        src:$(this).attr("data-source"),
                        id:$(this).attr("data-id"),
                        caption:$(this).attr("data-caption")
                    }
                );
            });
        },
        readDom:function(){
                var strDom='<div class="lightbox-pic-view">'+
            '<span class="lightbox-btn lightbox-prev-btn"> </span>'+
            '<img class="lightbox-image" src=""/>'+
            ' <span class="lightbox-btn lightbox-next-btn"></span>'+
            ' </div>'+
            ' <div class="lightbox-pic-caption">'+
            '<div class="lightbox-caption-area">'+
            ' <p class="lightbox-pic-desc">图片描述</p>'+
            '<span class="lightbox-of-index">当前索引</span>'+
            '</div>'+
            '<span class="lightbox-close-btn"></span>'+
            ' </div>';
            this.pupupWin.html(strDom);
            this.bodyNode.append(this.pupupMask,this.pupupWin);
        }
    };
    window["LightBox"]=LightBox;
})(jQuery);