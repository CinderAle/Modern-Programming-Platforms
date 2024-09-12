import { FileSavingError } from '@/error/fileSaving';
import fileUpload from 'express-fileupload';
import { unlinkSync } from 'fs';
import path from 'path';
import * as uuid from 'uuid';

class FileService {
    create(file: fileUpload.UploadedFile) {
        try {
            const fileName = `${uuid.v4()}.jpg`;
            const filePath = path.resolve('@/../static', fileName);
            file.mv(filePath);
            return fileName;
        } catch (e: any) {
            throw new FileSavingError(e.message);
        }
    }

    delete(filePath: string) {
        const fileName = path.basename(filePath);
        unlinkSync(`@/../static/${fileName}`);
    }
}

export default new FileService();
