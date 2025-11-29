/**
 * Groq API Test Endpoint
 * 
 * GET /api/test/groq - Groq API'yi test et
 * POST /api/test/groq - Özel mesaj ile Groq'u test et
 */

import { NextRequest, NextResponse } from 'next/server'
import { callGroq } from '@/lib/ai/groq-client'
import { classifyServiceCategory } from '@/lib/ai/classifyServiceCategory'

/**
 * GET /api/test/groq - Basit Groq testi
 */
export async function GET() {
  try {
    // Basit bir test mesajı
    const testMessage = 'Evde priz bozuldu, kıvılcım çıkıyor'

    // Groq'u test et
    const response = await callGroq([
      {
        role: 'user',
        content: `Aşağıdaki hizmet açıklamasını kısaca özetle: ${testMessage}`,
      },
    ])

    return NextResponse.json({
      success: true,
      message: 'Groq API başarıyla çalışıyor!',
      test: {
        input: testMessage,
        output: response.content,
        tokenUsage: response.tokenUsage,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Groq test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Groq API hatası',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/test/groq - Kategori sınıflandırma testi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, testType } = body

    if (!description) {
      return NextResponse.json(
        { error: 'description parametresi gerekli' },
        { status: 400 }
      )
    }

    if (testType === 'category') {
      // Kategori sınıflandırma testi
      const result = await classifyServiceCategory(description)

      return NextResponse.json({
        success: true,
        message: 'Kategori sınıflandırma başarılı!',
        result: {
          input: description,
          category: result.category,
          confidence: result.confidence,
        },
        timestamp: new Date().toISOString(),
      })
    } else {
      // Basit Groq testi
      const response = await callGroq([
        {
          role: 'user',
          content: `Aşağıdaki hizmet açıklamasını kısaca özetle: ${description}`,
        },
      ])

      return NextResponse.json({
        success: true,
        message: 'Groq API başarıyla çalışıyor!',
        result: {
          input: description,
          output: response.content,
          tokenUsage: response.tokenUsage,
        },
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error('Groq test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Groq API hatası',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

