// 代码块复制功能 - 彻底修复换行问题
(function() {
    'use strict';
    
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 为所有代码块添加复制功能
        const codeBlocks = document.querySelectorAll('.markdown-body .highlight');
        
        codeBlocks.forEach(function(block, index) {
            // 确保容器有相对定位
            block.style.position = 'relative';
            
            // 检查是否已有复制按钮，避免重复创建
            if (block.querySelector('.copy-button')) {
                return;
            }
            
            // 创建真实的复制按钮DOM元素
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.setAttribute('data-code-block-id', 'code-block-' + index);
            copyButton.textContent = '复制';
            copyButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.25);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 5px;
                padding: 8px 12px;
                font-size: 12px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                cursor: pointer;
                z-index: 9999;
                line-height: 1.2;
                white-space: nowrap;
                transition: all 0.2s ease;
                opacity: 0.9;
            `;
            
            // 悬停效果
            copyButton.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.background = 'rgba(255, 255, 255, 0.35)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                this.style.transform = 'scale(1.02)';
            });
            
            copyButton.addEventListener('mouseleave', function() {
                this.style.opacity = '0.9';
                this.style.background = 'rgba(255, 255, 255, 0.25)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                this.style.transform = 'scale(1)';
            });
            
            // 点击复制事件
            copyButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                copyCodeToClipboard(block, copyButton);
            });
            
            // 添加到代码块
            block.appendChild(copyButton);
        });
    });
    
    function copyCodeToClipboard(codeBlock, copyButton) {
        const codeElement = codeBlock.querySelector('pre code');
        if (!codeElement) return;
        
        // 获取处理后的纯文本内容，保持原有换行格式
        let text = extractCodeWithProperLineBreaks(codeElement);
        
        // 移除行号（如果有的话）
        text = text.replace(/^\s*\d+\s+/gm, '');
        
        // 使用现代 API 复制到剪贴板
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                showCopyFeedback(copyButton, '已复制!');
            }).catch(function() {
                fallbackCopyToClipboard(text, copyButton);
            });
        } else {
            fallbackCopyToClipboard(text, copyButton);
        }
    }
    
    function extractCodeWithProperLineBreaks(codeElement) {
        // 获取HTML内容
        const html = codeElement.innerHTML;
        
        // 重建文本格式，与显示保持一致
        let text = rebuildTextFromHTML(html);
        
        // 清理格式
        text = text.replace(/\s+/g, ' ');  // 多个空格变为一个
        text = text.replace(/\n\s*\n/g, '\n');  // 多个换行变为一个
        text = text.replace(/^\s+|\s+$/g, '');  // 去除首尾空格
        
        return text;
    }
    
    function rebuildTextFromHTML(html) {
        // 1. 移除所有.w span标签，替换为适当的空格
        let text = html.replace(/<span class="w">[^<]*?<\/span>/g, ' ');
        
        // 2. 处理注释行，确保它们独占一行
        text = text.replace(/<span class="c">([^<]*?)<\/span>/g, function(match, content) {
            // 如果是PowerShell注释（以#开头），确保换行
            if (content.trim().startsWith('#')) {
                return '\n' + content + '\n';
            }
            return content;
        });
        
        // 3. 移除所有其他HTML标签
        text = text.replace(/<[^>]*>/g, '');
        
        // 4. 处理HTML实体
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&amp;/g, '&');
        
        // 5. 清理多余的空格和换行
        text = text.replace(/\n\s*\n\s*\n/g, '\n\n');  // 最多两个连续换行
        text = text.replace(/^\s+|\s+$/g, '');  // 去除首尾空格
        
        return text;
    }
    
    function fallbackCopyToClipboard(text, copyButton) {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        try {
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            showCopyFeedback(copyButton, '已复制!');
        } catch (err) {
            showCopyFeedback(copyButton, '复制失败');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback(copyButton, message) {
        // 只操作当前点击的按钮
        if (!copyButton) return;
        
        // 保存原始文本和样式
        const originalText = copyButton.textContent;
        const originalBackground = copyButton.style.background;
        const originalBorderColor = copyButton.style.borderColor;
        
        // 显示反馈
        copyButton.textContent = message;
        copyButton.style.background = 'rgba(46, 160, 67, 0.9)';
        copyButton.style.borderColor = 'rgba(46, 160, 67, 0.9)';
        
        // 2秒后恢复原始状态
        setTimeout(function() {
            // 确保按钮还存在再操作
            if (copyButton && copyButton.parentNode) {
                copyButton.textContent = originalText;
                copyButton.style.background = originalBackground;
                copyButton.style.borderColor = originalBorderColor;
            }
        }, 2000);
    }
})();