/**
 * 你画我猜游戏逻辑 canvas.js
 * @authors Luo Zhenzong (shejisheng@yeah.net)
 * @date    2016-05-04 12:09:50
 * @version v1.0.2
 */

var canvas = document.getElementById('my-canvas');
viewConfig();

var pen = canvas.getContext("2d");
//配置项
var conf = {
  lineWidth: 1,
  strokeStyle: "black",
  lineCap: "round",       //端点设置
}

//获取关键DOM节点
var currentColorItem = document.getElementById('default-color');
var penPreview = document.getElementById('pen-preview');
var canvasFooterItems = document.getElementById('my-canvas-ctrl').children;
var colorSets = document.getElementById('color-sets');


currentColorItem.style.border = "2px dashed #fff";

penConfig( conf );

//-------------------------绘图相关--------------------------
canvas.addEventListener('touchstart', function (e) {
  if (e.targetTouches.length == 1) {
    e.preventDefault();
    var touch = e.targetTouches[0];
    var mouseX = touch.pageX - this.offsetLeft;
    var mouseY = touch.pageY - this.offsetTop;
    pen.beginPath();  
    pen.moveTo(mouseX,mouseY);     //起始位置
  }
});

canvas.addEventListener('touchmove', function (e) {
  if (e.targetTouches.length == 1) {
    e.preventDefault();
    var touch = e.targetTouches[0];
    var mouseX = touch.pageX - this.offsetLeft;
    var mouseY = touch.pageY - this.offsetTop;
    pen.lineTo( mouseX, mouseY );     //结束位置
    pen.stroke();                  //绘制图形
  }
});

canvas.addEventListener('touchend', function (e) {
  e.preventDefault();
  pen.closePath();
});
//-------------------------绘图相关--------------------------


//-------------------------配置选择--------------------------
var actions = {
  cancel: function() {
    console.log( "cancel" )
    //清除
    pen.clearRect( 0, 0, canvas.width, canvas.height );
  },
  enlarge: function() {
    console.log( "+" );
    conf.lineWidth += 2;
    penConfig( { lineWidth: conf.lineWidth } );
  },
  narrow: function() {
    console.log( "-" );
    conf.lineWidth -= 2;
    if ( conf.lineWidth < 0 ) {
      conf.lineWidth = 1;
    }
    penConfig( { lineWidth: conf.lineWidth } );
  },
  changeColor: function() {
    //显示颜色选择
    if ( colorSets.style.height.replace( "px", "") > "0" ) {
      colorSets.style.height = "0px";
    } else {
      colorSets.style.height = "50px";
    }
  },
  save: function() {

  },
}

//绑定footer的行为
for ( var i=0; i < canvasFooterItems.length; i++ ) {
  var item = canvasFooterItems[i];
  item.addEventListener('click', function(e) {
    var data = e.target.attributes["data-id"];
    if (data) {
      var action = e.target.attributes["data-id"].value;
      if ( actions.hasOwnProperty( action ) ) {
        actions[ action ]();
      }
    }
  });
}

var colorItems = colorSets.children;
for( var i=0; i < colorItems.length; i++ ) {
  var item = colorItems[i];
  item.addEventListener('click', function(e) {
    //改变颜色
    var color = e.target.className.split(" ")[1];
    conf.strokeStyle = color;
    penConfig( { strokeStyle: conf.strokeStyle } );
    //改变视图
    currentColorItem.style.border = "";
    currentColorItem = e.target;
    if( color == "white" ) {
      e.target.style.border = "2px dashed #000"
    } else {
      e.target.style.border = "2px dashed #fff";
    }
    colorSets.style.height = "0px";
    currentColorItem = e.target;
  });
}
//-------------------------配置选择--------------------------

//监听屏幕翻转
window.addEventListener('orientationchange', function(e) {
  viewConfig();
});

function viewConfig() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
}
function penConfig( conf ) {
  for ( var key in conf ) {
    pen[ key ] = conf[ key ];
  }
  //更新笔触preview界面
  penPreview.style.background = pen.strokeStyle;
  if( pen.strokeStyle == "#ffffff" ) {
    penPreview.style.color = "black";
  } else {
    penPreview.style.color = "white";
  }
  penPreview.innerText = pen.lineWidth + "px";
}