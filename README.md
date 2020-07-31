# JavaScript3DRenderer
Mini 3D Renderer by JavaScript (canvas version).

项目代码：https://github.com/foupwang/JavaScript3DRenderer
编辑器：VSCode
运行环境：Chrome浏览器
QQ交流群：1148938167（欢迎加入探讨图形渲染技术）

软件光栅化渲染器，是指用CPU（软件）实现GPU（硬件）绘图的功能。在现实环境中，因为OpenGL/Direct3D/游戏引擎的存在，我们基本接触不到光栅化过程中的细节，通过自己用纯代码实现光栅化，可以熟悉常用的图形算法，对渲染管线有更深刻的认识。

我将从一个最简单的画点函数开始，一小节一小节地实践怎么画一条直线，怎么填充三角形，怎么逐步加入背面剔除、深度测试、透视相机、着色器等高级功能。

本项目大部分代码基于André LaMothe大神写的《3D游戏编程大师技巧》，原书的C/C++代码，我把它改成了JavaScript实现，主要原因是JavaScript运行环境简单，只要有浏览器就可以。
