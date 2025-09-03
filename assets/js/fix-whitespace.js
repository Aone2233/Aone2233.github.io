// 智能代码块修复 - 基于原始markdown结构重建格式
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有代码块中的格式问题
        const codeBlocks = document.querySelectorAll('.highlight pre, .markdown-body pre');
        
        console.log('找到代码块数量:', codeBlocks.length);
        
        codeBlocks.forEach(function(codeBlock, index) {
            console.log('处理代码块', index);
            
            // 获取原始HTML内容
            const originalHTML = codeBlock.innerHTML;
            
            // 重建代码格式
            const rebuiltHTML = rebuildCodeStructure(originalHTML);
            
            console.log('原始HTML:', originalHTML.substring(0, 200));
            console.log('重建后HTML:', rebuiltHTML.substring(0, 200));
            
            // 只有当内容有变化时才更新
            if (rebuiltHTML !== originalHTML) {
                codeBlock.innerHTML = rebuiltHTML;
                console.log('代码块', index, '已更新');
            }
        });
    });
    
    function rebuildCodeStructure(html) {
        // 1. 移除所有.w span标签，替换为适当的空格
        let rebuilt = html.replace(/<span class="w">([^<]*?)<\/span>/g, function(match, content) {
            // 计算原始内容中的空格数量
            const spaceCount = (content.match(/\s/g) || []).length;
            return ' '.repeat(Math.max(1, spaceCount));
        });
        
        // 2. 识别注释行并在前后添加换行
        rebuilt = rebuilt.replace(/(<span class="c">[^<]*<\/span>)/g, function(match) {
            // 检查是否是PowerShell注释（以#开头）
            if (match.includes('#')) {
                return '<br>' + match + '<br>';
            }
            return match;
        });
        
        // 3. 清理多余的换行
        rebuilt = rebuilt.replace(/<br>\s*<br>\s*<br>/g, '<br><br>');
        rebuilt = rebuilt.replace(/^\s*<br>|<br>\s*$/g, '');
        
        // 4. 处理span标签之间的间距
        rebuilt = rebuilt.replace(/<\/span>\s*<span/g, '</span> <span');
        
        // 5. 确保代码块开始和结束格式正确
        rebuilt = rebuilt.trim();
        
        return rebuilt;
    }
})();