const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

class MiraEditsMinifier {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.cssDir = path.join(this.rootDir, 'css');
        this.jsDir = path.join(this.rootDir, 'js');
        this.distDir = path.join(this.rootDir, 'dist');
        
        this.cleanCSS = new CleanCSS({
            level: 2,
            returnPromise: true,
            sourceMap: true,
            compatibility: 'ie11',
            format: 'beautify'
        });
        
        this.uglifyOptions = {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                unsafe: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            mangle: {
                safari10: true,
                reserved: ['MiraEdits', 'DarkMode']
            },
            output: {
                comments: false,
                beautify: false
            },
            sourceMap: {
                filename: 'main.min.js',
                url: 'main.min.js.map'
            }
        };
    }
    
    // Ensure directories exist
    ensureDirectories() {
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true });
        }
        
        const cssDistDir = path.join(this.distDir, 'css');
        const jsDistDir = path.join(this.distDir, 'js');
        
        if (!fs.existsSync(cssDistDir)) {
            fs.mkdirSync(cssDistDir, { recursive: true });
        }
        
        if (!fs.existsSync(jsDistDir)) {
            fs.mkdirSync(jsDistDir, { recursive: true });
        }
    }
    
    // Minify CSS files
    async minifyCSS() {
        console.log('🎨 Starting CSS minification...');
        
        try {
            const cssFiles = ['style.css', 'dark-mode.css'];
            const minifiedFiles = [];
            
            for (const file of cssFiles) {
                const filePath = path.join(this.cssDir, file);
                
                if (fs.existsSync(filePath)) {
                    console.log(`  📄 Processing ${file}...`);
                    
                    const css = fs.readFileSync(filePath, 'utf8');
                    const result = await this.cleanCSS.minify(css);
                    
                    if (result.errors.length > 0) {
                        console.error(`❌ CSS Errors in ${file}:`, result.errors);
                        continue;
                    }
                    
                    if (result.warnings.length > 0) {
                        console.warn(`⚠️  CSS Warnings in ${file}:`, result.warnings);
                    }
                    
                    const outputFile = file.replace('.css', '.min.css');
                    const outputPath = path.join(this.distDir, 'css', outputFile);
                    
                    fs.writeFileSync(outputPath, result.styles);
                    
                    // Write source map if available
                    if (result.sourceMap) {
                        fs.writeFileSync(outputPath + '.map', result.sourceMap.toString());
                    }
                    
                    const originalSize = Buffer.byteLength(css, 'utf8');
                    const minifiedSize = Buffer.byteLength(result.styles, 'utf8');
                    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
                    
                    console.log(`  ✅ ${outputFile} created`);
                    console.log(`     Original: ${(originalSize / 1024).toFixed(1)}KB`);
                    console.log(`     Minified: ${(minifiedSize / 1024).toFixed(1)}KB`);
                    console.log(`     Savings: ${savings}%`);
                    
                    minifiedFiles.push({
                        original: file,
                        minified: outputFile,
                        originalSize,
                        minifiedSize,
                        savings: parseFloat(savings)
                    });
                } else {
                    console.warn(`⚠️  CSS file not found: ${file}`);
                }
            }
            
            return minifiedFiles;
            
        } catch (error) {
            console.error('❌ CSS minification failed:', error);
            throw error;
        }
    }
    
    // Minify JavaScript files
    async minifyJS() {
        console.log('📜 Starting JavaScript minification...');
        
        try {
            const jsFiles = ['main.js', 'video-modal.js', 'dark-mode.js'];
            const minifiedFiles = [];
            
            for (const file of jsFiles) {
                const filePath = path.join(this.jsDir, file);
                
                if (fs.existsSync(filePath)) {
                    console.log(`  📄 Processing ${file}...`);
                    
                    const js = fs.readFileSync(filePath, 'utf8');
                    const result = UglifyJS.minify(js, this.uglifyOptions);
                    
                    if (result.error) {
                        console.error(`❌ JS Error in ${file}:`, result.error);
                        continue;
                    }
                    
                    const outputFile = file.replace('.js', '.min.js');
                    const outputPath = path.join(this.distDir, 'js', outputFile);
                    
                    fs.writeFileSync(outputPath, result.code);
                    
                    // Write source map if available
                    if (result.map) {
                        fs.writeFileSync(outputPath + '.map', result.map);
                    }
                    
                    const originalSize = Buffer.byteLength(js, 'utf8');
                    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
                    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
                    
                    console.log(`  ✅ ${outputFile} created`);
                    console.log(`     Original: ${(originalSize / 1024).toFixed(1)}KB`);
                    console.log(`     Minified: ${(minifiedSize / 1024).toFixed(1)}KB`);
                    console.log(`     Savings: ${savings}%`);
                    
                    minifiedFiles.push({
                        original: file,
                        minified: outputFile,
                        originalSize,
                        minifiedSize,
                        savings: parseFloat(savings)
                    });
                } else {
                    console.warn(`⚠️  JS file not found: ${file}`);
                }
            }
            
            return minifiedFiles;
            
        } catch (error) {
            console.error('❌ JavaScript minification failed:', error);
            throw error;
        }
    }
    
    // Generate HTML template with minified assets
    generateProductionHTML() {
        console.log('📄 Generating production HTML...');
        
        try {
            const indexPath = path.join(this.rootDir, 'index.html');
            const prodIndexPath = path.join(this.distDir, 'index.html');
            
            let html = fs.readFileSync(indexPath, 'utf8');
            
            // Replace CSS links with minified versions
            html = html.replace(/href="css\/style\.css"/, 'href="css/style.min.css"');
            html = html.replace(/href="css\/dark-mode\.css"/, 'href="css/dark-mode.min.css"');
            
            // Replace JS src with minified versions
            html = html.replace(/src="js\/main\.js"/, 'src="js/main.min.js"');
            html = html.replace(/src="js\/video-modal\.js"/, 'src="js/video-modal.min.js"');
            html = html.replace(/src="js\/dark-mode\.js"/, 'src="js/dark-mode.min.js"');
            
            // Add production meta tags
            const productionMeta = `
    <!-- Production Build Meta -->
    <meta name="build-date" content="${new Date().toISOString()}">
    <meta name="build-version" content="1.0.0">
    <!-- End Production Meta -->`;
            
            html = html.replace('</head>', productionMeta + '\n</head>');
            
            fs.writeFileSync(prodIndexPath, html);
            console.log('  ✅ Production index.html created');
            
        } catch (error) {
            console.error('❌ HTML generation failed:', error);
            throw error;
        }
    }
    
    // Generate build report
    generateBuildReport(cssFiles, jsFiles) {
        const report = {
            buildDate: new Date().toISOString(),
            css: cssFiles,
            js: jsFiles,
            totalSavings: {
                originalSize: [...cssFiles, ...jsFiles].reduce((sum, file) => sum + file.originalSize, 0),
                minifiedSize: [...cssFiles, ...jsFiles].reduce((sum, file) => sum + file.minifiedSize, 0)
            }
        };
        
        report.totalSavings.savings = ((report.totalSavings.originalSize - report.totalSavings.minifiedSize) / report.totalSavings.originalSize * 100).toFixed(1);
        
        const reportPath = path.join(this.distDir, 'build-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n📊 Build Report:');
        console.log(`   Total Original Size: ${(report.totalSavings.originalSize / 1024).toFixed(1)}KB`);
        console.log(`   Total Minified Size: ${(report.totalSavings.minifiedSize / 1024).toFixed(1)}KB`);
        console.log(`   Total Savings: ${report.totalSavings.savings}%`);
        console.log(`   📄 Report saved to: build-report.json`);
    }
    
    // Main build function
    async build() {
        console.log('🚀 Starting MiraEdits production build...\n');
        
        try {
            this.ensureDirectories();
            
            const cssFiles = await this.minifyCSS();
            console.log('');
            
            const jsFiles = await this.minifyJS();
            console.log('');
            
            this.generateProductionHTML();
            console.log('');
            
            this.generateBuildReport(cssFiles, jsFiles);
            
            console.log('\n✅ Build completed successfully!');
            console.log('📁 Production files available in: ./dist/');
            
        } catch (error) {
            console.error('\n❌ Build failed:', error);
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const minifier = new MiraEditsMinifier();
    minifier.build();
}

module.exports = MiraEditsMinifier;