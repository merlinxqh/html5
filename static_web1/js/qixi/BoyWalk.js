/**
 * Created by Administrator on 2015/8/15.
 */
function BoyWalk(){
    var container=$("#content");
//ҳ���������
    var visualWidth=container.width();
    var visualHeight=container.height();

    var swipe=Swipe(container);

//��ȡ����
    var getValue=function(className){
        var $elem=$(''+className+'');
        //��·��·������
        return {
            height:$elem.height(),
            top:$elem.position().top
        };
    };

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
            top : disY?disY:undefined
        },time);
        return d1;
    }

    return {
        //��ʼ��·
        walkTo:function(time,proportionX,proportionY){
            var disX=calculateDist('x',proportionX);
            var disY=calculateDist('y',proportionY);
            return walkRun(time,disX,disY);
        },
        //ֹͣ��·
        stopWalk:function(){
            pauseWalk();
        },
        //���ñ���ɫ
        setColor:function(value){
            $boy.css('background-color',value);
        }

    };
}