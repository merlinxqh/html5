/**
 * Created by Administrator on 2015/8/13.
 */
//ҳ�滬��
function Swipe(container){
// ��ȡ��һ���ӽڵ�
    var element = container.find(":first");
    var swipe={};
// liҳ������
    var slides = element.find(">");//find > �ǲ��� ��һ���� ��ǩ
    //var slides = element.find("li");//���ҳ���ǩ�����е�li
// ��ȡ�����ߴ�
    var width = container.width();
    var height = container.height();

// ����liҳ���ܿ��
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });

// ����ÿһ��ҳ��li�Ŀ��
    $.each(slides, function(index) {
        var slide = slides.eq(index); // ��ȡ��ÿһ��liԪ��
        slide.css({ // ����ÿһ��li�ĳߴ�
            width: width + 'px',
            height: height + 'px'
        });
    });
    swipe.toScroll=function(x,speed){
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed+'ms',
            'transform': 'translate3d(-' + x + 'px,0px,0px)' //����ҳ��X���ƶ�
        });
        return this;
    };
    return swipe;

}

