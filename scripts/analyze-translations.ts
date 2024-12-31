import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';
// Load existing UI translations to compare against
const uiTranslations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.twitter': 'Twitter',
    // ... other translations from ui.ts
  }
};

interface TranslationUsage {
  file: string;
  line: number;
  text: string;
  suggestedKey?: string;
  hasTranslation: boolean;
}

function extractTextFromAstro(content: string): { text: string; line: number }[] {
    const lines = content.split('\n');
  const results: { text: string; line: number }[] = [];

  // Pattern to match text between HTML tags, excluding:
  // - Variables/expressions in curly braces {variable}
  // - Import statements
  // - Script tags content
  // - Style tags content
  let inFrontmatter = false;
  let inScript = false;
  let inStyle = false;

  lines.forEach((line, index) => {
    // Track section markers
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      return;
    }
    if (line.includes('<script')) {
      inScript = true;
      return;
    }
    if (line.includes('</script>')) {
      inScript = false;
      return;
    }
    if (line.includes('<style')) {
      inStyle = true;
      return;
    }
    if (line.includes('</style>')) {
      inStyle = false;
      return;
    }

    // Skip if we're in frontmatter, script, or style sections
    if (inFrontmatter || inScript || inStyle) {
      return;
    }

    // Find hardcoded strings in HTML-like content
    const stringMatches = line.match(/>(.*?)</g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1).trim();
        if (text && !text.includes('{') && text.length > 1) {
          results.push({ text, line: index + 1 });
        }
      });
    }

    // Find hardcoded strings in attributes
    const attrMatches = line.match(/(?:title|alt|placeholder|label)=["'](.*?)["']/g);
    if (attrMatches) {
      attrMatches.forEach(match => {
        const text = match.match(/["'](.*?)["']/)?.[1];
        if (text && !text.includes('{') && text.length > 1) {
          results.push({ text, line: index + 1 });
        }
      });
    }
  });

  return results;
}

function generateTranslationKey(text: string, context: string = ''): string {
  // Convert text to lowercase and remove special characters
  const baseKey = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '.');

  // Add context prefix if available
  if (context) {
    return `${context}.${baseKey}`;
  }

  // Try to infer context from text
  if (text.includes('Button') || text.includes('Click')) return `button.${baseKey}`;
  if (text.includes('Error') || text.includes('Warning')) return `message.${baseKey}`;
  if (text.includes('Title') || text.includes('Heading')) return `heading.${baseKey}`;
  
  return `ui.${baseKey}`;
}

async function findHardcodedText(): Promise<TranslationUsage[]> {
  const findings: TranslationUsage[] = [];
  
  // Find all .astro files
  const files = glob.sync('src/**/*.astro');

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    
    // Determine context from file path
    const fileContext = file.includes('/nav/') ? 'nav' : 
                       file.includes('/footer/') ? 'footer' :
                       file.includes('/form/') ? 'form' : '';

    // Extract text from the file
    const textMatches = extractTextFromAstro(content);
    
    textMatches.forEach(({ text, line }) => {
      const suggestedKey = generateTranslationKey(text, fileContext);
      const hasTranslation = Object.values(uiTranslations.en).includes(text);

      findings.push({
        file,
        line,
        text,
        suggestedKey,
        hasTranslation
      });
    });
  }

  return findings;
}

async function generateReport() {
  console.log('Analyzing .astro files for potential translations...\n');
  
  const findings = await findHardcodedText();
  
  // Group findings by file
  const groupedFindings = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) acc[finding.file] = [];
    acc[finding.file].push(finding);
    return acc;
  }, {} as Record<string, TranslationUsage[]>);

  // Generate report
  for (const [file, fileFindings] of Object.entries(groupedFindings)) {
    console.log(`\nFile: ${file}`);
  console.log('─'.repeat(80));
    
    fileFindings.forEach(finding => {
      console.log(`Line ${finding.line}: "${finding.text}"`);
      if (!finding.hasTranslation) {
        console.log(`  Suggested key: ${finding.suggestedKey}`);
        console.log(`  Add to ui.ts:`);
        console.log(`  '${finding.suggestedKey}': '${finding.text}',`);
      } else {
        console.log('  Already has translation');
}
      console.log();
    });
  }

  // Generate ui.ts updates
  console.log('\nSuggested ui.ts additions:');
  console.log('─'.repeat(80));
  console.log('export const ui = {');
  console.log('  en: {');
  findings
    .filter(f => !f.hasTranslation)
    .forEach(f => {
      console.log(`    '${f.suggestedKey}': '${f.text}',`);
    });
  console.log('  },');
  console.log('};');

  // Summary
  const totalFindings = findings.length;
  const needsTranslation = findings.filter(f => !f.hasTranslation).length;
  
  console.log('\nSummary');
  console.log('─'.repeat(80));
  console.log(`Total text strings found: ${totalFindings}`);
  console.log(`Needs translation: ${needsTranslation}`);
  console.log(`Already translated: ${totalFindings - needsTranslation}`);
}

// Run the script
generateReport().catch(console.error);