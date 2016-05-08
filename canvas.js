/**
 * 你画我猜游戏逻辑 canvas.js
 * @authors Luo Zhenzong (shejisheng@yeah.net)
 * @date    2016-05-04 12:09:50
 * @version v1.0.2
 */

var canvas = document.getElementById('my-canvas');
viewConfig();

var pen = canvas.getContext("2d");

//用户存储点，实现后退功能
var points = [];

//配置项
var conf = {
  lineWidth: 5,
  strokeStyle: "black",
  lineCap: "round",       //端点设置
}

//获取关键DOM节点
var currentColorItem = document.getElementById('current-color');
var currentPenItem = document.getElementById('current-pen');
var penPreview = document.getElementById('pen-preview');
var canvasFooterItems = document.getElementById('my-canvas-ctrl').children;
var colorSets = document.getElementById('color-sets');
var penSets = document.getElementById('pen-sets');
var referenceImg = document.getElementById('reference-img');
var modelContainer = document.getElementById('model-container');
var modelTitle = document.getElementById('model-title');
var canvasShare = document.getElementById('canvas-share');
var shareModel = document.getElementById('share-model');
var shareBtn = document.getElementById('share-btn');

currentColorItem.style.border = "2px dashed #fff";
currentPenItem.style.border = "1px dashed #fff";

penConfig( conf );

//-------------------------绘图相关--------------------------
var mouseX, mouseY;
var line = [];
canvas.addEventListener('touchstart', function (e) {
  if (e.targetTouches.length == 1) {
    e.preventDefault();
    var touch = e.targetTouches[0];
    mouseX = touch.pageX - this.offsetLeft;
    mouseY = touch.pageY - this.offsetTop;
    pen.beginPath();  
    pen.moveTo(mouseX,mouseY);     //起始位置
    line = [];
    line.push( { x: mouseX, y: mouseY } );
  }
});

canvas.addEventListener('touchmove', function (e) {
  if (e.targetTouches.length == 1) {
    e.preventDefault();
    var touch = e.targetTouches[0];
    mouseX = touch.pageX - this.offsetLeft;
    mouseY = touch.pageY - this.offsetTop;
    pen.lineTo( mouseX, mouseY );     //结束位置
    pen.stroke();                  //绘制图形
    line.push( { x: mouseX, y: mouseY } );
  }
});

canvas.addEventListener('touchend', function (e) {
  e.preventDefault();
  pen.closePath();
  points.push({ line: line, lineWidth: conf.lineWidth, strokeStyle: conf.strokeStyle });
});
//-------------------------绘图相关--------------------------


//-------------------------配置选择--------------------------
var actions = {
  back: function() {
    this.clear();
    //去掉最后一条线
    points = points.splice(0, points.length-1);
    if( points.length > 0 ) {
      for( var i = 0; i < points.length; i++ ) {
        var line = points[i].line;
        penConfig( { lineWidth: points[i].lineWidth, strokeStyle: points[i].strokeStyle } );
        pen.beginPath();
        var start = line[0];
        pen.moveTo( start.x, start.y );
        for( var j = 1; j < line.length; j++) {
          var point = line[j];
          pen.lineTo( point.x, point.y );
          pen.stroke();
        }
        pen.closePath();
      }
    }
  },
  clear: function() {
    pen.clearRect( 0, 0, canvas.width, canvas.height );
  },
  changeSize: function() {
    //显示画笔选择
    if ( penSets.style.height.replace( "px", "") > "0" ) {
      penSets.style.height = "0px";
    } else {
      penSets.style.height = "50px";
    }
  },
  changeColor: function() {
    //显示颜色选择
    if ( colorSets.style.height.replace( "px", "") > "0" ) {
      colorSets.style.height = "0px";
    } else {
      colorSets.style.height = "165px";
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

//绑定颜色选择行为
var colorItems = colorSets.children;
for( var i=0; i < colorItems.length; i++ ) {
  var item = colorItems[i];
  item.addEventListener('click', function(e) {
    var target = e.target;
    if (target.className == "palette-box") {
      target = target.children[0];
    }
    //改变颜色
    var color = target.style.background;
    conf.strokeStyle = color;
    penConfig( { strokeStyle: conf.strokeStyle } );
    //改变视图
    currentColorItem.style.border = "";
    currentColorItem = target;
    if( color == "white" ) {
      target.style.border = "2px dashed #000"
    } else {
      target.style.border = "2px dashed #fff";
    }
    colorSets.style.height = "0px";
  });
}

//绑定画笔选择行为
var penItems = penSets.children;
for( var i=0; i < penItems.length; i++ ) {
  var item = penItems[i];
  item.addEventListener('click', function(e) {
    //改变画笔大小
    var size = e.target.attributes["data-size"].value;
    conf.lineWidth = size;
    penConfig( { lineWidth: conf.lineWidth } );
    //改变视图
    currentPenItem.style.border = "";
    currentPenItem = e.target;
    e.target.style.border = "2px dashed #fff";
    penSets.style.height = "0px";
  });
}

//绑定参考图片行为
referenceImg.addEventListener('click', function(e) {
  if( this.style.width == "" ){
    this.style.width = "100%";
    this.style.left = "0";
    this.style.top = "20%";

    modelContainer.className = "model-container-large";
    modelTitle.style.display = "block";
  } else {
    this.style.width = "";
    this.style.left = "5px";
    this.style.top = "5px";

    modelContainer.className = "";
    modelTitle.style.display = "none";
  }
});

//触发，作为开始界面
referenceImg.click();

//绑定分享图片按钮行为
var ram = -1;
var result = [
  "你的画表现了你灵魂画师的潜力，以后你就是画坛半壁江山了！",
  "这行云流水的画风、这触动心灵的表现力，我对你的仰慕已久无法自拔！",
  "你就是当代的毕加索，你的画已久超越了这个时代！",
  "终于等到你，还好没放弃，传说中的画圣！"
];
canvasShare.addEventListener('click', function(e) {
  //弹出结果框，有按钮引导到微信上
  //随机生成结果
  if( ram == -1) {
    ram = Math.floor(Math.random() * 4);
  }
  shareModel.children[0].innerText = result[ram];
  shareModel.style.display = "block";
});
shareBtn.addEventListener('click', function(e) {
  shareModel.style.display = "none";
  console.log("分享到微信");
});

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