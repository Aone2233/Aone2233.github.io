// 代码块复制功能
(function() {
    'use strict';
    
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 为所有代码块添加复制功能
        const codeBlocks = document.querySelectorAll('.markdown-body .highlight');
        
        codeBlocks.forEach(function(block) {
            // 创建复制按钮 (使用CSS伪元素，这里添加点击事件)
            block.addEventListener('click', function(e) {
                // 检查是否点击了复制区域 (右上角)
                const rect = block.getBoundingClientRect();
                const clickX = e.clientX - rect.right;
                const clickY = e.clientY - rect.top;
                
                // 复制按钮区域大小约为 60x30 像素
                if (clickX >= -60 && clickX <= 0 && clickY >= 0 && clickY <= 30) {
                    e.preventDefault();
                    copyCodeToClipboard(block);
                }
            });
            
            // 鼠标悬停时改变光标样式
            block.addEventListener('mousemove', function(e) {
                const rect = block.getBoundingClientRect();
                const hoverX = e.clientX - rect.right;
                const hoverY = e.clientY - rect.top;
                
                if (hoverX >= -60 && hoverX <= 0 && hoverY >= 0 && hoverY <= 30) {
                    block.style.cursor = 'pointer';
                } else {
                    block.style.cursor = 'text';
                }
            });
            
            block.addEventListener('mouseleave', function() {
                block.style.cursor = 'text';
            });
        });
    });
    
    function copyCodeToClipboard(codeBlock) {
        const code = codeBlock.querySelector('pre code');
        if (!code) return;
        
        // 获取纯文本内容
        let text = code.textContent || code.innerText;
        
        // 移除行号（如果有的话）
        text = text.replace(/^\s*\d+\s+/gm, '');
        
        // 使用现代 API 复制到剪贴板
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                showCopyFeedback(codeBlock, '已复制!');
            }).catch(function() {
                fallbackCopyToClipboard(text, codeBlock);
            });
        } else {
            fallbackCopyToClipboard(text, codeBlock);
        }
    }
    
    function fallbackCopyToClipboard(text, codeBlock) {
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
            showCopyFeedback(codeBlock, '已复制!');
        } catch (err) {
            showCopyFeedback(codeBlock, '复制失败');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback(codeBlock, message) {
        // 临时改变复制按钮文本
        const styleId = 'copy-feedback-' + Date.now();
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .highlight::after {
                content: "${message}" !important;
                background: rgba(46, 160, 67, 0.9) !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
        
        // 2秒后恢复原始状态
        setTimeout(function() {
            const feedbackStyle = document.getElementById(styleId);
            if (feedbackStyle) {
                feedbackStyle.remove();
            }
        }, 2000);
    }
    
    // 添加键盘快捷键支持 (Ctrl+C 在代码块内)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                
                // 检查选择是否在代码块内
                let codeBlock = container.nodeType === Node.TEXT_NODE ? 
                    container.parentElement : container;
                
                while (codeBlock && !codeBlock.classList.contains('highlight')) {
                    codeBlock = codeBlock.parentElement;
                }
                
                if (codeBlock && selection.toString().trim() === '') {
                    // 如果在代码块内但没有选择文本，复制整个代码块
                    e.preventDefault();
                    copyCodeToClipboard(codeBlock);
                }
            }
        }
    });
})();