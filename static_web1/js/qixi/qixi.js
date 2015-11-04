/**
 * Created by Administrator on 2015/8/15.
 */
///////////
//�ƶ��� //
///////////
var lamp = {
    elem: $('.b_background'),
    bright: function() {
        this.elem.addClass('lamp-bright');
    },
    dark: function() {
        this.elem.removeClass('lamp-bright');
    }
};

//��ɵĶ���
var bird={
    elem:$(".bird"),
    fly:function(){
        this.elem.addClass("birdFly");//������� ��򶯻�
        this.elem.transition({
            right:$("#content").width()
        },15000,'linear');
    }
};

////////
//СŮ�� //
////////
var girl = {
    elem: $('.girl'),
    getHeight: function() {
        return this.elem.height();
    },
    // ת����
    rotate: function() {
        this.elem.addClass('girl-rotate');
    },
    setOffset: function() {
        this.elem.css({
            left: visualWidth / 2,
            top: bridgeY - this.getHeight()
        });
    },
    getOffset: function() {
        return this.elem.offset();
    },
    getWidth: function() {
        return this.elem.width();
    }
};
// ����СŮ��λ��
girl.setOffset();

var container=$("#content");
//ҳ���������
var visualWidth=container.width();
var visualHeight=container.height();

var swipe=Swipe(container);

//�ƶ���������
function scrollTo(time,proportionX){
    var disX=container.width()*proportionX;
    swipe.toScroll(disX,time);
}

//��ȡ����
var getValue=function(className){
    var $elem=$(''+className+'');
    //��·��·������
    return {
        height:$elem.height(),
        top:$elem.position().top
    };
};

// �ŵ�Y��
var bridgeY = function() {
    var data = getValue('.c_background_middle');
    return data.top;
}();


//������ʱ����ҳ��
swipe.toScroll(container.width()*2,0);


//�����Ų���
function doorAction(left, right, time) {
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // �ȴ��������
    var complete = function() {
        if (count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left': left
    }, time, complete);
    doorRight.transition({
        'left': right
    }, time, complete);
    return defer;
}

// ����
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}

// ����
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}



////С�к���·
function BoyWalk(){
    var instanceX,instanceY;

//·��Y��
    var pathY=function(){
        var data=getValue(".a_background_middle");
        return data.top+data.height/2;
    }();//����ִ�к���

    var $boy=$("#boy");
    var boyHeight=$boy.height();


//����С�к�����ȷλ��
    $boy.css({
        top:pathY - boyHeight +25
    });

////////////////////////////////////////////////////////
//===================��������============================ //
////////////////////////////////////////////////////////

    // ��ͣ��·
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

//�ָ���·
    function restoreWalk(){
        $boy.removeClass("pauseWalk");
    }

//css3�Ķ����仯
    function slowWalk(){
        $boy.addClass("slowWalk");
    }

//�����ƶ�����
    function calculateDist(direction,proportion){
        //���� Ϊ x y�� �Լ� ����
        return (direction == 'x'? visualWidth : visualHeight)*proportion;
    }

//��transition���˶�
    function startRun(options,runTime){
        //option����  runTimeִ��ʱ��
        var dfPlay= $.Deferred();//deferred�������jQuery�Ļص������������
        //�ָ���·
        restoreWalk();
        //�˶�������
        $boy.transition(options,runTime,'linear',function(){
            dfPlay.resolve();//�������
        });
        return dfPlay;
    }

//��ʼ��·
    function walkRun(time,dist,disY){
        time= time || 3000;
        //�Ŷ���
        slowWalk();
        //��ʼ��·
        var d1=startRun({
            left: dist + 'px',
            top : disY?disY + 'px':undefined
        },time);
        return d1;
    }

    //�߽��̵�
    // �߽��̵�
    function walkToShop(runTime) {
        var defer = $.Deferred();
        var doorObj = $('.door')
        // �ŵ�����
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        var doorOffsetTop = offsetDoor.top;
        // С����ǰ������
        var posBoy = $boy.position();
        var boyPoxLeft = posBoy.left;
        var boyPoxTop = posBoy.top;

        // �м�λ��
        var boyMiddle = $boy.width() / 2;
        var doorMiddle = doorObj.width() / 2;
        var doorTopMiddle = doorObj.height() / 2;


        // ��ǰ��Ҫ�ƶ�������
        instanceX = (doorOffsetLeft + doorMiddle) - (boyPoxLeft + boyMiddle);

        // Y������
        // top = ����ײ���top - ���м���topֵ
        instanceY = boyPoxTop + boyHeight - doorOffsetTop + (doorTopMiddle);

        // ��ʼ��·
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),translateY(-' + instanceY + 'px),scale(0.5,0.5)',
            opacity: 0.1
        }, 2000);
        // ��·���
        walkPlay.done(function() {
            $boy.css({
                opacity: 0
            });
            defer.resolve();
        });
        return defer;
    }

    //�߳��̵�
    function walkOutShop(runTime){
        var defer= $.Deferred();
        restoreWalk();
        //��ʼ��·
        var walkPlay=startRun({
            transform:'translateX('+instanceX+'px),scale(1,1)',
            opacity:1
        },runTime);

        //��·���
        walkPlay.done(function(){
            defer.resolve();
        });
        return defer;
    }

    //ȡ��
    function takeFlower(){
        var defer= $.Deferred();
        //������ʱȡ��ʱ��
        setTimeout(function(){
            $boy.removeClass("slowWalk");
            $boy.addClass("slowFlowerWalk");
            defer.resolve();
        },1000);
        return defer;
    }



    return {
        //��ʼ��·
        walkTo:function(time,proportionX,proportionY){
            var disX=calculateDist('x',proportionX);
            var disY=calculateDist('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //�߽��̵�
        toShop:function(){
           return walkToShop.apply(null,arguments);
        },
        //�߳��̵�
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        //ֹͣ��·
        stopWalk:function(){
            pauseWalk();
        },
        //���ñ���ɫ
        setColor:function(value){
            $boy.css('background-color',value);
        },
        takeFlower:function(){
            return takeFlower();
        },
        setFlowerWalk:function(){
            $boy.removeClass("slowWalk");
            $boy.addClass("slowFlowerWalk");
        },
        // ��λ��ʼ״̬
        resetOriginal: function() {
            this.stopWalk();
            // �ָ�ͼƬ
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        getWidth:function(){
            return $boy.width();
        }

    };
}