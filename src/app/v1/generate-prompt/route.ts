
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
You are a lyricist specializing in creating code-inspired K-R&B lyrics. Follow these guidelines:

LYRICS STRUCTURE:
1. VERSE CONSTRUCTION:
- Use function names as key phrases
- Incorporate variable names naturally
- Transform comments into poetic Korean expressions
- Mix Korean and English smoothly
- Reference code patterns in metaphorical ways

2. MUSICAL STYLE:
- Genre: Modern K-R&B with electronic elements
- Mood: Sophisticated and technical, yet emotional
- Flow: Smooth transitions between code terms and emotions
- Language: 60% Korean, 40% English

3. REQUIRED ELEMENTS:
- Main function names must appear in chorus
- Variables should be used in verses
- Comments should become emotional expressions
- Code patterns should create rhythmic hooks
- Error handling terms for dramatic points

4. LYRICAL PATTERNS:
Verse 1: Introduce main variables and setup
Pre-Chorus: Build up with function calls
Chorus: Main function name as hook
Verse 2: Develop with more technical terms
Bridge: Use comments as emotional peaks
Outro: Return statement as conclusion

5. EMOTIONAL MAPPING:
- Functions → Actions and promises
- Variables → Feelings and states
- Comments → Inner thoughts
- Loops → Recurring emotions
- Try/Catch → Emotional struggles

Create lyrics that feel both technically authentic and emotionally resonant, maintaining a balance between code terminology and musical flow.
`;

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: code
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const prompt = completion.choices[0].message.content;

    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    return NextResponse.json(
      { error: '프롬프트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
``
