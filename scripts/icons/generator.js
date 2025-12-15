'use strict;';

const webfontsGenerator = require('webfonts-generator');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const files = fs.readdirSync('src/assets/icons').map(file => path.join('src/assets/icons', file));

const fontPath = path.join('src/assets/fonts', 'argo-icon');
const fontName = 'argo-icon';

webfontsGenerator({
    files: files,
    dest: fontPath,
    fontName: fontName,
    cssDest: path.join(fontPath, fontName + '.css'),
    cssTemplate: 'src/assets/icons-template/template.hbs'
}, function (error) {
    if (error) {
        console.log('Fail!', error);
    } else {
        // fix issue with generated fonts, ensure that quotes are used for glyps path in SVG font, otherwise it fails to render in Safari/Firefox
        const svgContent = fs.readFileSync(
            `${fontPath}/${fontName}.svg`
        ).toString().replace(/glyph-name="([^"]*)"/g, 'glyph-name="$1" unicode="$1"');
        fs.writeFileSync(`${fontPath}/${fontName}.svg`, svgContent);
        const scss = fs.readFileSync('src/assets/fonts/argo-icon.scss').toString().replace(new RegExp("url\\(\"./argo-icon"), "url(\"../fonts/argo-icon");
        fs.writeFileSync('src/styles/argo-icon.scss', scss);
        fs.unlinkSync('src/assets/fonts/argo-icon.css');
        // set generated files permissions to 644 as git treats 755 as changes
        execSync(
            'chmod 644 ' + [
            `${fontName}.svg`,
            `${fontName}.eot`,
            `${fontName}.woff2`,
            `${fontName}.woff`,
            `${fontName}.ttf`
        ].map(name => path.join(fontPath, name)).join(' ') + ' && yarn lint' // lint after generation
        );
        console.log('Done!');
    }
});
