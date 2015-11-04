/**
 * Created by Administrator on 2015/8/15.
 */
function BoyWalk(){
    var container=$("#content");
//页面可视区域
    var visualWidth=container.width();
    var visualHeight=container.height();

    var swipe=Swipe(container);

//获取数据
    var getValue=function(className){
        var $elem=$(''+className+'');
        //走路的路线坐标
        return {
            height:$elem.height(),
            top:$elem.position().top
        };
    };

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
            top : disY?disY:undefined
        },time);
        return d1;
    }

    return {
        //开始走路
        walkTo:function(time,proportionX,proportionY){
            var disX=calculateDist('x',proportionX);
            var disY=calculateDist('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //停止走路
        stopWalk:function(){
            pauseWalk();
        },
        //设置背景色
        setColor:function(value){
            $boy.css('background-color',value);
        }

    };
}