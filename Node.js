const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const sharp = require('sharp'); // For image conversions

const app = express();
app.use(express.static('public')); // Serve frontend files
app.use(fileUpload());

// Route to handle file conversion
app.post('/convert', async (req, res) => {
    const file = req.files.file;
    const format = req.body.format;

    if (format === 'zip') {
        const output = fs.createWriteStream(path.join(__dirname, 'public', 'output.zip'));
        const archive = archiver('zip');
        output.on('close', () => {
            res.download(path.join(__dirname, 'public', 'output.zip'));
        });
        archive.pipe(output);
        archive.append(file.data, { name: file.name });
        archive.finalize();
    } else if (format === 'pdf') {
        // Implement PDF conversion logic here
        res.status(500).send('PDF conversion not implemented yet.');
    } else if (format === 'jpg' || format === 'png') {
        // Image conversion using sharp
        sharp(file.data)
            .toFormat(format)
            .toBuffer()
            .then(outputBuffer => {
                res.set('Content-Type', `image/${format}`);
                res.send(outputBuffer);
            })
            .catch(err => res.status(500).send('Error processing image'));
    } else {
        res.status(400).send('Unsupported format');
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
