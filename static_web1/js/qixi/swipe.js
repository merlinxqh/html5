/**
 * Created by Administrator on 2015/8/13.
 */
//页面滑动
function Swipe(container){
// 获取第一个子节点
    var element = container.find(":first");
    var swipe={};
// li页面数量
    var slides = element.find(">");//find > 是查找 下一级的 标签
    //var slides = element.find("li");//查找出标签下所有的li
// 获取容器尺寸
    var width = container.width();
    var height = container.height();

// 设置li页面总宽度
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });

// 设置每一个页面li的宽度
    $.each(slides, function(index) {
        var slide = slides.eq(index); // 获取到每一个li元素
        slide.css({ // 设置每一个li的尺寸
            width: width + 'px',
            height: height + 'px'
        });
    });
    swipe.toScroll=function(x,speed){
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed+'ms',
            'transform': 'translate3d(-' + x + 'px,0px,0px)' //设置页面X轴移动
        });
        return this;
    };
    return swipe;

}

