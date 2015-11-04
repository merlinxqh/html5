/**
 * Created by Administrator on 2015/8/15.
 */
///////////
//灯动画 //
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

//鸟飞的动画
var bird={
    elem:$(".bird"),
    fly:function(){
        this.elem.addClass("birdFly");//给鸟加上 翅膀动画
        this.elem.transition({
            right:$("#content").width()
        },15000,'linear');
    }
};

////////
//小女孩 //
////////
var girl = {
    elem: $('.girl'),
    getHeight: function() {
        return this.elem.height();
    },
    // 转身动作
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
// 修正小女孩位置
girl.setOffset();

var container=$("#content");
//页面可视区域
var visualWidth=container.width();
var visualHeight=container.height();

var swipe=Swipe(container);

//移动背景方法
function scrollTo(time,proportionX){
    var disX=container.width()*proportionX;
    swipe.toScroll(disX,time);
}

//获取数据
var getValue=function(className){
    var $elem=$(''+className+'');
    //走路的路线坐标
    return {
        height:$elem.height(),
        top:$elem.position().top
    };
};

// 桥的Y轴
var bridgeY = function() {
    var data = getValue('.c_background_middle');
    return data.top;
}();


//用来临时调整页面
swipe.toScroll(container.width()*2,0);


//开关门操作
function doorAction(left, right, time) {
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
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

// 开门
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}

// 关门
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}



////小男孩走路
function BoyWalk(){
    var instanceX,instanceY;

//路的Y轴
    var pathY=function(){
        var data=getValue(".a_background_middle");
        return data.top+data.height/2;
    }();//立即执行函数

    var $boy=$("#boy");
    var boyHeight=$boy.height();


//修正小男孩的正确位置
    $boy.css({
        top:pathY - boyHeight +25
    });

////////////////////////////////////////////////////////
//===================动画处理============================ //
////////////////////////////////////////////////////////

    // 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

//恢复走路
    function restoreWalk(){
        $boy.removeClass("pauseWalk");
    }

//css3的动作变化
    function slowWalk(){
        $boy.addClass("slowWalk");
    }

//计算移动距离
    function calculateDist(direction,proportion){
        //参数 为 x y轴 以及 比例
        return (direction == 'x'? visualWidth : visualHeight)*proportion;
    }

//用transition做运动
    function startRun(options,runTime){
        //option参数  runTime执行时间
        var dfPlay= $.Deferred();//deferred对象就是jQuery的回调函数解决方案
        //恢复走路
        restoreWalk();
        //运动的属性
        $boy.transition(options,runTime,'linear',function(){
            dfPlay.resolve();//动画完成
        });
        return dfPlay;
    }

//开始走路
    function walkRun(time,dist,disY){
        time= time || 3000;
        //脚动作
        slowWalk();
        //开始走路
        var d1=startRun({
            left: dist + 'px',
            top : disY?disY + 'px':undefined
        },time);
        return d1;
    }

    //走进商店
    // 走进商店
    function walkToShop(runTime) {
        var defer = $.Deferred();
        var doorObj = $('.door')
        // 门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        var doorOffsetTop = offsetDoor.top;
        // 小孩当前的坐标
        var posBoy = $boy.position();
        var boyPoxLeft = posBoy.left;
        var boyPoxTop = posBoy.top;

        // 中间位置
        var boyMiddle = $boy.width() / 2;
        var doorMiddle = doorObj.width() / 2;
        var doorTopMiddle = doorObj.height() / 2;


        // 当前需要移动的坐标
        instanceX = (doorOffsetLeft + doorMiddle) - (boyPoxLeft + boyMiddle);

        // Y的坐标
        // top = 人物底部的top - 门中见的top值
        instanceY = boyPoxTop + boyHeight - doorOffsetTop + (doorTopMiddle);

        // 开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),translateY(-' + instanceY + 'px),scale(0.5,0.5)',
            opacity: 0.1
        }, 2000);
        // 走路完毕
        walkPlay.done(function() {
            $boy.css({
                opacity: 0
            });
            defer.resolve();
        });
        return defer;
    }

    //走出商店
    function walkOutShop(runTime){
        var defer= $.Deferred();
        restoreWalk();
        //开始走路
        var walkPlay=startRun({
            transform:'translateX('+instanceX+'px),scale(1,1)',
            opacity:1
        },runTime);

        //走路完毕
        walkPlay.done(function(){
            defer.resolve();
        });
        return defer;
    }

    //取花
    function takeFlower(){
        var defer= $.Deferred();
        //增加延时取花时间
        setTimeout(function(){
            $boy.removeClass("slowWalk");
            $boy.addClass("slowFlowerWalk");
            defer.resolve();
        },1000);
        return defer;
    }



    return {
        //开始走路
        walkTo:function(time,proportionX,proportionY){
            var disX=calculateDist('x',proportionX);
            var disY=calculateDist('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //走进商店
        toShop:function(){
           return walkToShop.apply(null,arguments);
        },
        //走出商店
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        //停止走路
        stopWalk:function(){
            pauseWalk();
        },
        //设置背景色
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
        // 复位初始状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        getWidth:function(){
            return $boy.width();
        }

    };
}