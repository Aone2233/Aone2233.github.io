// 代码块复制功能 - 使用真实DOM元素
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
        const code = codeBlock.querySelector('pre code');
        if (!code) return;
        
        // 获取纯文本内容
        let text = code.textContent || code.innerText;
        
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
            copyButton.textContent = originalText;
            copyButton.style.background = originalBackground;
            copyButton.style.borderColor = originalBorderColor;
        }, 2000);
    }
})();