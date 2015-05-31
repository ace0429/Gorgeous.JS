#[ Gorgeous.JS ](https://github.com/Foolyou/Gorgeous.JS)#

Gorgeous.JS是一个基于Canvas的图像处理库，它可以直接在浏览器中操作图像，内置多种滤镜，还可以方便地添加自定义效果。

## 已有特性 ##

 * 滤镜效果：支持多种平滑、锐化、边缘检测等基础操作，内置多种常用滤镜；
 * 图像存储：支持直接使用Canvas进行绘制，也可输出为HTML的 &lt;img&gt; 方便用户保存；
 * 方便扩展：所有的处理操作都可以注册别名，支持中文命名，而且可以方便地添加自定义滤镜；

## 计划中特性 ##

 * 空间操作：支持图片的旋转、缩放等空间操作；
 * 图片叠加：支持图片叠加方法以及透明度运算；
 * 频域操作：支持傅里叶变换，可以在频域对图片进行处理。

## Demo ##

```
//注册自定义效果“灰色浮雕”为组合使用“Emboss”和“gray”两种效果
g.register('灰色浮雕', ['Emboss'], ['gray']);

//加载图片并进行处理
g.loadImage('img/baboon.png', function (oimg) {
    var imd = new g.ImageData(oimg);
    imd.use('灰色浮雕').getImage(function (rimg) {
        //展示处理前后的图像
        document.body.appendChild(oimg);
        document.body.appendChild(rimg);
    });
})
```
效果如下：

![原始图像][1] ![处理后的图像][2]

----------

Github地址：https://github.com/Foolyou/Gorgeous.JS

邮箱： chen-an@outlook.com

知乎： [@陈安][zhihu]

----------


  [1]: http://foolyou.github.io/Gorgeous.JS/images/README/o.png
  [2]: http://foolyou.github.io/Gorgeous.JS/images/README/r.png
  [zhihu]: http://www.zhihu.com/people/foolyou

# 开始使用Gorgeous.JS #

##开胃菜##

首先我们做一个小Demo，大致了解Gorgeous的使用方式：

 1. 在[这里][3]获取Gorgeous.JS，也可以在[Github Repo][4]获取完整的仓库，执行<code>npm run build</code>（需要node.js环境）之后在build目录下获取gorgeous.min.js。
 2. 建立GorgeousStart目录，结构如下：
    
    ```
        GorgeousStart
            |--lib
                |--gorgeous.min.js
            |--img
                |--baboon.png
            |-index.html
    ```
    将gorgeous.min.js放入lib目录下，测试图片[baboon.png][5]放入img目录下。
 3. 编辑index.html如下：
    
    ```
<!DOCTYPE html>
<html>
	<head>
		<title>Gorgeous Start</title>
		<meta charset="utf-8" />
	</head>
	<body>
		<h1>Gorgeous 开胃菜</h1>
		<script src="lib/gorgeous.min.js"></script>
		<script>
                        //记得先将gorgeous命名空间简记为g，方便后续使用
			var g = gorgeous;
			var src = 'img/baboon.png';
			
			//载入大猩猩图片并使用它创建g.ImageData对象
			g.ImageData(src, function (imd) {
				//将图像灰度化并显示出来
				imd.use('gray').getImage(function (img) {
					document.body.appendChild(img);
				});
				//对灰度化后的图片进行直方图均衡化提高对比度
				imd.use('equalize').getImage(function (img) {
					document.body.appendChild(img);
				});
			});			
		</script>
	</body>
</html>
    ```

打开index.html网页，可以看到如下两幅图：

![灰度化][6] ![直方图均衡化][7]

[3]: https://raw.githubusercontent.com/Foolyou/Gorgeous.JS/master/build/gorgeous.min.js
[4]: https://github.com/Foolyou/Gorgeous.JS
[5]: https://github.com/Foolyou/Gorgeous.JS/blob/master/test/img/baboon.png
[6]: http://foolyou.github.io/Gorgeous.JS/images/README/startg.png
[7]: http://foolyou.github.io/Gorgeous.JS/images/README/starth.png

## 创建g.ImageData对象 ##

在上面的代码中，我们使用图片源地址来初始化g.ImageData对象。实际上在Gorgeous里，一共有六种方式可以创建g.ImageData对象：

 1. 使用图片源地址
    g.ImageData({string}, {function ({g.ImageData})})
    
    如上，向g.ImageData()传入两个参数，一个字符串src存储着图片源地址，以及一个回调函数callback，callback接受一个指向创建好的g.ImageData对象的参数imd。当图片加载成功，g.ImageData初始化完毕时，callback就会被调用。
    
    Example:
    ```
    g.ImageData('img/baboon.png', function (imd) {
        //Do someting with imd.
    });
    ```
    
 2. 使用加载好的&lt;img&gt;
    g.ImageData({Image})
    
    向构造函数传入一个Image对象，函数将返回一个指向创建好的g.ImageData对象的引用。
    
    Example:
    ```
    //获取Image对象img的代码
    //...
    var imd = g.ImageData(img);
    //Do something with imd
    ```
    Gorgeous提供了函数g.loadImage({string}, {function ({Image})})方便图片的动态加载。
    Example:
    ```
    g.loadImage('baboon.png', function (img) {
        var imd = g.ImageData(img);
        //Do something with img and imd.
    });
    ```
    
 3. 使用HTMLCanvasElement对象
    g.ImageData({HTMLCanvasElement})
    
    Gorgeous提供了g.makeCanvasContext(width, height)函数来创建Canvas，这个函数会返回一个CanvasRenderingContext2D对象ctx,你可以用ctx.canvas来获取HTMLCanvasElement。
    
    Example:
    ```
    //获取Canvas对象canvas的代码
    //...
    var imd = g.ImageData(canvas);
    //Do something with imd
    ```
 4. 使用CanvasRenderingContext2D对象
   g.ImageData({CanvasRenderingContext2D})
   
 5. 使用由Canvas获取的原生ImageData对象
   g.ImageData({ImageData})
   
 6. 使用已有的g.ImageData对象（相当于整体拷贝）
   g.ImageData({g.ImageData})

以上方式都会返回一个创建好的g.ImageData对象，你可以自由选择是否使用new运算符。实际上使用new来创建新对象会减少一次函数调用，但是一般来说这并不会带来多少性能提升，所以不必在意。