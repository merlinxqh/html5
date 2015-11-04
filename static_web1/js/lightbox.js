/**
 * Created by Administrator on 2015/8/7.
 */
//��װLightBox��
;(function($){

  var LightBox=function(settings){
      var self=this;
      this.settings={
          speed:500,
          scale:1
      };
      $.extend(this.settings,settings || {});
      //����body
      this.bodyNode=$(document.body);
      //�������ֲ� �� ������
      this.pupupMask=$('<div id="G-lightbox-mask">');
      this.pupupWin=$('<div id="G-lightbox-popup">');

      //��Ⱦʣ���dom ���Ҳ��뵽body
      this.readDom();

      this.pupupViewArea=this.pupupWin.find("div.lightbox-pic-view");//ͼƬԤ������
      this.pupupPic=this.pupupWin.find("img.lightbox-image");//ͼƬ
      this.picCaptionArea=this.pupupWin.find("div.lightbox-pic-caption");//ͼƬ��������
      this.nextBtn=this.pupupWin.find("span.lightbox-next-btn");
      this.prevBtn=this.pupupWin.find("span.lightbox-prev-btn");

      this.captionText=this.pupupWin.find("p.lightbox-pic-desc");//ͼƬ��������

      this.currentIndex=this.pupupWin.find("span.lightbox-of-index");//ͼƬ��ǰ����
      this.closeBtn=this.pupupWin.find("span.lightbox-close-btn");//�رհ�ť

      this.groupName=null;
      //��ŵ�ǰ�����
      this.groupList=[];
      this.flag=true;//��ֹ�ظ�������������л���ť
      //׼�������¼�ί��  ��ȡ������
      this.bodyNode.delegate(".js-lightbox,*[data-role='lightbox']","click",function(e){
             //��ֹ�¼�ð�� Ӱ�������div�Ͽ�����ӵ��¼�
          e.stopPropagation();
          var currentGroupName=$(this).attr("data-group");
          if(currentGroupName != self.groupName){
              self.groupName=currentGroupName;
              //��ȡͬһ������
              self.getGroup();
          }
          self.initPupup($(this));
      });

      //��� ������ֲ� �ر� ���� �Լ����ֲ� ����
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


      //������� ���л���ťЧ��
      this.nextBtn.hover(function(){
          if(!$(this).hasClass("disabled")){
              $(this).addClass("lightbox-next-btn-show");
          }
      },function(){
          if(!$(this).hasClass("disabled")){
              $(this).removeClass("lightbox-next-btn-show");
          }
      }).click(function(e){//���� ����¼�
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
      }).click(function(e){//���� ����¼�
          if(!$(this).hasClass("disabled") && self.flag){
              self.flag=false;
              e.stopPropagation();
              self.gotoMethod("prev");
          }
      });
      //��ǰ��������ڱ仯ʱ  ͼƬ����Ӧ
      var timer=null;
      this.autoSize=false;//���� ����ʾ  ������ ʱ �� �Զ����� ��С
      $(window).resize(function(){
          if(self.autoSize){
              window.clearTimeout(timer);
              timer=window.setTimeout(function(){
                  self.loadPicSize(self.groupList[self.indexOf].src);
              },500);
          }
      }).keyup(function(e){//�����¼�

          if(e.which == 37 || e.which == 38){//������ ���� ���� �����ͷ
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
            if(type == 'next'){//�����л�
               self.indexOf++;
                if(self.indexOf >= self.groupList.length-1){//�������һ��
                    self.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(self.indexOf == 1){//�ӵ�һ�� �� ��һ�Ű�ť
                    self.prevBtn.removeClass("disabled");
                }
            }else{
                self.indexOf--;
                if(self.indexOf <= 0){//�����һ��
                   self.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(self.indexOf+1 >= self.groupList.length-1){//�����һ��ͼƬ��������л�
                    self.nextBtn.removeClass("disabled");
                }
            }
            self.loadPicSize(self.groupList[self.indexOf].src);
        },
        loadPicSize:function(sourceSrc){
             var self=this;
            self.picCaptionArea.hide();
            self.preLoadImg(sourceSrc,function(){
                //�����һ��ͼƬ���õ� ���
                self.pupupPic.css({
                    width:"auto",
                    height:"auto"
                }).hide();
                 self.pupupPic.attr("src",sourceSrc);

                //console.log(self.pupupPic.width()+"  "+self.pupupPic.height());
                var picWidth=self.pupupPic.width(),
                    picHeight=self.pupupPic.height();
                self.changePic(picWidth,picHeight);//����ͼƬ��� �ı䵯������
            });
        },
        changePic:function(width,height){
            var self=this,
                winWidth=$(window).width(),
                winHeight=$(window).height();
            var scale=Math.min(winWidth/(width+10),winHeight/(height+10),1);//����ͼƬ ��߱��� ��Ӧ��ǰ ���������
            width=width*scale*self.settings.scale;
            height=height*scale*self.settings.scale;
            //����ͼƬ������
            this.pupupViewArea.animate({
                width:width-10,
                height:height-10
            },self.settings.speed);
            //���õ������� �Լ�����Ч��
            this.pupupWin.animate({
                width:width,
                height:height,
                marginLeft:-width/2,
                top:(winHeight-height)/2
            },self.settings.speed,function(){//��ʾͼƬ
                 self.pupupPic.css({
                     width:width-10,
                     height:height-10
                 }).fadeIn();
                //��ʾ ��������
                self.picCaptionArea.fadeIn();
                self.flag=true;
                self.autoSize=true;
            });
            self.captionText.text(self.groupList[this.indexOf].caption);//����
            self.currentIndex.text("��ǰ����: "+(this.indexOf+1)+" of "+this.groupList.length);
        },
        preLoadImg:function(sourceSrc,callBack){//����ͼƬ����
             var image=new Image();
            //����ie����� ��ieû��image onload����
            if(!!window.ActiveXObject){//��ʾie�����
                image.onreadystatechange=function(){
                    if(this.readyState == 'complete'){//ͼƬ�������
                        callBack();//ִ��callBack
                    }
                }
            }else{//���������
                image.onload=function(){
                    callBack();
                }
            }
            image.src=sourceSrc;//ָ��ͼƬ·��
        },
        getIndexOf:function(currentId){//��ȡ���ͼƬ��ǰ����
             var index=0;
            var self=this;
            $(self.groupList).each(function(i){
                if(this.id === currentId){//idƥ��
                     index=i;
                    return false;//break
                }
            });
            return index;
        },
        showMaskAndPupup:function(sourceSrc,currentId){
             var  self=this;
            this.pupupPic.hide();//����ͼƬ
            this.picCaptionArea.hide();//���� ͼƬ��������
            this.pupupMask.fadeIn();//���ֲ� ����

            //��ȡ��ǰ���� �߶ȿ��
            var winWidth=$(window).width();
            var winHeight=$(window).height();

            //���õ���������λ��
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
                top:-viewHeight//��ʼ��λ����������λ��
            }).animate({//����������ʾ
                top:(winHeight-viewHeight)/2
            },self.settings.speed,function(){
                //����ͼƬ
                self.loadPicSize(sourceSrc);
            });

            this.indexOf=this.getIndexOf(currentId);
            //�жϸ�ͼƬ����
            var groupDataLength=self.groupList.length;
            if(groupDataLength>1){//����һ��ͼƬ ������ʾ �����л���ť
                if(this.indexOf == 0){//��һ��ͼ
                     this.nextBtn.removeClass("disabled");
                     this.prevBtn.addClass("disabled");
                }else if(this.indexOf == groupDataLength-1){//���һ��ͼ
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{//�м�  ���°�ť����ʾ
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }
            }
        },
        initPupup:function(currentObj){
             var self=this,
                 sourceSrc=currentObj.attr("data-source"),
                 currentId=currentObj.attr("data-id");
            self.showMaskAndPupup(sourceSrc,currentId);//��������
        },
        getGroup:function(){
            //���浱ǰ����
            var self=this;
            var groupDataList=self.bodyNode.find("*[data-group='"+self.groupName+"']");
            //�����list
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
            ' <p class="lightbox-pic-desc">ͼƬ����</p>'+
            '<span class="lightbox-of-index">��ǰ����</span>'+
            '</div>'+
            '<span class="lightbox-close-btn"></span>'+
            ' </div>';
            this.pupupWin.html(strDom);
            this.bodyNode.append(this.pupupMask,this.pupupWin);
        }
    };
    window["LightBox"]=LightBox;
})(jQuery);