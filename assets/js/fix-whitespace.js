// 修复Rouge代码高亮器空白字符问题
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有代码块中的空白字符span标签
        const codeBlocks = document.querySelectorAll('.highlight pre, .markdown-body pre');
        
        console.log('找到代码块数量:', codeBlocks.length);
        
        codeBlocks.forEach(function(codeBlock, index) {
            console.log('处理代码块', index, ':', codeBlock);
            
            // 获取原始HTML内容
            const originalHTML = codeBlock.innerHTML;
            console.log('原始HTML:', originalHTML.substring(0, 200));
            
            // 替换策略：将.w span标签中的换行符移除，但保留其他格式
            let fixedHTML = originalHTML;
            
            // 1. 将.w span标签中的换行符替换为空格
            fixedHTML = fixedHTML.replace(/<span class="w">([^<]*?)<\/span>/g, function(match, content) {
                // 只处理换行符，保留其他空白字符
                const cleanedContent = content.replace(/\n+/g, ' ');
                return cleanedContent;
            });
            
            // 2. 处理span标签之间的多余空白
            fixedHTML = fixedHTML.replace(/<\/span>\s+<span/g, '</span><span');
            
            console.log('修复后HTML:', fixedHTML.substring(0, 200));
            
            // 只有当内容有变化时才更新
            if (fixedHTML !== originalHTML) {
                codeBlock.innerHTML = fixedHTML;
                console.log('代码块', index, '已更新');
            }
        });
    });
})();