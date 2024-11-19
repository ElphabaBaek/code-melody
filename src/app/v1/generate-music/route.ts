import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    // request body에서 프롬프트 추출
    const { prompt } = await request.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    const input = {
      prompt: prompt,
      model_version: 'stereo-large',
      output_format: 'mp3',
      normalization_strategy: 'peak'
    };

    const output = (await replicate.run(
      'meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb',
      { input }
    ))

    // 파일 이름 생성
    const fileName = `output-${Date.now()}.mp3`;

    // @ts-ignore
    return new NextResponse(output, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: '오디오 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
