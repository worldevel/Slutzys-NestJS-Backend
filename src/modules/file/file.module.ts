import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { FileController } from './controllers/file.controller';
import { fileProviders } from './providers';
import { FileService, VideoFileService } from './services';
import { ImageService } from './services/image.service';

@Module({
  imports: [MongoDBModule, forwardRef(() => AuthModule)],
  providers: [...fileProviders, FileService, ImageService, VideoFileService],
  controllers: [FileController],
  exports: [...fileProviders, FileService, ImageService, VideoFileService]
})
export class FileModule {}
