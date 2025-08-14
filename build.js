const fs = require('fs').promises;
const path = require('path');

class GameBuilder {
    constructor() {
        this.srcDir = 'src';
        this.buildDir = 'build';
    }

    async build() {
        console.log('Starting modular build process...');
        
        try {
            // Ensure build directory exists
            await this.ensureDir(this.buildDir);
            
            // Read the template HTML
            const templatePath = path.join(this.srcDir, 'index.html');
            let html = await fs.readFile(templatePath, 'utf-8');
            
            // Read and combine all .tw passage files
            const storyData = await this.buildStoryData();
            
            // Inject story data into HTML
            html = html.replace(
                '<!-- Story content will be injected here by build system -->',
                storyData
            );
            
            // Write the final HTML file
            const outputPath = path.join(this.buildDir, 'index.html');
            await fs.writeFile(outputPath, html, 'utf-8');
            
            // Copy data files for runtime loading
            await this.copyDirectory(path.join(this.srcDir, 'data'), path.join(this.buildDir, 'src', 'data'));
            await this.copyDirectory(path.join(this.srcDir, 'styles'), path.join(this.buildDir, 'styles'));
            await this.copyDirectory(path.join(this.srcDir, 'scripts'), path.join(this.buildDir, 'scripts'));
            
            console.log('Modular build completed successfully!');
            console.log(`Output: ${outputPath}`);
            
        } catch (error) {
            console.error('Build failed:', error);
            process.exit(1);
        }
    }
    
    async buildStoryData() {
        const passagesDir = path.join(this.srcDir, 'passages');
        const passages = [];
        
        // Collect all .tw files
        const twFiles = await this.findTwineFiles(passagesDir);
        console.log(`Found ${twFiles.length} passage files:`, twFiles.map(f => path.relative(this.srcDir, f)));
        
        for (const file of twFiles) {
            const content = await fs.readFile(file, 'utf-8');
            passages.push(content);
        }
        
        // Combine all passage content
        const allPassageContent = passages.join('\n\n');
        
        // Convert to proper Twine XML format and wrap in story data
        const xmlPassages = this.convertToTwineFormat(allPassageContent);
        
        return `
<tw-storydata name="Таинственное поместье" startnode="1" creator="Twine" creator-version="2.3.16" ifid="12345678-ABCD-EFGH-IJKL-9876543210AB" format="SugarCube" format-version="2.36.1" options="" tags="" zoom="1" hidden>
${xmlPassages}
</tw-storydata>
<script role="script" id="twine-user-script" type="text/twine-javascript"></script>`;
    }
    
    async findTwineFiles(dir) {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                const subFiles = await this.findTwineFiles(fullPath);
                files.push(...subFiles);
            } else if (entry.name.endsWith('.tw')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }
    
    convertToTwineFormat(content) {
        // Split content by passage markers (::)
        const passageBlocks = content.split('::').filter(p => p.trim());
        let pid = 1;
        let xmlPassages = '';
        
        for (const block of passageBlocks) {
            const lines = block.trim().split('\n');
            if (lines.length === 0) continue;
            
            const headerLine = lines[0].trim();
            const passageContent = lines.slice(1).join('\n').trim();
            
            // Parse header: "PassageName {"position":"x,y","tags":"tag1 tag2"}"
            const headerMatch = headerLine.match(/^(.+?)(?:\s*\{(.+)\})?$/);
            if (!headerMatch) continue;
            
            const passageName = headerMatch[1].trim();
            const attributes = headerMatch[2] || '';
            
            // Parse attributes
            let position = `${100 + (pid * 150)},100`;
            let tags = "";
            
            if (attributes) {
                const posMatch = attributes.match(/"position"\s*:\s*"([^"]+)"/);
                const tagsMatch = attributes.match(/"tags"\s*:\s*"([^"]+)"/);
                
                if (posMatch) position = posMatch[1];
                if (tagsMatch) tags = tagsMatch[1];
            }
            
            xmlPassages += `
<tw-passagedata pid="${pid}" name="${passageName}" tags="${tags}" position="${position}">
${passageContent}
</tw-passagedata>`;
            
            pid++;
        }
        
        return xmlPassages;
    }
    
    async ensureDir(dir) {
        try {
            await fs.mkdir(dir, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
        }
    }
    
    async copyDirectory(src, dest) {
        await this.ensureDir(dest);
        
        try {
            const entries = await fs.readdir(src, { withFileTypes: true });
            
            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                
                if (entry.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath);
                } else {
                    await fs.copyFile(srcPath, destPath);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not copy ${src} to ${dest}:`, error.message);
        }
    }
}

// Run the build
const builder = new GameBuilder();
builder.build();