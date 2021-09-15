import { CreateDocumentDto } from './create-document.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePageDto extends CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
