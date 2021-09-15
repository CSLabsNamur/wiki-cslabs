import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export abstract class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  parentCategoryId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
