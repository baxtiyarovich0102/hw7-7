// import { CreateUploadDto } from './dto/create-upload.dto';
// import { UpdateUploadDto } from './dto/update-upload.dto';
import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|gif/;
        const ext = extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Faqat rasm fayllar ruxsat etiladi!'), false);
        }
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuborilmadi!');
    }
    return {
      message: 'Rasm muvaffaqiyatli yuklandi!',
      url: `/upload/image/${file.filename}`,
    };
  }

  @Get('image/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = `uploads/images/${filename}`;
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Fayl topilmadi');
    }
    res.sendFile(filename, { root: 'uploads/images' });
  }
}
