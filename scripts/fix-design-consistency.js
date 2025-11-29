/**
 * Design Consistency Fixer
 * 
 * Bu script tüm sayfalarda:
 * 1. Arkaplan rengini #F5F5F7 yapar
 * 2. Brand rengini #FF6000 yapar
 * 3. Eski tasarımları günceller
 */

const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..', 'app')
const componentsDir = path.join(__dirname, '..', 'components')

// Arkaplan renk değişiklikleri
const backgroundReplacements = [
  { from: /bg-white/g, to: 'bg-[#F5F5F7]' },
  { from: /bg-slate-50/g, to: 'bg-[#F5F5F7]' },
  { from: /bg-gray-50/g, to: 'bg-[#F5F5F7]' },
  { from: /bg-gray-100/g, to: 'bg-[#F5F5F7]' },
]

// Brand renk değişiklikleri
const brandReplacements = [
  { from: /bg-\[#3B82F6\]/g, to: 'bg-brand-500' },
  { from: /bg-blue-500/g, to: 'bg-brand-500' },
  { from: /bg-blue-600/g, to: 'bg-brand-600' },
  { from: /text-\[#3B82F6\]/g, to: 'text-brand-500' },
  { from: /text-blue-500/g, to: 'text-brand-500' },
  { from: /text-blue-600/g, to: 'text-brand-600' },
]

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Arkaplan renklerini düzelt
    backgroundReplacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        // Özel durumlar: Card, modal, dropdown gibi beyaz olması gereken yerler
        // Sadece sayfa arkaplanlarını değiştir
        if (content.includes('min-h-screen') || content.includes('className="min-h-screen')) {
          content = content.replace(from, to)
          modified = true
        }
      }
    })

    // Brand renklerini düzelt
    brandReplacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to)
        modified = true
      }
    })

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed: ${filePath}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return false
  }
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDir(filePath, fileList)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// Ana işlem
console.log('🔍 Scanning files...')
const appFiles = walkDir(appDir)
const componentFiles = walkDir(componentsDir)
const allFiles = [...appFiles, ...componentFiles]

console.log(`📁 Found ${allFiles.length} files`)

let fixedCount = 0
allFiles.forEach(file => {
  if (processFile(file)) {
    fixedCount++
  }
})

console.log(`\n✨ Fixed ${fixedCount} files`)
console.log('✅ Design consistency check complete!')

