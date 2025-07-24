
export const handlePrint = () => {
    const contentEl = document.querySelector('.event-summary-modal .printable');
    if (!contentEl) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    // Copy styles from main document
    const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
            try {
                return Array.from(styleSheet.cssRules || [])
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                return ''; // Handle cross-origin stylesheets
            }
        })
        .join('\n');

    printWindow.document.write(`
        <html dir='rtl'>
            <head>
                <title>Print Summary</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 16px;
                        margin: 0;
                        overflow: visible;
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
    printWindow.print();
    printWindow.close();
};