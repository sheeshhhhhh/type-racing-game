import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAccount {
    @IsString()
    username: string;
    
    @IsString()
    email: string;
}

export class UpdatePassword {
    @MinLength(6)
    @MaxLength(30)
    @IsString()
    password: string;

    @MinLength(6)
    @MaxLength(30)
    @IsString()
    newPassword: string;

    @MinLength(6)
    @MaxLength(30)
    @IsString()
    confirmPassword: string;
}

class TypePreferences {
    @IsBoolean()
    soundEffects: boolean;
    
    @IsNumber()
    fontSize: number;
    
    @IsString()
    keyboardLayout: string;
}

export class UpdateTypePreferences extends PartialType(TypePreferences) {}