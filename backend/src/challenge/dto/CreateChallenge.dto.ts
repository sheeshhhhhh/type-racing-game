import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ChallengeCategory, Difficulty } from '@prisma/client';

export class CreateChallengeDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @MinLength(30)
    @MaxLength(300)
    challenge: string;

    @IsEnum(Difficulty)
    difficulty: Difficulty;
    
    @IsEnum(ChallengeCategory)
    category: ChallengeCategory
}