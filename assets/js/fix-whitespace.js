// 修复Rouge代码高亮器空白字符问题
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有代码块中的空白字符span标签
        const codeBlocks = document.querySelectorAll('.highlight pre, .markdown-body pre');
        
        console.log('找到代码块数量:', codeBlocks.length);
        
        codeBlocks.forEach(function(codeBlock, index) {
            console.log('处理代码块', index);
            
            // 克隆节点以避免修改原始DOM
            const clonedBlock = codeBlock.cloneNode(true);
            
            // 处理所有子节点
            const processNode = function(node) {
                if (node.nodeType === 1) { // 元素节点
                    const tagName = node.tagName.toLowerCase();
                    
                    if (tagName === 'span' && node.className === 'w') {
                        // 将.w span标签替换为文本节点
                        const textNode = document.createTextNode(node.textContent || '');
                        node.parentNode.replaceChild(textNode, node);
                    } else if (tagName === 'span' && node.className === 'c') {
                        // 注释span标签，在其后添加换行
                        const br = document.createElement('br');
                        node.parentNode.insertBefore(br, node.nextSibling);
                    } else {
                        // 递归处理子节点
                        Array.from(node.childNodes).forEach(processNode);
                    }
                }
            };
            
            // 处理克隆的节点
            Array.from(clonedBlock.childNodes).forEach(processNode);
            
            // 获取处理后的HTML
            const newHTML = clonedBlock.innerHTML;
            const originalHTML = codeBlock.innerHTML;
            
            console.log('原始HTML:', originalHTML.substring(0, 200));
            console.log('处理后HTML:', newHTML.substring(0, 200));
            
            // 只有当内容有变化时才更新
            if (newHTML !== originalHTML) {
                codeBlock.innerHTML = newHTML;
                console.log('代码块', index, '已更新');
            }
        });
    });
})();