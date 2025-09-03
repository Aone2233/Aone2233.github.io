// 修复Rouge代码高亮器空白字符问题
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有代码块中的空白字符span标签
        const codeBlocks = document.querySelectorAll('.highlight pre, .markdown-body pre');
        
        codeBlocks.forEach(function(codeBlock) {
            // 修复.w span标签：移除包含换行符的.w span，保留包含空格的.w span
            const wSpans = codeBlock.querySelectorAll('.w');
            wSpans.forEach(function(wSpan) {
                const textContent = wSpan.textContent || wSpan.innerText || '';
                
                // 如果.w span包含换行符，移除整个span
                if (textContent.includes('\n') || textContent.includes('\r')) {
                    wSpan.parentNode.removeChild(wSpan);
                }
                // 如果.w span只包含空格，替换为单个空格
                else if (textContent.trim() === '') {
                    const space = document.createTextNode(' ');
                    wSpan.parentNode.replaceChild(space, wSpan);
                }
                // 其他情况保持不变
            });
            
            // 修复span标签之间的换行符：移除span标签之间的空白换行
            const spans = codeBlock.querySelectorAll('span');
            spans.forEach(function(span) {
                // 移除span标签之前的空白文本节点（主要是换行符）
                let prevSibling = span.previousSibling;
                while (prevSibling && prevSibling.nodeType === 3 && prevSibling.textContent.trim() === '') {
                    const toRemove = prevSibling;
                    prevSibling = prevSibling.previousSibling;
                    toRemove.parentNode.removeChild(toRemove);
                }
            });
            
            // 清理代码块内容，移除多余的空行但保留有意义的换行
            let htmlContent = codeBlock.innerHTML;
            
            // 移除空行中的注释和代码之间的多余换行
            htmlContent = htmlContent.replace(/<\/span>\s*<span class="c">/g, '</span><br><span class="c">');
            
            // 确保注释后有换行
            htmlContent = htmlContent.replace(/(<\/span><span class="c">[^<]*<\/span>)(?!\s*<br>)/g, '$1<br>');
            
            // 应用修改
            if (htmlContent !== codeBlock.innerHTML) {
                codeBlock.innerHTML = htmlContent;
            }
        });
    });
})();