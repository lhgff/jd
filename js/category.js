/*
 * @Author: zhengwei
 * @Date:   2016-07-07 10:21:46
 * @Last Modified by:   zhengwei
 * @Last Modified time: 2016-07-08 09:37:29
 */

'use strict';
window.onload = function() {
    //分类菜单左滑
    swipeLeft();
    swipeRight();
}

function swipeLeft() {
    //1.swipeul要滑动 要能实现连续滑动
    //2.有一个最大允许滑动的距离和最小允许滑动的距离
    //3.最大的Y定位是0 最小定位是 -(ul的高度-左侧分类div的高度)
    //4.最大允许滑动的距离是 (最大定位位置)0 + 缓冲区的距离
    //最小允许滑动的距离 最小定位的位置 - 缓冲区的距离
    //5.如果超过最大的定位的位置 让他吸附回去(弹回去) > 最大 
    //6.如果超过了最小的定位位置 让他吸附回去(弹回去) < 小于 
    //7.我们要点击li的时候让这个li变为焦点状态 
    //8.然后要让这个li跳到顶部
    var categoryLeft = document.querySelector('.category-left');
    var swipeUl = categoryLeft.querySelector('ul');
    //要让ul滑动所以给ul注册滑动事件
    var startY = 0; //初始滑动时候的位置
    var moveY = 0; //滑动中的位置
    var distanceY = 0; //滑动中的距离  moveY-startY
    var currentY = 0; //记录当前要定位的位置 (和我们轮播图的index)
    var maxPosition = 0; //最大定位位置
    var minPosition = -(swipeUl.offsetHeight - categoryLeft.offsetHeight); //最小定位位置
    var buffer = 150; //缓冲区的距离
    var maxSwipe = maxPosition + buffer; //最大允许滑动的距离
    var minSwipe = minPosition - buffer; //最小允许滑动的距离
    var lis = swipeUl.querySelectorAll('li'); //获取左侧分类的所有的li
    swipeUl.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    swipeUl.addEventListener('touchmove', function(e) {
        moveY = e.touches[0].clientY; //记录滑动中的时候的位置
        distanceY = moveY - startY; //滑动中的时候的滑动距离
        //一定记得要记录上次滑动的位置到哪了 下一次滑动从那个位置开始
        //我们当前要滑动的位置要小于最大的 大于最小的才是合法的滑动距离
        if ((currentY + distanceY) < maxSwipe && (currentY + distanceY) > minSwipe) {
            //为了连续滑动 让滑动中的时候根据滑动中的距离不断的改变位置
            setTranslateY(currentY + distanceY);
            //我们在Move的时候已经很慢了所以这时候不要加过渡
            removeTransition();
        }
    });
    swipeUl.addEventListener('touchend', function(e) {
        //连续记录上次的位置
        currentY = currentY + distanceY;
        // currentY += distanceY;
        if (currentY > maxPosition) {
            currentY = maxPosition;
            //每次你只要设置了这个setTranslateY current就要记录一下
            setTranslateY(currentY);
            //因为这时候很快弹回去了所以要加过渡慢慢弹回去
            addTransition();
        } else if (currentY < minPosition) {
            currentY = minPosition;
            setTranslateY(currentY);
            addTransition();
        }
    });
    //添加一个click事件
    // swipeUl.addEventListener('click', function(e) {
    //     for (var i = 0; i < lis.length; i++) {
    //         lis[i].className = "";
    //         //自定义一个index属性记录当前的li的下标
    //         lis[i].index = i;
    //     }
    //     e.target.parentNode.className = "now";
    //     // console.log(e.target.parentNode.index);
    //     var height = -e.target.parentNode.index * 50;
    //     //-500px 的时候是大于 -600px  合法 -700px < -600px 不合法
    //     if (height > minPosition) {
    //         currentY = height;
    //         setTranslateY(currentY);
    //         addTransition();
    //     } else {
    //         //如果我们height超过了最小的定位位置 就设置最小定位 
    //         //然后每次设置定位 记得记录到当前的位置currentY
    //         currentY = minPosition;
    //         setTranslateY(currentY);
    //         addTransition();
    //     }
    //     // -900px  -800px(不合法)  <  -600px      - 600px  -500px  (合法) 我就直接取这个值
    //     // if(height < minPosition){
    //     //     height = minPosition;//不合法我们就要取最小定位的这个合法值
    //     // }
    //     // currentY = height;
    //     //  setTranslateY(currentY);
    //     //     addTransition();
    // });
    //1.封装一个tap事件
    //1.我们得知道有没touchmove(有没有滑动)
    //2.如果没有滑动我们就认为是一个轻触事件(tap事件)
    // var isMove = false;
    // swipeUl.addEventListener('touchstart', function() {

    // });
    // swipeUl.addEventListener('touchmove', function() {
    //     isMove = true;
    // });
    // swipeUl.addEventListener('touchend', function(e) {
    //     //如果isMove还是没有变化说明没滑动 说明是一个轻触tap
    //     if (isMove == false) {
    //         for (var i = 0; i < lis.length; i++) {
    //             lis[i].className = "";
    //             //自定义一个index属性记录当前的li的下标
    //             lis[i].index = i;
    //         }
    //         e.target.parentNode.className = "now";
    //         // console.log(e.target.parentNode.index);
    //         var height = -e.target.parentNode.index * 50;
    //         //-500px 的时候是大于 -600px  合法 -700px < -600px 不合法
    //         if (height > minPosition) {
    //             currentY = height;
    //             setTranslateY(currentY);
    //             addTransition();
    //         } else {
    //             //如果我们height超过了最小的定位位置 就设置最小定位 
    //             //然后每次设置定位 记得记录到当前的位置currentY
    //             currentY = minPosition;
    //             setTranslateY(currentY);
    //             addTransition();
    //         }
    //     }
    //     //滑着滑着就点不了了
    //     isMove = false;
    // });
    // 传入的时候这个e是形参
    tap(swipeUl, function(e) {
        for (var i = 0; i < lis.length; i++) {
            lis[i].className = "";
            //自定义一个index属性记录当前的li的下标
            lis[i].index = i;
        }
        e.target.parentNode.className = "now";
        // console.log(e.target.parentNode.index);
        var height = -e.target.parentNode.index * 50;
        //-500px 的时候是大于 -600px  合法 -700px < -600px 不合法
        if (height > minPosition) {
            currentY = height;
            setTranslateY(currentY);
            addTransition();
        } else {
            //如果我们height超过了最小的定位位置 就设置最小定位 
            //然后每次设置定位 记得记录到当前的位置currentY
            currentY = minPosition;
            setTranslateY(currentY);
            addTransition();
        }
    });
    tap(swipeUl,function  (e) {
        console.log(e);
    });
        //封装一个tap函数 参数1 是指要tap的dom元素 
    function tap(dom, callback) {
        var isMove = false;
        dom.addEventListener('touchstart', function() {

        });
        dom.addEventListener('touchmove', function() {
            isMove = true;
        });
        dom.addEventListener('touchend', function(e) {
            //如果isMove还是没有变化说明没滑动 说明是一个轻触tap
            if (isMove == false) {
                // if (typeof callback == "function") {
                //     //首先我这调用函数传一个实际参数
                //     callback(e);
                // }
                callback && callback(e);
            }
            //滑着滑着就点不了了
            isMove = false;
        });
    }


    //封装设置移动位置的函数
    function setTranslateY(y) {
        //因为我们封装函数要考虑的东西多所以我们为了兼容性
        //我们使用px
        swipeUl.style.transform = "translateY(" + y + "px)";
    }
    //封装添加过渡的函数
    function addTransition() {
        swipeUl.style.transition = "all 0.2s";
    }
    //封装删除过渡函数
    function removeTransition() {
        swipeUl.style.transition = "none";
    }
}

