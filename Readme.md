

1. 监听了 selectchange 没有生效
2. 换行在最前面插入的
3. 输入一个字符加回车会报错误: Uncaught IndexSizeError: Failed to execute 'setStart' on 'Range': The offset -1 is larger than or equal to the node's length (0).editor.js:210 createRangeeditor.js:442 getCoordinateseditor.js:225 (anonymous function)utils.js:32 laterutils.js:16 (anonymous function)
猜测是getCoordinates里面有错误, 注释掉所有有关它的引用，就不会出现这个问题，但是有时候换行光标会不移动(实际上在后面插入了换行)
即使第一次不行，第二次一定行，感觉时false和true的转换

感觉：关键弄明白如何控制光标(使用range)

4. 刷新后，第一次输入会在后面插入字符