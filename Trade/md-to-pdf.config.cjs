module.exports = {
    launch_options: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--enable-local-file-accesses'
        ]
    },
    pdf_options: {
        format: 'A4',
        margin: {
            top: '0mm',
            bottom: '0mm',
            left: '0mm',
            right: '0mm'
        },
        printBackground: true,
        waitUntil: 'networkidle0'
    }
};
