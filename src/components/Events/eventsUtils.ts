export const handlePrint = (title: string) => {
    const contentEl = document.querySelector('.printable');
    if (!contentEl) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const styleProperties = [
        'font', 'font-family', 'font-size', 'font-weight',
        'font-style', 'line-height', 'letter-spacing', 'word-spacing',
        'border', 'border-collapse', 'border-spacing',
        'padding', 'text-align', 'vertical-align',
        'background', 'background-color', 'width',
        'margin', 'margin-bottom',
      ];

    const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
            try {
                return Array.from(styleSheet.cssRules || [])
                    .filter(rule => {
                        if (rule instanceof CSSStyleRule) {
                            return styleProperties.some(prop => rule.style.getPropertyValue(prop));
                        }
                        return false;
                    })
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                return '';
            }
        })
        .join('\n');

    printWindow.document.write(`
        <html dir='rtl'>
            <head>
                <title>${title}</title>
                <style>
                    @media print {
                        html, body {
                            overflow: visible !important;
                        }

                        ::-webkit-scrollbar {
                            display: none;
                        }

                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                        }

                        * {
                            break-inside: avoid;
                        }

                        .page-break {
                            page-break-before: always;
                        }

                        ul {
                            padding-right: 20px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 16px;
                        }

                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                        }
                    }
                    ${styles}
                </style>
            </head>
            <body>
                ${contentEl.innerHTML}
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
};
