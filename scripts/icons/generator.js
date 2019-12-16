'use strict;';

const webfontsGenerator = require('webfonts-generator');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const FONT_TYPES = ['svg', 'ttf', 'woff', 'eot'];

webfontsGenerator({
    files: glob.sync('src/styles/icons/*.svg'),
    dest: 'src/assets/fonts',
    fontName: 'argo-icon',
    types: FONT_TYPES,
    cssTemplate: path.resolve(__dirname, './scss.hbs'),
    templateOptions: {
        baseTag: 'i',
        classPrefix: 'argo-icon-',
        baseSelector: '.argo-icon'
    }
}, function (error) {
    if (error) {
        console.log('Fail!', error);
    } else {
        const scss = fs.readFileSync('src/assets/fonts/argo-icon.css', 'utf-8').replace(/url\(\"argo-icon/g, 'url\($argo-icon-fonts-root + \"argo-icon');
        fs.writeFileSync('src/styles/argo-icon.scss', scss);
        fs.unlinkSync('src/assets/fonts/argo-icon.css');
    }
});
