// 修复Rouge代码高亮器空白字符问题
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有代码块中的空白字符span标签
        const codeBlocks = document.querySelectorAll('.highlight pre, .markdown-body pre');
        
        codeBlocks.forEach(function(codeBlock) {
            // 获取所有子节点
            const childNodes = Array.from(codeBlock.childNodes);
            
            // 重新构建内容
            let newContent = '';
            let currentLineContent = '';
            
            childNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    const tagName = node.tagName.toLowerCase();
                    
                    if (tagName === 'span') {
                        const className = node.className || '';
                        const textContent = node.textContent || node.innerText || '';
                        
                        if (className === 'w') {
                            // 处理空白字符span
                            if (textContent.includes('\n')) {
                                // 如果包含换行符，结束当前行并开始新行
                                if (currentLineContent.trim()) {
                                    newContent += currentLineContent + '<br>';
                                    currentLineContent = '';
                                }
                            } else if (textContent.trim() === '') {
                                // 纯空格，添加到当前行
                                currentLineContent += ' ';
                            } else {
                                // 其他空白字符，添加到当前行
                                currentLineContent += textContent;
                            }
                        } else if (className === 'c' && textContent.trim().startsWith('#')) {
                            // 注释span，结束当前行并开始新行
                            if (currentLineContent.trim()) {
                                newContent += currentLineContent + '<br>';
                                currentLineContent = '';
                            }
                            currentLineContent += node.outerHTML + '<br>';
                            newContent += currentLineContent;
                            currentLineContent = '';
                        } else {
                            // 其他语法高亮span，添加到当前行
                            currentLineContent += node.outerHTML;
                        }
                    } else if (tagName === 'code') {
                        // code标签，处理其内容
                        currentLineContent += node.innerHTML;
                    }
                } else if (node.nodeType === 3) { // 文本节点
                    const textContent = node.textContent || '';
                    
                    if (textContent.includes('\n')) {
                        // 包含换行符的文本
                        const lines = textContent.split('\n');
                        lines.forEach(function(line, index) {
                            if (index > 0) {
                                // 换行，结束当前行
                                if (currentLineContent.trim()) {
                                    newContent += currentLineContent + '<br>';
                                    currentLineContent = '';
                                }
                            }
                            if (line.trim()) {
                                currentLineContent += line;
                            }
                        });
                    } else if (textContent.trim()) {
                        // 普通文本，添加到当前行
                        currentLineContent += textContent;
                    }
                }
            });
            
            // 添加最后一行
            if (currentLineContent.trim()) {
                newContent += currentLineContent;
            }
            
            // 替换代码块内容
            if (newContent !== codeBlock.innerHTML) {
                codeBlock.innerHTML = newContent;
            }
        });
    });
})();