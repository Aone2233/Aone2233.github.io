// 简单的代码块修复 - 隐藏有问题的空白字符span标签
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 隐藏所有导致换行问题的.w span标签
        const whitespaceSpans = document.querySelectorAll('.highlight .w, .markdown-body .w');
        
        whitespaceSpans.forEach(function(span) {
            // 将span的内容替换为单个空格
            const textNode = document.createTextNode(' ');
            span.parentNode.replaceChild(textNode, span);
        });
        
        console.log('处理了', whitespaceSpans.length, '个空白字符span标签');
    });
})();