function swipeRight() {
    //1.swipeul要滑动 要能实现连续滑动
    //2.有一个最大允许滑动的距离和最小允许滑动的距离
    //3.最大的Y定位是0 最小定位是 -(ul的高度-左侧分类div的高度)
    //4.最大允许滑动的距离是 (最大定位位置)0 + 缓冲区的距离
    //最小允许滑动的距离 最小定位的位置 - 缓冲区的距离
    //5.如果超过最大的定位的位置 让他吸附回去(弹回去) > 最大 
    //6.如果超过了最小的定位位置 让他吸附回去(弹回去) < 小于 
    //7.我们要点击li的时候让这个li变为焦点状态 
    //8.然后要让这个li跳到顶部
    var categoryLeft = document.querySelector('.category-right');
    var swipeUl = categoryLeft.querySelector('.category-right-content');
    //要让ul滑动所以给ul注册滑动事件
    var startY = 0; //初始滑动时候的位置
    var moveY = 0; //滑动中的位置
    var distanceY = 0; //滑动中的距离  moveY-startY
    var currentY = 0; //记录当前要定位的位置 (和我们轮播图的index)
    var maxPosition = 0; //最大定位位置
    var minPosition = -(swipeUl.offsetHeight - categoryLeft.offsetHeight); //最小定位位置
    var buffer = 150; //缓冲区的距离
    var maxSwipe = maxPosition + buffer; //最大允许滑动的距离
    var minSwipe = minPosition - buffer; //最小允许滑动的距离
    var lis = swipeUl.querySelectorAll('li'); //获取左侧分类的所有的li
    swipeUl.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    swipeUl.addEventListener('touchmove', function(e) {
        moveY = e.touches[0].clientY;
        distanceY = moveY - startY;
        //一定记得要记录上次滑动的位置到哪了 下一次滑动从那个位置开始
        //我们当前要滑动的位置要小于最大的 大于最小的才是合法的滑动距离
        if ((currentY + distanceY) < maxSwipe && (currentY + distanceY) > minSwipe) {
            //为了连续滑动 让滑动中的时候根据滑动中的距离不断的改变位置
            setTranslateY(currentY + distanceY);
            //我们在Move的时候已经很慢了所以这时候不要加过渡
            removeTransition();
        }
    });
    swipeUl.addEventListener('touchend', function(e) {
        //连续记录上次的位置
        currentY = currentY + distanceY;
        // currentY += distanceY;
        if ((currentY + distanceY) > maxPosition) {
            currentY = maxPosition;
            //每次你只要设置了这个setTranslateY current就要记录一下
            setTranslateY(currentY);
            //因为这时候很快弹回去了所以要加过渡慢慢弹回去
            addTransition();
        } else if ((currentY + distanceY) < minPosition) {
            currentY = minPosition;
            setTranslateY(currentY);
            addTransition();
        }
    });
    //封装设置移动位置的函数
    function setTranslateY(y) {
        //因为我们封装函数要考虑的东西多所以我们为了兼容性
        //我们使用px
        swipeUl.style.transform = "translateY(" + y + "px)";
    }
    //封装添加过渡的函数
    function addTransition() {
        swipeUl.style.transition = "all 0.2s";
    }
    //封装删除过渡函数
    function removeTransition() {
        swipeUl.style.transition = "none";
    }
}
