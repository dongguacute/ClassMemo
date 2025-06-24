"use client";
"use client";
import { useEffect, useState } from 'react';
import './markdown-content.css';

// Extend the Window interface to include our custom function
declare global {
  interface Window {
    toggleCollapse: (collapseId: string) => void;
  }
}

// 定义 TocItem 接口
interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 内容渲染器组件
function ContentRenderer({ content }: { content: string }) {
  useEffect(() => {
    // 添加折叠功能的全局函数
    window.toggleCollapse = (collapseId: string) => {
     const contentElement = document.getElementById(`content-${collapseId}`);
     const chevronElement = document.getElementById(`chevron-${collapseId}`);
    
     if (contentElement && chevronElement) {
       const isVisible = contentElement.style.display !== 'none';
       contentElement.style.display = isVisible ? 'none' : 'block';
       chevronElement.textContent = isVisible ? '▶' : '▼';
     }
    };

    // 初始化所有折叠区域为展开状态
    const collapsibleSections = document.querySelectorAll('.collapsible-content');
    collapsibleSections.forEach((section) => {
      (section as HTMLElement).style.display = 'block';
    });
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default function MarkdownContent({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [processedContent, setProcessedContent] = useState<string>('');

  // 处理特殊语法（提示框、折叠区域和CSV表格）
  // Helper function to escape HTML
  const escapeHtml = (unsafe: string): string => {
    const textMap: Record<string, string> = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#039;'
    };
    return unsafe.split('').map(char => textMap[char] || char).join('');
  };
  
  // Function to copy code to clipboard
  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optionally show a confirmation message (not implemented here)
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  const processSpecialSyntax = (content: string) => {
    let processed = content;
  
    // 处理CSV代码块转换为表格
    processed = processed.replace(
      /```csv\n([\s\S]*?)\n```/g,
      (match, csvContent) => {
        const lines = csvContent.trim().split('\n');
        if (lines.length === 0) return match;
  
        const headers = lines[0].split(',').map((h: string) => h.trim());
        const rows = lines.slice(1).map((line: string) => line.split(',').map((cell: string) => cell.trim()));
  
        let tableHtml = '<table class="csv-table">';
        tableHtml += '<thead><tr>';
        headers.forEach((header: string) => {
          tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
  
        rows.forEach((row: string[]) => {
          tableHtml += '<tr>';
          row.forEach((cell: string) => {
            tableHtml += `<td>${cell}</td>`;
          });
          tableHtml += '</tr>';
        });
  
        tableHtml += '</tbody></table>';
        return tableHtml;
      }
    );
  
    // 处理提示框语法: :::type title
    processed = processed.replace(
      /:::(\w+)(?:\s+(.+?))?\n([\s\S]*?):::/g,
      (match, type, title, innerContent) => {
        const alertId = `alert-${Math.random().toString(36).substr(2, 9)}`;
        return `<div class="alert-box alert-${type}" data-alert-type="${type}" data-alert-title="${title || ''}" data-alert-id="${alertId}">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              ${type === 'info' ? '🛈' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '❌'}
            </div>
            <div class="flex-1">
              ${title ? `<h4 class="font-semibold mb-2">${title}</h4>` : ''}
              <div>${innerContent.trim()}</div>
            </div>
          </div>
        </div>`;
      }
    );
  
    // 处理折叠区域语法: +++title
    processed = processed.replace(
      /\+\+\+(.+?)\n([\s\S]*?)\+\+\+/g,
      (match, title, innerContent) => {
        const collapseId = `collapse-${Math.random().toString(36).substr(2, 9)}`;
        return `<div class="collapsible-section" data-collapse-title="${title.trim()}" data-collapse-id="${collapseId}">
          <div class="collapsible-header" onclick="toggleCollapse('${collapseId}')">
            <span class="font-medium">${title.trim()}</span>
            <span class="chevron" id="chevron-${collapseId}">▼</span>
          </div>
          <div class="collapsible-content" id="content-${collapseId}" style="display: none;">
            ${innerContent.trim()}
          </div>
        </div>`;
      }
    );
  
    // 处理代码块
    processed = processed.replace(
      /```([\s\S]*?)```/g,
      (match, code) => {
        const language = match.split('```')[1]?.trim() || 'javascript';
        return `<div class="code-block">
          <pre><code class="language-${language}">${escapeHtml(code)}</code></pre>
          <button onclick="copyCode('${escapeHtml(code)}')">Copy</button>
        </div>`;
      }
    );
    
    // 处理删除线
    processed = processed.replace(
      /~~([\s\S]*?)~~/g,
      (match, text) => `<del>${text}</del>`
    );
  
    // 处理图片
    processed = processed.replace(
      /!\[\]\((.*?)\)/g,
      '<img src="$1" alt="" />'
    );
  
    return processed;
  };
  // 解析内容，提取标题用于目录
  useEffect(() => {
    const processed = processSpecialSyntax(content);
    setProcessedContent(processed);

    // 正则表达式匹配 HTML 中的标题
    const headingRegex = /<h([1-6])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[1-6]>/g;
    const tocItems: TocItem[] = [];
    let match;

    // 提取所有标题
    while ((match = headingRegex.exec(processed)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3];

      tocItems.push({ level, id, text });
    }

    setToc(tocItems);
  }, [content]);

  // 监听滚动，设置当前活动的标题
  useEffect(() => {
    const handleScroll = () => {
      if (toc.length === 0) return;

      const headingElements = toc.map(item =>
        document.getElementById(item.id)
      ).filter(Boolean);

      const headingPositions = headingElements.map(el => ({
        id: el?.id,
        position: el?.getBoundingClientRect().top || 0
      }));

      // 找到第一个在视口中或刚刚过去的标题
      const currentHeading = headingPositions.reduce((acc, curr) => {
        // 标题在视口顶部之上但最接近的
        if (curr.position < 100 && curr.position > -100) {
          return curr.id;
        }
        return acc;
      }, headingPositions[0]?.id);

      setActiveHeading(currentHeading ?? null);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [toc]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* 目录侧边栏 - 小屏幕隐藏，大屏幕显示 */}
      {toc.length > 0 && (
        <nav className="hidden md:block w-64 pr-8 sticky top-8 self-start">
          <h2 className="text-xl font-bold mb-4">Contents</h2>
          <ul className="space-y-2">
            {toc.map(item => (
              <li
                key={item.id}
                className={`
                  pl-${(item.level - 1) * 4}
                  ${activeHeading === item.id ? 'font-bold text-blue-600' : 'text-gray-700'}
                `}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* 主要内容区域 */}
      <div className="markdown-content flex-grow">
        <ContentRenderer content={processedContent} />
      </div>
    </div>
  );
}
